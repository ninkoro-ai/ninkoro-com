/* ============================================================
   NINKORO.COM — 内容系统 v3
   单一内容源：DEFAULTS → localStorage 缓存 → Supabase 远端
   渲染标记约定（供 edit.js 可视化编辑收割）：
   - 单值文本：  [data-edit="home.sub"]
   - 列表容器：  [data-list-path="works"][data-kind="works"]
   - 列表条目：  [data-item] + 隐藏属性 [data-meta]（非文本字段 JSON）
   - 文本字段：  [data-field="title"]
   - 嵌套列表：  [data-list-key="items"][data-kind="linkItem"]
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
      sub: "在这里，我把想法做成东西——从 LifeOS 这样的个人生活系统，到《AI Agent 产品设计实战手册》这样的产品方法论。相信好东西都是慢慢打磨出来的，也相信 AI Builder 这代人，值得拥有自己的实验室。",
      manifesto: [
        { title: "少即是多", body: "工具越轻，想法越重。能用一张白纸说清的事，不开十个应用。这个网站没有框架、没有构建步骤，打开记事本就能改。" },
        { title: "做出来再说", body: "完美是完成的敌人。先把东西做出来放到阳光下，再慢慢打磨。想法不值钱，做出来才算数。" },
        { title: "长期主义", body: "LifeOS 是个十年项目：健身、饮食、日程、健康、旅行，一步一步来。不追风口，每天推进一点，让系统自己长出来。" }
      ]
    },
    works: [
      {
        year: "2026", status: "wip", title: "LifeOS", en: "A PERSONAL LIFE OS",
        desc: "一个主动管理日常生活的 AI 系统。不止给建议，直接替你完成：自动预约健身课、按预算安排健身餐。从健身场景切入，逐步接管重复决策。",
        tags: ["Next.js", "FastAPI", "Supabase", "Agent"]
      },
      {
        year: "2026", status: "live", title: "Ninkoro.com", en: "THIS VERY SITE",
        desc: "你正在看的这个网站。纯手写、零框架、零构建。暗色暖调、衬线排版、材质分层——自己的地方就该有自己的脾气。",
        tags: ["手写", "零依赖", "响应式"]
      },
      {
        year: "2026", status: "live", title: "LifeOS 官网", en: "PRODUCT LANDING",
        desc: "LifeOS 的产品官网：手机交互 Demo、场景化叙事、纯静态手写。把产品讲清楚之前，先让它好看。",
        tags: ["Landing", "交互动效", "响应式"],
        href: "https://lifeos.ninkoro.com"
      },
      {
        year: "2026", status: "idea", title: "好好吃饭", en: "EAT WELL, DECIDE LESS",
        desc: "LifeOS 的第二个模块：根据训练日、预算和口味，自动规划一周餐单。目标是把\"今天吃什么\"这个世纪难题从大脑里删掉。",
        tags: ["规划中", "餐单", "生活"]
      }
    ],
    thoughts: [
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
        "目前的全部精力在 **LifeOS** 上——一个主动管理日常生活的系统。第一个切入场景是健身：自动约课、按预算安排健身餐，涉及付款的决定永远留给人。",
        "做东西之外，读书、看电影、听音乐，偶尔在这个网站写点什么。所有的输入都会变成输出的审美，所以我对输入很挑剔。"
      ],
      facts: [
        ["位置", "互联网"],
        ["正在做", "LifeOS — 个人生活系统"],
        ["方式", "先想清楚，再动手"],
        ["常用", "TypeScript · Python"],
        ["信条", "少即是多 · 做出来再说"],
        ["联系", "hi@ninkoro.com"]
      ],
      timeline: [
        { when: "2026 — 现在", title: "开始做 LifeOS", body: "从零搭建一个个人生活系统：先想清楚模型，再一行行实现。第一个场景：健身。" },
        { when: "2025", title: "找到自己的工作方式", body: "确认了一件事：把重复的实现交给工具，人专注在判断和审美上，效率会完全不一样了。" },
        { when: "更早", title: "写下第一行代码", body: "从\"这东西能不能做出来\"到\"这东西该被做成什么样\"，中间隔了很多年，也隔了很多个推倒重来的深夜。" }
      ],
      now: [
        { title: "在做", body: "LifeOS：打通\"规划 → 执行 → 人确认付款\"的完整闭环，跑通自动约课与健身餐两个真实场景。" },
        { title: "在读", body: "《设计中的设计》——原研哉。\"再设计\"：把日常之物重新审视一遍，未知化的过程本身就是创造。" },
        { title: "在想", body: "工具的边界感：什么时候该自动，什么时候必须停下来问人。这个分寸，决定了工具是帮手还是麻烦。" }
      ]
    },
    shares: {
      books: [
        { title: "设计中的设计", by: "原研哉", note: "\"再设计\"——把日常之物重新审视一遍。做东西同理：把熟悉的东西未知化，创造就发生在那里。", stars: 5, cover: "设", color: "#d3a24a" },
        { title: "黑客与画家", by: "Paul Graham · 阮一峰 译", note: "做东西是手艺活。每次重读都有新的理由坚持自己的审美偏见。", stars: 5, cover: "黑", color: "#a8756b" },
        { title: "悉达多", by: "赫尔曼·黑塞 · 姜乙 译", note: "知识可以传授，智慧不能。所有的弯路都得自己走一遍。", stars: 4, cover: "悉", color: "#7c8a6e" },
        { title: "银河系边缘的小失常", by: "埃特加·凯雷特", note: "短篇集的教科书：荒诞里全是温柔。累了的时候读一篇，脑子会松快很多。", stars: 4, cover: "银", color: "#8a7a9e" }
      ],
      movies: [
        { title: "银翼杀手 2049", by: "丹尼斯·维伦纽瓦 · 2017", note: "不是霓虹灯，是雾气、废墟和克制的配乐。暗色系审美的启蒙。", stars: 5, cover: "银", color: "#5b7a8c" },
        { title: "完美的日子", by: "维姆·文德斯 · 2023", note: "一个人如何把每一天过成作品。\"下次是下次，现在是现在。\"", stars: 5, cover: "完", color: "#8c9e7a" },
        { title: "星际穿越", by: "克里斯托弗·诺兰 · 2014", note: "硬科幻的外壳，亲情的内核。玉米地、五维书架和管风琴，缺一个都不成立。", stars: 5, cover: "星", color: "#9e6b5b" },
        { title: "花样年华", by: "王家卫 · 2000", note: "克制是最高级的表达。欲言又止的旗袍、慢门镜头和 Yumeji's Theme。", stars: 4, cover: "花", color: "#6b5b8c" }
      ],
      music: [
        { title: "async", by: "坂本龙一 · 2017", note: "钢琴与环境音的\"异步\"。深夜的标配背景，听久了会进入一种安静的专注。", stars: 5, cover: "a", color: "#8c8c8c" },
        { title: "Modal Soul", by: "Nujabes · 2005", note: "Jazz Hip-hop 的永恒坐标。Luv(sic) 系列永远听不腻，是最好的心流触发器。", stars: 5, cover: "N", color: "#b58950" },
        { title: "冀西南林路行", by: "万能青年旅店 · 2020", note: "十年磨一张，太行山云雾里的中国摇滚。编曲的密度和留白都值得反复拆解。", stars: 5, cover: "万", color: "#7a6b5b" },
        { title: "Ylang Ylang", by: "FKJ · 2019", note: "一个人的乐队。钢琴、贝斯、萨克斯层层叠叠，像看一个熟练的工匠即兴造物。", stars: 4, cover: "F", color: "#5b8c7a" }
      ]
    },
    links: [
      {
        name: "设计灵感",
        items: [
          { name: "Awwwards", url: "https://www.awwwards.com", letter: "A", color: "#d3a24a" },
          { name: "Dribbble", url: "https://dribbble.com", letter: "D", color: "#c66a8a" },
          { name: "Behance", url: "https://www.behance.net", letter: "B", color: "#6a8ac6" },
          { name: "Typewolf", url: "https://www.typewolf.com", letter: "T", color: "#8ac66a" },
          { name: "Are.na", url: "https://www.are.na", letter: "Ar", color: "#c6b56a" }
        ]
      },
      {
        name: "开发",
        items: [
          { name: "GitHub", url: "https://github.com", letter: "G", color: "#8a8a8a" },
          { name: "MDN Web Docs", url: "https://developer.mozilla.org", letter: "M", color: "#6a8ac6" },
          { name: "Vercel", url: "https://vercel.com", letter: "V", color: "#5a5a5a" },
          { name: "Can I Use", url: "https://caniuse.com", letter: "C", color: "#8ac66a" },
          { name: "Supabase", url: "https://supabase.com", letter: "Su", color: "#4ac68a" }
        ]
      },
      {
        name: "效率",
        items: [
          { name: "Notion", url: "https://www.notion.so", letter: "N", color: "#8a8a8a" },
          { name: "Raycast", url: "https://www.raycast.com", letter: "R", color: "#c66a6a" },
          { name: "Excalidraw", url: "https://excalidraw.com", letter: "E", color: "#9e7ac6" },
          { name: "Figma", url: "https://www.figma.com", letter: "F", color: "#8ac66a" }
        ]
      },
      {
        name: "阅读与写作",
        items: [
          { name: "少数派", url: "https://sspai.com", letter: "少", color: "#c66a6a" },
          { name: "阮一峰的网络日志", url: "https://www.ruanyifeng.com/blog/", letter: "阮", color: "#6a8ac6" },
          { name: "豆瓣", url: "https://www.douban.com", letter: "豆", color: "#6ac68a" }
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
    }
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

  /* ---------- 条目渲染（edit.js 新增条目时复用） ---------- */
  var ITEM_RENDER = {
    works: function (w, delay, href) {
      var st = STATUS[w.status] || STATUS.idea;
      var tags = (w.tags || []).map(function (t) { return "<li>" + esc(t) + "</li>"; }).join("");
      var inner =
        '<div class="top"><span class="year">' + esc(w.year) + '</span><span class="badge ' + st.cls + '">' + st.label + "</span></div>" +
        '<h3><span data-field="title">' + esc(w.title) + "</span>" + (href ? ' <span class="arrow">→</span>' : "") + "</h3>" +
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
      var go = (linked || hasHref) ? "↗" : "·";
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
      for (var i = 1; i <= 5; i++) stars += i <= (s.stars || 0) ? "★" : '<span class="off">★</span>';
      return '<div data-item' + metaAttr({ stars: s.stars, color: s.color }) + ' class="share-item">' +
        '<div class="share-cover" style="background:' + esc(s.color || "#d3a24a") + ';" data-field="cover">' + esc(s.cover || "?") + "</div>" +
        "<div><h3 data-field=\"title\">" + esc(s.title) + "</h3>" +
        '<p class="by" data-field="by">' + esc(s.by) + "</p>" +
        '<p class="note" data-field="note">' + md(s.note) + "</p></div>" +
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
      document.getElementById("home-works").innerHTML =
        c.works.slice(0, 3).map(function (w, i) { return ITEM_RENDER.works(w, i || "", "works.html"); }).join("");
      document.getElementById("home-works").setAttribute("data-list-path", "home.worksPreview");
      document.getElementById("home-manifesto").innerHTML =
        h.manifesto.map(function (m, i) { return ITEM_RENDER.textCard(m, i || ""); }).join("");
      document.getElementById("home-manifesto").setAttribute("data-list-path", "home.manifesto");
      document.getElementById("home-manifesto").setAttribute("data-kind", "textCard");
      document.getElementById("home-thoughts").innerHTML =
        c.thoughts.slice(0, 3).map(function (t) { return ITEM_RENDER.thought(t, true); }).join("");
    },

    works: function (c) {
      var el = document.getElementById("works-list");
      el.innerHTML = c.works.map(function (w, i) { return ITEM_RENDER.works(w, i % 4 || "", w.href || ""); }).join("");
    },

    thoughts: function (c) {
      var el = document.getElementById("thoughts-list");
      el.innerHTML = c.thoughts.map(function (t) { return ITEM_RENDER.thought(t, false); }).join("");
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

  /* 先用默认内容首屏渲染，再异步拉远端覆盖 */
  var page = document.body.getAttribute("data-page");
  if (page) {
    render(state);
    if (window.NINKORO_DB) {
      window.NINKORO_DB.load().then(function (remote) {
        if (remote && remote.works) {
          render(merge(DEFAULTS, remote));
          /* 远端覆盖：跳过二次动画，直接显示 */
          document.querySelectorAll(".reveal").forEach(function (el) { el.classList.add("visible"); });
        }
      });
    }
  }

  window.NINKORO_CMS = {
    DEFAULTS: DEFAULTS,
    ITEM_RENDER: ITEM_RENDER,
    render: render,
    getState: function () { return state; },
    merge: merge
  };
})();
