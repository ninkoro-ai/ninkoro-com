/* ============================================================
   NINKORO.COM — 全站搜索 v1
   索引 = content.js DEFAULTS 动态条目 + 静态页面清单
   纯前端、零外部请求；导航栏放大镜呼出，Ctrl+K / "/" 快捷
   ============================================================ */
(function () {
  "use strict";

  var GROUP_ORDER = ["作品", "书影音", "想法", "资源", "工具", "长文", "归档", "关于", "页面"];
  var MAX_RESULTS = 30;

  /* 静态页面清单（不在 DEFAULTS 里的页面与长文章节） */
  var STATIC_PAGES = [
    { t: "首页", g: "页面", d: "Ninkoro 的个人站：AI Builder · Personal Lab。从 LifeOS 到 AI Agent 产品设计实战手册。", u: "index.html", k: "home 个人站 实验室 入口" },
    { t: "作品", g: "页面", d: "做出来后自己还想再看一眼的东西：LifeOS、Ninkoro.com、LifeOS 官网、好好吃饭。", u: "projects.html", k: "projects 作品集 项目 入口" },
    { t: "分享", g: "页面", d: "书影音与资源工具：看过的好东西，和真正每天都在用的工具。", u: "knowledge.html", k: "知识 分享 书影音 资源 工具 入口" },
    { t: "想法", g: "页面", d: "不成体系的随想：关于做东西、工具的边界与一个审美偏见。", u: "thoughts.html", k: "thoughts 随想 思考 入口" },
    { t: "关于", g: "页面", d: "关于 Ninkoro：自我介绍、速览、时间线、此刻在做，以及 MBTI 与星座特质介绍。", u: "about.html", k: "about 关于我 简历 时间线 mbti 星座 水瓶座 intj" },
    { t: "归档", g: "页面", d: "网站历史页面与旧版本内容归档，内容资产零损失。", u: "archive.html", k: "archive 归档 旧版 历史" },
    { t: "书影音", g: "页面", d: "读书、电影与音乐档案：读过的书、看过的电影、反复听的音乐。", u: "shares.html", k: "shares 读书 电影 音乐 豆瓣 评分" },
    { t: "网址导航", g: "页面", d: "共享 ID、4K 影视与网盘资源搜索的私人起始页。", u: "links.html", k: "links 导航 收藏 资源 id 影视 夸克搜 网盘 指南" },
    { t: "装备清单", g: "页面", d: "硬件、软件与日常手艺、AI 搭档——只留每天都用的。", u: "tools.html", k: "tools 硬件 软件 手艺 原则" },
    { t: "知识库（旧）", g: "归档", d: "原知识库列表页：AI Agent、FitBuddy、Ninkoro Philosophy 三篇文章的归档入口。", u: "wiki.html", k: "wiki 知识库 AI Agent FitBuddy 哲学" },
    { t: "AI Agent", g: "归档", d: "AI Agent 的架构、产品设计与实践记录：从 Planner、Memory、Tool 到 Execution 的完整拆解。", u: "wiki/ai-agent.html", k: "planner memory tool execution 架构" },
    { t: "FitBuddy", g: "归档", d: "FitBuddy 的产品设计记录：AI 自动约课与自动点餐，以及「执行闭环 + 人工确认」的边界设计。", u: "wiki/fitbuddy.html", k: "约课 点餐 乐刻 麦当劳 边界 产品" },
    { t: "Ninkoro Philosophy", g: "归档", d: "为什么建立 Ninkoro，Personal OS 理念，以及 AI 时代个人知识资产的意义。", u: "wiki/ninkoro-philosophy.html", k: "哲学 personal os 知识资产 理念" },
    { t: "AI Agent 产品设计实战手册", g: "长文", d: "面向产品经理与 AI 创业者的 Agent 产品设计方法论，五章全链路覆盖，附 LifeOS 真实案例。", u: "ai-agent-handbook.html", k: "handbook 手册 方法论 agent 产品设计" },
    { t: "第一章　AI Agent 产品的本质与设计范式", g: "长文", d: "从 Chatbot 到 Agent 的演进；五层架构模型；四款产品案例拆解；Agent 设计四原则与可行性 Checklist。", u: "ai-agent-handbook.html#ch1", k: "chatbot assistant 五层架构 意图层 规划层 执行层 反馈层 安全层" },
    { t: "第二章　用户意图理解与多轮对话设计", g: "长文", d: "意图理解三层模型与多轮对话设计：在模糊与精确之间搭一座桥。", u: "ai-agent-handbook.html#ch2", k: "意图理解 对话 上下文 澄清" },
    { t: "第三章　Skill 生态与插件化架构设计", g: "长文", d: "Skill 生态与插件化架构：如何让 Agent 的能力可插拔、可扩展。", u: "ai-agent-handbook.html#ch3", k: "skill 插件 架构 扩展" },
    { t: "第四章　安全合规与边界设计", g: "长文", d: "Agent 安全的四层防护、HITL 人机边界、权限模型与合规框架。", u: "ai-agent-handbook.html#ch4", k: "安全 hitl 权限 rbac 合规 边界 支付" },
    { t: "第五章　从 MVP 到规模化运营", g: "长文", d: "Agent 产品的 MVP 定义、核心指标体系与规模化运营。", u: "ai-agent-handbook.html#ch5", k: "mvp 指标 运营 规模化 留存" }
  ];

  /* ---------- 索引 ---------- */
  function push(out, t, g, d, u, k, x, ext) {
    out.push({ t: t, g: g, d: d, u: u, k: k || "", x: !!x, ext: ext || null });
  }

  function buildIndex() {
    var out = [];
    var s = (window.NINKORO_CMS && window.NINKORO_CMS.getState) ? window.NINKORO_CMS.getState() : null;
    if (s) {
      (s.works || []).forEach(function (w) {
        push(out, w.title, "作品", w.desc, w.href || "projects.html", (w.en || "") + " " + (w.tags || []).join(" "));
      });
      (s.thoughts || []).forEach(function (t) {
        push(out, t.title, "想法", t.body, t.href || "thoughts.html", t.date || "");
      });
      var kindLabel = { books: "读书", movies: "电影", music: "音乐" };
      ["books", "movies", "music"].forEach(function (k) {
        (s.shares && s.shares[k] || []).forEach(function (it) {
          push(out, it.title, "书影音", it.by + "。" + it.note, "shares.html#" + k, kindLabel[k], false, it.douban);
        });
      });
      (s.links || []).forEach(function (grp) {
        (grp.items || []).forEach(function (it) {
          push(out, it.name, "资源", grp.name, it.url, it.url, true);
        });
      });
      (s.tools && s.tools.blocks || []).forEach(function (b) {
        push(out, b.title, "工具", (b.lines || []).map(function (l) { return l[0] + "：" + l[1]; }).join("；"), "tools.html", b.title);
      });
      (s.tools && s.tools.principles || []).forEach(function (p) {
        push(out, p.title, "工具", p.body, "tools.html", "");
      });
      (s.wiki || []).forEach(function (w) {
        push(out, w.title, "归档", w.description, w.url, (w.tags || []).join(" "));
      });
      var a = s.about;
      if (a) {
        (a.paragraphs || []).forEach(function (p) { push(out, "关于 Ninkoro", "关于", p, "about.html", ""); });
        (a.facts || []).forEach(function (f) { push(out, f[0], "关于", f[1], "about.html", "速览"); });
        (a.timeline || []).forEach(function (tm) { push(out, tm.title, "关于", tm.body, "about.html", tm.when); });
        (a.now || []).forEach(function (n) { push(out, n.title, "关于", n.body, "about.html", "此刻在做"); });
      }
    }
    STATIC_PAGES.forEach(function (p) { push(out, p.t, p.g, p.d, p.u, p.k, p.x); });
    return out;
  }

  var INDEX = [];

  /* ---------- 匹配与排序 ---------- */
  function norm(s) { return String(s == null ? "" : s).toLowerCase(); }

  function score(entry, terms) {
    var sc = 0;
    for (var i = 0; i < terms.length; i++) {
      var q = terms[i];
      if (norm(entry.t).indexOf(q) >= 0) sc += 4;
      if (norm(entry.k).indexOf(q) >= 0) sc += 3;
      if (norm(entry.d).indexOf(q) >= 0) sc += 1;
    }
    return sc;
  }

  function snippet(entry, terms) {
    var d = entry.d || "";
    if (d.length <= 90) return d;
    var low = norm(d), first = -1;
    for (var i = 0; i < terms.length; i++) {
      var p = low.indexOf(terms[i]);
      if (p >= 0 && (first < 0 || p < first)) first = p;
    }
    var start = first > 30 ? first - 24 : 0;
    return (start > 0 ? "…" : "") + d.substr(start, 90) + (start + 90 < d.length ? "…" : "");
  }

  function esc(s) {
    return String(s == null ? "" : s)
      .replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");
  }

  function hl(text, terms) {
    var out = esc(text);
    for (var i = 0; i < terms.length; i++) {
      var q = terms[i];
      if (!q) continue;
      var re = new RegExp(q.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"), "gi");
      out = out.replace(re, function (m) { return "<mark>" + m + "</mark>"; });
    }
    return out;
  }

  function doSearch(query) {
    var terms = norm(query).split(/\s+/).filter(function (x) { return x; });
    if (!terms.length) return { terms: terms, hits: [] };
    var hits = [];
    INDEX.forEach(function (e) {
      var sc = score(e, terms);
      if (sc > 0) hits.push({ e: e, s: sc });
    });
    hits.sort(function (a, b) {
      if (b.s !== a.s) return b.s - a.s;
      var ga = GROUP_ORDER.indexOf(a.e.g), gb = GROUP_ORDER.indexOf(b.e.g);
      return (ga < 0 ? 99 : ga) - (gb < 0 ? 99 : gb);
    });
    return { terms: terms, hits: hits.slice(0, MAX_RESULTS) };
  }

  /* ---------- 渲染 ---------- */
  var overlay, input, resultsEl;

  function render(query, terms, hits) {
    if (!query) {
      resultsEl.innerHTML = '<div class="search-state">输入关键词，搜索作品、想法、书影音与工具</div>';
      return;
    }
    if (!hits.length) {
      resultsEl.innerHTML = '<div class="search-state">没有找到相关内容，换个关键词试试</div>';
      return;
    }
    var html = "", lastGroup = null;
    hits.forEach(function (hit, idx) {
      var e = hit.e;
      if (e.g !== lastGroup) {
        lastGroup = e.g;
        html += '<div class="sr-group">' + esc(e.g) + "</div>";
      }
      html += '<div class="search-result' + (idx === 0 ? " is-active" : "") + (e.ext ? " has-ext" : "") + '">';
      html += '<a class="sr-main" href="' + esc(e.u) + '"' + (e.x ? ' target="_blank" rel="noopener"' : "") + ">" +
        '<span class="sr-top"><span class="sr-title">' + hl(e.t, terms) + "</span>" +
        (e.x && !e.ext ? '<span class="sr-tag">外链</span>' : "") + "</span>" +
        (e.d ? '<span class="sr-desc">' + hl(snippet(e, terms), terms) + "</span>" : "") +
        "</a>";
      if (e.ext) html += '<a class="sr-ext" href="' + esc(e.ext) + '" target="_blank" rel="noopener">外链 ↗</a>';
      html += "</div>";
    });
    resultsEl.innerHTML = html;
  }

  /* ---------- 交互 ---------- */
  function move(dir) {
    var items = resultsEl.querySelectorAll(".search-result");
    if (!items.length) return;
    var cur = -1;
    items.forEach(function (el, i) { if (el.classList.contains("is-active")) cur = i; });
    var next = (cur + dir + items.length) % items.length;
    items.forEach(function (el, i) { el.classList.toggle("is-active", i === next); });
    items[next].scrollIntoView({ block: "nearest" });
  }

  function open() {
    overlay.classList.add("is-open");
    overlay.setAttribute("aria-hidden", "false");
    document.body.style.overflow = "hidden";
    var menu = document.querySelector(".mobile-menu");
    var burger = document.querySelector(".nav-burger");
    if (menu && menu.classList.contains("is-open")) {
      menu.classList.remove("is-open");
      if (burger) burger.classList.remove("is-open");
    }
    setTimeout(function () { input.focus(); }, 60);
  }

  function close() {
    overlay.classList.remove("is-open");
    overlay.setAttribute("aria-hidden", "true");
    document.body.style.overflow = "";
    input.value = "";
    render("", [], []);
  }

  function init() {
    overlay = document.querySelector("[data-search-overlay]");
    if (!overlay) return;
    input = overlay.querySelector(".search-input");
    resultsEl = overlay.querySelector("[data-search-results]");
    INDEX = buildIndex();
    render("", [], []);

    document.querySelectorAll("[data-search-open]").forEach(function (btn) {
      btn.addEventListener("click", open);
    });
    overlay.querySelectorAll("[data-search-close]").forEach(function (el) {
      el.addEventListener("click", close);
    });
    input.addEventListener("input", function () {
      var r = doSearch(input.value);
      render(input.value, r.terms, r.hits);
    });

    document.addEventListener("ninkoro:rendered", function () { INDEX = buildIndex(); });

    document.addEventListener("keydown", function (ev) {
      if (ev.isComposing) return;
      var tag = (ev.target && ev.target.tagName || "").toLowerCase();
      var typing = tag === "input" || tag === "textarea" || (ev.target && ev.target.isContentEditable);
      if ((ev.ctrlKey || ev.metaKey) && ev.key.toLowerCase() === "k") {
        ev.preventDefault();
        open();
        return;
      }
      if (!typing && ev.key === "/") {
        ev.preventDefault();
        open();
        return;
      }
      if (!overlay.classList.contains("is-open")) return;
      if (ev.key === "Escape") { ev.preventDefault(); close(); return; }
      if (ev.key === "ArrowDown") { ev.preventDefault(); move(1); return; }
      if (ev.key === "ArrowUp") { ev.preventDefault(); move(-1); return; }
      if (ev.key === "Enter") {
        var a = resultsEl.querySelector(".search-result.is-active .sr-main");
        if (a) a.click();
        ev.preventDefault();
      }
    });
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }
})();
