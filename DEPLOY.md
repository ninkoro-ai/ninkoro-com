# 部署指南（双仓库 + 双域名）

## 架构

| 站点 | 域名 | GitHub 仓库 | 本地目录 |
|------|------|-------------|---------|
| Ninkoro.com 个人站 | `ninkoro.com` | `ninkoro-ai/ninkoro-com`（新建） | `ninkoro.com/` |
| LifeOS 产品落地页 | `lifeos.ninkoro.com` | `ninkoro-ai/lifeos`（新建） | `website/` |

两个仓库完全独立，互不覆盖。

## 一、部署 Ninkoro.com 个人站

### 1. 新建 GitHub 仓库
- 在 GitHub 新建仓库 **ninkoro-ai/ninkoro-com**（Public）
- **不要**初始化 README / .gitignore（本地已有）

### 2. 推送
```bash
cd D:\lifeOS\ninkoro.com
git init -b main
git remote add origin https://github.com/ninkoro-ai/ninkoro-com.git
git add -A
git commit -m "Ninkoro.com personal site — initial"
git push -u origin main
```

### 3. 开启 GitHub Pages + 自定义域名
- 仓库 **Settings → Pages**：
  - Source: **Deploy from a branch** → Branch: `main` → Folder: **/ (root)** → Save。
  - Custom domain: `ninkoro.com` → Save。
  - DNS 生效后勾选 **Enforce HTTPS**。

### 4. DNS（ninkoro.com 注册商后台）
```
类型: A     主机记录: @    值: 185.199.108.153
类型: A     主机记录: @    值: 185.199.109.153
类型: A     主机记录: @    值: 185.199.110.153
类型: A     主机记录: @    值: 185.199.111.153
```
（或用 CNAME 指向 `ninkoro-ai.github.io`）

---

## 二、部署 LifeOS 产品页（lifeos.ninkoro.com）

### 1. 新建 GitHub 仓库
- 在 GitHub 新建仓库 **ninkoro-ai/lifeos**（Public）
- **不要**初始化 README / .gitignore

### 2. 推送
```bash
cd D:\lifeOS\website
git init -b main
git remote add origin https://github.com/ninkoro-ai/lifeos.git
git add -A
git commit -m "LifeOS product landing page — initial"
git push -u origin main
```

### 3. 开启 GitHub Pages + 子域名
- 仓库 **Settings → Pages**：
  - Source: **Deploy from a branch** → Branch: `main` → Folder: **/ (root)** → Save。
  - Custom domain: `lifeos.ninkoro.com` → Save。

### 4. DNS（子域名记录，在 ninkoro.com 同一注册商添加）
```
类型: CNAME  主机记录: lifeos   值: ninkoro-ai.github.io
```
> 或用 A 记录指向同样的四个 GitHub Pages IP。

### 5. 验证
- `https://ninkoro.com` → 个人站首页
- `https://lifeos.ninkoro.com` → LifeOS 产品页
- 个人站导航「LifeOS 官网」→ 跳转 lifeos.ninkoro.com ✓
- LifeOS 页脚「← Ninkoro.com」→ 跳转 ninkoro.com ✓

---

## 可选：启用可视化编辑（个人站）
1. Supabase 新建项目 → SQL Editor 跑 `supabase-setup.sql`
2. Auth → Users 建用户 → 复制 URL/anon key 到 `assets/js/supabase-config.js`
3. 不填则站点为只读静态页（内容走 content.js 默认值），不影响展示。
