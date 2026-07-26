# Ninkoro.com

一个 AI Builder 的个人实验室 —— 把想法做成东西的地方。作品、想法与审美的集合地。

> 定位：AI Builder · Personal Lab。
> 风格基调：暗色暖调、衬线中文大标题、材质分层、Apple 式交互动效。
> 全站不刻意强调「开发者 / Vibe Coding」标签，而是把重点放在「做了什么、怎么想」上。

## 页面结构

| 文件 | 说明 |
|------|------|
| `index.html` | 首页 — Hero、精选作品、信条、最新想法 |
| `works.html` | 作品集 — 精选作品卡片（状态徽章 + 标签） |
| `about.html` | 关于我 — 自我介绍、速览卡、时间线、此刻在做 |
| `thoughts.html` | 一些想法 — 随想列表 |
| `shares.html` | 我的分享 — 读书 / 电影 / 音乐（Tab 切换 + 评分） |
| `links.html` | 网址导航 — 分类收藏（设计 / 开发 / 阅读 / 效率） |
| `tools.html` | 常用工具 — 硬件、日常工具、常用手艺、选工具三原则 |
| `admin.html` | 登录页（管理员入口，普通访客无导航链接） |

## 技术栈

纯静态 HTML / CSS / 原生 JS，**零依赖、零构建**。

- 暖黑暗色主题，旧金点缀，衬线中文大标题（CSS 变量驱动）
- Apple 式交互：`cubic-bezier(0.32, 0.72, 0, 1)` 临界阻尼缓动、按钮 `:active` 即时缩放、材质毛玻璃分层
- 滚动揭示动画、颗粒质感叠层、Marquee 跑马灯
- 响应式：PC / 平板 / 手机（760px 以下汉堡全屏菜单）
- 尊重 `prefers-reduced-motion` / `prefers-reduced-transparency`

## 内容管理（Supabase 轻后台 + 可视化编辑）

全站内容由 `assets/js/content.js` 单一内容源驱动：`DEFAULTS` 默认内容 → 远端 Supabase 覆盖。
编辑采用**可视化直编**：登录后在页面上直接点文字改、拖动条目排序，无需进任何表单后台。

### 1. 一次性搭建 Supabase

1. 在 Supabase 新建项目，打开 **SQL Editor**，粘贴运行 `supabase-setup.sql`
   （建 `public.site_content` 表 + 公开读 / 登录写 的 RLS 策略）。
2. **Authentication → Users** 新建一个用户（邮箱 + 密码），这就是编辑账号。
3. 打开 **Project Settings → API**，复制 `Project URL` 与 `anon public key`，
   填入 `assets/js/supabase-config.js`：

   ```js
   window.NINKORO_SUPABASE = {
     URL: "https://xxxx.supabase.co",
     ANON_KEY: "eyJhbGciOi..."
   };
   ```

### 2. 可视化编辑

1. 浏览器打开 `admin.html`，用上面的账号登录 → 自动跳回首页。
2. 页面底部浮出编辑工具条，点「**编辑**」进入编辑态：
   - **改文字**：直接点任意带虚线框的文字，输入即改。
   - **排序**：拖动条目左上角手柄（⠿）重排，仅限同列表内。
   - **增删**：每个列表底部「+ 添加一条」，条目右上角「×」删除。
   - 支持 `**双星号**` 加粗（在支持富文本的字段内）。
3. 点「**保存**」→ 内容写入 Supabase `site_content` 表（单行 id=`content`）。

### 3. 离线降级

- 未配置 Supabase 时：站点照常运行（显示 `DEFAULTS`），但**编辑工具条不出现**，内容只读。
- 已配置但拉取失败时：自动读取 localStorage 缓存，保证页面不空白。

### 渲染标记约定（供 `edit.js` 收割）

- 单值文本：`[data-edit="home.sub"]`
- 列表容器：`[data-list-path="works"][data-kind="works"]`
- 列表条目：`[data-item]` + 隐藏 `[data-meta]`（非文本字段 JSON）
- 文本字段：`[data-field="title"]` / `[data-field="0"]`（数组项）
- 嵌套列表：`[data-list-key="items"][data-kind="linkItem"]`

保存时 `edit.js` 按 DOM 顺序 + 这些标记把改动收割回内容对象再写库。

## 脚本加载顺序（每个内容页，V2 起）

```html
<script src="assets/js/content.js" defer></script>
<script src="assets/js/main.js" defer></script>
```

- 公开页**不再加载 Supabase / db.js / edit.js**：默认内容即 `content.js` 的 `DEFAULTS`，零外部依赖、零阻塞脚本。
- `content.js`：默认内容 + 渲染 + 暴露 `window.NINKORO_CMS`
- `main.js`：导航、移动端菜单、滚动揭示等全局交互
- 编辑态（`edit.js` + Supabase）仅在 `admin.html` 登录后由 `admin-login.js` 拉起，公开访客完全不接触。

## 本地预览

```bash
cd ninkoro.com
python -m http.server 8080
# 打开 http://localhost:8080
```

## 部署（Cloudflare Pages，0 服务器成本）

1. 在 GitHub 建仓库（如 `ninkoro-ai/ninkoro-com`），把本目录作为仓库根推送。
2. Cloudflare Pages → **Create a project** → 连接该仓库：
   - Build command：**留空**（纯静态，无构建步骤）
   - Build output directory：`ninkoro.com`（即本目录）
   - 根目录的 `_headers` 会被 Cloudflare 自动读取，落地 CSP / X-Frame-Options / X-Content-Type-Options / Referrer-Policy / 缓存策略。
3. **自定义域**：在 Cloudflare 添加 `ninkoro.com` 与 `www.ninkoro.com`，按提示把域名 NS 从原注册商（腾讯云）切到 Cloudflare——**此 NS 切换需在域名注册商后台操作，Agent 无法代切**。
4. 任意**静态托管**也都可用（Vercel / Netlify / Nginx），但 `_headers` 的安全头与缓存策略是 Cloudflare Pages 专属语法，换平台需改用对应机制（如 Netlify 兼容 `_headers`、Nginx 的 `add_header`）。
5. 生成社交分享图：`python make_og.py`（产出根目录 `og.png`，被各页 OG/Twitter meta 引用）。

> DNS 与 NS 切换属于域名注册商操作，需你本人在后台完成；本步骤仅改文档与代码。

## 许可

© 2026 Ninkoro. All rights reserved.
