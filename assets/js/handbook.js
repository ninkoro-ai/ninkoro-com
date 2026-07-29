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

  // 4) 悬浮球：可拖动 reposition + 点击展开章节菜单 + 一键回到顶部（移动端）
  function setupFab() {
    var wrap = document.getElementById("fabWrap");
    var fab = document.getElementById("fab");
    var menu = document.getElementById("fabMenu");
    var toc = document.getElementById("fabToc");
    var topBtn = document.getElementById("fabTop");
    if (!wrap || !fab || !menu || !toc || !topBtn) return;

    // 4a) 动态构建章节菜单（与顶部/侧栏目录同源：h2.ch-title / h3.sec-title）
    var heads = document.querySelectorAll(".article-body h2.ch-title, .article-body h3.sec-title");
    Array.prototype.forEach.call(heads, function (h) {
      if (!h.id) return;
      var a = document.createElement("a");
      a.href = "#" + h.id;
      a.textContent = h.textContent;
      a.className = h.tagName === "H2" ? "fab-ch" : "fab-sec";
      a.addEventListener("click", function (ev) {
        ev.preventDefault();
        var t = document.getElementById(h.id);
        if (t) t.scrollIntoView({ behavior: "smooth", block: "start" });
        closeMenu();
      });
      toc.appendChild(a);
    });

    function openMenu() {
      var rect = wrap.getBoundingClientRect();
      var vw = window.innerWidth;
      // 左右：靠右半屏则向左展开，靠左则向右展开，避免溢出
      if (rect.left + rect.width / 2 > vw / 2) {
        menu.style.right = "0"; menu.style.left = "auto";
      } else {
        menu.style.left = "0"; menu.style.right = "auto";
      }
      // 上下：贴近顶部时改为向下展开
      if (rect.top < 340) {
        menu.style.top = "calc(100% + 12px)"; menu.style.bottom = "auto";
      } else {
        menu.style.bottom = "calc(100% + 12px)"; menu.style.top = "auto";
      }
      menu.classList.add("open");
      fab.setAttribute("aria-expanded", "true");
    }
    function closeMenu() {
      menu.classList.remove("open");
      fab.setAttribute("aria-expanded", "false");
    }
    function toggleMenu() {
      if (menu.classList.contains("open")) closeMenu(); else openMenu();
    }

    topBtn.addEventListener("click", function () {
      window.scrollTo({ top: 0, behavior: "smooth" });
      closeMenu();
    });

    // 4b) 拖动（pointer events；>6px 视为主动拖动，不触发点击）
    var dragging = false, moved = false, sx = 0, sy = 0;
    var saved = loadPos();
    if (saved) applyPos(saved);

    function applyPos(p) {
      wrap.style.left = p.x + "px";
      wrap.style.top = p.y + "px";
      wrap.style.right = "auto";
      wrap.style.bottom = "auto";
    }
    function loadPos() {
      try {
        var s = JSON.parse(localStorage.getItem("fabPos"));
        if (s && typeof s.x === "number" && typeof s.y === "number") return s;
      } catch (e) {}
      return null;
    }
    function savePos(p) {
      try { localStorage.setItem("fabPos", JSON.stringify(p)); } catch (e) {}
    }
    function clamp(v, lo, hi) { return Math.max(lo, Math.min(hi, v)); }

    fab.addEventListener("pointerdown", function (e) {
      dragging = true; moved = false;
      sx = e.clientX; sy = e.clientY;
      if (menu.classList.contains("open")) closeMenu();
      try { fab.setPointerCapture(e.pointerId); } catch (err) {}
      fab.style.cursor = "grabbing";
    });
    fab.addEventListener("pointermove", function (e) {
      if (!dragging) return;
      var dx = e.clientX - sx, dy = e.clientY - sy;
      if (Math.abs(dx) > 6 || Math.abs(dy) > 6) moved = true;
      if (!moved) return;
      var rect = wrap.getBoundingClientRect();
      var nx = clamp(rect.left + dx, 4, window.innerWidth - rect.width - 4);
      var ny = clamp(rect.top + dy, 4, window.innerHeight - rect.height - 4);
      applyPos({ x: nx, y: ny });
      sx = e.clientX; sy = e.clientY;
      savePos({ x: nx, y: ny });
    });
    function endDrag() {
      if (!dragging) return;
      dragging = false;
      fab.style.cursor = "grab";
      if (moved) return;       // 拖动过 → 仅移动，不弹菜单
      toggleMenu();            // 视为点击 → 切换菜单
    }
    fab.addEventListener("pointerup", endDrag);
    fab.addEventListener("pointercancel", function () { dragging = false; fab.style.cursor = "grab"; });

    // 点击空白处 / 滚动时收起菜单
    document.addEventListener("click", function (e) {
      if (menu.classList.contains("open") && !wrap.contains(e.target)) closeMenu();
    });
    window.addEventListener("scroll", function () {
      if (menu.classList.contains("open")) closeMenu();
    }, { passive: true });
  }
  setupFab();
})();
