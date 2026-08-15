/* ============================================================
   NINKORO.COM — 首屏粒子消散（灭霸响指 / 风吹沙）
   滚动时首屏标题、副标题、按钮像沙一样散开；滚回时粒子归位复原。
   尊重 prefers-reduced-motion；零外部依赖，仅 index.html 加载。
   ============================================================ */
(function () {
  "use strict";

  if (window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

  var copy = document.querySelector(".hero-copy");
  if (!copy) return;
  var host = copy.parentElement;
  if (!host) return;

  var TARGETS = [
    { sel: ".hero-eyebrow", kind: "text" },
    { sel: ".hero-title", kind: "text" },
    { sel: ".hero-sub", kind: "text" },
    { sel: ".hero-actions .btn", kind: "button" }
  ];

  var GOLD = [211, 162, 74];
  var INK = [23, 19, 10];
  var MAX = 9000;
  var dpr = Math.min(window.devicePixelRatio || 1, 2);

  var canvas = document.createElement("canvas");
  canvas.className = "dissolve-canvas";
  canvas.setAttribute("aria-hidden", "true");
  host.appendChild(canvas);
  var ctx = canvas.getContext("2d");

  var W = 0, H = 0;
  var particles = [];
  var t = 0;
  var looping = false;
  var built = false;

  function clamp01(v) { return v < 0 ? 0 : (v > 1 ? 1 : v); }
  function ease(v) { return 1 - Math.pow(1 - v, 3); }

  function parseColor(str) {
    var m = str && str.match(/rgba?\(([^)]+)\)/);
    if (!m) return null;
    var p = m[1].split(",").map(function (s) { return parseFloat(s); });
    if (p.length >= 4 && p[3] < 0.5) return null;
    if (isNaN(p[0])) return null;
    return [Math.round(p[0]), Math.round(p[1]), Math.round(p[2])];
  }

  function roundRect(c, x, y, w, h, r) {
    c.beginPath();
    c.moveTo(x + r, y);
    c.arcTo(x + w, y, x + w, y + h, r);
    c.arcTo(x + w, y + h, x, y + h, r);
    c.arcTo(x, y + h, x, y, r);
    c.arcTo(x, y, x + w, y, r);
    c.closePath();
  }

  function wrapText(c, text, maxW) {
    if (!text) return [""];
    var words = text.split(/\s+/);
    var lines = [];
    var cur = "";
    for (var i = 0; i < words.length; i++) {
      var test = cur ? cur + " " + words[i] : words[i];
      if (!cur || c.measureText(test).width <= maxW) {
        cur = test;
      } else {
        lines.push(cur);
        cur = words[i];
      }
    }
    if (cur) lines.push(cur);
    return lines.length ? lines : [""];
  }

  function elRect(el) {
    var r = el.getBoundingClientRect();
    var b = copy.getBoundingClientRect();
    return { x: r.left - b.left, y: r.top - b.top, w: r.width, h: r.height };
  }

  function makeParticle(x, y, r, g, b) {
    var a = Math.random() * Math.PI * 2;
    var d = 26 + Math.random() * 150;
    var wind = 0.5 + Math.random() * 0.9;
    return {
      x: x, y: y,
      sx: x + Math.cos(a) * d + wind * 75,
      sy: y - (0.35 + Math.random() * 0.55) * d - Math.sin(a) * d * 0.35,
      r: r, g: g, b: b,
      ph: Math.random() * Math.PI * 2,
      size: 1.1 + Math.random() * 1.5
    };
  }

  function sample(oc, rect, scale) {
    var id = oc.getContext("2d").getImageData(0, 0, oc.width, oc.height).data;
    var step = rect.button ? (scale >= 2 ? 6 : 4) : (scale >= 2 ? 3 : 2);
    for (var py = 0; py < oc.height && particles.length < MAX; py += step) {
      for (var px = 0; px < oc.width && particles.length < MAX; px += step) {
        var i = (py * oc.width + px) * 4;
        if (id[i + 3] > 90) {
          particles.push(makeParticle(rect.x + px / scale, rect.y + py / scale, id[i], id[i + 1], id[i + 2]));
        }
      }
    }
  }

  function drawTarget(el, kind) {
    var cs = getComputedStyle(el);
    var rect = elRect(el);
    if (rect.w < 4 || rect.h < 4) return;
    var scale = dpr;
    var oc = document.createElement("canvas");
    oc.width = Math.max(2, Math.ceil(rect.w * scale));
    oc.height = Math.max(2, Math.ceil(rect.h * scale));
    var c = oc.getContext("2d");
    c.scale(scale, scale);

    var fw = cs.fontWeight || "400";
    var fs = parseFloat(cs.fontSize) || 16;
    var ff = cs.fontFamily || "sans-serif";
    c.font = fw + " " + fs + "px " + ff;
    if ("letterSpacing" in c) {
      try { c.letterSpacing = cs.letterSpacing || "0px"; } catch (e) {}
    }
    c.textBaseline = "middle";
    c.textAlign = kind === "button" ? "center" : "left";

    var color;
    if (kind === "button") {
      if (el.classList.contains("solid")) {
        var g = c.createLinearGradient(0, 0, 0, rect.h);
        g.addColorStop(0, "rgb(230,193,118)");
        g.addColorStop(1, "rgb(189,138,46)");
        c.fillStyle = g;
        roundRect(c, 0, 0, rect.w, rect.h, Math.min(14, rect.h * 0.28));
        c.fill();
        color = INK;
      } else {
        c.strokeStyle = "rgb(211,162,74)";
        c.lineWidth = 1.4;
        roundRect(c, 0.7, 0.7, rect.w - 1.4, rect.h - 1.4, Math.min(14, rect.h * 0.28));
        c.stroke();
        color = GOLD;
      }
    } else {
      color = parseColor(cs.color) || GOLD;
    }
    c.fillStyle = "rgb(" + color[0] + "," + color[1] + "," + color[2] + ")";

    var text = (el.textContent || "").trim();
    var lines = wrapText(c, text, Math.max(20, rect.w - 8));
    var lh = (parseFloat(cs.lineHeight) || fs * 1.25);
    var x = kind === "button" ? rect.w / 2 : 4;
    for (var li = 0; li < lines.length; li++) {
      c.fillText(lines[li], x, lh * (li + 0.5));
    }
    rect.button = kind === "button";
    sample(oc, rect, scale);
  }

  function build() {
    W = copy.clientWidth;
    H = copy.clientHeight;
    if (W < 10 || H < 10) return;
    var hg = host.getBoundingClientRect();
    var cr = copy.getBoundingClientRect();
    canvas.width = Math.round(W * dpr);
    canvas.height = Math.round(H * dpr);
    canvas.style.width = W + "px";
    canvas.style.height = H + "px";
    canvas.style.left = (cr.left - hg.left) + "px";
    canvas.style.top = (cr.top - hg.top) + "px";
    particles = [];
    TARGETS.forEach(function (tg) {
      if (particles.length >= MAX) return;
      copy.querySelectorAll(tg.sel).forEach(function (el) { drawTarget(el, tg.kind); });
    });
    built = true;
  }

  function paint(now) {
    if (!built) return;
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    ctx.clearRect(0, 0, W, H);
    var e = ease(t);
    var wob = t > 0.002 ? Math.sin(now / 520) : 0;
    for (var i = 0; i < particles.length; i++) {
      var p = particles[i];
      var k = clamp01(e * (1 + Math.sin(p.ph) * 0.25));
      if (k <= 0.001) continue;
      var x = p.x + (p.sx - p.x) * k + wob * 2.4 * k;
      var y = p.y + (p.sy - p.y) * k + Math.sin(now / 430 + p.ph) * 1.8 * k;
      ctx.globalAlpha = (1 - k) * 0.92 + 0.08;
      ctx.fillStyle = "rgb(" + p.r + "," + p.g + "," + p.b + ")";
      var s = p.size * (1 - k * 0.35);
      ctx.fillRect(x - s / 2, y - s / 2, s, s);
    }
    ctx.globalAlpha = 1;
  }

  function ensureLoop() {
    if (t > 0.002 && !looping) {
      looping = true;
      requestAnimationFrame(function tick(now) {
        paint(now);
        if (t <= 0.002) { looping = false; return; }
        requestAnimationFrame(tick);
      });
    } else if (t <= 0.002 && !looping) {
      requestAnimationFrame(function () { paint(0); });
    }
  }

  function setT(v) {
    t = clamp01(v);
    var o = 1 - t * 0.96;
    copy.style.opacity = t > 0.001 ? String(Math.max(0, o)) : "";
    ensureLoop();
  }

  function updateT() {
    var hero = copy.closest(".hero");
    var heroH = hero ? hero.offsetHeight : window.innerHeight;
    var start = 70;
    var end = Math.max(240, heroH * 0.6);
    setT((window.scrollY - start) / (end - start));
  }

  function rebuild() {
    build();
    updateT();
  }

  window.addEventListener("scroll", updateT, { passive: true });
  window.addEventListener("resize", rebuild);
  document.addEventListener("ninkoro:langchange", rebuild);

  function boot() {
    var ready = function () { build(); setTimeout(build, 1200); updateT(); };
    if (document.fonts && document.fonts.ready) {
      document.fonts.ready.then(ready);
    } else {
      ready();
    }
  }
  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", boot);
  } else {
    boot();
  }
})();
