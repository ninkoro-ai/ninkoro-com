/* ============================================================
   NINKORO.COM — 国际化（默认英文，可切换中文）
   语言状态：localStorage "ninkoro-lang"（en | zh）
   机制：
     - [data-i18n]           元素文本，从 data-en / data-zh 取值
     - [data-i18n-html]      同上，但写入 innerHTML（可含链接）
     - <title data-en data-zh> 页面标题
     - meta[data-i18n-meta]  data-en / data-zh → content
     - [data-i18n-body]      正文容器，内容取自
       <template data-lang-body="en|zh">
   本脚本必须最先加载（在 content.js 之前），以便 content.js 读取初始语言。
   ============================================================ */
(function () {
  "use strict";

  var KEY = "ninkoro-lang";
  var lang = "en";
  try {
    lang = localStorage.getItem(KEY) === "zh" ? "zh" : "en";
  } catch (e) { /* localStorage 不可用时保持默认英文 */ }
  window.__NINKORO_INIT_LANG__ = lang;

  function applyText() {
    var zh = lang === "zh";
    var attr = zh ? "data-zh" : "data-en";
    document.querySelectorAll("[data-i18n], [data-i18n-html]").forEach(function (el) {
      if (!el.hasAttribute(attr)) return;
      if (el.hasAttribute("data-i18n-html")) {
        el.innerHTML = el.getAttribute(attr);
      } else {
        el.textContent = el.getAttribute(attr);
      }
    });
    document.querySelectorAll("[data-i18n-aria]").forEach(function (el) {
      if (el.hasAttribute(attr)) el.setAttribute("aria-label", el.getAttribute(attr));
    });
    document.querySelectorAll("[data-i18n-placeholder]").forEach(function (el) {
      if (el.hasAttribute(attr)) el.setAttribute("placeholder", el.getAttribute(attr));
    });
  }

  function applyMeta() {
    var zh = lang === "zh";
    var t = document.querySelector("title");
    if (t) {
      var tv = zh ? t.getAttribute("data-zh") : t.getAttribute("data-en");
      if (tv) t.textContent = tv;
    }
    document.querySelectorAll("meta[data-i18n-meta]").forEach(function (m) {
      var v = zh ? m.getAttribute("data-zh") : m.getAttribute("data-en");
      if (v) m.setAttribute("content", v);
    });
    var doc = document.documentElement;
    doc.lang = zh ? "zh-CN" : "en";
    doc.classList.toggle("is-zh", zh);
    document.querySelectorAll("[data-lang-toggle]").forEach(function (b) {
      b.classList.toggle("is-zh", zh);
      b.setAttribute("aria-label", zh ? "Switch to English" : "切换到中文");
    });
  }

  function applyBodies() {
    document.querySelectorAll("[data-i18n-body]").forEach(function (box) {
      var tpl = box.parentElement.querySelector('template[data-lang-body="' + lang + '"]');
      if (tpl && tpl.innerHTML.trim()) box.innerHTML = tpl.innerHTML;
    });
    rebuildToc();
  }

  /* wiki 长文的内联目录：正文语言切换后重建 */
  function rebuildToc() {
    var toc = document.getElementById("tocInline");
    if (!toc || !toc.hasAttribute("data-auto")) return;
    var scope = document.querySelector("[data-i18n-body]") || document.querySelector(".longread");
    if (!scope) return;
    var heads = scope.querySelectorAll("h2, h3");
    if (!heads.length) return;
    toc.innerHTML = "";
    var label = document.createElement("div");
    label.className = "toc-label";
    label.textContent = lang === "zh" ? "目录" : "Contents";
    toc.appendChild(label);
    var ol = document.createElement("ol");
    heads.forEach(function (h) {
      if (!h.id) h.id = "s" + Math.random().toString(36).slice(2, 8);
      var li = document.createElement("li");
      var a = document.createElement("a");
      a.href = "#" + h.id;
      a.textContent = h.textContent;
      li.appendChild(a);
      ol.appendChild(li);
    });
    toc.appendChild(ol);
  }

  function setLang(next) {
    if (next !== "zh" && next !== "en") return;
    lang = next;
    try { localStorage.setItem(KEY, lang); } catch (e) {}
    window.__NINKORO_INIT_LANG__ = lang;
    applyText();
    applyMeta();
    applyBodies();
    var cms = window.NINKORO_CMS;
    if (cms && cms.getLang && cms.setLang && cms.getLang() !== lang) {
      cms.setLang(lang);
    }
    document.dispatchEvent(new CustomEvent("ninkoro:langchange", { detail: { lang: lang } }));
  }

  function init() {
    setLang(lang);
    document.querySelectorAll("[data-lang-toggle]").forEach(function (btn) {
      btn.addEventListener("click", function () {
        setLang(lang === "zh" ? "en" : "zh");
      });
    });
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }
})();
