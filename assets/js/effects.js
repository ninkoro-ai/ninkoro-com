/* ============================================================
   NINKORO.COM — 首页动效（DeepSeek Harness 风格适配）
   粒子星空（canvas 2D + 鼠标连线）· 终端打字
   仅 index.html 加载；尊重 prefers-reduced-motion
   ============================================================ */
(function () {
  "use strict";

  var reduceMotion = window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;

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

  /* ---------- 彩蛋：PC 首屏底部地球弧线 + 访客坐标（IP 定位） ---------- */
  var earthArc = document.getElementById("earthArc");
  if (earthArc) {
    var earthDot = document.getElementById("earthDot");
    var earthRing = document.getElementById("earthDotRing");
    var earthCoords = document.getElementById("earthCoords");
    var COUNTRY = [
      { c: "CN", lat: 35.86, lon: 104.19 }, { c: "US", lat: 39.83, lon: -98.58 },
      { c: "JP", lat: 36.20, lon: 138.25 }, { c: "SG", lat: 1.35, lon: 103.82 },
      { c: "HK", lat: 22.32, lon: 114.17 }, { c: "TW", lat: 23.70, lon: 121.00 },
      { c: "KR", lat: 36.50, lon: 127.90 }, { c: "DE", lat: 51.10, lon: 10.40 },
      { c: "GB", lat: 55.40, lon: -3.40 }, { c: "FR", lat: 46.20, lon: 2.20 },
      { c: "NL", lat: 52.10, lon: 5.30 }, { c: "RU", lat: 61.50, lon: 105.30 },
      { c: "AU", lat: -25.30, lon: 133.80 }, { c: "CA", lat: 56.10, lon: -106.30 },
      { c: "IN", lat: 20.60, lon: 78.90 }, { c: "BR", lat: -14.20, lon: -51.90 },
      { c: "ID", lat: -0.80, lon: 113.90 }, { c: "IT", lat: 42.80, lon: 12.80 },
      { c: "ES", lat: 40.50, lon: -3.70 }, { c: "SE", lat: 60.10, lon: 18.60 },
      { c: "CH", lat: 46.80, lon: 8.20 }, { c: "UA", lat: 48.40, lon: 31.20 },
      { c: "PL", lat: 52.10, lon: 19.40 }, { c: "TR", lat: 38.96, lon: 35.24 },
      { c: "TH", lat: 15.87, lon: 100.99 }, { c: "VN", lat: 16.00, lon: 108.00 },
      { c: "MY", lat: 4.20, lon: 101.90 }, { c: "PH", lat: 12.90, lon: 121.90 },
      { c: "NZ", lat: -40.90, lon: 174.90 }, { c: "MX", lat: 23.60, lon: -102.50 },
      { c: "AR", lat: -34.00, lon: -64.00 }, { c: "ZA", lat: -29.00, lon: 24.00 },
      { c: "EG", lat: 26.80, lon: 30.80 }, { c: "SA", lat: 23.90, lon: 45.10 },
      { c: "AE", lat: 24.00, lon: 54.00 }, { c: "IL", lat: 31.40, lon: 35.20 },
      { c: "FI", lat: 61.90, lon: 25.70 }, { c: "NO", lat: 60.50, lon: 8.50 },
      { c: "DK", lat: 56.26, lon: 9.50 }, { c: "BE", lat: 50.50, lon: 4.50 },
      { c: "AT", lat: 47.50, lon: 14.50 }, { c: "PT", lat: 39.50, lon: -8.00 },
      { c: "GR", lat: 39.00, lon: 22.00 }, { c: "IE", lat: 53.40, lon: -8.20 },
      { c: "CZ", lat: 49.80, lon: 15.50 }, { c: "RO", lat: 45.90, lon: 25.00 }
    ];
    function findCountry(code) {
      for (var i = 0; i < COUNTRY.length; i++) {
        if (COUNTRY[i].c === code) return COUNTRY[i];
      }
      return null;
    }
    function fmt(lat, lon) {
      var ns = lat >= 0 ? "N" : "S", ew = lon >= 0 ? "E" : "W";
      return Math.abs(lat).toFixed(2) + "° " + ns + ", " + Math.abs(lon).toFixed(2) + "° " + ew;
    }
    function place(lat, lon, ip) {
      var t = (lon + 180) / 360;
      var x = 1200 * t;
      var y = 220 - 520 * t + 520 * t * t;
      earthDot.setAttribute("cx", x);
      earthDot.setAttribute("cy", y);
      earthRing.setAttribute("cx", x);
      earthRing.setAttribute("cy", y);
      var txt = "≈ " + fmt(lat, lon);
      if (ip) txt += " · IP " + ip;
      earthCoords.textContent = txt;
    }
    function randomCoord() {
      return {
        lat: Math.round((Math.random() * 130 - 60) * 100) / 100,
        lon: Math.round((Math.random() * 360 - 180) * 100) / 100
      };
    }
    var zhInit = window.NINKORO_CMS && window.NINKORO_CMS.getLang && window.NINKORO_CMS.getLang() === "zh";
    earthCoords.textContent = zhInit ? "定位中…" : "locating…";
    var settled = false;
    function fallback() {
      if (settled) return;
      settled = true;
      var rc = randomCoord();
      place(rc.lat, rc.lon, null);
    }
    if (window.fetch && /^https?:$/.test(location.protocol)) {
      fetch("/cdn-cgi/trace", { cache: "no-store" }).then(function (r) { return r.text(); }).then(function (txt) {
        if (settled) return;
        settled = true;
        var m = /^ip=(.*)$/m.exec(txt);
        var ip = m ? m[1] : null;
        m = /^loc=(.*)$/m.exec(txt);
        var loc = m ? m[1] : null;
        var cc = loc ? findCountry(loc) : null;
        if (cc) place(cc.lat, cc.lon, ip);
        else {
          var rc = randomCoord();
          place(rc.lat, rc.lon, ip);
        }
      }).catch(fallback);
      window.setTimeout(fallback, 4000);
    } else {
      fallback();
    }
  }
})();
