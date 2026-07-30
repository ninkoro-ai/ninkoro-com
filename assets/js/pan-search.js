/* 网盘资源搜索（首页区块）
 *
 * 调用同源 Cloudflare Pages Function：GET /api/pan-search?q=KEYWORD&top_k=12
 *   - 该函数在 Cloudflare 边缘**服务端**中继 kkso.net 搜索 API，返回结构化结果；
 *   - 同源调用，无跨域 CORS、无后端依赖、无需部署任何服务器；
 *   - 结果直接指向夸克网盘等第三方分享链接；上游不可达时优雅提示。
 */
(function () {
  "use strict";

  var API_BASE = ""; // 同源相对路径
  var DEFAULT_TOP_K = 12;

  var form = document.getElementById("pan-form");
  var input = document.getElementById("pan-input");
  var statusEl = document.getElementById("pan-status");
  var resultsEl = document.getElementById("pan-results");
  if (!form) return;

  function esc(s) {
    return String(s == null ? "" : s).replace(/[&<>"']/g, function (c) {
      return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c];
    });
  }

  function setStatus(msg, isErr) {
    statusEl.textContent = msg || "";
    statusEl.className = "pan-status" + (isErr ? " err" : "");
  }

  function renderResults(results, error) {
    if (error === "upstream_unavailable") {
      resultsEl.innerHTML = "";
      setStatus("搜索服务暂不可用，请稍后重试。", true);
      return;
    }
    if (!results || !results.length) {
      resultsEl.innerHTML = '<p class="pan-empty">未找到相关资源。</p>';
      setStatus("");
      return;
    }
    setStatus("");
    var items = results
      .map(function (r) {
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
      })
      .join("");
    resultsEl.innerHTML = '<div class="pan-grid">' + items + "</div>";
  }

  form.addEventListener("submit", function (e) {
    e.preventDefault();
    var q = (input.value || "").trim();
    if (!q) {
      setStatus("请输入关键词", true);
      return;
    }
    setStatus("");
    resultsEl.innerHTML = "";

    var url =
      API_BASE +
      "/api/pan-search?q=" +
      encodeURIComponent(q) +
      "&top_k=" +
      DEFAULT_TOP_K;

    fetch(url, { method: "GET" })
      .then(function (resp) {
        if (!resp.ok) {
          return resp.json().catch(function () { return {}; }).then(function (err) {
            throw new Error(err.error || "请求失败（" + resp.status + "）");
          });
        }
        return resp.json();
      })
      .then(function (data) {
        renderResults(data.results, data.error);
      })
      .catch(function (err) {
        setStatus("搜索失败：" + err.message, true);
      });
  });
})();
