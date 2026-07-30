// Cloudflare Pages Function — /api/pan-search
//
// 只读中继：在服务端抓取 pan.xiaozi.cc 的**公开**搜索结果页，解析出标题与
// 详情链接后返回结构化 JSON。本站不抓取、不建索引、不托管任何文件，仅作为
// 既有第三方公开搜索的入口。
//
// 设计约束（与 NINKORO pan-xiaozi-search skill 一致）：
//   - 只读搜索，不下载、不绕过任何限制；
//   - 上游不可达 / 页面结构变化 -> 优雅降级为 0 条结果（绝不抛错）；
//   - 返回链接按不可信处理，调用方须在 UI 展示安全提醒。

const BASE_URL = "https://pan.xiaozi.cc";
const SEARCH_PATH = "/resource";

const SAFETY_NOTE =
  "返回链接指向第三方网盘页面，请核对域名、勿在其中输入账号密码；" +
  "本站仅为第三方公开搜索的中继入口，不抓取、不建索引、不托管任何文件。" +
  "仅用于合法搜索，访问或分享前请遵守当地法规与版权。";

const PAN_TYPES = ["夸克", "百度", "阿里", "迅雷", "UC", "天翼", "115", "移动"];
const DATE_RE = /\b(\d{4}-\d{2}-\d{2})\b/;
const ESCAPED_BASE = BASE_URL.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");

function stripHtml(s) {
  return s.replace(/<[^>]+>/g, "").replace(/\s+/g, " ").trim();
}

// 解析搜索页 HTML：抽取 /resource/<ID> 详情链接 + 标题，并尽力附带
// 网盘类型、分类、更新时间。布局不匹配时自然得到 0 条。
export function parseResults(html) {
  const results = [];
  const seen = new Set();
  const linkRe = new RegExp(
    'href=["\'](' + ESCAPED_BASE + SEARCH_PATH + "/([\\w-]+))[\"']",
    "g"
  );
  let m;
  while ((m = linkRe.exec(html)) !== null) {
    const detailUrl = m[1];
    if (seen.has(detailUrl)) continue;

    // 标题：取 <a> 内文本
    const gt = html.indexOf(">", m.index);
    let title = "resource " + m[2];
    let anchorEnd = gt;
    if (gt !== -1) {
      const lt = html.indexOf("</a>", gt);
      if (lt !== -1) {
        const t = stripHtml(html.slice(gt + 1, lt));
        if (t) title = t;
        anchorEnd = lt;
      }
    }

    // 元数据：以 </a> 为锚点，向后取 800 字符窗口做尽力抽取
    const windowEnd = Math.min(html.length, anchorEnd + 800);
    const win = html.slice(anchorEnd, windowEnd);

    let panType = null;
    for (const p of PAN_TYPES) {
      if (win.includes(p)) {
        panType = p;
        break;
      }
    }
    const dm = win.match(DATE_RE);
    const updatedAt = dm ? dm[1] : null;

    const catM = win.match(
      /<a[^>]+href="[^"]*category=([\w-]+)[^"]*"[^>]*>([^<]+)<\/a>/
    );
    const category = catM ? stripHtml(catM[2]) : null;

    seen.add(detailUrl);
    results.push({
      title,
      detail_url: detailUrl,
      pan_type: panType,
      category,
      updated_at: updatedAt,
    });
  }
  return results;
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

  const upstream = `${BASE_URL}${SEARCH_PATH}?q=${encodeURIComponent(query)}`;
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), 12000);

  try {
    const resp = await fetch(upstream, {
      headers: {
        "User-Agent": "Mozilla/5.0 (compatible; NinkoroRelay/1.0)",
        Accept: "text/html,application/xhtml+xml",
      },
      signal: controller.signal,
    });
    if (!resp.ok) throw new Error("upstream " + resp.status);
    const html = await resp.text();
    const results = parseResults(html).slice(0, topK);
    return jsonResponse({
      query,
      total: results.length,
      results,
      mode: "real",
      safety_note: SAFETY_NOTE,
    });
  } catch {
    // 优雅降级：上游不可达或结构变化 -> 0 条，不报错
    return jsonResponse({
      query,
      total: 0,
      results: [],
      mode: "real",
      safety_note: SAFETY_NOTE,
      error: "upstream_unavailable",
    });
  } finally {
    clearTimeout(timer);
  }
}
