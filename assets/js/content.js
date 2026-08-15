/* ============================================================
   NINKORO.COM — 内容系统 v3
   单一内容源：DEFAULTS（直接在本文件维护，或由 AI Agent 改写）
   渲染标记（data-field / data-item / data-meta）仅用于结构化渲染，无运行时依赖。
   ============================================================ */
(function () {
  "use strict";

  /* ---------- 默认内容 ---------- */
  var DEFAULTS_ZH = {
    site: { email: "hi@ninkoro.com" },
    home: {
      eyebrow: "AI · 个人实践",
      titleMain: "你好，我是 ",
      titleAccent: "Ninkoro",
      sub: "喜欢琢磨 AI 能怎么真正帮上忙，也动手把它做成能用的东西——从替人记住重要日子的「心桥」，到把复杂股权关系画清楚的「股权穿透」。这里记录我做过的，和正在做的。"
    },
    works: [
      {
        year: "2026", status: "live", title: "股权穿透", en: "EQUITY PENETRATION CHART",
        desc: "上传工商股权 Excel，自动生成一张银行授信场景能直接看懂的股权穿透结构图：多路径持股、交叉持股都能正确表达，25% 以上股东自动穿透，自然人与境外主体自动终止。纯浏览器本地处理，数据不上传。",
        tags: ["零后端", "Excel 导入", "Graph", "银行版式"],
        href: "https://ox.ninkoro.com"
      },
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
      { date: "2026.08", title: "从一个页面到一次整站重建：Ninkoro 变成了会打字的终端", body: "从克隆 DeepSeek Harness 页面开始的一场整站改造记录：动效适配、移动端打磨、中英双语、装着 8 个 Agent CLI 的打字终端、银河背景、彩蛋，以及那些没能活下来的效果。", href: "thought-site-rebuild.html" },
      { date: "2026.08", title: "为什么画一张股权图，差点把一个系统搞崩溃？", body: "「股权穿透」工具背后的架构故事：把真实企业关系硬塞进一棵树，信息必然丢失；换成一张「网」之后才发现，真正的难题是——真实，不等于能看。一次从 Tree 到 Graph 的重新抽象。", href: "equity-graph.html" },
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
        "最近上线了 **股权穿透**——上传工商股权 Excel，自动生成银行能看懂的穿透结构图。它的背后是一次印象深刻的架构重构（想法页有完整记录）。也还在持续打磨 **心桥** 这样的客户生日助手，以及 **LifeOS** 这样的生活系统原型，涉及付款的决定永远留给人。",
        "做东西之外，读书、看电影、听音乐，偶尔在这个网站写点什么。所有的输入都会变成输出的审美，所以我对输入很挑剔。"
      ],
      facts: [
        ["位置", "互联网"],
        ["正在做", "股权穿透 · 心桥"],
        ["方式", "先想清楚，再动手"],
        ["常用", "TypeScript · Python"],
        ["信条", "少即是多 · 做出来再说"],
        ["联系", "hi@ninkoro.com"]
      ],
      timeline: [
        { when: "2026 — 现在", title: "上线「股权穿透」", body: "把一次股权图需求的架构重构，做成了人人可用的工具：上传工商股东 Excel，自动生成可读的穿透结构图。最大的收获不是代码，而是重新理解了「正确的抽象」这件事。" },
        { when: "2026", title: "上线「心桥」", body: "做出第一个真正被人用起来的小工具：替人记住每一个重要的生日，把关怀提前送到。从想法到上线，全程自己设计、自己写。" },
        { when: "2025", title: "找到自己的工作方式", body: "确认了一件事：把重复的实现交给工具，人专注在判断和审美上，效率会完全不一样了。" },
        { when: "更早", title: "写下第一行代码", body: "从\"这东西能不能做出来\"到\"这东西该被做成什么样\"，中间隔了很多年，也隔了很多个推倒重来的深夜。" }
      ],
      now: [
        { title: "在做", body: "股权穿透刚上线：用真实企业案例继续打磨识别与排版，让再复杂的股权关系也能一页看懂；心桥同步持续维护。" },
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

  /* ---------- 英文内容（默认语言） ---------- */
  var DEFAULTS_EN = {
    site: { email: "hi@ninkoro.com" },
    home: {
      eyebrow: "AI · PERSONAL PRACTICE",
      titleMain: "Hi, I'm ",
      titleAccent: "Ninkoro",
      sub: "I like figuring out how AI can genuinely help, then building it into things people actually use — from Xinqiao, a little tool that remembers the birthdays that matter, to an equity penetration chart that makes tangled shareholding structures readable. This is where I keep what I've made, and what I'm making."
    },
    works: [
      {
        year: "2026", status: "live", title: "Equity Penetration", en: "EQUITY PENETRATION CHART",
        desc: "Upload a business-registration equity Excel and get a shareholding structure chart a bank credit team can read at a glance: multi-path and cross holdings render correctly, shareholders above 25% are automatically traced, and individuals or offshore entities terminate the chain. Everything runs locally in the browser — your data never leaves your device.",
        tags: ["Zero-Backend", "Excel Import", "Graph", "Bank-Ready"],
        href: "https://ox.ninkoro.com"
      },
      {
        year: "2026", status: "live", title: "Xinqiao", en: "XINQIAO · BIRTHDAY CARE",
        desc: "A customer birthday-care assistant that remembers every important date for you: auto-computes birthdays, reminds you 7 days ahead, and drafts a heartfelt greeting in one tap. Fully local storage, zero backend, installable offline via “Add to Home Screen”.",
        tags: ["PWA", "React", "IndexedDB", "Zero-Backend"],
        href: "https://xinqiao.ninkoro.com"
      },
      {
        year: "2026", status: "live", title: "AI Study", en: "AI STUDY COMPANION",
        desc: "An AI-assisted study workbench for grad-school exams: 207 knowledge points, Ebbinghaus spaced review, mastery tracking, checkpoint quizzes and daily streaks. Fully local storage, zero backend, installable offline via “Add to Home Screen”.",
        tags: ["PWA", "Zero-Backend", "LocalStorage", "Exam Prep"],
        href: "https://study.ninkoro.com"
      },
      {
        year: "2026", status: "live", title: "Ninkoro.com", en: "THIS VERY SITE",
        desc: "The site you're looking at. Hand-written, zero frameworks, zero build steps. Warm dark tones, serif type, layered materials — your own corner of the internet should have its own temperament.",
        tags: ["Hand-Coded", "Zero Dependencies", "Responsive"]
      },
      {
        year: "2026", status: "wip", title: "LifeOS", en: "A PERSONAL LIFE OS",
        desc: "An AI system that actively manages daily life (in development). Starting with fitness, exploring a closed loop of “plan → execute → human confirms”. Still being polished, not the current focus.",
        tags: ["Next.js", "FastAPI", "Supabase", "In Progress"]
      }
    ],
    thoughts: [
      { date: "2026.08", title: "From one page to a whole rebuild: how ninkoro.com became a terminal that types", body: "The full log of redesigning ninkoro.com after cloning the DeepSeek Harness page: motion adaptation, mobile polish, bilingual i18n, a typewriter terminal with 8 agent CLIs, a galaxy background, easter eggs — and the effects that didn't survive.", href: "thought-site-rebuild.html" },
      { date: "2026.08", title: "Why drawing one equity chart nearly crashed a system", body: "The architecture story behind the Equity Penetration tool: cramming real corporate relationships into a tree loses information; switching to a graph revealed the real challenge — being truthful is not the same as being legible. A rebuild from Tree to Graph.", href: "equity-graph.html" },
      { date: "2026.08", title: "From a slogan to a product people actually use: the birth of Xinqiao", body: "The complete thinking path behind Xinqiao, from idea to launch: why build it, how to build it, the trade-offs behind every feature, and the pitfalls and fixes along the way.", href: "thought-xinqiao.html" },
      { date: "2026.07", title: "New｜The AI Agent Product Design Handbook", body: "A practical handbook for product managers and AI founders: end-to-end coverage of design, build, validation and operations. Five chapters, 30+ reusable checklists and decision matrices, with real LifeOS case studies.", href: "ai-agent-handbook.html" },
      { date: "2026.07", title: "The faster tools get, the more time you should spend on taste", body: "When making things gets cheap, the most valuable work left for humans is exactly this: deciding what to build, what not to build, and what it should look like." },
      { date: "2026.06", title: "Lessons from writing a production backend in one week", body: "10 entities, 12 routes, zero drift. The key wasn't technique — it was thinking before coding: if the model isn't settled, the faster you write, the more you rework." },
      { date: "2026.06", title: "A sense of proportion matters more than capability", body: "LifeOS has one hard boundary: the system can place an order up to \"awaiting payment\", but never pay automatically. There's a thin line between automation and intrusion — good systems know when to stop and ask." },
      { date: "2026.05", title: "Making things alone: the first hurdle isn't technology", body: "It's keeping going on the days nobody claps. The only fix: make progress visible — a commit a day, a page of log every week." },
      { date: "2026.05", title: "Why this website uses no framework", body: "Does a personal site need a framework? No. Hand-written, editable in any text editor, still running in ten years. Tool complexity should match problem complexity." },
      { date: "2026.04", title: "Deleting \"what should I eat today\" from your brain", body: "Humans make hundreds of decisions a day, most of them repetitive and low-value. Save that cognitive bandwidth for what actually matters." }
    ],
    about: {
      lede: "I'm Ninkoro, someone who likes making things.",
      paragraphs: [
        "I believe **good things are polished into existence**. As making becomes cheaper, only two things still matter: judgment and taste. So every project of mine is self-directed — I set the direction and I set the details.",
        "Recently I shipped **Equity Penetration** — upload a business-registration equity Excel and get a structure chart a bank can read. Behind it is an architecture rebuild I won't forget (fully documented on the thoughts page). I'm also continuously polishing tools like **Xinqiao**, a birthday-care assistant, and prototypes like **LifeOS** — where anything involving payment always stays a human decision.",
        "Beyond building, I read, watch films and listen to music, and occasionally write on this site. All inputs become the taste behind outputs, so I'm picky about what I let in."
      ],
      facts: [
        ["Location", "The Internet"],
        ["Building", "Equity Penetration · Xinqiao"],
        ["Approach", "Think first, then build"],
        ["Stack", "TypeScript · Python"],
        ["Belief", "Less is more · Ship it"],
        ["Contact", "hi@ninkoro.com"]
      ],
      timeline: [
        { when: "2026 — now", title: "Shipped “Equity Penetration”", body: "Turned an architecture rebuild for an equity-chart request into a tool anyone can use: upload a shareholders Excel, get a legible penetration chart. The biggest takeaway wasn't the code — it was re-understanding what “the right abstraction” means." },
        { when: "2026", title: "Shipped “Xinqiao”", body: "Made the first little tool people actually use: remembering every important birthday and delivering care ahead of time. From idea to launch, designed and written entirely by me." },
        { when: "2025", title: "Found my way of working", body: "Confirmed one thing: hand the repetitive implementation to tools, keep humans focused on judgment and taste — and efficiency changes completely." },
        { when: "Earlier", title: "Wrote the first line of code", body: "From “can this even be built” to “what should this become”, there were many years — and many late nights of starting over." }
      ],
      now: [
        { title: "Building", body: "Equity Penetration just launched: refining recognition and layout against real corporate cases so even the most tangled structures fit on one page; maintaining Xinqiao alongside it." },
        { title: "Reading", body: "Designing Design by Kenya Hara — “re-design”: looking at everyday things anew; the process of making the familiar unknown is itself creation." },
        { title: "Thinking", body: "The boundary sense of tools: when to automate, when to stop and ask a human. That proportion decides whether a tool is a helper or a nuisance." }
      ]
    },
    shares: {
      books: [
        { title: "置身事内", by: "Lan Xiaohuan · Shanghai People's Publishing House · 2021", note: "A masterful primer on how China's economy actually works, told through local-government investment and financing: from land finance to industrial upgrading. The best entry point I've found.", stars: 5, cover: "置", color: "#d3a24a", douban: "https://book.douban.com/subject/35546622/" },
        { title: "讲谈社·中国的历史", by: "Kodansha · Ten Volumes", note: "A Chinese history written for general readers by Japan's academic community — ten scholars, one volume each, from the age of myth to the late Qing. Fresh perspectives, few preconceptions; a great way to break out of familiar narratives.", stars: 5, cover: "史", color: "#a8756b", douban: "https://book.douban.com/subject/25844017/" },
        { title: "咸的玩笑", by: "Liu Zhenyun · 2025", note: "Liu Zhenyun's new novel: Du Taibai drifts between teaching, hosting weddings and funerals, and street vending. The language stays witty and sharp; beneath it is compassion — “for people who take life's jokes seriously”.", stars: 4, cover: "咸", color: "#7c8a6e", douban: "https://book.douban.com/subject/37833272/" }
      ],
      movies: [
        { title: "绝望写手", by: "Hacks · Season 1 · 2021", note: "An HBO two-hander: Las Vegas legend Deborah and out-of-work young writer Ava are forced to partner. Razor-sharp dialogue; every laugh is a clash of generations and eras.", stars: 5, cover: "写", color: "#9e6b8c", douban: "https://movie.douban.com/subject/35445834/" },
        { title: "人浮于爱", by: "Lin Shuyu · 2025", note: "Adapted from Hou Wenyong's novel of the same name, starring Chen Yanxi, Wu Kangren and Song Yunhua. Several loves float through the city — gentle on the surface, blunt beneath.", stars: 4, cover: "爱", color: "#7a8a9e", douban: "https://movie.douban.com/subject/35441802/" },
        { title: "星期三", by: "Wednesday · 2022", note: "The Addams Family spinoff with Tim Burton involved. Jenna Ortega turns the gothic teen into a new-generation icon — gloomy, sharp-tongued, and surprisingly easy to root for.", stars: 5, cover: "三", color: "#5b6b8c", douban: "https://movie.douban.com/subject/35364243/" },
        { title: "蜘蛛侠：崭新之日", by: "Spider-Man: Brand New Day · Destin Daniel Cretton · 2026", note: "The fourth Tom Holland Spider-Man: the world has forgotten Peter Parker, and he goes solo as the friendly neighborhood hero. A two-and-a-half-hour story of a lonely hero growing up — Douban's highest franchise opening score.", stars: 4, cover: "蜘", color: "#a04a4a", douban: "https://movie.douban.com/subject/36246195/" }
      ],
      music: [
        { title: "Catch Catch", by: "YENA · 2026", note: "The lead track from her fifth mini album Love Catcher. Bouncy beats and playful melody — the song on repeat lately.", stars: 4, cover: "C", color: "#c66a8a" },
        { title: "Perfect Illusion", by: "Lady Gaga · 2016", note: "The lead single from Joanne. Distorted guitars and electronic beats wrap around a scream about the “perfect illusion” — Gaga's declaration of returning to her roots.", stars: 4, cover: "P", color: "#b58950" },
        { title: "Radio", by: "Lana Del Rey · 2012", note: "A gem from Born to Die. Lazy, retro vocals singing “I'm a radio” — melancholic yet proud, and dangerously addictive.", stars: 5, cover: "R", color: "#8a7a9e" }
      ]
    },
    links: [
      {
        name: "Resources",
        items: [
          { name: "Shared ID", url: "https://idshare001.me", letter: "ID", color: "#6a8ac6" },
          { name: "4K Movies", url: "https://pomo.mom", letter: "4K", color: "#a04a4a" },
          { name: "Kuake Search", url: "https://kuakesou.net", letter: "夸", color: "#4ac68a" }
        ]
      }
    ],
    tools: {
      blocks: [
        { title: "Hardware", lines: [
          ["CPU", "Intel i5-12600KF · 10C/16T"],
          ["Cooler", "ProArtist X600 PRO · 6 heatpipes"],
          ["RAM", "Kingbank 32GB (16G×2) 3200"],
          ["SSD", "Lexar NQ790 1TB · R7000/W6000"],
          ["Motherboard", "ASUS PRIME B760M-K D4"],
          ["GPU", "Colorful 4060Ti Advanced OC 16G"],
          ["PSU", "FSP HV Pro 650W · 80+ Bronze"],
          ["Case", "ZhiRui V6"],
          ["Phone", "iPhone 17 Pro"],
          ["Earbuds", "AirPods 3"]
        ] },
        { title: "Daily Tools", lines: [["Editor", "The one that feels right"], ["Terminal", "iTerm2 / Windows Terminal"], ["Versioning", "Git · GitHub"], ["Database", "PostgreSQL"], ["Launcher", "Raycast"]] },
        { title: "Craft", lines: [["Frontend", "TypeScript · Next.js"], ["Backend", "Python · FastAPI"], ["Data", "PostgreSQL · Supabase"], ["Method", "Think first, then build"], ["Principle", "Less is more"]] },
        { title: "Design", lines: [["UI", "Figma"], ["Whiteboard", "Excalidraw · pen & paper"], ["Type Inspiration", "Typewolf"], ["Colors", "System picker + eyes"]] },
        { title: "Writing & Log", lines: [["Notes", "Plain-text Markdown"], ["Logs", "One entry a day, progress visible"], ["Reading", "WeRead · paper books"], ["Archive", "Douban · books/films/music"]] },
        { title: "Life", lines: [["Music", "Apple Music"], ["Fitness", "LeFit · auto class booking"], ["Food", "Eat well, decide less"], ["Focus", "Pomodoro + noise-cancelling"]] }
      ],
      principles: [
        { title: "Good enough is enough", body: "Tool complexity should match problem complexity. A personal site doesn't need a framework; notes don't need a database. Paying in advance for needs that don't exist is the most expensive waste." },
        { title: "Switch less, use more", body: "Constant tool-switching is another form of procrastination. Pick one set, use it until it's muscle memory — familiar keybindings and launcher habits are compound interest on time." },
        { title: "Keep your data in your hands", body: "Store what matters in plain text, locally. Services die and formats go stale; plain text always opens." }
      ]
    },
    wiki: [
      { title: "AI Agent", category: "AI", tags: ["AI", "Product"], description: "Notes on AI Agent architecture, product design and practice: Planner, Memory, Tool, Execution.", updated: "2026.07", url: "wiki/ai-agent.html" },
      { title: "FitBuddy", category: "Product", tags: ["Product", "Life"], description: "Product design notes for AI auto class-booking and auto meal-ordering: positioning, execution loop and the human-confirmation boundary.", updated: "2026.07", url: "wiki/fitbuddy.html" },
      { title: "Ninkoro Philosophy", category: "Philosophy", tags: ["Philosophy", "Life"], description: "Why Ninkoro exists, the Personal OS idea, and what personal knowledge assets mean in the age of AI.", updated: "2026.07", url: "wiki/ninkoro-philosophy.html" }
    ]
  };

  /* ---------- 语言状态 ---------- */
  var LANG = (window.__NINKORO_INIT_LANG__ === "zh") ? "zh" : "en";
  var CONTENT = { zh: DEFAULTS_ZH, en: DEFAULTS_EN };
  var DEFAULTS = CONTENT[LANG];

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
        '<span class="accent" data-edit="home.titleAccent">' + esc(h.titleAccent) + "</span>";
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
    CONTENT: CONTENT,
    ITEM_RENDER: ITEM_RENDER,
    render: render,
    getState: function () { return state; },
    merge: merge,
    getLang: function () { return LANG; },
    setLang: function (l) {
      if (!CONTENT[l]) return;
      LANG = l;
      DEFAULTS = CONTENT[l];
      state = merge(DEFAULTS, null);
      render(state);
      document.dispatchEvent(new CustomEvent("ninkoro:langchange", { detail: { lang: l } }));
    }
  };
})();
