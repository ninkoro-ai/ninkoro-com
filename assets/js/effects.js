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

  /* ---------- 终端打字 ---------- */
  var typeLayer = document.getElementById("typeLayer");
  var cursorEl = document.getElementById("cursor");
  var TYPED_LINES_ZH = [
    { t: "$ git clone https://github.com/ninkoro-ai/ninkoro-com", c: "ln-cmd" },
    { t: "$ cd ninkoro-com && python -m http.server 8080", c: "ln-cmd" },
    { t: "→ 你好，我是 Ninkoro", c: "ln-out" },
    { t: "$ open https://ninkoro.com", c: "ln-cmd" },
    { t: "→ 心桥 · 股权穿透 · 我ai学习", c: "ln-ok" }
  ];
  var TYPED_LINES_EN = [
    { t: "$ git clone https://github.com/ninkoro-ai/ninkoro-com", c: "ln-cmd" },
    { t: "$ cd ninkoro-com && python -m http.server 8080", c: "ln-cmd" },
    { t: "→ Hi, I'm Ninkoro", c: "ln-out" },
    { t: "$ open https://ninkoro.com", c: "ln-cmd" },
    { t: "→ Xinqiao · Equity Penetration · AI Study", c: "ln-ok" }
  ];
  function typedLines() {
    return (window.NINKORO_CMS && window.NINKORO_CMS.getLang && window.NINKORO_CMS.getLang() === "zh") ? TYPED_LINES_ZH : TYPED_LINES_EN;
  }
  var TYPED_LINES = typedLines();

  function esc(s) {
    return String(s).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
  }

  function buildTypeHTML(uptoLine, uptoChar) {
    var html = "";
    for (var i = 0; i < TYPED_LINES.length; i++) {
      var text = i < uptoLine ? TYPED_LINES[i].t : (i === uptoLine ? TYPED_LINES[i].t.slice(0, uptoChar) : "");
      html += '<span class="' + TYPED_LINES[i].c + '">' + esc(text) + "</span>";
      if (i < uptoLine || (i === uptoLine && uptoChar >= TYPED_LINES[i].t.length)) html += "\n";
    }
    return html;
  }

  function typeStart() {
    if (!typeLayer || !cursorEl) return;
    TYPED_LINES = typedLines();
    if (reduceMotion) {
      typeLayer.innerHTML = buildTypeHTML(TYPED_LINES.length, 0);
      return;
    }
    var li = 0, ci = 0;
    function tick() {
      if (li >= TYPED_LINES.length) {
        cursorEl.style.animation = "blink 1.1s steps(1) infinite";
        return;
      }
      typeLayer.innerHTML = buildTypeHTML(li, ci);
      cursorEl.style.animation = "none";
      void cursorEl.offsetWidth;
      cursorEl.style.animation = "";
      ci++;
      if (ci > TYPED_LINES[li].t.length) {
        li++; ci = 0;
        window.setTimeout(tick, 420);
        return;
      }
      window.setTimeout(tick, 34 + Math.random() * 28);
    }
    window.setTimeout(tick, 600);
  }

  typeStart();
  document.addEventListener("ninkoro:langchange", function () {
    if (!typeLayer) return;
    typeLayer.innerHTML = "";
    typeStart();
  });
})();
