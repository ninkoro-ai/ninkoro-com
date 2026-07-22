-- ============================================================
-- NINKORO.COM 内容后台 — Supabase 初始化脚本
-- 在 Supabase 控制台 SQL Editor 中执行本文件
-- ============================================================

-- 1. 内容表：单行 JSONB 存全站内容
create table if not exists public.site_content (
  id text primary key,
  data jsonb not null,
  updated_at timestamptz not null default now()
);

-- 2. 开启 RLS
alter table public.site_content enable row level security;

-- 3. 策略：任何人可读（网站前台匿名拉取内容）
drop policy if exists "public read" on public.site_content;
create policy "public read"
  on public.site_content for select
  using (true);

-- 4. 策略：仅登录用户可写（你在后台编辑时）
drop policy if exists "auth write" on public.site_content;
create policy "auth write"
  on public.site_content for all
  using (auth.role() = 'authenticated')
  with check (auth.role() = 'authenticated');

-- ============================================================
-- 接下来（控制台操作，无需 SQL）：
-- 1) Authentication → Users → Add user → 用你自己的邮箱 + 密码创建账号
-- 2) Project Settings → API → 复制 Project URL 和 anon public key
--    填入 assets/js/supabase-config.js
-- 3) 打开网站 /admin.html 登录，即可在页面上直接编辑
-- ============================================================
