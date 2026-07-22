/* ============================================================
   NINKORO.COM — Supabase 数据层
   依赖：CDN @supabase/supabase-js@2 + supabase-config.js
   未配置时全部优雅降级为离线模式（站点照常运行）。
   ============================================================ */
(function () {
  "use strict";

  var CACHE_KEY = "ninkoro_cms_cache_v2";
  var client = null;

  function configured() {
    var c = window.NINKORO_SUPABASE || {};
    return !!(c.URL && c.ANON_KEY && window.supabase && window.supabase.createClient);
  }

  if (configured()) {
    var c = window.NINKORO_SUPABASE;
    client = window.supabase.createClient(c.URL, c.ANON_KEY);
  }

  function readCache() {
    try {
      var raw = localStorage.getItem(CACHE_KEY);
      return raw ? JSON.parse(raw) : null;
    } catch (e) { return null; }
  }
  function writeCache(data) {
    try { localStorage.setItem(CACHE_KEY, JSON.stringify(data)); } catch (e) {}
  }

  window.NINKORO_DB = {
    isOnline: function () { return !!client; },

    /* 拉取内容：成功返回远端 data 并写缓存；失败返回缓存或 null */
    load: function () {
      if (!client) return Promise.resolve(readCache());
      return client
        .from("site_content")
        .select("data")
        .eq("id", "content")
        .maybeSingle()
        .then(function (res) {
          if (res.error) return readCache();
          if (res.data && res.data.data) {
            writeCache(res.data.data);
            return res.data.data;
          }
          return readCache();
        })
        .catch(function () { return readCache(); });
    },

    /* 保存内容（需登录） */
    save: function (data) {
      writeCache(data);
      if (!client) return Promise.resolve({ ok: false, offline: true });
      return client
        .from("site_content")
        .upsert({ id: "content", data: data, updated_at: new Date().toISOString() })
        .then(function (res) {
          return res.error ? { ok: false, error: res.error.message } : { ok: true };
        })
        .catch(function (e) { return { ok: false, error: String(e) }; });
    },

    /* 认证 */
    session: function () {
      if (!client) return Promise.resolve(null);
      return client.auth.getSession().then(function (r) {
        return r.data && r.data.session ? r.data.session : null;
      }).catch(function () { return null; });
    },
    signIn: function (email, password) {
      if (!client) return Promise.resolve({ ok: false, error: "未配置 Supabase" });
      return client.auth.signInWithPassword({ email: email, password: password })
        .then(function (r) {
          return r.error ? { ok: false, error: r.error.message } : { ok: true };
        })
        .catch(function (e) { return { ok: false, error: String(e) }; });
    },
    signOut: function () {
      if (!client) return Promise.resolve();
      return client.auth.signOut().catch(function () {});
    }
  };
})();
