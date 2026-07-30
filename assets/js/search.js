/* 网盘资源搜索页（search.html）
 *
 * 调用同源 Cloudflare Pages Function：GET /api/pan-search?q=KW&top_k=30
 *   - 函数在 Cloudflare 边缘服务端中继 kkso.net 搜索 API，返回结构化结果；
 *   - 同源调用，无 CORS、无后端依赖、无独立服务器；
 *   - 上游对关键词搜索不做分页（page 参数被忽略），一次返回全部匹配，故本页
 *     以 top_k=30 一次取全量，无需分页 UI；
 *   - 结果直接指向夸克网盘等第三方分享链接；上游不可达时优雅降级。
 *   - URL 同步 ?q=，结果可分享。
 */
(function () {
  "use strict";

  var API_BASE = "";
  var TOP_K = 30; // 一次取全量（kkso 对关键词搜索不分页）

  var form = document.getElementById("pan-form");
  var input = document.getElementById("pan-input");
  var resultsEl = document.getElementById("pan-results");
  var suggestEl = document.getElementById("pan-suggest");
  if (!form) return;

  function esc(s) {
    return String(s == null ? "" : s).replace(/[&<>"']/g, function (c) {
      return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c];
    });
  }

  function cardHTML(r) {
    var cat = r.pan_type || "网盘";
    var tag = r.category
      ? '<span class="pan-tag">' + esc(r.category) + "</span>"
      : "";
    var meta = r.updated_at
      ? '<span class="pan-meta">更新 ' + esc(r.updated_at) + "</span>"
      : "";
    return (
      '<a class="pan-item" href="' +
      esc(r.detail_url) +
      '" target="_blank" rel="noopener noreferrer">' +
      '<span class="pan-cat">' + esc(cat) + "</span>" +
      '<span class="pan-arrow arrow"></span>' +
      '<div class="pan-item-title">' + esc(r.title) + "</div>" +
      tag +
      meta +
      "</a>"
    );
  }

  function renderResults(data) {
    var results = data.results || [];
    if (data.error === "upstream_unavailable") {
      resultsEl.innerHTML =
        '<p class="pan-empty">搜索服务暂不可用，请稍后重试。</p>';
      return;
    }
    if (!results.length) {
      resultsEl.innerHTML = '<p class="pan-empty">未找到相关资源。</p>';
      return;
    }
    resultsEl.innerHTML =
      '<div class="pan-grid">' + results.map(cardHTML).join("") + "</div>";
  }

  function syncURL(q) {
    var params = new URLSearchParams();
    if (q) params.set("q", q);
    var qs = params.toString();
    history.replaceState(null, "", qs ? "?" + qs : location.pathname);
  }

  function go(q) {
    q = (q || "").trim();
    if (!q) return;
    input.value = q;
    syncURL(q);
    resultsEl.innerHTML = '<p class="pan-empty">搜索中…</p>';

    var url =
      API_BASE + "/api/pan-search?q=" + encodeURIComponent(q) + "&top_k=" + TOP_K;

    fetch(url, { method: "GET" })
      .then(function (resp) {
        if (!resp.ok) {
          return resp.json().catch(function () { return {}; }).then(function (err) {
            throw new Error(err.error || "请求失败（" + resp.status + "）");
          });
        }
        return resp.json();
      })
      .then(renderResults)
      .catch(function (err) {
        resultsEl.innerHTML =
          '<p class="pan-empty">搜索失败：' + esc(err.message) + "</p>";
      });
  }

  form.addEventListener("submit", function (e) {
    e.preventDefault();
    go(input.value);
  });

  if (suggestEl) {
    suggestEl.addEventListener("click", function (e) {
      var btn = e.target.closest("button[data-q]");
      if (!btn) return;
      go(btn.getAttribute("data-q"));
    });
  }

  // 进入页面时，若 URL 带 ?q= 则自动搜索
  var initQ = new URLSearchParams(location.search).get("q");
  if (initQ) go(initQ);
})();
