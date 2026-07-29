(function () {
  "use strict";

  // 1) 在文章顶部构建内联目录（移动端 TOC），从正文标题动态生成，无需手写重复 HTML
  function buildInlineToc() {
    var host = document.getElementById("tocInline");
    if (!host) return;
    var heads = document.querySelectorAll(".article-body h2.ch-title, .article-body h3.sec-title");
    if (!heads.length) return;
    var nav = document.createElement("nav");
    nav.className = "toc-nav";
    var ul = document.createElement("ul");
    ul.className = "toc-list";
    var curChapter = null;
    Array.prototype.forEach.call(heads, function (h) {
      var li = document.createElement("li");
      var a = document.createElement("a");
      a.href = "#" + (h.id || "");
      a.textContent = h.textContent;
      li.appendChild(a);
      if (h.tagName === "H2") {
        ul.appendChild(li);
        curChapter = li;
      } else if (curChapter) {
        var sub = curChapter.querySelector("ul.toc-sub");
        if (!sub) {
          sub = document.createElement("ul");
          sub.className = "toc-sub";
          curChapter.appendChild(sub);
        }
        sub.appendChild(li);
      } else {
        ul.appendChild(li);
      }
    });
    nav.appendChild(ul);
    host.appendChild(nav);
  }
  buildInlineToc();

  // 2) 阅读进度条
  var bar = document.getElementById("readProgress");
  function onScroll() {
    var h = document.documentElement;
    var max = h.scrollHeight - h.clientHeight;
    var p = max > 0 ? (h.scrollTop || document.body.scrollTop) / max : 0;
    if (bar) bar.style.width = (p * 100).toFixed(2) + "%";
  }
  window.addEventListener("scroll", onScroll, { passive: true });
  onScroll();

  // 3) 目录高亮（左侧栏 + 顶部内联目录 + 旧底部目录 同步）
  var links = Array.prototype.slice.call(document.querySelectorAll(".toc-nav a"));
  var map = {};
  links.forEach(function (a) {
    var id = a.getAttribute("href").slice(1);
    if (!id) return;
    if (!map[id]) map[id] = [];
    map[id].push(a);
  });
  var targets = Object.keys(map)
    .map(function (id) { return document.getElementById(id); })
    .filter(Boolean);
  if ("IntersectionObserver" in window && targets.length) {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) {
        if (e.isIntersecting) {
          links.forEach(function (l) { l.classList.remove("active"); });
          var arr = map[e.target.id];
          if (arr) arr.forEach(function (a) { a.classList.add("active"); });
        }
      });
    }, { rootMargin: "-20% 0px -70% 0px", threshold: 0 });
    targets.forEach(function (t) { io.observe(t); });
  }

})();
