/* ============================================================
   NINKORO.COM — 内容管理后台
   密码门（SHA-256）· 分区编辑 · 增删排序 · 导入导出
   内容存于浏览器 localStorage，通过「导出」备份/迁移
   ============================================================ */
(function () {
  "use strict";

  /* 初始密码：ninkoro2026（登录后可在「设置」中修改） */
  var DEFAULT_HASH = "14572eeaf18a3b7e3ab26e2c6cce2bebb984384d05653fc2dff0bc90785c6144";
  var PASS_KEY = "ninkoro_pass_hash";
  var SESSION_KEY = "ninkoro_admin";
  var STORE_KEY = window.NINKORO_CMS.STORE_KEY;

  /* ---------- 工具 ---------- */
  function $(s, r) { return (r || document).querySelector(s); }
  function $all(s, r) { return Array.prototype.slice.call((r || document).querySelectorAll(s)); }
  function el(tag, cls, html) {
    var e = document.createElement(tag);
    if (cls) e.className = cls;
    if (html != null) e.innerHTML = html;
    return e;
  }
  function esc(s) {
    return String(s == null ? "" : s)
      .replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");
  }
  function sha256(s) {
    return crypto.subtle.digest("SHA-256", new TextEncoder().encode(s)).then(function (b) {
      return Array.from(new Uint8Array(b)).map(function (x) { return x.toString(16).padStart(2, "0"); }).join("");
    });
  }
  function toast(msg, isErr) {
    var t = $("#toast");
    t.textContent = msg;
    t.classList.toggle("err", !!isErr);
    t.classList.add("show");
    clearTimeout(t._timer);
    t._timer = setTimeout(function () { t.classList.remove("show"); }, 2200);
  }
  function clone(o) { return JSON.parse(JSON.stringify(o)); }

  /* ---------- 状态 ---------- */
  var state = clone(window.NINKORO_CMS.getContent());
  var curSec = "home";

  /* 保存/渲染前规范化：保证派生字段一致 */
  function normalize() {
    state.works.forEach(function (w) {
      if (typeof w.tagsText !== "string") w.tagsText = (w.tags || []).join(", ");
      w.tags = w.tagsText.split(/[,，]/).map(function (s) { return s.trim(); }).filter(Boolean);
    });
  }

  function save() {
    normalize();
    localStorage.setItem(STORE_KEY, JSON.stringify(state));
    toast("已保存，刷新网站即可看到修改");
  }

  /* ---------- 密码门 ---------- */
  function passHash() { return localStorage.getItem(PASS_KEY) || DEFAULT_HASH; }

  function tryLogin() {
    var input = $("#gate-pass").value;
    if (!input) return;
    sha256(input).then(function (h) {
      if (h === passHash()) {
        sessionStorage.setItem(SESSION_KEY, "1");
        enter();
      } else {
        $("#gate-err").textContent = "密码不对，再试一次。";
        $("#gate-pass").select();
      }
    });
  }

  function enter() {
    $("#gate").style.display = "none";
    $("#shell").style.display = "grid";
    var hash = location.hash.replace("#", "");
    if (hash) curSec = hash;
    renderSide();
    render();
  }

  $("#gate-btn").addEventListener("click", tryLogin);
  $("#gate-pass").addEventListener("keydown", function (e) { if (e.key === "Enter") tryLogin(); });
  if (sessionStorage.getItem(SESSION_KEY) === "1") enter();

  /* ---------- 侧栏 ---------- */
  var SEC_TITLES = {
    home: "首页文案", works: "作品集", thoughts: "想法", about: "关于我",
    shares: "分享", links: "网址导航", tools: "常用工具", settings: "设置"
  };
  function renderSide() {
    $all("#side a").forEach(function (a) {
      a.classList.toggle("active", a.getAttribute("data-sec") === curSec);
      a.onclick = function (e) {
        e.preventDefault();
        curSec = a.getAttribute("data-sec");
        location.hash = curSec;
        renderSide();
        render();
      };
    });
  }

  $("#btn-save").addEventListener("click", save);
  $("#btn-logout").addEventListener("click", function () {
    sessionStorage.removeItem(SESSION_KEY);
    location.reload();
  });

  /* ---------- 表单构件 ---------- */
  function field(label, input) {
    var f = el("div", "adm-field");
    f.appendChild(el("label", null, esc(label)));
    f.appendChild(input);
    return f;
  }
  function input(value, oninput, type) {
    var i = el("input", "adm-input");
    i.type = type || "text";
    i.value = value == null ? "" : value;
    i.addEventListener("input", function () { oninput(i.value); });
    return i;
  }
  function textarea(value, oninput, rows) {
    var t = el("textarea", "adm-textarea");
    t.value = value == null ? "" : value;
    if (rows) t.style.minHeight = rows * 28 + "px";
    t.addEventListener("input", function () { oninput(t.value); });
    return t;
  }
  function select(value, options, oninput) {
    var s = el("select", "adm-select");
    options.forEach(function (o) {
      var op = el("option", null, esc(o.label));
      op.value = o.value;
      if (o.value === value) op.selected = true;
      s.appendChild(op);
    });
    s.addEventListener("change", function () { oninput(s.value); });
    return s;
  }
  function colorInput(value, oninput) {
    var i = el("input", "adm-color");
    i.type = "color";
    i.value = value || "#d3a24a";
    i.addEventListener("input", function () { oninput(i.value); });
    return i;
  }

  /* 通用列表编辑器：items 为数组，fields 描述每个字段 */
  function listEditor(items, fields, opts) {
    opts = opts || {};
    var box = el("div");

    function itemCard(it, idx) {
      var card = el("div", "adm-item");
      var head = el("div", "adm-item-head");
      head.appendChild(el("span", "no", (opts.itemName || "条目") + " " + (idx + 1)));
      var tools = el("div", "adm-item-tools");

      var up = el("button", "adm-btn sm icon", "↑");
      up.title = "上移";
      up.onclick = function () {
        if (idx === 0) return;
        items.splice(idx - 1, 0, items.splice(idx, 1)[0]);
        redraw();
      };
      var down = el("button", "adm-btn sm icon", "↓");
      down.title = "下移";
      down.onclick = function () {
        if (idx === items.length - 1) return;
        items.splice(idx + 1, 0, items.splice(idx, 1)[0]);
        redraw();
      };
      var del = el("button", "adm-btn sm danger", "删除");
      del.onclick = function () {
        if (!confirm("确定删除这条？")) return;
        items.splice(idx, 1);
        redraw();
      };
      tools.appendChild(up); tools.appendChild(down); tools.appendChild(del);
      head.appendChild(tools);
      card.appendChild(head);

      var grid = el("div", fields.length > 2 ? "adm-grid2" : null);
      fields.forEach(function (f) {
        var w;
        if (f.type === "textarea") {
          w = textarea(it[f.key], function (v) { it[f.key] = v; }, f.rows);
        } else if (f.type === "select") {
          w = select(it[f.key], f.options, function (v) { it[f.key] = v; });
        } else if (f.type === "color") {
          w = colorInput(it[f.key], function (v) { it[f.key] = v; });
        } else if (f.type === "number") {
          w = input(it[f.key], function (v) { it[f.key] = Math.max(0, Math.min(5, parseInt(v, 10) || 0)); }, "number");
          w.min = 0; w.max = 5;
        } else {
          w = input(it[f.key], function (v) { it[f.key] = v; });
        }
        var fw = field(f.label, w);
        if (f.full) fw.style.gridColumn = "1 / -1";
        grid.appendChild(fw);
      });
      card.appendChild(grid);
      return card;
    }

    function redraw() {
      box.innerHTML = "";
      items.forEach(function (it, i) { box.appendChild(itemCard(it, i)); });
      var add = el("button", "adm-btn", "+ " + (opts.addLabel || "添加一条"));
      add.onclick = function () { items.push(clone(opts.blank || {})); redraw(); };
      box.appendChild(add);
    }
    redraw();
    return box;
  }

  function secTitle(t, hint) {
    var frag = document.createDocumentFragment();
    frag.appendChild(el("h2", "adm-section-title", esc(t)));
    if (hint) frag.appendChild(el("p", "adm-hint", esc(hint)));
    return frag;
  }

  /* 键值对文本 <-> 数组（每行 "键 | 值"） */
  function kvToText(pairs) {
    return pairs.map(function (p) { return p[0] + " | " + p[1]; }).join("\n");
  }
  function textToKv(text) {
    return text.split("\n").map(function (l) { return l.trim(); }).filter(Boolean)
      .map(function (l) {
        var i = l.indexOf("|");
        return i < 0 ? [l.trim(), ""] : [l.slice(0, i).trim(), l.slice(i + 1).trim()];
      });
  }

  /* ---------- 各分区编辑器 ---------- */
  var EDITORS = {
    home: function (box) {
      var h = state.home;
      box.appendChild(secTitle("Hero 区域", "首页最上方的大标题与自我介绍。"));
      box.appendChild(field("顶部小字（英文标签）", input(h.eyebrow, function (v) { h.eyebrow = v; })));
      var g = el("div", "adm-grid3");
      g.appendChild(field("标题 · 前段", input(h.titleMain, function (v) { h.titleMain = v; })));
      g.appendChild(field("标题 · 金色部分", input(h.titleAccent, function (v) { h.titleAccent = v; })));
      g.appendChild(field("标题 · 第二行（灰色）", input(h.titleThin, function (v) { h.titleThin = v; })));
      box.appendChild(g);
      box.appendChild(field("自我介绍（**双星号** 可加粗）", textarea(h.sub, function (v) { h.sub = v; }, 4)));

      box.appendChild(secTitle("一点信条", "首页中部的三张小卡片（数量不限）。"));
      box.appendChild(listEditor(h.manifesto, [
        { key: "title", label: "标题" },
        { key: "body", label: "内容", type: "textarea", full: true }
      ], { itemName: "信条", addLabel: "添加信条", blank: { title: "", body: "" } }));
    },

    works: function (box) {
      normalize(); // 先补全 tagsText，再渲染
      box.appendChild(secTitle("作品列表", "首页精选展示前 3 个；状态决定右上角徽章（已上线/进行中/构思中）。"));
      box.appendChild(listEditor(state.works, [
        { key: "title", label: "名称" },
        { key: "en", label: "英文副标题" },
        { key: "year", label: "年份" },
        { key: "status", label: "状态", type: "select", options: [
          { value: "live", label: "已上线" }, { value: "wip", label: "进行中" }, { value: "idea", label: "构思中" }
        ] },
        { key: "desc", label: "描述", type: "textarea", full: true },
        { key: "tagsText", label: "标签（逗号分隔）", full: true }
      ], {
        itemName: "作品", addLabel: "添加作品",
        blank: { year: new Date().getFullYear() + "", status: "idea", title: "", en: "", desc: "", tags: [], tagsText: "" }
      }));
    },

    thoughts: function (box) {
      box.appendChild(secTitle("想法列表", "首页展示前 3 条。按时间倒序排列即可。"));
      box.appendChild(listEditor(state.thoughts, [
        { key: "date", label: "日期（如 2026.07）" },
        { key: "title", label: "标题" },
        { key: "body", label: "正文", type: "textarea", full: true }
      ], { itemName: "想法", addLabel: "添加想法", blank: { date: "", title: "", body: "" } }));
    },

    about: function (box) {
      var a = state.about;
      box.appendChild(secTitle("自我介绍", "关于我页面左侧的文字。"));
      box.appendChild(field("导语（衬线大字）", textarea(a.lede, function (v) { a.lede = v; }, 3)));
      box.appendChild(field("正文段落（空行分段）", textarea(a.paragraphs.join("\n\n"), function (v) {
        a.paragraphs = v.split(/\n\s*\n/).map(function (s) { return s.trim(); }).filter(Boolean);
      }, 8)));

      box.appendChild(secTitle("速览卡", "右侧 Facts 卡片。每行一条：名称 | 内容"));
      box.appendChild(textarea(kvToText(a.facts), function (v) { a.facts = textToKv(v); }, 7));

      box.appendChild(secTitle("时间线", "「一路走来」的经历节点。"));
      box.appendChild(listEditor(a.timeline, [
        { key: "when", label: "时间（如 2026 — 现在）" },
        { key: "title", label: "标题" },
        { key: "body", label: "内容", type: "textarea", full: true }
      ], { itemName: "节点", addLabel: "添加节点", blank: { when: "", title: "", body: "" } }));

      box.appendChild(secTitle("此刻在做", "「此刻在做」卡片（/now）。"));
      box.appendChild(listEditor(a.now, [
        { key: "title", label: "标题" },
        { key: "body", label: "内容", type: "textarea", full: true }
      ], { itemName: "卡片", addLabel: "添加卡片", blank: { title: "", body: "" } }));
    },

    shares: function (box) {
      var groups = [["books", "读书"], ["movies", "电影"], ["music", "音乐"]];
      groups.forEach(function (g) {
        var key = g[0], label = g[1];
        box.appendChild(secTitle(label, "封面字：封面上显示的字；评分 0–5。"));
        box.appendChild(listEditor(state.shares[key], [
          { key: "title", label: "名称" },
          { key: "by", label: "作者 / 创作者" },
          { key: "cover", label: "封面字" },
          { key: "color", label: "封面颜色", type: "color" },
          { key: "stars", label: "评分（0-5）", type: "number" },
          { key: "note", label: "短评", type: "textarea", full: true }
        ], { itemName: label, addLabel: "添加" + label, blank: { title: "", by: "", note: "", stars: 5, cover: "", color: "#d3a24a" } }));
      });
    },

    links: function (box) {
      box.appendChild(secTitle("链接分组", "每组下面用文本编辑链接，每行一条：名称 | 链接 | 封面字母 | 颜色(可省)"));
      state.links.forEach(function (g, gi) {
        var card = el("div", "adm-item");
        var head = el("div", "adm-item-head");
        head.appendChild(el("span", "no", "分组 " + (gi + 1)));
        var tools = el("div", "adm-item-tools");
        var del = el("button", "adm-btn sm danger", "删除分组");
        del.onclick = function () {
          if (!confirm("删除整个分组及其链接？")) return;
          state.links.splice(gi, 1); render();
        };
        tools.appendChild(del);
        head.appendChild(tools);
        card.appendChild(head);
        card.appendChild(field("分组名称", input(g.name, function (v) { g.name = v; })));
        card.appendChild(field("链接（每行：名称 | URL | 字母 | 颜色）", textarea(
          g.items.map(function (it) {
            return [it.name, it.url, it.letter, it.color].filter(function (x) { return x != null && x !== ""; }).join(" | ");
          }).join("\n"),
          function (v) {
            g.items = v.split("\n").map(function (l) { return l.trim(); }).filter(Boolean).map(function (l) {
              var p = l.split("|").map(function (s) { return s.trim(); });
              return { name: p[0] || "", url: p[1] || "#", letter: p[2] || (p[0] || "?").charAt(0), color: p[3] || "#d3a24a" };
            });
          }, 7)));
        box.appendChild(card);
      });
      var add = el("button", "adm-btn", "+ 添加分组");
      add.onclick = function () { state.links.push({ name: "新分组", items: [] }); render(); };
      box.appendChild(add);
    },

    tools: function (box) {
      box.appendChild(secTitle("工具清单", "每行一条：名称 | 说明"));
      state.tools.blocks.forEach(function (b, bi) {
        var card = el("div", "adm-item");
        var head = el("div", "adm-item-head");
        head.appendChild(el("span", "no", "清单 " + (bi + 1)));
        var tools = el("div", "adm-item-tools");
        var del = el("button", "adm-btn sm danger", "删除");
        del.onclick = function () {
          if (!confirm("删除这张清单？")) return;
          state.tools.blocks.splice(bi, 1); render();
        };
        tools.appendChild(del);
        head.appendChild(tools);
        card.appendChild(head);
        card.appendChild(field("清单名称", input(b.title, function (v) { b.title = v; })));
        card.appendChild(field("条目（每行：名称 | 说明）", textarea(kvToText(b.lines), function (v) {
          b.lines = textToKv(v);
        }, 6)));
        box.appendChild(card);
      });
      var add = el("button", "adm-btn", "+ 添加清单");
      add.onclick = function () { state.tools.blocks.push({ title: "新清单", lines: [] }); render(); };
      box.appendChild(add);

      box.appendChild(secTitle("选工具的原则", "页面底部的小卡片。"));
      box.appendChild(listEditor(state.tools.principles, [
        { key: "title", label: "标题" },
        { key: "body", label: "内容", type: "textarea", full: true }
      ], { itemName: "原则", addLabel: "添加原则", blank: { title: "", body: "" } }));
    },

    settings: function (box) {
      box.appendChild(secTitle("基本信息"));
      box.appendChild(field("联系邮箱（页脚 / 按钮使用）", input(state.site.email, function (v) { state.site.email = v; })));

      box.appendChild(secTitle("修改密码", "先输入当前密码，再输入新密码。修改后请记住它——没有找回渠道。"));
      var g = el("div", "adm-grid2");
      var oldP = el("input", "adm-input"); oldP.type = "password"; oldP.placeholder = "当前密码";
      var newP = el("input", "adm-input"); newP.type = "password"; newP.placeholder = "新密码（至少 6 位）";
      g.appendChild(field("当前密码", oldP));
      g.appendChild(field("新密码", newP));
      box.appendChild(g);
      var chg = el("button", "adm-btn", "修改密码");
      chg.onclick = function () {
        if (newP.value.length < 6) { toast("新密码至少 6 位", true); return; }
        sha256(oldP.value).then(function (h) {
          if (h !== passHash()) { toast("当前密码不对", true); return; }
          return sha256(newP.value).then(function (nh) {
            localStorage.setItem(PASS_KEY, nh);
            oldP.value = newP.value = "";
            toast("密码已更新");
          });
        });
      };
      box.appendChild(chg);

      box.appendChild(secTitle("备份与迁移", "内容保存在当前浏览器的 localStorage。换电脑/换浏览器前，先导出 JSON，再在新环境导入。"));
      var row = el("div"); row.style.display = "flex"; row.style.gap = "10px"; row.style.flexWrap = "wrap";
      var exp = el("button", "adm-btn", "导出 JSON");
      exp.onclick = function () {
        var blob = new Blob([JSON.stringify(state, null, 2)], { type: "application/json" });
        var a = el("a");
        a.href = URL.createObjectURL(blob);
        a.download = "ninkoro-content-" + new Date().toISOString().slice(0, 10) + ".json";
        a.click();
        URL.revokeObjectURL(a.href);
      };
      var imp = el("button", "adm-btn", "导入 JSON");
      imp.onclick = function () { $("#import-file").click(); };
      var rst = el("button", "adm-btn danger", "恢复默认内容");
      rst.onclick = function () {
        if (!confirm("将清空你所有的修改并恢复到初始内容，确定？")) return;
        localStorage.removeItem(STORE_KEY);
        state = clone(window.NINKORO_CMS.getContent());
        render();
        toast("已恢复默认内容");
      };
      row.appendChild(exp); row.appendChild(imp); row.appendChild(rst);
      box.appendChild(row);

      box.appendChild(secTitle("说明"));
      box.appendChild(el("p", "adm-hint",
        "① 编辑后点右上角「保存修改」才会生效；② 内容只存在本浏览器，换设备请用导出/导入；" +
        "③ 网站正文支持 **双星号** 加粗；④ 后台入口是页脚右下角的小点「·」，游客基本不会注意到。"));
    }
  };

  $("#import-file").addEventListener("change", function (e) {
    var f = e.target.files[0];
    if (!f) return;
    var rd = new FileReader();
    rd.onload = function () {
      try {
        var data = JSON.parse(rd.result);
        if (!data || typeof data !== "object" || !data.works) throw new Error("bad");
        state = Object.assign(clone(window.NINKORO_CMS.DEFAULTS), data);
        normalize();
        localStorage.setItem(STORE_KEY, JSON.stringify(state));
        render();
        toast("导入成功");
      } catch (err) {
        toast("文件格式不对，导入失败", true);
      }
      e.target.value = "";
    };
    rd.readAsText(f);
  });

  /* ---------- 渲染当前分区 ---------- */
  function render() {
    $("#sec-title").textContent = SEC_TITLES[curSec] || "";
    var box = $("#editor");
    box.innerHTML = "";
    (EDITORS[curSec] || EDITORS.home)(box);
    window.scrollTo(0, 0);
  }

  window.addEventListener("hashchange", function () {
    var h = location.hash.replace("#", "");
    if (h && EDITORS[h]) { curSec = h; renderSide(); render(); }
  });
})();
