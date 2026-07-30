/* 网盘搜索核心模块（pan-core.js）
 *
 * 多源并行直连搜索，浏览器端完成，无需 Cloudflare Function：
 *   - kkso   : https://kkso.net       夸克网盘搜索，返回夸克直链，CORS: *
 *   - pansou : https://so.252035.xyz  PanSou 公共演示实例，多网盘直链(夸克/百度/阿里/
 *             迅雷/115/UC/123/天翼/电驴/磁力)，CORS: *
 * 两个源都返回真实网盘分享直链（pan.quark.cn/s/...、pan.baidu.com/s/...?pwd=... 等），
 * 点击直达，不经过任何「中转页」，因此不会出现二维码保存 JSON 乱码。
 *
 * 设计：
 *   - 多源并行，各自带超时；任一源失败（网络/CORS/超时）被隔离，不影响其它源；
 *   - 结果按规范化 URL 去重后合并；
 *   - 支持 onPartial 回调实现「渐进渲染」：快源先出，慢源到达后合并重绘；
 *   - 法律 posture：均为第三方公开聚合成果，ToS 灰色，本站仅作中性搜索入口。
 */
(function (global) {
  "use strict";

  function detectPanType(url) {
    var u = String(url || "").toLowerCase();
    if (u.indexOf("quark") > -1) return "夸克";
    if (u.indexOf("baidu") > -1) return "百度";
    if (u.indexOf("aliyun") > -1 || u.indexOf("alipan") > -1) return "阿里";
    if (u.indexOf("xunlei") > -1) return "迅雷";
    if (u.indexOf("tianyi") > -1 || u.indexOf("189") > -1) return "天翼";
    if (u.indexOf("115") > -1) return "115";
    if (u.indexOf("weiyun") > -1) return "微云";
    if (u.indexOf("ctfile") > -1) return "城通";
    if (u.indexOf("uc.cn") > -1 || u.indexOf("drive.uc") > -1) return "UC";
    if (u.indexOf("123") > -1 || u.indexOf("123pan") > -1) return "123";
    if (u.indexOf("magnet") > -1) return "磁力";
    if (u.indexOf("ed2k") > -1) return "电驴";
    return "网盘";
  }

  function mapPanType(t) {
    var m = {
      baidu: "百度",
      aliyun: "阿里",
      quark: "夸克",
      xunlei: "迅雷",
      "115": "115",
      tianyi: "天翼",
      uc: "UC",
      "123": "123",
      ed2k: "电驴",
      magnet: "磁力",
    };
    return m[String(t || "").toLowerCase()] || null;
  }

  // 规范化用于去重：小写、去 # 片段、去末尾斜杠（保留 ?query 含提取码）
  function normalizeUrl(u) {
    var s = String(u || "").trim().toLowerCase();
    var h = s.indexOf("#");
    if (h > -1) s = s.slice(0, h);
    if (s.slice(-1) === "/") s = s.slice(0, -1);
    return s;
  }

  var SOURCES = [
    {
      name: "kkso",
      timeout: 8000,
      buildUrl: function (q) {
        return "https://kkso.net/api/search?title=" + encodeURIComponent(q) + "&page=1";
      },
      parse: function (json) {
        if (!json || json.code !== 200 || !json.data || !Array.isArray(json.data.items)) {
          return [];
        }
        return json.data.items
          .map(function (it) {
            var url = it.url || "";
            if (!url) return null;
            return {
              title: it.title || it.name || "未命名资源",
              detail_url: url,
              pan_type: detectPanType(url),
              category: it.category || null,
              updated_at: it.times || null,
              pwd: null,
            };
          })
          .filter(Boolean);
      },
    },
    {
      name: "pansou",
      timeout: 9000,
      buildUrl: function (q) {
        return "https://so.252035.xyz/api/search?kw=" + encodeURIComponent(q) + "&res=results";
      },
      parse: function (json) {
        if (!json || json.code !== 0 || !json.data) return [];
        var results = json.data.results;
        if (!Array.isArray(results)) return [];
        var out = [];
        // 公共实例结果量极大（数百条），取前 60 条扁平化即可，避免无意义膨胀
        results.slice(0, 60).forEach(function (it) {
          var links = it.links || [];
          var title = it.title || "";
          links.forEach(function (lk) {
            var url = lk.url || "";
            if (!url) return;
            out.push({
              title: title || lk.note || "未命名资源",
              detail_url: url,
              pan_type: mapPanType(lk.type) || detectPanType(url),
              category: null,
              updated_at: it.datetime ? String(it.datetime).slice(0, 10) : null,
              pwd: lk.password || null,
            });
          });
        });
        return out;
      },
    },
  ];

  function fetchSource(src, query) {
    return new Promise(function (resolve) {
      var controller = new AbortController();
      var timer = setTimeout(function () {
        controller.abort();
      }, src.timeout);
      fetch(src.buildUrl(query), {
        method: "GET",
        headers: { Accept: "application/json" },
        signal: controller.signal,
      })
        .then(function (r) {
          if (!r.ok) throw new Error("HTTP " + r.status);
          return r.json();
        })
        .then(function (json) {
          clearTimeout(timer);
          resolve({ items: src.parse(json), error: false });
        })
        .catch(function () {
          clearTimeout(timer);
          resolve({ items: [], error: true });
        });
    });
  }

  // 并行查询所有源，合并去重；onPartial(results, state) 在每源返回后回调（渐进渲染）
  function fetchAll(query, topK, onPartial) {
    return new Promise(function (resolve) {
      var merged = [];
      var seen = new Set();
      var done = 0;
      var total = SOURCES.length;
      var anyOk = false;
      var anyError = false;

      SOURCES.forEach(function (src) {
        fetchSource(src, query)
          .then(function (res) {
            if (res.items.length) anyOk = true;
            if (res.error) anyError = true;
            try {
              res.items.forEach(function (r) {
                var k = normalizeUrl(r.detail_url);
                if (!seen.has(k)) {
                  seen.add(k);
                  merged.push(r);
                }
              });
              if (onPartial) {
                onPartial(merged.slice(0, topK), {
                  done: done + 1,
                  total: total,
                  anyOk: anyOk,
                  anyError: anyError,
                });
              }
            } catch (e) {
              /* 渲染回调异常不影响主流程 */
            }
          })
          .then(function () {
            done++;
            if (done === total) {
              resolve({
                results: merged.slice(0, topK),
                anyOk: anyOk,
                anyError: anyError,
              });
            }
          });
      });
    });
  }

  global.PanSearch = { fetchAll: fetchAll, SOURCES: SOURCES };
})(typeof window !== "undefined" ? window : this);
