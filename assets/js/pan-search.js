/* 网盘资源搜索（首页区块）
 *
 * 调用共享核心 PanSearch（assets/js/pan-core.js）：并行直连 kkso + PanSou，
 * 返回均为夸克/百度等网盘「直链」，点击直达真实分享页，无中转、无乱码。
 *   - 零成本、无服务器、无后端依赖；多源各自超时隔离，单源失败不影响整体；
 *   - 渐进渲染（快源先出，慢源合并重绘）。
 */
(function () {
  "use strict";

  var TOP_K = 12; // 首页预览最多展示条数

  var form = document.getElementById("pan-form");
  var input = document.getElementById("pan-input");
  var statusEl = document.getElementById("pan-status");
  var resultsEl = document.getElementById("pan-results");
  if (!form || !window.PanSearch) return;

  function esc(s) {
    return String(s == null ? "" : s).replace(/[&<>"']/g, function (c) {
      return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c];
    });
  }

  function setStatus(msg, isErr) {
    statusEl.textContent = msg || "";
    statusEl.className = "pan-status" + (isErr ? " err" : "");
  }

  function cardHTML(r) {
    var cat = r.pan_type || "网盘";
    var tag = r.category
      ? '<span class="pan-tag">' + esc(r.category) + "</span>"
      : "";
    var meta = "";
    if (r.pwd) meta += '<span class="pan-meta">提取码 ' + esc(r.pwd) + "</span>";
    if (r.updated_at) meta += '<span class="pan-meta">更新 ' + esc(r.updated_at) + "</span>";
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

  function renderResults(results) {
    if (!results.length) {
      resultsEl.innerHTML = '<p class="pan-empty">未找到相关资源。</p>';
      setStatus("");
      return;
    }
    setStatus("");
    resultsEl.innerHTML =
      '<div class="pan-grid">' + results.map(cardHTML).join("") + "</div>";
  }

  function emptyOrError(state) {
    if (state.anyError && !state.anyOk) {
      setStatus("搜索服务连接异常，请稍后重试", true);
      return null;
    }
    setStatus("");
    return '<p class="pan-empty">未找到相关资源。</p>';
  }

  form.addEventListener("submit", function (e) {
    e.preventDefault();
    var q = (input.value || "").trim();
    if (!q) {
      setStatus("请输入关键词", true);
      return;
    }
    setStatus("");
    resultsEl.innerHTML = '<p class="pan-empty">搜索中…</p>';

    PanSearch.fetchAll(q, TOP_K, function (results, state) {
      if (results.length) {
        renderResults(results);
      } else if (state.done === state.total && !state.anyOk) {
        var html = emptyOrError(state);
        if (html) resultsEl.innerHTML = html;
      }
    }).then(function (final) {
      if (!final.results.length) {
        var html = emptyOrError(final);
        if (html) resultsEl.innerHTML = html;
      } else {
        renderResults(final.results);
      }
    });
  });
})();
