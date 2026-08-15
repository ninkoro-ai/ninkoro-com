/* ============================================================
   NINKORO.COM — 全站星空 + 星座彩蛋
   固定全屏 canvas（z-index:-1，位于所有内容之下）
   星点漂移 + 鼠标连线 + 1-3 个随机星座（带中英文名称注释）
   每次刷新随机位置与星座组合
   ============================================================ */
(function () {
  "use strict";

  var reduceMotion = window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  var canvas = document.createElement("canvas");
  canvas.id = "starfield";
  canvas.setAttribute("aria-hidden", "true");
  document.body.insertBefore(canvas, document.body.firstChild);

  var ctx = canvas.getContext("2d");
  var W = 0, H = 0, DPR = 1;
  var stars = [], consts = [];
  var mouse = { x: -9999, y: -9999 };
  var raf = null;

  /* 星座数据：归一化坐标（0-1）+ 连线 + 中英名称 */
  var CONSTELLATIONS = [
    {
      name: { zh: "大熊座", en: "Ursa Major" },
      stars: [[0.05, 0.62], [0.2, 0.5], [0.36, 0.47], [0.5, 0.55], [0.58, 0.72], [0.7, 0.85], [0.88, 0.82]],
      lines: [[0, 1], [1, 2], [2, 3], [3, 4], [4, 5], [5, 6]]
    },
    {
      name: { zh: "猎户座", en: "Orion" },
      stars: [[0.5, 0.05], [0.88, 0.1], [0.44, 0.55], [0.55, 0.5], [0.66, 0.45], [0.3, 0.92], [0.76, 0.9]],
      lines: [[0, 1], [0, 2], [1, 4], [2, 3], [3, 4], [2, 5], [4, 6]]
    },
    {
      name: { zh: "仙后座", en: "Cassiopeia" },
      stars: [[0.05, 0.62], [0.28, 0.18], [0.5, 0.72], [0.72, 0.18], [0.95, 0.62]],
      lines: [[0, 1], [1, 2], [2, 3], [3, 4]]
    },
    {
      name: { zh: "天鹅座", en: "Cygnus" },
      stars: [[0.5, 0.05], [0.5, 0.95], [0.5, 0.5], [0.18, 0.6], [0.82, 0.42]],
      lines: [[0, 2], [2, 1], [3, 2], [2, 4]]
    },
    {
      name: { zh: "天蝎座", en: "Scorpius" },
      stars: [[0.12, 0.22], [0.28, 0.32], [0.42, 0.48], [0.55, 0.58], [0.68, 0.68], [0.82, 0.74], [0.95, 0.62], [0.9, 0.42]],
      lines: [[0, 1], [1, 2], [2, 3], [3, 4], [4, 5], [5, 6], [6, 7]]
    },
    {
      name: { zh: "狮子座", en: "Leo" },
      stars: [[0.1, 0.42], [0.16, 0.18], [0.36, 0.08], [0.56, 0.18], [0.52, 0.44], [0.3, 0.54], [0.4, 0.78], [0.78, 0.72]],
      lines: [[0, 1], [1, 2], [2, 3], [3, 4], [4, 5], [5, 0], [5, 6], [6, 7]]
    },
    {
      name: { zh: "天琴座", en: "Lyra" },
      stars: [[0.5, 0.1], [0.28, 0.42], [0.52, 0.48], [0.42, 0.78], [0.18, 0.7], [0.6, 0.86]],
      lines: [[0, 1], [1, 2], [2, 3], [3, 4], [4, 1], [2, 5]]
    },
    {
      name: { zh: "金牛座", en: "Taurus" },
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
    initStars();
    placeConstellations();
  }

  function initStars() {
    stars = [];
    var n = Math.max(36, Math.min(100, Math.floor(W * H / 16000)));
    for (var i = 0; i < n; i++) {
      stars.push({
        x: Math.random() * W, y: Math.random() * H,
        vx: (Math.random() - .5) * .16, vy: (Math.random() - .5) * .16,
        r: Math.random() * 1.2 + .5,
        a: Math.random() * .3 + .12
      });
    }
  }

  function placeConstellations() {
    consts = [];
    var n = W > 760 ? 1 + Math.floor(Math.random() * 3) : 1;
    var pool = CONSTELLATIONS.slice();
    for (var i = pool.length - 1; i > 0; i--) {
      var j = Math.floor(Math.random() * (i + 1));
      var t = pool[i]; pool[i] = pool[j]; pool[j] = t;
    }
    var idx = 0, attempts = 0;
    while (consts.length < n && idx < pool.length && attempts < 80) {
      var data = pool[idx]; idx++;
      var s = Math.min(W, H) * (0.10 + Math.random() * 0.06);
      var cw = s, ch = s * 0.85;
      var x = W * 0.04 + Math.random() * Math.max(1, W * 0.92 - cw);
      var y = 100 + Math.random() * Math.max(1, H - 140 - ch);
      var box = { x: x, y: y, w: cw, h: ch };
      var overlap = consts.some(function (c) {
        return !(box.x + box.w < c.x || box.x > c.x + c.w || box.y + box.h < c.y || box.y > c.y + c.h);
      });
      if (overlap) { attempts++; continue; }
      consts.push({ data: data, x: x, y: y, s: s });
    }
  }

  function drawConstellation(c) {
    var pts = c.data.stars;
    var x0 = c.x, y0 = c.y, s = c.s;
    ctx.strokeStyle = "rgba(211,162,74,.32)";
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
    var label = c.data.name.zh + " · " + c.data.name.en;
    ctx.font = "11px 'SF Mono','JetBrains Mono',ui-monospace,Menlo,Consolas,monospace";
    ctx.textAlign = "center";
    ctx.fillStyle = "rgba(211,162,74,.78)";
    ctx.fillText(label, x0 + s / 2, y0 + maxY * s + 18);
  }

  function frame() {
    ctx.clearRect(0, 0, W, H);
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
        var ma = (1 - Math.sqrt(md2) / 140) * .22;
        ctx.beginPath();
        ctx.moveTo(p.x, p.y); ctx.lineTo(mouse.x, mouse.y);
        ctx.strokeStyle = "hsla(45, 70%, 75%, " + ma + ")";
        ctx.lineWidth = 1;
        ctx.stroke();
      }
    }
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
    get starCount() { return stars.length; },
    get names() { return consts.map(function (c) { return c.data.name.zh + " · " + c.data.name.en; }); }
  };
})();
