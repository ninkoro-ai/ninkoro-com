// Cloudflare Pages Function — /api/pan-search
//
// 只读中继：在服务端调用公开网盘搜索 API，把夸克/迅雷等网盘资源搜索结果
// 透传给前端。本站不抓取、不建索引、不托管任何文件，仅作为第三方公开搜索
// 的中继入口。
//
// 设计约束（与 NINKORO pan-xiaozi-search skill 一致）：
//   - 只读搜索，不下载、不绕过任何限制；
//   - 多源 fallback：任一上游不可达/被限流，自动切换下一个源，绝不抛错；
//   - 每个源都有硬超时，超时即降级，确保函数总是返回 200（浏览器不会
//     "Failed to fetch"）；
//   - 返回链接按不可信处理，UI 不额外提示（由站点整体说明承担）。
//
// 数据源（按优先级）：
//   1. zreso（泽索搜）— 公开 JSON API，对数据中心 IP 友好；链接为中转链，
//      用户点击后由其中转页跳转真实网盘链接。
//   2. kkso（KK网盘搜）— 返回夸克直链，但 openresty 对 Cloudflare 边缘 IP
//      段限流，作为兜底。

const ZRESO_BASE = "https://zreso.cn";
const ZRESO_PATH = "/api/search";
const KKSO_BASE = "https://kkso.net";
const KKSO_PATH = "/api/search";

const UA =
  "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 " +
  "(KHTML, like Gecko) Chrome/124.0 Safari/537.36";

const PER_SRC_TIMEOUT = 5000; // 单源硬超时（ms）

// 按 URL 域名识别网盘类型（用于 kkso 直链）
const PAN_HOST_MAP = [
  ["quark", "夸克"],
  ["baidu", "百度"],
  ["aliyun", "阿里"],
  ["alipan", "阿里"],
  ["tianyi", "天翼"],
  ["115", "115"],
  ["weiyun", "微云"],
  ["189", "天翼"],
  ["ctfile", "城通"],
  ["pan.baidu", "百度"],
];

function detectPanTypeByUrl(url) {
  const u = String(url || "").toLowerCase();
  for (const [host, label] of PAN_HOST_MAP) {
    if (u.includes(host)) return label;
  }
  return "夸克";
}

// 按中文/英文网盘名识别类型（用于 zreso 的 cloud_type_name）
function mapCloudType(label) {
  const l = String(label || "").toLowerCase();
  if (l.includes("quark") || l.includes("夸克")) return "夸克";
  if (l.includes("baidu") || l.includes("百度")) return "百度";
  if (l.includes("aliyun") || l.includes("alipan") || l.includes("阿里"))
    return "阿里";
  if (l.includes("xunlei") || l.includes("迅雷")) return "迅雷";
  if (l.includes("tianyi") || l.includes("天翼")) return "天翼";
  if (l.includes("115")) return "115";
  if (l.includes("weiyun") || l.includes("微云")) return "微云";
  return "网盘";
}

// 解析 kkso JSON（直链）
export function parseKkso(json) {
  if (!json || json.code !== 200 || !json.data || !Array.isArray(json.data.items)) {
    return [];
  }
  return json.data.items
    .map((it) => {
      const url = it.url || "";
      if (!url) return null;
      return {
        title: it.title || it.name || "未命名资源",
        detail_url: url,
        pan_type: detectPanTypeByUrl(url),
        category: it.category || null,
        updated_at: it.times || null,
      };
    })
    .filter(Boolean);
}

// 解析 zreso JSON（中转链）
export function parseZreso(json) {
  const container = json && json.data;
  const arr = container && Array.isArray(container.results) ? container.results : [];
  if (!arr.length) return [];
  return arr
    .map((it) => {
      const raw =
        it.first_url || (it.links && it.links[0] && it.links[0].url) || "";
      if (!raw) return null;
      const url = raw.startsWith("http") ? raw : ZRESO_BASE + raw;
      const typeLabel =
        it.cloud_type_name ||
        (it.links && it.links[0] && it.links[0].type) ||
        "";
      return {
        title: it.title || "未命名资源",
        detail_url: url,
        pan_type: mapCloudType(typeLabel),
        category: null,
        updated_at: it.date || (it.datetime ? String(it.datetime).slice(0, 10) : null),
      };
    })
    .filter(Boolean);
}

async function fetchKkso(query, topK, signal) {
  const upstream = `${KKSO_BASE}${KKSO_PATH}?title=${encodeURIComponent(
    query,
  )}&page=1`;
  const resp = await fetch(upstream, {
    headers: {
      "User-Agent": UA,
      Accept: "application/json, text/plain, */*",
      Referer: KKSO_BASE + "/",
    },
    signal,
  });
  if (!resp.ok) throw new Error("kkso " + resp.status);
  const json = await resp.json();
  const results = parseKkso(json);
  const total =
    json && json.data && typeof json.data.total_result === "number"
      ? json.data.total_result
      : results.length;
  return { results: results.slice(0, topK), total };
}

async function fetchZreso(query, topK, signal) {
  const upstream = `${ZRESO_BASE}${ZRESO_PATH}?q=${encodeURIComponent(query)}`;
  const resp = await fetch(upstream, {
    headers: {
      "User-Agent": UA,
      Accept: "application/json, text/plain, */*",
      Referer: ZRESO_BASE + "/",
    },
    signal,
  });
  if (!resp.ok) throw new Error("zreso " + resp.status);
  const json = await resp.json();
  const results = parseZreso(json);
  return { results: results.slice(0, topK), total: results.length };
}

// 数据源顺序：zreso 优先（对 CF 友好），kkso 兜底（直链但被限流）
const SOURCES = [
  { name: "zreso", fn: fetchZreso },
  { name: "kkso", fn: fetchKkso },
];

function jsonResponse(obj, status = 200) {
  return new Response(JSON.stringify(obj), {
    status,
    headers: {
      "Content-Type": "application/json; charset=utf-8",
      "Cache-Control": "public, max-age=120",
    },
  });
}

export async function onRequest(context) {
  const { request } = context;

  let query = "";
  let topK = 12;
  try {
    if (request.method === "POST") {
      const body = await request.json().catch(() => ({}));
      query = String(body.query || "").trim();
      topK = parseInt(body.top_k, 10) || 12;
    } else {
      const url = new URL(request.url);
      query = String(url.searchParams.get("q") || "").trim();
      topK = parseInt(url.searchParams.get("top_k"), 10) || 12;
    }
  } catch {
    return jsonResponse({ error: "bad_request" }, 400);
  }

  if (!query) {
    return jsonResponse({ error: "missing_query" }, 400);
  }
  topK = Math.min(Math.max(topK, 1), 30);

  for (const src of SOURCES) {
    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), PER_SRC_TIMEOUT);
    try {
      const r = await src.fn(query, topK, controller.signal);
      if (r.results.length) {
        return jsonResponse({
          query,
          total: r.total,
          results: r.results,
          mode: "relay",
          source: src.name,
        });
      }
    } catch {
      // 该源失败，尝试下一个
    } finally {
      clearTimeout(timer);
    }
  }

  // 所有源都不可用 -> 优雅降级（总是 200，浏览器不会 Failed to fetch）
  return jsonResponse({
    query,
    total: 0,
    results: [],
    mode: "relay",
    error: "upstream_unavailable",
  });
}
