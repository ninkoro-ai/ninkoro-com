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

  /* ---------- 随机炫酷代码演示（1000 种，每次刷新随机一段，6-8 行，纯英文） ---------- */
  var CMD = ["build", "launch", "orbit", "dream", "sync", "boost", "weave", "pilot", "pulse", "signal"];
  var NAMES = ["agent", "mind", "core", "engine", "pilot", "ghost", "echo", "node"];
  var TYPES = ["Agent", "Model", "Planner", "Memory", "Tool", "Orchestrator", "Dream", "Pulse"];
  var KEYS = ["autonomy", "memory", "focus", "mode", "depth", "loop", "signal", "taste"];
  var VALS = ["true", "42", "'deep'", "1.618", "0.42", "'auto'", "'gold'"];
  var METHODS = ["plan()", "execute()", "remember()", "think()", "learn()", "orbit()", "pulse()", "wake()"];
  var ARGS = ["goal", "dream", "data", "next", "schema", "signal"];
  var CONDS = ["model.focus > 0.8", "loop < 7", "trust == true", "signal.ok", "memory.has('idea')", "phase === 'deep'"];
  var NUMS = [7, 13, 21, 42, 100];
  var PHRASES_EN = ["hello, world", "all systems nominal", "thinking…", "less is more", "wake up", "neural ping", "deep work", "stay curious"];
  var OUT_EN = ["mind online", "ready", "orbit locked", "dream compiled", "memory synced", "signal found", "loop closed", "gold ready"];
  var OK_EN = ["tasks done", "neurons wired", "nodes linked", "paths traced", "layers deep"];

  function pick(a) { return a[Math.floor(Math.random() * a.length)]; }
  function mkLine(c, en) { return { c: c, en: en }; }

  function makeDemo() {
    var n = 6 + Math.floor(Math.random() * 3);
    var lines = [];
    var cmd = pick(CMD);
    lines.push(mkLine("ln-cmd", "$ npx ninkoro " + cmd));
    var used = {};
    while (lines.length < n) {
      var kind = Math.floor(Math.random() * 6);
      var line;
      if (kind === 0) {
        line = mkLine("ln-cmd", "const " + pick(NAMES) + " = new " + pick(TYPES) + "({ " + pick(KEYS) + ": " + pick(VALS) + " })");
      } else if (kind === 1) {
        line = mkLine("ln-cmd", "await " + pick(NAMES) + "." + pick(METHODS) + "(" + pick(ARGS) + ")");
      } else if (kind === 2) {
        line = mkLine("ln-cmd", "if (" + pick(CONDS) + ") { " + pick(NAMES) + ".go() }");
      } else if (kind === 3) {
        line = mkLine("ln-cmd", "# " + pick(PHRASES_EN));
      } else if (kind === 4) {
        line = mkLine("ln-out", "→ " + pick(OUT_EN));
      } else {
        line = mkLine("ln-ok", "✓ " + pick(NUMS) + " " + pick(OK_EN));
      }
      if (!used[line.en]) { used[line.en] = true; lines.push(line); }
    }
    return lines;
  }

  var DEMO_POOL = [];
  var seen = {};
  while (DEMO_POOL.length < 1000) {
    var d = makeDemo();
    var key = d.map(function (l) { return l.en; }).join("|");
    if (!seen[key]) { seen[key] = 1; DEMO_POOL.push(d); }
  }
  var CURRENT_DEMO = DEMO_POOL[Math.floor(Math.random() * DEMO_POOL.length)];

  function esc(s) {
    return String(s).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
  }

  function buildTypeHTML(lines, uptoLine, uptoChar) {
    var html = "";
    for (var i = 0; i < lines.length; i++) {
      var text = i < uptoLine ? lines[i].en : (i === uptoLine ? lines[i].en.slice(0, uptoChar) : "");
      html += '<span class="' + lines[i].c + '">' + esc(text) + "</span>";
      if (i < uptoLine || (i === uptoLine && uptoChar >= lines[i].en.length)) html += "\n";
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
  document.addEventListener("ninkoro:langchange", function () {
    if (!typeLayer) return;
    ++typeToken;
    if (typeTimer) { clearTimeout(typeTimer); typeTimer = null; }
    typeLayer.innerHTML = "";
    typeStart();
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
})();
