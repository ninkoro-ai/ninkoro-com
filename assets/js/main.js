/* ============================================================
   NINKORO.COM — 交互脚本
   滚动揭示 · 移动导航 · Tab 切换 · 导航高亮
   ============================================================ */
(function () {
  "use strict";

  /* ---------- 导航滚动态 ---------- */
  var nav = document.querySelector(".nav");
  function onScroll() {
    if (nav) nav.classList.toggle("is-scrolled", window.scrollY > 24);
  }
  window.addEventListener("scroll", onScroll, { passive: true });
  onScroll();

  /* ---------- 移动端菜单 ---------- */
  var burger = document.querySelector(".nav-burger");
  var menu = document.querySelector(".mobile-menu");
  if (burger && menu) {
    burger.addEventListener("click", function () {
      var open = menu.classList.toggle("is-open");
      burger.classList.toggle("is-open", open);
      document.body.style.overflow = open ? "hidden" : "";
      burger.setAttribute("aria-expanded", open);
    });
    menu.querySelectorAll("a").forEach(function (a, i) {
      a.style.transitionDelay = (0.06 * i + 0.1) + "s";
      a.addEventListener("click", function () {
        menu.classList.remove("is-open");
        burger.classList.remove("is-open");
        document.body.style.overflow = "";
      });
    });
  }

  /* ---------- 滚动揭示 ---------- */
  var io = new IntersectionObserver(function (entries) {
    entries.forEach(function (en) {
      if (en.isIntersecting) {
        en.target.classList.add("visible");
        io.unobserve(en.target);
      }
    });
  }, { threshold: 0.12, rootMargin: "0px 0px -40px 0px" });
  document.querySelectorAll(".reveal").forEach(function (el) { io.observe(el); });

  /* 内容重渲染后（远端覆盖 / 编辑保存取消），新节点重新挂观察器 */
  document.addEventListener("ninkoro:rendered", function () {
    document.querySelectorAll(".reveal:not(.visible)").forEach(function (el) { io.observe(el); });
  });

  /* ---------- Tab 切换 ---------- */
  document.querySelectorAll(".tabs").forEach(function (bar) {
    var tabs = bar.querySelectorAll(".tab");
    tabs.forEach(function (tab) {
      tab.addEventListener("click", function () {
        var target = tab.getAttribute("data-tab");
        tabs.forEach(function (t) { t.classList.toggle("active", t === tab); });
        document.querySelectorAll(".tab-panel").forEach(function (p) {
          p.classList.toggle("active", p.id === target);
        });
      });
    });
  });

  /* 按 URL hash 直接激活对应 tab（如从站内搜索跳 shares.html#movies） */
  var hashTab = (location.hash || "").replace("#", "");
  if (hashTab) {
    document.querySelectorAll(".tab").forEach(function (tab) {
      if (tab.getAttribute("data-tab") === hashTab) tab.click();
    });
  }

  /* ---------- 当前页导航高亮 ---------- */
  var here = location.pathname.split("/").pop() || "index.html";
  document.querySelectorAll(".nav-links a, .mobile-menu a").forEach(function (a) {
    if (a.getAttribute("href") === here) a.classList.add("active");
  });

  /* ---------- 页脚年份 ---------- */
  document.querySelectorAll("[data-year]").forEach(function (el) {
    el.textContent = new Date().getFullYear();
  });
})();
