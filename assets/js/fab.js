(function () {
  "use strict";

  // 通用悬浮球：章节快选 + 一键回顶 + 可拖动 reposition（仅移动端展示，由 CSS 控制）
  // 章节源：手册页用 .article-body，通用长文页用 .longread；无章节的列表页自动降级为「仅回顶」
  function setupFab() {
    var wrap = document.getElementById("fabWrap");
    var fab = document.getElementById("fab");
    var menu = document.getElementById("fabMenu");
    var toc = document.getElementById("fabToc");
    var topBtn = document.getElementById("fabTop");
    if (!wrap || !fab || !menu || !toc || !topBtn) return;

    // 1) 动态构建章节菜单（与 .article-body / .longread 内的 h2/h3 同源）
    var src = document.querySelector(".article-body") || document.querySelector(".longread");
    var heads = src ? src.querySelectorAll("h2, h3") : [];
    var hasChapters = false;

    Array.prototype.forEach.call(heads, function (h) {
      if (!h.id) h.id = "fab-" + Math.random().toString(36).slice(2, 8);
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
      hasChapters = true;
    });

    // 2) 无章节（列表页）：仅保留「回到顶部」按钮，隐藏章节球与空菜单
    if (!hasChapters) {
      wrap.classList.add("only-top");
      if (topBtn.parentNode === menu) wrap.insertBefore(topBtn, menu);
      menu.style.display = "none";
      fab.style.display = "none";
      topBtn.addEventListener("click", function () {
        window.scrollTo({ top: 0, behavior: "smooth" });
      });
      return;
    }

    // 3) 有章节：完整模式（点击展开章节菜单 + 内含回顶）
    function openMenu() {
      var rect = wrap.getBoundingClientRect();
      var vw = window.innerWidth;
      if (rect.left + rect.width / 2 > vw / 2) {
        menu.style.right = "0"; menu.style.left = "auto";
      } else {
        menu.style.left = "0"; menu.style.right = "auto";
      }
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

    // 4) 拖动（pointer events；>6px 视为主动拖动，不触发点击）
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

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", setupFab);
  } else {
    setupFab();
  }
})();
