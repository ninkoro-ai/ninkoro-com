# 部署指南（Tencent Cloud 域名 + Cloudflare Pages + GitHub 源码）

## 架构

| 角色 | 服务 | 说明 |
|------|------|------|
| 域名注册 | 腾讯云 | `ninkoro.com` 在腾讯云注册，后续把 NS 委托给 Cloudflare |
| 源码 | GitHub | `ninkoro-ai/ninkoro-com`，纯静态，Cloudflare Pages 拉取构建（无构建步骤） |
| 托管 / CDN / DNS | Cloudflare Pages | 根目录 `_headers` 落地安全头与缓存；Cloudflare 提供 DNS + CDN |

> 0 服务器成本：Cloudflare Pages 免费额度足够个人站；不引入任何需付费的后端。

## 一、部署 Ninkoro.com 个人站

### 1. 源码仓库（GitHub）
- 新建 `ninkoro-ai/ninkoro-com`（Public）。
- 把 `ninkoro.com/` 目录作为仓库根推送（仓库根即本目录内容）：

```bash
cd D:\lifeOS\ninkoro.com
git init -b main
git remote add origin https://github.com/ninkoro-ai/ninkoro-com.git
git add -A
git commit -m "Ninkoro.com — AI Builder Personal Lab (V2)"
git push -u origin main
```

### 2. Cloudflare Pages
- **Workers & Pages → Create → Pages → Connect to Git** → 选上述仓库。
- Build command：**留空**；Build output directory：`ninkoro.com`。
- 部署后获得 `*.pages.dev` 预览域名。

### 3. 自定义域名 + DNS（需在腾讯云后台操作）
1. Cloudflare 添加站点 `ninkoro.com`，按指引**把域名的 NS 从腾讯云改为 Cloudflare 提供的 NS**（这是域名注册商侧操作，Agent 不能代切）。
2. Cloudflare → DNS 添加：
   - `ninkoro.com` → CNAME → `<your-project>.pages.dev`
   - `www.ninkoro.com` → CNAME → `<your-project>.pages.dev`
3. Cloudflare → SSL/TLS → 选 **Full** 或 **Full (strict)**，开启「Always Use HTTPS」。
4. 回到 Pages → Custom domains 绑定 `ninkoro.com` 与 `www.ninkoro.com`。

### 4. 验证
- `https://ninkoro.com` → 个人站首页（公开页无外部请求、~15KB JS）
- 响应头含 `Content-Security-Policy` / `X-Frame-Options: DENY` / `X-Content-Type-Options: nosniff`（DevTools → Network 校验）
- 社交分享：各页 `og:` / `twitter:` meta + 根目录 `og.png`（运行 `python make_og.py` 生成）

### 5. 内容维护
- 直接编辑 `assets/js/content.js` 的 `DEFAULTS`，或由 AI Agent 改写，无需后台 / 登录入口。

## 二、LifeOS 产品页（lifeos.ninkoro.com）
同架构可复用到 `website/`：GitHub 仓库 `ninkoro-ai/lifeos` + Cloudflare Pages（output `website`）+ 子域 CNAME。DNS 在同一次 Cloudflare 托管内添加即可，无需再切 NS。
