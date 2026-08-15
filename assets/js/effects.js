/* ============================================================
   NINKORO.COM — 首页动效（DeepSeek Harness 风格适配）
   粒子星空（canvas 2D + 鼠标连线）· 终端打字
   仅 index.html 加载；尊重 prefers-reduced-motion
   ============================================================ */
(function () {
  "use strict";

  var reduceMotion = window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  /* ---------- 粒子星空 ---------- */
  var canvas = document.getElementById("hero-stars");
  var hero = canvas ? canvas.closest(".hero") : null;
  var ctx = canvas ? canvas.getContext("2d") : null;
  var W = 0, H = 0, DPR = 1, pts = [], mouse = { x: -9999, y: -9999 };
  var raf = null, running = true, LINK_DIST = 130;

  function resize() {
    var rect = hero ? hero.getBoundingClientRect() : { width: 0, height: 0 };
    W = Math.max(rect.width, window.innerWidth);
    H = Math.max(rect.height, window.innerHeight);
    DPR = Math.min(window.devicePixelRatio || 1, 2);
    canvas.width = W * DPR;
    canvas.height = H * DPR;
    ctx.setTransform(DPR, 0, 0, DPR, 0, 0);
    initPts();
  }

  function initPts() {
    pts = [];
    var n = Math.max(28, Math.min(90, Math.floor(W * H / 17000)));
    for (var i = 0; i < n; i++) {
      pts.push({
        x: Math.random() * W,
        y: Math.random() * H,
        vx: (Math.random() - .5) * .2,
        vy: (Math.random() - .5) * .2,
        r: Math.random() * 1.4 + .6,
        a: Math.random() * .4 + .2
      });
    }
  }

  function frame() {
    if (!running) return;
    ctx.clearRect(0, 0, W, H);
    for (var i = 0; i < pts.length; i++) {
      var p = pts[i];
      p.x += p.vx; p.y += p.vy;
      if (p.x < -20) p.x = W + 20; if (p.x > W + 20) p.x = -20;
      if (p.y < -20) p.y = H + 20; if (p.y > H + 20) p.y = -20;
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
      ctx.fillStyle = "hsla(45, 60%, 72%, " + p.a + ")";
      ctx.fill();
      for (var j = i + 1; j < pts.length; j++) {
        var q = pts[j];
        var dx = p.x - q.x, dy = p.y - q.y;
        var d2 = dx * dx + dy * dy;
        if (d2 < LINK_DIST * LINK_DIST) {
          var alpha = (1 - Math.sqrt(d2) / LINK_DIST) * .12;
          ctx.beginPath();
          ctx.moveTo(p.x, p.y); ctx.lineTo(q.x, q.y);
          ctx.strokeStyle = "hsla(45, 60%, 70%, " + alpha + ")";
          ctx.lineWidth = 1;
          ctx.stroke();
        }
      }
      var mx = p.x - mouse.x, my = p.y - mouse.y;
      var md2 = mx * mx + my * my;
      if (md2 < LINK_DIST * LINK_DIST) {
        var ma = (1 - Math.sqrt(md2) / LINK_DIST) * .28;
        ctx.beginPath();
        ctx.moveTo(p.x, p.y); ctx.lineTo(mouse.x, mouse.y);
        ctx.strokeStyle = "hsla(45, 70%, 75%, " + ma + ")";
        ctx.lineWidth = 1;
        ctx.stroke();
      }
    }
    raf = requestAnimationFrame(frame);
  }

  if (canvas && ctx && hero && !reduceMotion) {
    window.addEventListener("resize", resize);
    window.addEventListener("mousemove", function (e) { mouse.x = e.clientX; mouse.y = e.clientY; });
    window.addEventListener("mouseleave", function () { mouse.x = -9999; mouse.y = -9999; });
    resize();
    var ioStars = new IntersectionObserver(function (entries) {
      var vis = entries[0].isIntersecting;
      running = vis;
      if (vis && !raf) raf = requestAnimationFrame(frame);
      if (!vis && raf) { cancelAnimationFrame(raf); raf = null; }
    }, { threshold: 0 });
    ioStars.observe(hero);
  }

  /* ---------- 实用代码演示（CMD / PowerShell / Agent Skill，每次刷新随机，6-8 行，纯英文） ---------- */
  function pick(a) { return a[Math.floor(Math.random() * a.length)]; }
  function mkLine(c, en) { return { c: c, en: en }; }

  var THEMES = [
    {
      id: "dos",
      name: { en: "CMD · Windows Command Prompt", zh: "CMD（Windows 命令提示符）" },
      desc: {
        en: "A practical Windows console workflow: listing and copying files, checking the network, managing processes.",
        zh: "实用的 Windows 命令行操作：文件查看与复制、网络检查、进程管理。"
      },
      use: { en: "System administration, quick file operations, network troubleshooting.", zh: "系统管理、快速文件操作、网络排查。" },
      comments: ["Windows cmd · daily ops", "CMD · quick system check", "DOS console · file & network"],
      lines: [
        "$ dir /b /s C:\\data\\*.csv",
        "$ cd /d D:\\lifeOS && dir",
        "$ ipconfig /all | findstr IPv4",
        "$ ping -n 3 8.8.8.8",
        "$ tasklist | findstr /i ninkoro",
        "$ copy report.csv D:\\backup\\",
        "$ tree /f D:\\docs",
        "$ netstat -ano | findstr :8080",
        "$ chcp 65001",
        "$ set MODE=auto",
        "$ type config.ini",
        "$ mkdir logs && move *.log logs\\"
      ],
      outs: ["→ 42 files found", "→ IPv4: 192.168.1.8 · 4 replies", "✓ backup copied", "→ 3 processes match", "✓ logs moved"]
    },
    {
      id: "ps",
      name: { en: "PowerShell", zh: "PowerShell" },
      desc: {
        en: "A PowerShell automation workflow: inspecting processes and services, reading and exporting data.",
        zh: "PowerShell 自动化工作流：查看进程与服务、读取数据、导出结果。"
      },
      use: { en: "Ops automation, batch processing, data export.", zh: "运维自动化、批处理、数据导出。" },
      comments: ["PowerShell 7 · daily ops", "PS · automation script", "PowerShell · data pipeline"],
      lines: [
        "$ Get-Process | Sort-Object CPU -Descending | Select-Object -First 5",
        "$ Get-Service | Where-Object Status -eq 'Running' | Select-Object -First 5",
        "$ Invoke-WebRequest -Uri https://ninkoro.com/health -UseBasicParsing",
        "$ Get-ChildItem -Recurse -Filter *.csv | Measure-Object",
        "$ Get-Content .\\log.txt -Tail 20",
        "$ Set-Content -Path .\\config.json -Value '{\"mode\":\"auto\"}'",
        "$ $rows = Get-Content .\\data.json | ConvertFrom-Json",
        "$ ConvertTo-Json $rows | Out-File .\\export.json",
        "$ Get-Date -Format 'yyyy-MM-dd HH:mm'",
        "$ Test-Connection -ComputerName 8.8.8.8 -Count 2"
      ],
      outs: ["→ 200 OK · 42ms", "→ 5 processes found", "✓ export.json written", "→ 18 csv files", "✓ 7 services running"]
    },
    {
      id: "skill",
      name: { en: "Agent Skill (CLI)", zh: "Agent Skill（命令行）" },
      desc: {
        en: "Calling agent skills from the command line: memory search, calendar booking, file access, web search.",
        zh: "通过命令行调用 Agent 技能：记忆检索、日历预约、文件读取、网络搜索。"
      },
      use: { en: "AI-powered personal ops: reminders, research, automation.", zh: "AI 驱动的个人事务：提醒、调研、自动化。" },
      comments: ["agent skill · memory & calendar", "ninkoro skills · run demo", "agent skills · daily workflow"],
      lines: [
        "$ skill:memory.search(\"last meeting\")",
        "$ skill:calendar.book(\"course\", \"Thu 19:00\")",
        "$ skill:file.read(\"data/equity.xlsx\")",
        "$ skill:web.search(\"Ninkoro\", top=5)",
        "$ skill:notion.append(\"daily-log\", $entry)",
        "$ skill:mail.draft(\"client\", \"birthday\")",
        "$ npx ninkoro skill run memory.recall --key latest",
        "$ npx ninkoro skill list --filter productivity",
        "$ skill:todo.add(\"review report\", due=tomorrow)",
        "$ skill:calendar.remind(\"call\", $client.name)"
      ],
      outs: ["→ \"last meeting: 2026-08-01\"", "✓ 3 skills loaded", "→ 5 results · top 1: ninkoro.com", "✓ birthday reminder scheduled", "→ todo added · due tomorrow"]
    },
    {
      id: "hybrid",
      name: { en: "PowerShell + Agent Skill", zh: "PowerShell + Agent Skill" },
      desc: {
        en: "A realistic end-to-end workflow: PowerShell gathers today's data, then an agent skill takes the next action.",
        zh: "真实端到端工作流：PowerShell 收集今日数据，Agent 技能接着执行下一步。"
      },
      use: { en: "Automating daily life tasks end-to-end.", zh: "端到端自动化日常事务。" },
      comments: ["PS + skill · end-to-end", "daily automation · hybrid", "PowerShell → agent skill"],
      lines: [
        "$ $rows = Get-Content .\\clients.json | ConvertFrom-Json",
        "$ $due = $rows | Where-Object { $_.birthday -eq (Get-Date -Format 'MM-dd') }",
        "$ skill:mail.draft(\"happy-birthday\", $due)",
        "$ skill:calendar.remind(\"call\", $due.name)",
        "$ ConvertTo-Json $due | Out-File .\\today.json",
        "$ Invoke-WebRequest -Uri https://api.ninkoro.com/sync -Method Post",
        "$ Write-Host 'done' -ForegroundColor Green"
      ],
      outs: ["→ 8 clients due today", "✓ birthday reminder scheduled", "→ sync 200 OK", "✓ today.json written"]
    }
  ];

  function makeDemo() {
    var theme = pick(THEMES);
    var n = 6 + Math.floor(Math.random() * 3);
    var lines = [];
    var used = {};
    lines.push(mkLine("ln-cmd", "# " + pick(theme.comments)));
    used[lines[0].en] = true;
    while (lines.length < n) {
      var isOut = Math.random() < 0.24;
      var pool = isOut ? theme.outs : theme.lines;
      var t = pick(pool);
      if (used[t]) continue;
      used[t] = true;
      var c = isOut ? (t.indexOf("✓") === 0 ? "ln-ok" : "ln-out") : "ln-cmd";
      lines.push(mkLine(c, t));
    }
    return { lines: lines, theme: theme };
  }

  var DEMO_POOL = [];
  var seen = {};
  while (DEMO_POOL.length < 1000) {
    var d = makeDemo();
    var key = d.lines.map(function (l) { return l.en; }).join("|");
    if (!seen[key]) { seen[key] = 1; DEMO_POOL.push(d); }
  }
  var picked = DEMO_POOL[Math.floor(Math.random() * DEMO_POOL.length)];
  var CURRENT_DEMO = picked.lines;
  var CURRENT_THEME = picked.theme;
  var CURRENT_META = { lang: CURRENT_THEME.name, desc: CURRENT_THEME.desc, use: CURRENT_THEME.use };

  function esc(s) {
    return String(s).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
  }

  function buildTypeHTML(lines, uptoLine, uptoChar) {
    var html = "";
    for (var i = 0; i < lines.length; i++) {
      var text = i < uptoLine ? lines[i].en : (i === uptoLine ? lines[i].en.slice(0, uptoChar) : "");
      html += '<span class="' + lines[i].c + '">' + esc(text) + "</span>";
      var isLast = (i === lines.length - 1);
      if (!isLast && (i < uptoLine || (i === uptoLine && uptoChar >= lines[i].en.length))) html += "\n";
    }
    return html;
  }

  var typeLayer = document.getElementById("typeLayer");
  var typeToken = 0, typeTimer = null;
  function typeStart() {
    if (!typeLayer) return;
    var lines = CURRENT_DEMO;
    var token = ++typeToken;
    if (typeTimer) { clearTimeout(typeTimer); typeTimer = null; }
    var body = typeLayer.parentElement;
    function paint(uptoLine, uptoChar, typing) {
      typeLayer.innerHTML = buildTypeHTML(lines, uptoLine, uptoChar) + '<span class="cursor" aria-hidden="true"></span>';
      if (body) body.classList.toggle("is-typing", typing);
    }
    if (reduceMotion) { paint(lines.length, 0, false); return; }
    var li = 0, ci = 0;
    function tick() {
      if (token !== typeToken) return;
      if (li >= lines.length) { paint(lines.length, 0, false); return; }
      paint(li, ci, true);
      ci++;
      if (ci > lines[li].en.length) { li++; ci = 0; typeTimer = setTimeout(tick, 300); return; }
      typeTimer = setTimeout(tick, 30 + Math.random() * 26);
    }
    typeTimer = setTimeout(tick, 500);
  }

  typeStart();
  /* ---------- 查看注释：终端右下角按钮 + 框内展开 ---------- */
  var noteToggle = document.getElementById("noteToggle");
  var noteBox = document.getElementById("demoNote");
  var noteOpen = false;
  function renderNote() {
    if (!noteBox || !CURRENT_META) return;
    var zh = window.NINKORO_CMS && window.NINKORO_CMS.getLang && window.NINKORO_CMS.getLang() === "zh";
    noteBox.innerHTML =
      '<p class="note-lang"><b>' + (zh ? "语言" : "LANGUAGE") + " / </b>" + (zh ? CURRENT_META.lang.zh : CURRENT_META.lang.en) + "</p>" +
      '<p class="note-desc"><b>' + (zh ? "功能" : "WHAT IT DOES") + " / </b>" + (zh ? CURRENT_META.desc.zh : CURRENT_META.desc.en) + "</p>" +
      '<p class="note-use"><b>' + (zh ? "适用场景" : "WHEN TO USE") + " / </b>" + (zh ? CURRENT_META.use.zh : CURRENT_META.use.en) + "</p>";
  }
  if (noteToggle) {
    noteToggle.addEventListener("click", function () {
      noteOpen = !noteOpen;
      noteBox.classList.toggle("show", noteOpen);
      noteToggle.classList.toggle("is-open", noteOpen);
      if (noteOpen) renderNote();
    });
  }
  document.addEventListener("ninkoro:langchange", function () {
    if (!typeLayer) return;
    ++typeToken;
    if (typeTimer) { clearTimeout(typeTimer); typeTimer = null; }
    typeLayer.innerHTML = "";
    typeStart();
    if (noteOpen) renderNote();
  });

  /* ---------- 磁吸按钮 + 入口卡 3D 倾斜（精细指针设备） ---------- */
  var finePointer = window.matchMedia && window.matchMedia("(hover: hover) and (pointer: fine)").matches;
  if (finePointer && !reduceMotion) {
    document.querySelectorAll(".hero-actions .btn, .cta-actions .btn").forEach(function (btn) {
      btn.addEventListener("mousemove", function (e) {
        var r = btn.getBoundingClientRect();
        var dx = e.clientX - (r.left + r.width / 2);
        var dy = e.clientY - (r.top + r.height / 2);
        var mx = Math.max(-6, Math.min(6, dx * 0.22));
        var my = Math.max(-6, Math.min(6, dy * 0.32));
        btn.style.setProperty("--mx", mx.toFixed(1) + "px");
        btn.style.setProperty("--my", my.toFixed(1) + "px");
        btn.classList.add("magnet-in");
      });
      btn.addEventListener("mouseleave", function () {
        btn.classList.remove("magnet-in");
        btn.style.removeProperty("--mx");
        btn.style.removeProperty("--my");
      });
    });

    document.querySelectorAll(".entry-card").forEach(function (card) {
      card.addEventListener("mousemove", function (e) {
        var r = card.getBoundingClientRect();
        var px = (e.clientX - r.left) / r.width - 0.5;
        var py = (e.clientY - r.top) / r.height - 0.5;
        card.style.setProperty("--ry", (px * 10).toFixed(2) + "deg");
        card.style.setProperty("--rx", (-py * 8).toFixed(2) + "deg");
        card.classList.add("tilt-in", "tilt-active");
      });
      card.addEventListener("mouseleave", function () {
        card.classList.remove("tilt-active");
        card.classList.remove("tilt-in");
        card.style.removeProperty("--rx");
        card.style.removeProperty("--ry");
      });
    });
  }

  /* ---------- 彩蛋：CTA「联系我」按钮在框内闪躲鼠标 ---------- */
  var ctaContact = document.getElementById("ctaContact");
  if (ctaContact && finePointer && !reduceMotion) {
    var ctaInner = ctaContact.closest(".cta-inner");
    function dodge() {
      if (!ctaContact.classList.contains("cta-dodge-active")) ctaContact.classList.add("cta-dodge-active");
      var box = ctaInner || ctaContact.parentElement;
      var br = box.getBoundingClientRect();
      var bw = ctaContact.offsetWidth || 130;
      var bh = ctaContact.offsetHeight || 44;
      var pad = 14;
      var maxX = Math.max(pad, br.width - bw - pad);
      var maxY = Math.max(pad, br.height - bh - pad);
      ctaContact.style.left = (pad + Math.random() * Math.max(1, maxX - pad)) + "px";
      ctaContact.style.top = (pad + Math.random() * Math.max(1, maxY - pad)) + "px";
      ctaContact.style.transform = "rotate(" + (Math.random() * 10 - 5).toFixed(1) + "deg)";
    }
    ctaContact.addEventListener("pointerover", dodge);
    if (ctaInner) {
      ctaInner.addEventListener("mousemove", function (e) {
        var r = ctaContact.getBoundingClientRect();
        var dx = e.clientX - (r.left + r.width / 2);
        var dy = e.clientY - (r.top + r.height / 2);
        if (dx * dx + dy * dy < 90 * 90) dodge();
      });
    }
  }
})();
