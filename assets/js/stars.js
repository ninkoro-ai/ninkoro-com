/* ============================================================
   NINKORO.COM — 全站银河背景 + 星座彩蛋
   固定全屏 canvas（z-index:-1，位于所有内容之下）
   内容：星云漂移 · 螺旋星系（双旋臂 + 黑洞吸积盘）· 星点 · 鼠标连线
   星座：只绘制在桌面端内容两侧的安全边栏（不压文字），
         并带星云柔光，仿佛置身银河之中
   ============================================================ */
(function () {
  "use strict";

  /* 移动端恢复修改前样式：不渲染全屏银河/星空画布 */
  if (window.matchMedia && window.matchMedia("(max-width: 760px)").matches) return;

  var reduceMotion = window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  var isHome = document.body && document.body.getAttribute("data-page") === "home";

  var canvas = document.createElement("canvas");
  canvas.id = "starfield";
  canvas.setAttribute("aria-hidden", "true");
  document.body.insertBefore(canvas, document.body.firstChild);

  var ctx = canvas.getContext("2d");
  var W = 0, H = 0, DPR = 1;
  var stars = [], arms = [], nebulas = [], consts = [];
  var galaxy = { x: 0, y: 0, r: 0 };
  var mouse = { x: -9999, y: -9999 };
  var raf = null;

  /* 星座数据：归一化坐标（0-1）+ 连线 + 中英名称 */
  var CONSTELLATIONS = [
    {
      name: { zh: "大熊座", en: "Ursa Major" },
      pos: { r: 0.82, a: 55 },
      stars: [[0.05, 0.62], [0.2, 0.5], [0.36, 0.47], [0.5, 0.55], [0.58, 0.72], [0.7, 0.85], [0.88, 0.82]],
      lines: [[0, 1], [1, 2], [2, 3], [3, 4], [4, 5], [5, 6]]
    },
    {
      name: { zh: "猎户座", en: "Orion" },
      pos: { r: 0.52, a: 125 },
      stars: [[0.5, 0.05], [0.88, 0.1], [0.44, 0.55], [0.55, 0.5], [0.66, 0.45], [0.3, 0.92], [0.76, 0.9]],
      lines: [[0, 1], [0, 2], [1, 4], [2, 3], [3, 4], [2, 5], [4, 6]]
    },
    {
      name: { zh: "仙后座", en: "Cassiopeia" },
      pos: { r: 0.30, a: 15 },
      stars: [[0.05, 0.62], [0.28, 0.18], [0.5, 0.72], [0.72, 0.18], [0.95, 0.62]],
      lines: [[0, 1], [1, 2], [2, 3], [3, 4]]
    },
    {
      name: { zh: "天鹅座", en: "Cygnus" },
      pos: { r: 0.46, a: 265 },
      stars: [[0.5, 0.05], [0.5, 0.95], [0.5, 0.5], [0.18, 0.6], [0.82, 0.42]],
      lines: [[0, 2], [2, 1], [3, 2], [2, 4]]
    },
    {
      name: { zh: "天蝎座", en: "Scorpius" },
      pos: { r: 0.74, a: 225 },
      stars: [[0.12, 0.22], [0.28, 0.32], [0.42, 0.48], [0.55, 0.58], [0.68, 0.68], [0.82, 0.74], [0.95, 0.62], [0.9, 0.42]],
      lines: [[0, 1], [1, 2], [2, 3], [3, 4], [4, 5], [5, 6], [6, 7]]
    },
    {
      name: { zh: "狮子座", en: "Leo" },
      pos: { r: 0.85, a: 345 },
      stars: [[0.1, 0.42], [0.16, 0.18], [0.36, 0.08], [0.56, 0.18], [0.52, 0.44], [0.3, 0.54], [0.4, 0.78], [0.78, 0.72]],
      lines: [[0, 1], [1, 2], [2, 3], [3, 4], [4, 5], [5, 0], [5, 6], [6, 7]]
    },
    {
      name: { zh: "天琴座", en: "Lyra" },
      pos: { r: 0.34, a: 305 },
      stars: [[0.5, 0.1], [0.28, 0.42], [0.52, 0.48], [0.42, 0.78], [0.18, 0.7], [0.6, 0.86]],
      lines: [[0, 1], [1, 2], [2, 3], [3, 4], [4, 1], [2, 5]]
    },
    {
      name: { zh: "金牛座", en: "Taurus" },
      pos: { r: 0.58, a: 165 },
      stars: [[0.14, 0.72], [0.3, 0.55], [0.46, 0.5], [0.62, 0.55], [0.78, 0.72], [0.36, 0.24], [0.62, 0.2]],
      lines: [[0, 1], [1, 2], [2, 3], [3, 4], [2, 5], [2, 6]]
    }
  ];

  function resize() {
    DPR = Math.min(window.devicePixelRatio || 1, 2);
    W = window.innerWidth;
    H = window.innerHeight;
    canvas.width = W * DPR;
    canvas.height = H * DPR;
    canvas.style.width = W + "px";
    canvas.style.height = H + "px";
    ctx.setTransform(DPR, 0, 0, DPR, 0, 0);
    layout();
  }

  function layout() {
    galaxy.x = W * 0.58;
    galaxy.y = H * 0.40;
    galaxy.r = Math.min(W, H) * 0.62;
    nebulas = [
      { x: W * 0.84, y: H * 0.20, r: Math.min(W, H) * 0.34, c: "211,162,74", sx: 0.003, sy: 0.002 },
      { x: W * 0.18, y: H * 0.72, r: Math.min(W, H) * 0.30, c: "122,142,210", sx: 0.002, sy: 0.003 },
      { x: W * 0.52, y: H * 0.90, r: Math.min(W, H) * 0.24, c: "94,178,162", sx: 0.002, sy: 0.001 }
    ];
    initStars();
    initArms();
    placeConstellations();
  }

  function initStars() {
    stars = [];
    var n = Math.max(40, Math.min(110, Math.floor(W * H / 15000)));
    for (var i = 0; i < n; i++) {
      stars.push({
        x: Math.random() * W, y: Math.random() * H,
        vx: (Math.random() - .5) * .16, vy: (Math.random() - .5) * .16,
        r: Math.random() * 1.2 + .5,
        a: Math.random() * .3 + .12
      });
    }
  }

  function initArms() {
    arms = [];
    var n = Math.floor(galaxy.r * 0.85);
    var turns = 2.8;
    for (var i = 0; i < n; i++) {
      var t = Math.random();
      var theta = t * Math.PI * 2 * turns;
      var r = galaxy.r * (0.08 + t * 0.92) * (0.8 + Math.random() * 0.4);
      var arm = (i % 2) * Math.PI;
      var p = Math.random();
      arms.push({
        x: galaxy.x + Math.cos(theta + arm) * r,
        y: galaxy.y + Math.sin(theta + arm) * r * 0.72,
        r: Math.random() * 0.9 + .3,
        a: Math.random() * .22 + .08,
        c: p < .68 ? "241,235,219" : (p < .85 ? "211,162,74" : "158,180,228")
      });
    }
  }

  /* 星座只放在内容两侧安全边栏（永不压文字），银河盘面自然延伸到该区域 */
  function placeConstellations() {
    consts = [];
    var gutter = Math.max(0, (W - 1120) / 2);
    if (gutter < 100) return;
    var avoidBottom = isHome ? 250 : 90;
    var data = CONSTELLATIONS[Math.floor(Math.random() * CONSTELLATIONS.length)];
    var left = Math.random() < 0.5;
    var maxW = gutter - 26;
    var s = Math.min(maxW, 150) * (0.9 + Math.random() * 0.2);
    var x = left
      ? 12 + Math.random() * Math.max(1, maxW - s)
      : W - 12 - s - Math.random() * Math.max(1, maxW - s);
    var y = 120 + Math.random() * Math.max(1, H - avoidBottom - 120 - s * 0.9);
    consts.push({ data: data, x: x, y: y, s: s });
  }

  function drawNebulas(time) {
    nebulas.forEach(function (n, i) {
      var dx = Math.sin(time * n.sx + i * 2.1) * W * 0.02;
      var dy = Math.cos(time * n.sy + i * 1.3) * H * 0.02;
      var x = n.x + dx, y = n.y + dy;
      var g = ctx.createRadialGradient(x, y, 0, x, y, n.r);
      g.addColorStop(0, "rgba(" + n.c + ",.075)");
      g.addColorStop(0.6, "rgba(" + n.c + ",.035)");
      g.addColorStop(1, "rgba(" + n.c + ",0)");
      ctx.fillStyle = g;
      ctx.beginPath();
      ctx.arc(x, y, n.r, 0, Math.PI * 2);
      ctx.fill();
    });
  }

  function drawGalaxy() {
    arms.forEach(function (p) {
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
      ctx.fillStyle = "rgba(" + p.c + "," + p.a + ")";
      ctx.fill();
    });
    // 核心辉光
    var g = ctx.createRadialGradient(galaxy.x, galaxy.y, 0, galaxy.x, galaxy.y, galaxy.r * 0.5);
    g.addColorStop(0, "rgba(255,205,130,.12)");
    g.addColorStop(0.5, "rgba(211,162,74,.05)");
    g.addColorStop(1, "rgba(211,162,74,0)");
    ctx.fillStyle = g;
    ctx.beginPath();
    ctx.arc(galaxy.x, galaxy.y, galaxy.r * 0.5, 0, Math.PI * 2);
    ctx.fill();
  }

  function drawConstellation(c) {
    var pts = c.data.stars;
    var x0 = c.x, y0 = c.y, s = c.s;
    // 星云柔光（星座仿佛在银河中）
    var glow = ctx.createRadialGradient(x0 + s / 2, y0 + s * 0.45, 0, x0 + s / 2, y0 + s * 0.45, s * 0.8);
    glow.addColorStop(0, "rgba(211,162,74,.08)");
    glow.addColorStop(1, "rgba(211,162,74,0)");
    ctx.fillStyle = glow;
    ctx.fillRect(x0 - s * 0.25, y0 - s * 0.25, s * 1.5, s * 1.5);
    ctx.strokeStyle = "rgba(211,162,74,.34)";
    ctx.lineWidth = 1;
    c.data.lines.forEach(function (pair) {
      var a = pts[pair[0]], b = pts[pair[1]];
      ctx.beginPath();
      ctx.moveTo(x0 + a[0] * s, y0 + a[1] * s);
      ctx.lineTo(x0 + b[0] * s, y0 + b[1] * s);
      ctx.stroke();
    });
    pts.forEach(function (p) {
      ctx.beginPath();
      ctx.arc(x0 + p[0] * s, y0 + p[1] * s, 1.6, 0, Math.PI * 2);
      ctx.fillStyle = "rgba(241,235,219,.9)";
      ctx.shadowColor = "rgba(211,162,74,.8)";
      ctx.shadowBlur = 4;
      ctx.fill();
      ctx.shadowBlur = 0;
    });
    var maxY = 0;
    pts.forEach(function (p) { if (p[1] > maxY) maxY = p[1]; });
    /* 名称：鼠标悬停到星座上方才显示 */
    var hover = mouse.x >= x0 - 26 && mouse.x <= x0 + s + 26 &&
                mouse.y >= y0 - 26 && mouse.y <= y0 + s + 26;
    if (hover) {
      ctx.font = "11px 'SF Mono','JetBrains Mono',ui-monospace,Menlo,Consolas,monospace";
      ctx.textAlign = "center";
      ctx.fillStyle = "rgba(211,162,74,.85)";
      ctx.fillText(c.data.name.en, x0 + s / 2, y0 + maxY * s + 18);
    }
  }

  function frame() {
    var time = performance.now();
    ctx.clearRect(0, 0, W, H);
    drawNebulas(time);
    for (var i = 0; i < stars.length; i++) {
      var p = stars[i];
      p.x += p.vx; p.y += p.vy;
      if (p.x < -20) p.x = W + 20; if (p.x > W + 20) p.x = -20;
      if (p.y < -20) p.y = H + 20; if (p.y > H + 20) p.y = -20;
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
      ctx.fillStyle = "hsla(45, 60%, 72%, " + p.a + ")";
      ctx.fill();
      var mx = p.x - mouse.x, my = p.y - mouse.y;
      var md2 = mx * mx + my * my;
      if (md2 < 140 * 140) {
        var ma = (1 - Math.sqrt(md2) / 140) * .2;
        ctx.beginPath();
        ctx.moveTo(p.x, p.y); ctx.lineTo(mouse.x, mouse.y);
        ctx.strokeStyle = "hsla(45, 70%, 75%, " + ma + ")";
        ctx.lineWidth = 1;
        ctx.stroke();
      }
    }
    drawGalaxy(time);
    consts.forEach(drawConstellation);
    raf = requestAnimationFrame(frame);
  }

  if (ctx) {
    window.addEventListener("resize", resize);
    window.addEventListener("mousemove", function (e) { mouse.x = e.clientX; mouse.y = e.clientY; });
    window.addEventListener("mouseleave", function () { mouse.x = -9999; mouse.y = -9999; });
    resize();
    if (reduceMotion) {
      frame();
      cancelAnimationFrame(raf);
      raf = null;
    } else {
      raf = requestAnimationFrame(frame);
    }
  }

  window.NINKORO_STARS = {
    get count() { return consts.length; },
    get starCount() { return stars.length + arms.length; },
    get names() { return consts.map(function (c) { return c.data.name.en; }); },
    get boxes() { return consts.map(function (c) { return { x: Math.round(c.x), y: Math.round(c.y), w: Math.round(c.s), h: Math.round(c.s * 0.9) }; }); }
  };
})();
