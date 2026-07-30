/* 网盘资源搜索（首页区块）
 *
 * 直接调用 kkso.net 公开搜索 API（浏览器端，跨域由服务端 Access-Control-Allow-Origin: *
 * 放行，无需 Cloudflare Function 中继）：
 *   - kkso 返回夸克网盘等「直链」（pan.quark.cn/s/...），点击即直达真实分享页，
 *     不再经过 zreso 中转接口（该接口返回二维码保存 JSON，浏览器直接打开会显示乱码）；
 *   - 零成本、无服务器、无后端依赖；上游不可达时优雅降级为友好提示。
 */
(function () {
  "use strict";

  var API = "https://kkso.net/api/search";
  var TOP_K = 12;
  var TIMEOUT = 8000;

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
    return "网盘";
  }

  function parseItems(json) {
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
        };
      })
      .filter(Boolean)
      .slice(0, TOP_K);
  }

  function renderResults(results) {
    if (!results.length) {
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
    resultsEl.innerHTML = '<p class="pan-empty">搜索中…</p>';

    var url = API + "?title=" + encodeURIComponent(q) + "&page=1";
    var controller = new AbortController();
    var timer = setTimeout(function () {
      controller.abort();
    }, TIMEOUT);

    fetch(url, {
      method: "GET",
      headers: { Accept: "application/json" },
      signal: controller.signal,
    })
      .then(function (resp) {
        if (!resp.ok) throw new Error("HTTP " + resp.status);
        return resp.json();
      })
      .then(function (json) {
        clearTimeout(timer);
        renderResults(parseItems(json));
      })
      .catch(function (err) {
        clearTimeout(timer);
        var msg =
          err && err.name === "AbortError"
            ? "搜索超时，请稍后重试"
            : /failed to fetch|networkerror|typeerror/i.test(err.message)
            ? "搜索服务连接异常，请稍后重试"
            : err.message || "搜索失败";
        setStatus("搜索失败：" + msg, true);
        resultsEl.innerHTML = "";
      });
  });
})();
