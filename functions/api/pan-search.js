// Cloudflare Pages Function — /api/pan-search
//
// 只读中继：在服务端调用 kkso.net 的公开搜索 API，把夸克网盘资源搜索结果
// 透传给前端。本站不抓取、不建索引、不托管任何文件，仅作为第三方公开搜索
// 的中继入口。
//
// 设计约束（与 NINKORO pan-xiaozi-search skill 一致）：
//   - 只读搜索，不下载、不绕过任何限制；
//   - 上游不可达 / 接口变更 -> 优雅降级为 0 条结果（绝不抛错）；
//   - 返回链接按不可信处理，UI 不额外提示（由站点整体说明承担）。

const KKSO_BASE = "https://kkso.net";
const API_PATH = "/api/search";

// 注：本站仅作第三方公开搜索的中继入口（不抓取、不建索引、不托管），
// 法律 posture 由站点其余说明承担，本接口不向客户端回传额外提示文案。

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

function detectPanType(url) {
  const u = String(url || "").toLowerCase();
  for (const [host, label] of PAN_HOST_MAP) {
    if (u.includes(host)) return label;
  }
  return "夸克"; // kkso 以夸克分享为主
}

// 解析 kkso 的 JSON 响应，抽取结构化结果。
// 入参为已 JSON.parse 的对象；结构不匹配时自然得到 0 条。
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
        pan_type: detectPanType(url),
        category: it.category || null,
        updated_at: it.times || null,
      };
    })
    .filter(Boolean);
}

function jsonResponse(obj, status = 200) {
  return new Response(JSON.stringify(obj), {
    status,
    headers: {
      "Content-Type": "application/json; charset=utf-8",
      // 允许 Cloudflare 边缘缓存 5 分钟，减轻上游压力、降成本
      "Cache-Control": "public, max-age=300",
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

  // 注意：kkso 的过滤参数名是 `title`（非 `q`）。用 `q` 会被忽略，
  // 上游回吐全库最新列表（total 恒为全量），导致任何关键词都搜出无关结果。
  const upstream = `${KKSO_BASE}${API_PATH}?title=${encodeURIComponent(query)}&page=1`;
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), 12000);

  try {
    const resp = await fetch(upstream, {
      headers: {
        "User-Agent":
          "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 " +
          "(KHTML, like Gecko) Chrome/124.0 Safari/537.36",
        Accept: "application/json, text/plain, */*",
        Referer: KKSO_BASE + "/",
      },
      signal: controller.signal,
    });
    if (!resp.ok) throw new Error("upstream " + resp.status);
    const json = await resp.json();
    const results = parseKkso(json).slice(0, topK);

    const error =
      results.length === 0 && json && json.code === 200
        ? "parse_empty"
        : undefined;

    return jsonResponse({
      query,
      total: results.length,
      results,
      mode: "real",
      ...(error ? { error } : {}),
    });
  } catch {
    // 优雅降级：上游不可达或结构变化 -> 0 条，不报错
    return jsonResponse({
      query,
      total: 0,
      results: [],
      mode: "real",
      error: "upstream_unavailable",
    });
  } finally {
    clearTimeout(timer);
  }
}
