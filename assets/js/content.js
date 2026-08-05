/* ============================================================
   NINKORO.COM — 内容系统 v3
   单一内容源：DEFAULTS（直接在本文件维护，或由 AI Agent 改写）
   渲染标记（data-field / data-item / data-meta）仅用于结构化渲染，无运行时依赖。
   ============================================================ */
(function () {
  "use strict";

  /* ---------- 默认内容 ---------- */
  var DEFAULTS = {
    site: { email: "hi@ninkoro.com" },
    home: {
      eyebrow: "AI BUILDER · PERSONAL LAB",
      titleMain: "你好，我是 ",
      titleAccent: "Ninkoro",
      titleThin: "一个 AI Builder 的个人实验室。",
      sub: "在这里，我把想法做成东西——从「心桥」这样替人记住重要日子的客户关怀助手，到《AI Agent 产品设计实战手册》这样的产品方法论。相信好东西都是慢慢打磨出来的，也相信 AI Builder 这代人，值得拥有自己的实验室。"
    },
    works: [
      {
        year: "2026", status: "live", title: "心桥", en: "XINQIAO · BIRTHDAY CARE",
        desc: "一个替你记住每一个重要日子的客户生日关怀助手：自动推算生日、提前 7 天提醒、一键生成走心祝福。纯本地存储、零后端，可「添加到主屏幕」离线使用。",
        tags: ["PWA", "React", "IndexedDB", "零后端"],
        href: "https://xinqiao.ninkoro.com"
      },
      {
        year: "2026", status: "live", title: "我ai学习", en: "AI STUDY COMPANION",
        desc: "一个 AI 辅助的考研备考工作台：207 个知识点、艾宾浩斯智能复习、掌握度追踪、闯关测试与连续打卡。全程本地存储、零后端，可「添加到主屏幕」离线使用。",
        tags: ["PWA", "零后端", "LocalStorage", "考研备考"],
        href: "https://study.ninkoro.com"
      },
      {
        year: "2026", status: "live", title: "Ninkoro.com", en: "THIS VERY SITE",
        desc: "你正在看的这个网站。纯手写、零框架、零构建。暗色暖调、衬线排版、材质分层——自己的地方就该有自己的脾气。",
        tags: ["手写", "零依赖", "响应式"]
      },
      {
        year: "2026", status: "wip", title: "LifeOS", en: "A PERSONAL LIFE OS",
        desc: "一个主动管理日常生活的 AI 系统（开发中）。从健身场景切入，探索「规划 → 执行 → 人确认」的闭环。目前仍在打磨，暂不作为重点展示。",
        tags: ["Next.js", "FastAPI", "Supabase", "开发中"]
      }
    ],
    thoughts: [
      { date: "2026.08", title: "从一句 slogan 到一款被真正用起来的产品：心桥诞生记", body: "记录「心桥」从想法到上线的完整思考路径：为什么做、怎么做、每个功能设计背后的权衡，以及踩过的坑与修正。", href: "thought-xinqiao.html" },
      { date: "2026.07", title: "新书｜《AI Agent 产品设计实战手册》", body: "一本写给产品经理和 AI 创业者的实战手册：从 0 到 1 覆盖设计、构建、验证、运营全链路。五章、三十多个可复用 Checklist 与决策矩阵，附 LifeOS 真实案例拆解。", href: "ai-agent-handbook.html" },
      { date: "2026.07", title: "工具越快，越要把时间留给审美", body: "当实现一件事的成本越来越低，人剩下的工作恰恰是最值钱的部分：判断什么该做、什么不该做，以及把它做成什么样子。" },
      { date: "2026.06", title: "一周写完一个生产级后端的体会", body: "10 个实体、12 条路由、零漂移。关键不是技巧，而是动手之前先想清楚：模型定不下来，代码写得越快返工越多。" },
      { date: "2026.06", title: "分寸感比能力更重要", body: "LifeOS 里有一条硬边界：系统可以把订单下到\"待付款\"，但绝不自动扣款。自动与打扰之间只有一线之隔，好的系统知道什么时候该停下来问人。" },
      { date: "2026.05", title: "一个人做东西，第一道坎不是技术", body: "是持续在没人鼓掌的日子里推进。解决办法只有一个：把进度变成可见的东西——每天一条提交记录，每周一页日志。" },
      { date: "2026.05", title: "为什么这个网站不用任何框架", body: "一个个人网站需要框架吗？不需要。纯手写，打开记事本就能改，十年后还能跑。工具的复杂度应该和问题的复杂度成正比。" },
      { date: "2026.04", title: "把\"今天吃什么\"从大脑里删掉", body: "人每天要做上百个决策，大多数都是重复的、低价值的。省下来的认知带宽，留给真正重要的事。" }
    ],
    about: {
      lede: "我是 Ninkoro，一个喜欢做东西的人。",
      paragraphs: [
        "我相信**好东西都是打磨出来的**。实现一件事的成本越来越低之后，真正值钱的只剩两件事：判断力和审美。所以我的所有作品，都坚持自己定方向、自己定细节。",
        "目前的精力主要放在 **心桥** 上——一个替人记住重要日子、把关怀提前送到的客户生日助手。也还在慢慢打磨 **LifeOS** 这样的生活系统原型，涉及付款的决定永远留给人。",
        "做东西之外，读书、看电影、听音乐，偶尔在这个网站写点什么。所有的输入都会变成输出的审美，所以我对输入很挑剔。"
      ],
      facts: [
        ["位置", "互联网"],
        ["正在做", "心桥 — 客户生日助手"],
        ["方式", "先想清楚，再动手"],
        ["常用", "TypeScript · Python"],
        ["信条", "少即是多 · 做出来再说"],
        ["联系", "hi@ninkoro.com"]
      ],
      timeline: [
        { when: "2026 — 现在", title: "上线「心桥」", body: "做出第一个真正被人用起来的小工具：替人记住每一个重要的生日，把关怀提前送到。从想法到上线，全程自己设计、自己写。" },
        { when: "2025", title: "找到自己的工作方式", body: "确认了一件事：把重复的实现交给工具，人专注在判断和审美上，效率会完全不一样了。" },
        { when: "更早", title: "写下第一行代码", body: "从\"这东西能不能做出来\"到\"这东西该被做成什么样\"，中间隔了很多年，也隔了很多个推倒重来的深夜。" }
      ],
      now: [
        { title: "在做", body: "心桥：打磨维护记录、批量导入与一键撤销等人际关怀的细节，让工具真正好用、让人愿意每天打开。" },
        { title: "在读", body: "《设计中的设计》——原研哉。\"再设计\"：把日常之物重新审视一遍，未知化的过程本身就是创造。" },
        { title: "在想", body: "工具的边界感：什么时候该自动，什么时候必须停下来问人。这个分寸，决定了工具是帮手还是麻烦。" }
      ]
    },
    shares: {
      books: [
        { title: "置身事内", by: "兰小欢 · 上海人民出版社 · 2021", note: "以地方政府投融资为主线，把“土地财政—产业升级”的运作逻辑讲得明明白白。想看懂中国经济，这是最好的入门之一。", stars: 5, cover: "置", color: "#d3a24a", douban: "https://book.douban.com/subject/35546622/" },
        { title: "讲谈社·中国的历史", by: "讲谈社 · 十卷本", note: "日本学界写给大众的中国通史，十位学者各写一卷，从神话时代一路写到清末。视角新鲜，少有成见，适合打破惯常的历史叙事。", stars: 5, cover: "史", color: "#a8756b", douban: "https://book.douban.com/subject/25844017/" },
        { title: "咸的玩笑", by: "刘震云 · 2025", note: "刘震云新作：杜太白在教师、红白事主持人与小贩之间辗转求生。语言依旧幽默锋利，底色是悲悯——“献给命运玩笑中认真生活的人”。", stars: 4, cover: "咸", color: "#7c8a6e", douban: "https://book.douban.com/subject/37833272/" }
      ],
      movies: [
        { title: "绝望写手", by: "Hacks · 第一季 · 2021", note: "HBO 双女主喜剧：拉斯维加斯传奇女谐星 Deborah 与失业的年轻写手 Ava 被迫搭档。台词锋利如刀，笑点里全是代际与时代的碰撞。", stars: 5, cover: "写", color: "#9e6b8c", douban: "https://movie.douban.com/subject/35445834/" },
        { title: "人浮于爱", by: "林书宇 · 2025", note: "改编自侯文咏同名小说，陈妍希、吴慷仁、宋芸桦等主演。几段爱情在都市里载浮载沉，温柔的表象下是现实的钝痛。", stars: 4, cover: "爱", color: "#7a8a9e", douban: "https://movie.douban.com/subject/35441802/" },
        { title: "星期三", by: "Wednesday · 2022", note: "《亚当斯一家》衍生剧，蒂姆·伯顿参与执导。珍娜·奥尔特加把哥特少女演成新一代 icon——阴郁、毒舌，却意外让人共情。", stars: 5, cover: "三", color: "#5b6b8c", douban: "https://movie.douban.com/subject/35364243/" },
        { title: "蜘蛛侠：崭新之日", by: "Spider-Man: Brand New Day · 德斯汀·克里顿 · 2026", note: "荷兰弟版蜘蛛侠第四部：全世界遗忘了彼得·帕克，他独自成为全职的好邻居。两个半小时的孤独英雄成长史，豆瓣开分创系列新高。", stars: 4, cover: "蜘", color: "#a04a4a", douban: "https://movie.douban.com/subject/36246195/" }
      ],
      music: [
        { title: "Catch Catch", by: "YENA 崔叡娜 · 2026", note: "来自第五张迷你专辑《Love Catcher》的主打歌。轻快的节拍和俏皮的旋律，是最近循环最多的开心歌。", stars: 4, cover: "C", color: "#c66a8a" },
        { title: "Perfect Illusion", by: "Lady Gaga · 2016", note: "《Joanne》的首支单曲。失真吉他与电子节拍包裹着关于“完美幻觉”的声嘶力竭，是 Gaga 回归根源的宣言。", stars: 4, cover: "P", color: "#b58950" },
        { title: "Radio", by: "Lana Del Rey · 2012", note: "《Born to Die》里的名曲。慵懒复古的嗓音唱出“我是电台”的宣言，丧里带着骄傲，越听越上瘾。", stars: 5, cover: "R", color: "#8a7a9e" }
      ]
    },
    links: [
      {
        name: "资源",
        items: [
          { name: "共享 ID", url: "https://idshare001.me", letter: "ID", color: "#6a8ac6" },
          { name: "4K 影视", url: "https://pomo.mom", letter: "4K", color: "#a04a4a" },
          { name: "夸克搜", url: "https://kuakesou.net", letter: "夸", color: "#4ac68a" }
        ]
      }
    ],
    tools: {
      blocks: [
        { title: "硬件", lines: [
          ["CPU", "Intel i5-12600KF · 10核16线程"],
          ["散热", "雅浚 ProArtist X600 PRO · 6热管"],
          ["内存", "金百达 32GB (16G×2) 3200"],
          ["固态", "雷克沙 NQ790 1T · 读7000/写6000"],
          ["主板", "华硕 PRIME B760M-K D4"],
          ["显卡", "七彩虹 4060Ti Advanced OC 16G"],
          ["电源", "全汉 HV Pro 650W · 铜牌"],
          ["机箱", "至睿甄选 V6"],
          ["手机", "iPhone 17 Pro"],
          ["耳机", "AirPods 3"]
        ] },
        { title: "日常工具", lines: [["编辑器", "顺手的那个"], ["终端", "iTerm2 / Windows Terminal"], ["版本管理", "Git · GitHub"], ["数据库", "PostgreSQL"], ["启动器", "Raycast"]] },
        { title: "常用手艺", lines: [["前端", "TypeScript · Next.js"], ["后端", "Python · FastAPI"], ["数据", "PostgreSQL · Supabase"], ["方法", "先想清楚，再动手"], ["原则", "少即是多"]] },
        { title: "设计", lines: [["界面", "Figma"], ["白板", "Excalidraw · 纸和笔"], ["字体灵感", "Typewolf"], ["取色", "系统取色器 + 眼睛"]] },
        { title: "写作与记录", lines: [["笔记", "Markdown 纯文本"], ["日志", "每天一条，进度可见"], ["阅读", "微信读书 · 纸质书"], ["标记", "豆瓣 · 书影音档案"]] },
        { title: "生活", lines: [["音乐", "Apple Music"], ["健身", "乐刻 · 自动约课"], ["饮食", "好好吃饭，少做决定"], ["专注", "番茄钟 + 降噪耳机"]] }
      ],
      principles: [
        { title: "够用就好", body: "工具的复杂度应该和问题的复杂度成正比。个人网站不需要框架，笔记不需要数据库。为不存在的需求提前买单，是最贵的浪费。" },
        { title: "少换，多用", body: "频繁换工具是另一种拖延。选定一套，用到肌肉记忆里——顺手的键位、启动器的唤起，全是时间复利。" },
        { title: "数据在自己手里", body: "重要的东西用纯文本存，写在本地。服务会倒闭，格式会过时，纯文本永远能打开。" }
      ]
    },
    wiki: [
      { title: "AI Agent", category: "AI", tags: ["AI", "Product"], description: "关于 AI Agent 架构、产品设计与实践记录：Planner、Memory、Tool、Execution。", updated: "2026.07", url: "wiki/ai-agent.html" },
      { title: "FitBuddy", category: "产品", tags: ["Product", "Life"], description: "AI 自动约课与自动点餐的产品设计记录：产品定位、执行闭环与人工确认边界。", updated: "2026.07", url: "wiki/fitbuddy.html" },
      { title: "Ninkoro Philosophy", category: "思想", tags: ["Philosophy", "Life"], description: "为什么建立 Ninkoro，Personal OS 理念，以及 AI 时代个人知识资产的意义。", updated: "2026.07", url: "wiki/ninkoro-philosophy.html" }
    ]
  };

  /* ---------- 工具 ---------- */
  function esc(s) {
    return String(s == null ? "" : s)
      .replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;");
  }
  function md(s) {
    return esc(s).replace(/\*\*([^*]+)\*\*/g, "<strong>$1</strong>");
  }
  function metaAttr(obj) {
    return ' data-meta="' + esc(JSON.stringify(obj || {})) + '"';
  }
  function pad2(n) { return (n < 10 ? "0" : "") + n; }
  function merge(base, saved) {
    var out = {};
    for (var k in base) out[k] = (saved && saved[k] !== undefined) ? saved[k] : base[k];
    return out;
  }

  var STATUS = {
    live: { label: "已上线", cls: "live" },
    wip: { label: "进行中", cls: "wip" },
    idea: { label: "构思中", cls: "idea" }
  };

  /* ---------- 条目渲染（在 DEFAULTS 中新增条目时复用） ---------- */
  var ITEM_RENDER = {
    works: function (w, delay, href) {
      var st = STATUS[w.status] || STATUS.idea;
      var tags = (w.tags || []).map(function (t) { return "<li>" + esc(t) + "</li>"; }).join("");
      var inner =
        '<div class="top"><span class="year">' + esc(w.year) + '</span><span class="badge ' + st.cls + '">' + st.label + "</span></div>" +
        '<h3><span data-field="title">' + esc(w.title) + "</span>" + (href ? ' <span class="arrow"></span>' : "") + "</h3>" +
        '<p class="en" data-field="en">' + esc(w.en) + "</p>" +
        "<p data-field=\"desc\">" + md(w.desc) + "</p>" +
        '<ul class="tags">' + tags + "</ul>";
      var attrs = ' data-item' + metaAttr({ year: w.year, status: w.status, tags: w.tags || [] }) +
        ' class="spot work-card reveal' + (delay ? '" data-delay="' + delay : "") + '"';
      if (href) return '<a href="' + href + '"' + attrs + ">" + inner + "</a>";
      return "<div" + attrs + ">" + inner + "</div>";
    },
    thought: function (t, linked) {
      var hasHref = !!(t.href && String(t.href).trim());
      var go = (linked || hasHref) ? '<span class="ico ico-ext"></span>' : "·";
      var inner =
        '<span class="date" data-field="date">' + esc(t.date) + "</span>" +
        "<div><h3 data-field=\"title\">" + esc(t.title) + "</h3><p data-field=\"body\">" + md(t.body) + "</p></div>" +
        '<span class="go">' + go + "</span>";
      /* href 存入 data-meta，可视化编辑收割时可保留，不破坏现有字段 */
      var attrs = ' data-item' + metaAttr({ href: t.href || "" }) + ' class="list-row"' + (linked || hasHref ? "" : ' style="cursor:default;"');
      if (hasHref) return '<a href="' + esc(t.href) + '"' + attrs + ">" + inner + "</a>";
      if (linked) return '<a href="thoughts.html"' + attrs + ">" + inner + "</a>";
      return "<article" + attrs + ">" + inner + "</article>";
    },
    wikiCard: function (w, delay) {
      var inner =
        '<span class="cat" data-field="category">' + esc(w.category) + "</span>" +
        '<h3><span data-field="title">' + esc(w.title) + '</span> <span class="arrow"></span></h3>' +
        '<p data-field="description">' + md(w.description) + "</p>" +
        (w.updated ? '<span class="upd">更新 ' + esc(w.updated) + "</span>" : "");
      var attrs = ' data-item' + metaAttr({ category: w.category, updated: w.updated || "" }) +
        ' class="spot wiki-card reveal' + (delay ? '" data-delay="' + delay : '"');
      return '<a href="' + esc(w.url) + '"' + attrs + ">" + inner + "</a>";
    },
    textCard: function (t, delay) {
      return '<div data-item' + metaAttr({}) + ' class="spot work-card reveal"' + (delay ? ' data-delay="' + delay + '"' : "") + ">" +
        "<h3 data-field=\"title\">" + esc(t.title) + "</h3><p data-field=\"body\">" + md(t.body) + "</p></div>";
    },
    timeline: function (t) {
      return '<div data-item' + metaAttr({}) + ' class="tl-item">' +
        '<p class="when" data-field="when">' + esc(t.when) + "</p>" +
        "<h3 data-field=\"title\">" + esc(t.title) + "</h3>" +
        "<p data-field=\"body\">" + md(t.body) + "</p></div>";
    },
    share: function (s) {
      var stars = "";
      for (var i = 1; i <= 5; i++) stars += i <= (s.stars || 0) ? '<span class="star"></span>' : '<span class="star off"></span>';
      var link = s.douban ? '<a class="douban-link" href="' + esc(s.douban) + '" target="_blank" rel="noopener">豆瓣 <span class="ico ico-ext"></span></a>' : "";
      return '<div data-item' + metaAttr({ stars: s.stars, color: s.color, douban: s.douban || "" }) + ' class="share-item">' +
        '<div class="share-cover" style="background:' + esc(s.color || "#d3a24a") + ';" data-field="cover">' + esc(s.cover || "?") + "</div>" +
        "<div><h3 data-field=\"title\">" + esc(s.title) + "</h3>" +
        '<p class="by" data-field="by">' + esc(s.by) + "</p>" +
        '<p class="note" data-field="note">' + md(s.note) + "</p>" + link + "</div>" +
        '<span class="stars">' + stars + "</span></div>";
    },
    linkItem: function (it) {
      var host = String(it.url || "").replace(/^https?:\/\//, "").replace(/\/.*$/, "");
      return '<a data-item' + metaAttr({ url: it.url, letter: it.letter, color: it.color }) +
        ' href="' + esc(it.url) + '" target="_blank" rel="noopener" class="spot link-card">' +
        '<span class="favi" style="background:' + esc(it.color || "#d3a24a") + ';">' + esc(it.letter || "?") + "</span>" +
        '<span class="meta"><span class="name" data-field="name">' + esc(it.name) + "</span>" +
        '<span class="url">' + esc(host) + "</span></span></a>";
    },
    linkGroup: function (g, gi) {
      var cards = (g.items || []).map(ITEM_RENDER.linkItem).join("");
      return '<div data-item' + metaAttr({}) + ' class="links-group reveal">' +
        '<h3><span class="no">' + pad2(gi + 1) + '</span><span data-field="name">' + esc(g.name) + "</span></h3>" +
        '<div class="links-grid" data-list-key="items" data-kind="linkItem">' + cards + "</div></div>";
    },
    toolBlock: function (b, bi) {
      var lines = (b.lines || []).map(function (l) {
        return '<div data-item' + metaAttr({}) + ' class="tool-line">' +
          '<span class="k" data-field="0">' + esc(l[0]) + '</span>' +
          '<span class="v" data-field="1">' + esc(l[1]) + "</span></div>";
      }).join("");
      return '<div data-item' + metaAttr({}) + ' class="spot tool-block reveal"' + (bi ? ' data-delay="' + Math.min(bi, 5) + '"' : "") + ">" +
        "<h3><span class=\"no\">" + pad2(bi + 1) + "</span><span data-field=\"title\">" + esc(b.title) + "</span></h3>" +
        '<div data-list-key="lines" data-kind="kv">' + lines + "</div></div>";
    },
    kv: function (l) { // [k, v]
      return '<div data-item' + metaAttr({}) + ' class="tool-line">' +
        '<span class="k" data-field="0">' + esc(l[0]) + '</span>' +
        '<span class="v" data-field="1">' + esc(l[1]) + "</span></div>";
    },
    fact: function (f) {
      return '<div data-item' + metaAttr({}) + "><dt data-field=\"0\">" + esc(f[0]) + "</dt><dd data-field=\"1\">" + esc(f[1]) + "</dd></div>";
    },
    paragraph: function (p) {
      return '<p data-item data-field="text"' + metaAttr({}) + ">" + md(p) + "</p>";
    }
  };

  /* ---------- 页面渲染器 ---------- */
  var R = {
    home: function (c) {
      var h = c.home;
      document.getElementById("hero-eyebrow").innerHTML = '<span data-edit="home.eyebrow">' + esc(h.eyebrow) + "</span>";
      document.getElementById("hero-title").innerHTML =
        '<span data-edit="home.titleMain">' + esc(h.titleMain) + '</span>' +
        '<span class="accent" data-edit="home.titleAccent">' + esc(h.titleAccent) + "</span><br>" +
        '<span class="thin" data-edit="home.titleThin">' + esc(h.titleThin) + "</span>";
      document.getElementById("hero-sub").innerHTML = '<span data-edit="home.sub">' + md(h.sub) + "</span>";
      var hw = document.getElementById("home-works");
      if (hw) {
        hw.innerHTML = c.works.slice(0, 3).map(function (w, i) { return ITEM_RENDER.works(w, i || "", w.href || "projects.html"); }).join("");
        hw.setAttribute("data-list-path", "home.worksPreview");
      }
      var hm = document.getElementById("home-manifesto");
      if (hm) {
        hm.innerHTML = h.manifesto.map(function (m, i) { return ITEM_RENDER.textCard(m, i || ""); }).join("");
        hm.setAttribute("data-list-path", "home.manifesto");
        hm.setAttribute("data-kind", "textCard");
      }
      var ht = document.getElementById("home-thoughts");
      if (ht) ht.innerHTML = c.thoughts.slice(0, 3).map(function (t) { return ITEM_RENDER.thought(t, true); }).join("");
    },

    works: function (c) {
      var el = document.getElementById("works-list");
      el.innerHTML = c.works.map(function (w, i) { return ITEM_RENDER.works(w, i % 4 || "", w.href || ""); }).join("");
    },

    projects: function (c) {
      var el = document.getElementById("projects-list");
      if (el) el.innerHTML = c.works.map(function (w, i) { return ITEM_RENDER.works(w, i % 4 || "", w.href || ""); }).join("");
    },

    thoughts: function (c) {
      var el = document.getElementById("thoughts-list");
      el.innerHTML = c.thoughts.map(function (t) { return ITEM_RENDER.thought(t, false); }).join("");
    },

    wiki: function (c) {
      var root = document.getElementById("wiki-root");
      if (!root || !c.wiki) return;
      var order = ["AI", "产品", "商业", "思想"];
      var groups = {};
      c.wiki.forEach(function (w) {
        (groups[w.category] = groups[w.category] || []).push(w);
      });
      var cats = Object.keys(groups).sort(function (a, b) {
        var ia = order.indexOf(a), ib = order.indexOf(b);
        if (ia < 0) ia = 99; if (ib < 0) ib = 99;
        return ia - ib;
      });
      root.innerHTML = cats.map(function (cat) {
        var cards = groups[cat].map(function (w, i) { return ITEM_RENDER.wikiCard(w, i % 4); }).join("");
        return '<section class="section wiki-cat">' +
          '<div class="wrap">' +
          '<div class="sec-head row reveal"><div><p class="sec-label">' + esc(cat.toUpperCase()) + '</p>' +
          '<h2 class="sec-title">' + esc(cat) + "</h2></div></div>" +
          '<div class="wiki-grid">' + cards + "</div>" +
          "</div></section>";
      }).join("");
    },

    knowledge: function (c) {
      /* knowledge.html 复用 wiki 渲染器，把 Wiki 卡片内联到 #wiki-root；其余分区为静态链接 */
      R.wiki(c);
    },

    about: function (c) {
      var a = c.about;
      document.getElementById("about-text").innerHTML =
        '<p class="lede"><span data-edit="about.lede">' + md(a.lede) + "</span></p>" +
        '<div data-list-path="about.paragraphs" data-kind="paragraph">' +
        a.paragraphs.map(ITEM_RENDER.paragraph).join("") + "</div>";
      document.getElementById("facts-card").innerHTML =
        '<h3>速览 / Facts</h3><dl data-list-path="about.facts" data-kind="kv">' +
        a.facts.map(ITEM_RENDER.fact).join("") + "</dl>";
      document.getElementById("timeline").innerHTML =
        a.timeline.map(ITEM_RENDER.timeline).join("");
      document.getElementById("now-grid").innerHTML =
        a.now.map(function (n, i) { return ITEM_RENDER.textCard(n, i || ""); }).join("");
    },

    shares: function (c) {
      ["books", "movies", "music"].forEach(function (k) {
        var el = document.getElementById("panel-" + k);
        if (el) el.innerHTML = (c.shares[k] || []).map(ITEM_RENDER.share).join("");
      });
    },

    links: function (c) {
      var el = document.getElementById("links-groups");
      el.innerHTML = c.links.map(ITEM_RENDER.linkGroup).join("");
    },

    tools: function (c) {
      document.getElementById("tools-grid").innerHTML =
        c.tools.blocks.map(ITEM_RENDER.toolBlock).join("");
      document.getElementById("principles-grid").innerHTML =
        c.tools.principles.map(function (p, i) { return ITEM_RENDER.textCard(p, i || ""); }).join("");
    }
  };

  /* ---------- 状态 & 启动 ---------- */
  var state = merge(DEFAULTS, null);

  function applyMailto(c) {
    document.querySelectorAll("[data-mailto]").forEach(function (a) {
      a.setAttribute("href", "mailto:" + c.site.email);
      if (a.hasAttribute("data-mailto-text")) a.textContent = c.site.email;
    });
  }

  function render(c) {
    state = c;
    var page = document.body.getAttribute("data-page");
    if (page && R[page]) R[page](c);
    applyMailto(c);
    document.dispatchEvent(new CustomEvent("ninkoro:rendered", { detail: { state: c } }));
  }

  /* 首屏用默认内容渲染（内容维护：直接编辑本文件 DEFAULTS，或由 AI Agent 改写） */
  var page = document.body.getAttribute("data-page");
  if (page) {
    render(state);
  }

  window.NINKORO_CMS = {
    DEFAULTS: DEFAULTS,
    ITEM_RENDER: ITEM_RENDER,
    render: render,
    getState: function () { return state; },
    merge: merge
  };
})();
