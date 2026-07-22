/* ============================================================
   NINKORO.COM — 可视化编辑
   登录后：浮动工具条 → 进入编辑 → 点击文字直接改 / 拖动条目排序
   保存时按 DOM 顺序收割回内容对象，写入 Supabase
   ============================================================ */
(function () {
  "use strict";

  if (!window.NINKORO_DB || !window.NINKORO_CMS) return;
  var DB = window.NINKORO_DB;
  var CMS = window.NINKORO_CMS;

  var editing = false;
  var dirty = false;
  var toolbar = null, statusEl = null;

  /* 单行字段（回车无效） */
  var SINGLE_LINE = {
    title: 1, en: 1, date: 1, year: 1, name: 1, cover: 1,
    when: 1, by: 1, "0": 1, "1": 1, "home.eyebrow": 1,
    "home.titleMain": 1, "home.titleAccent": 1, "home.titleThin": 1
  };

  /* 各类条目的空白模板 */
  function blankOf(kind) {
    switch (kind) {
      case "works": return { year: new Date().getFullYear() + "", status: "idea", title: "新作品", en: "", desc: "一句话介绍它。", tags: [] };
      case "thought": return { date: "2026.", title: "新想法", body: "写点什么。" };
      case "textCard": return { title: "标题", body: "内容。" };
      case "timeline": return { when: "2026", title: "节点", body: "发生了什么。" };
      case "share": return { title: "名称", by: "作者", note: "短评。", stars: 5, cover: "新", color: "#d3a24a" };
      case "linkItem": return { name: "新链接", url: "https://", letter: "新", color: "#d3a24a" };
      case "linkGroup": return { name: "新分组", items: [{ name: "新链接", url: "https://", letter: "新", color: "#d3a24a" }] };
      case "toolBlock": return { title: "新清单", lines: [["名称", "说明"]] };
      case "kv": return ["名称", "说明"];
      case "paragraph": return "新段落。";
      default: return null;
    }
  }

  function renderItem(kind, obj) {
    var IR = CMS.ITEM_RENDER;
    switch (kind) {
      case "works": return IR.works(obj);
      case "thought": return IR.thought(obj, false);
      case "textCard": return IR.textCard(obj);
      case "timeline": return IR.timeline(obj);
      case "share": return IR.share(obj);
      case "linkItem": return IR.linkItem(obj);
      case "linkGroup": return IR.linkGroup(obj, 0);
      case "toolBlock": return IR.toolBlock(obj, 0);
      case "kv": return IR.kv(obj);
      case "paragraph": return IR.paragraph(obj);
      default: return null;
    }
  }

  /* ---------- 文本提取（<strong> 还原为 **） ---------- */
  function fieldText(el) {
    var html = el.innerHTML
      .replace(/<strong[^>]*>([\s\S]*?)<\/strong>/gi, "**$1**")
      .replace(/<br\s*\/?>/gi, "\n")
      .replace(/<\/p>\s*<p[^>]*>/gi, "\n\n")
      .replace(/<[^>]+>/g, "");
    var t = document.createElement("textarea");
    t.innerHTML = html;
    return t.value.replace(/\u00a0/g, " ").trim();
  }

  /* ---------- 路径读写 ---------- */
  function setByPath(obj, path, val) {
    var keys = path.split(".");
    var cur = obj;
    for (var i = 0; i < keys.length - 1; i++) {
      if (cur[keys[i]] == null) cur[keys[i]] = /^\d+$/.test(keys[i + 1]) ? [] : {};
      cur = cur[keys[i]];
    }
    cur[keys[keys.length - 1]] = val;
  }

  /* ---------- 收割 ---------- */
  function harvestList(listEl) {
    var kind = listEl.getAttribute("data-kind");
    var out = [];
    Array.prototype.forEach.call(listEl.children, function (itemEl) {
      if (!itemEl.hasAttribute || !itemEl.hasAttribute("data-item")) return;
      var obj = {};
      try { obj = JSON.parse(itemEl.getAttribute("data-meta") || "{}"); } catch (e) {}

      if (itemEl.hasAttribute("data-field")) {
        obj[itemEl.getAttribute("data-field")] = fieldText(itemEl);
      }
      itemEl.querySelectorAll("[data-field]").forEach(function (f) {
        if (f.closest("[data-item]") !== itemEl) return;
        obj[f.getAttribute("data-field")] = fieldText(f);
      });
      itemEl.querySelectorAll("[data-list-key]").forEach(function (nested) {
        if (nested.closest("[data-item]") !== itemEl) return;
        obj[nested.getAttribute("data-list-key")] = harvestList(nested);
      });

      if (kind === "kv") out.push([obj["0"] || "", obj["1"] || ""]);
      else if (kind === "paragraph") out.push(obj.text || "");
      else out.push(obj);
    });
    return out;
  }

  function harvest() {
    var next = JSON.parse(JSON.stringify(CMS.getState()));
    document.querySelectorAll("[data-edit]").forEach(function (el) {
      setByPath(next, el.getAttribute("data-edit"), fieldText(el));
    });
    document.querySelectorAll("[data-list-path]").forEach(function (listEl) {
      if (!listEl.getAttribute("data-kind")) return;
      setByPath(next, listEl.getAttribute("data-list-path"), harvestList(listEl));
    });
    return next;
  }

  /* ---------- toast ---------- */
  var toastEl = null;
  function toast(msg, isErr) {
    if (!toastEl) {
      toastEl = document.createElement("div");
      toastEl.className = "ed-toast";
      document.body.appendChild(toastEl);
    }
    toastEl.textContent = msg;
    toastEl.classList.toggle("err", !!isErr);
    toastEl.classList.add("show");
    clearTimeout(toastEl._t);
    toastEl._t = setTimeout(function () { toastEl.classList.remove("show"); }, 2400);
  }

  /* ---------- 编辑行为附着 ---------- */
  function editableFields() {
    var fields = [];
    document.querySelectorAll("[data-edit]").forEach(function (el) { fields.push(el); });
    document.querySelectorAll("[data-list-path][data-kind] [data-field], [data-list-key][data-kind] [data-field]").forEach(function (el) { fields.push(el); });
    return fields;
  }

  function fieldKey(el) {
    return el.getAttribute("data-field") || el.getAttribute("data-edit") || "";
  }

  function attachEditing() {
    /* 文字直改 */
    editableFields().forEach(function (el) {
      el.setAttribute("contenteditable", "true");
      el.setAttribute("spellcheck", "false");
    });

    /* 条目：可拖 + 可删 */
    document.querySelectorAll("[data-list-path][data-kind], [data-list-key][data-kind]").forEach(function (listEl) {
      Array.prototype.forEach.call(listEl.children, function (itemEl) {
        if (itemEl.hasAttribute("data-item")) decorateItem(itemEl);
      });
      /* 添加按钮 */
      var add = document.createElement("button");
      add.className = "ed-add ed-ui";
      add.textContent = "+ 添加一条";
      add.addEventListener("click", function () {
        var kind = listEl.getAttribute("data-kind");
        var html = renderItem(kind, blankOf(kind));
        if (!html) return;
        var tmp = document.createElement("div");
        tmp.innerHTML = html;
        var node = tmp.firstElementChild;
        node.classList.add("visible");
        listEl.insertBefore(node, add);
        decorateItem(node);
        node.querySelectorAll("[data-field]").forEach(function (f) {
          f.setAttribute("contenteditable", "true");
          f.setAttribute("spellcheck", "false");
        });
        dirty = true;
        status("未保存");
      });
      listEl.appendChild(add);
    });
  }

  function decorateItem(itemEl) {
    itemEl.setAttribute("draggable", "true");
    var del = document.createElement("button");
    del.className = "ed-del ed-ui";
    del.textContent = "×";
    del.title = "删除";
    del.addEventListener("click", function (e) {
      e.stopPropagation();
      if (!confirm("删除这条？")) return;
      itemEl.remove();
      dirty = true;
      status("未保存");
    });
    itemEl.appendChild(del);
  }

  /* ---------- 拖拽排序（HTML5 DnD，1:1 反馈） ---------- */
  var dragEl = null;

  document.addEventListener("dragstart", function (e) {
    if (!editing) return;
    var item = e.target.closest && e.target.closest("[data-item]");
    if (!item) { e.preventDefault(); return; }
    dragEl = item;
    item.classList.add("ed-dragging");
    try { e.dataTransfer.setData("text/plain", ""); e.dataTransfer.effectAllowed = "move"; } catch (err) {}
  });

  document.addEventListener("dragover", function (e) {
    if (!editing || !dragEl) return;
    var item = e.target.closest && e.target.closest("[data-item]");
    if (!item || item === dragEl) return;
    if (item.parentElement !== dragEl.parentElement) return; /* 只允许同列表内 */
    e.preventDefault();
    var r = item.getBoundingClientRect();
    var before = (e.clientY - r.top) < r.height / 2;
    document.querySelectorAll(".ed-drop-target").forEach(function (x) { x.classList.remove("ed-drop-target"); });
    item.classList.add("ed-drop-target");
    item._dropBefore = before;
  });

  document.addEventListener("drop", function (e) {
    if (!editing || !dragEl) return;
    var item = e.target.closest && e.target.closest("[data-item]");
    if (item && item !== dragEl && item.parentElement === dragEl.parentElement) {
      e.preventDefault();
      if (item._dropBefore) item.parentElement.insertBefore(dragEl, item);
      else item.parentElement.insertBefore(dragEl, item.nextSibling);
      dirty = true;
      status("未保存");
    }
  });

  document.addEventListener("dragend", function () {
    if (dragEl) dragEl.classList.remove("ed-dragging");
    document.querySelectorAll(".ed-drop-target").forEach(function (x) { x.classList.remove("ed-drop-target"); });
    dragEl = null;
  });

  /* 单行字段回车拦截 */
  document.addEventListener("keydown", function (e) {
    if (!editing || e.key !== "Enter") return;
    var f = e.target.closest && (e.target.closest("[data-field]") || e.target.closest("[data-edit]"));
    if (f && SINGLE_LINE[fieldKey(f)]) e.preventDefault();
  });

  /* ---------- 工具条 ---------- */
  function status(t) {
    dirty = true;
    if (statusEl) statusEl.textContent = t;
  }

  function buildToolbar() {
    toolbar = document.createElement("div");
    toolbar.className = "ed-toolbar ed-ui";
    document.body.appendChild(toolbar);
    renderToolbar();
    requestAnimationFrame(function () { toolbar.classList.add("show"); });
  }

  function btn(label, cls, fn) {
    var b = document.createElement("button");
    b.className = "ed-btn " + (cls || "");
    b.textContent = label;
    b.addEventListener("click", fn);
    return b;
  }

  function renderToolbar() {
    toolbar.innerHTML = "";
    if (!editing) {
      toolbar.appendChild(btn("编辑", "primary", enterEdit));
      toolbar.appendChild(btn("退出登录", "", function () {
        DB.signOut().then(function () { location.reload(); });
      }));
    } else {
      statusEl = document.createElement("span");
      statusEl.className = "ed-status";
      statusEl.textContent = "点击文字直接改 · 拖动条目排序";
      toolbar.appendChild(statusEl);
      toolbar.appendChild(btn("保存", "primary", saveAll));
      toolbar.appendChild(btn("取消", "", function () {
        if (dirty && !confirm("有未保存的修改，确定放弃？")) return;
        exitEdit();
        CMS.render(CMS.getState());
      }));
      toolbar.appendChild(btn("退出登录", "", function () {
        if (dirty && !confirm("有未保存的修改，确定退出？")) return;
        DB.signOut().then(function () { location.reload(); });
      }));
    }
  }

  function enterEdit() {
    editing = true;
    dirty = false;
    document.body.classList.add("editing");
    document.querySelectorAll(".reveal").forEach(function (el) { el.classList.add("visible"); });
    attachEditing();
    renderToolbar();
  }

  function exitEdit() {
    editing = false;
    document.body.classList.remove("editing");
    renderToolbar();
  }

  function saveAll() {
    var next = harvest();
    statusEl.textContent = "保存中…";
    DB.save(next).then(function (r) {
      if (r.ok) {
        dirty = false;
        toast("已保存");
        exitEdit();
        CMS.render(next);
      } else if (r.offline) {
        toast("未配置 Supabase，仅保存到本机缓存", true);
        statusEl.textContent = "离线";
      } else {
        toast("保存失败：" + (r.error || "未知错误"), true);
        statusEl.textContent = "保存失败";
      }
    });
  }

  /* ---------- 启动：有会话才显示工具条 ---------- */
  if (!document.body.getAttribute("data-page")) return;
  DB.session().then(function (s) {
    if (s) buildToolbar();
  });
})();
