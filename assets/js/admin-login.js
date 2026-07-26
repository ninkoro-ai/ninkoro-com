(function () {
  var err = document.getElementById("err");
  var btn = document.getElementById("btn");

  function showLogged() {
    document.getElementById("form").style.display = "none";
    document.getElementById("logged").style.display = "block";
    document.querySelector(".login-card h1").textContent = "欢迎回来";
  }

  if (!window.NINKORO_DB.isOnline()) {
    err.textContent = "尚未配置 Supabase，请先在 assets/js/supabase-config.js 填入 URL 和 anon key。";
    btn.disabled = true;
    return;
  }

  window.NINKORO_DB.session().then(function (s) { if (s) showLogged(); });

  function go() {
    var email = document.getElementById("email").value.trim();
    var pass = document.getElementById("pass").value;
    if (!email || !pass) { err.textContent = "邮箱和密码都要填。"; return; }
    btn.disabled = true;
    btn.textContent = "登录中…";
    window.NINKORO_DB.signIn(email, pass).then(function (r) {
      if (r.ok) { location.href = "index.html"; }
      else {
        err.textContent = "登录失败：" + (r.error || "请检查账号密码");
        btn.disabled = false;
        btn.textContent = "登录";
      }
    });
  }
  btn.addEventListener("click", go);
  document.getElementById("pass").addEventListener("keydown", function (e) { if (e.key === "Enter") go(); });
  document.getElementById("email").addEventListener("keydown", function (e) { if (e.key === "Enter") go(); });
  document.getElementById("btn-out").addEventListener("click", function () {
    window.NINKORO_DB.signOut().then(function () { location.reload(); });
  });
})();
