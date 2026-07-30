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

  function renderResults(results, safetyNote, error) {
    if (error === "upstream_unavailable") {
      resultsEl.innerHTML =
        '<p class="pan-empty">搜索服务暂时不可用（上游无响应），请稍后再试。</p>';
      return;
    }
    if (error === "parse_empty") {
      resultsEl.innerHTML =
        '<p class="pan-empty">已获取搜索结果，但解析为空（上游可能已变更）。</p>';
      return;
    }
    if (!results || !results.length) {
      resultsEl.innerHTML = '<p class="pan-empty">没有找到相关资源。</p>';
      return;
    }
    var items = results
      .map(function (r) {
        var tags = [r.pan_type, r.category]
          .filter(Boolean)
          .map(function (t) {
            return '<span class="pan-tag">' + esc(t) + "</span>";
          })
          .join("");
        var meta = [r.updated_at ? "更新 " + esc(r.updated_at) : ""]
          .filter(Boolean)
          .join(" · ");
        return (
          '<a class="pan-item" href="' +
          esc(r.detail_url) +
          '" target="_blank" rel="noopener noreferrer">' +
          '<div class="pan-item-title">' + esc(r.title) + "</div>" +
          (tags ? '<div class="pan-item-tags">' + tags + "</div>" : "") +
          (meta ? '<div class="pan-item-meta">' + meta + "</div>" : "") +
          "</a>"
        );
      })
      .join("");
    resultsEl.innerHTML =
      '<div class="pan-grid">' + items + "</div>" +
      (safetyNote ? '<p class="pan-note">' + esc(safetyNote) + "</p>" : "");
  }

  form.addEventListener("submit", function (e) {
    e.preventDefault();
    var q = (input.value || "").trim();
    if (!q) {
      setStatus("请输入关键词", true);
      return;
    }
    setStatus("搜索中…");
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
        setStatus("找到 " + data.total + " 条结果");
        renderResults(data.results, data.safety_note, data.error);
      })
      .catch(function (err) {
        setStatus("搜索失败：" + err.message, true);
      });
  });
})();
