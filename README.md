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

## 技术栈

纯静态 HTML / CSS / 原生 JS，**零依赖、零构建**。

- 暖黑暗色主题，旧金点缀，衬线中文大标题（CSS 变量驱动）
- Apple 式交互：`cubic-bezier(0.32, 0.72, 0, 1)` 临界阻尼缓动、按钮 `:active` 即时缩放、材质毛玻璃分层
- 滚动揭示动画、颗粒质感叠层、Marquee 跑马灯
- 响应式：PC / 平板 / 手机（760px 以下汉堡全屏菜单）
- 尊重 `prefers-reduced-motion` / `prefers-reduced-transparency`

## 内容管理

全站内容由 `assets/js/content.js` 单一内容源驱动，`DEFAULTS` 即默认内容。
内容维护方式：**直接编辑 `content.js` 的 `DEFAULTS`**，或由 AI Agent 在对话中改写该文件——无需任何后台或登录入口。

- 公开页仅加载 `content.js` + `main.js`（均 `defer`），零外部依赖、零阻塞脚本。
- `content.js`：默认内容 + 渲染 + 暴露 `window.NINKORO_CMS`
- `main.js`：导航、移动端菜单、滚动揭示等全局交互

## 脚本加载顺序（每个内容页）

```html
<script src="assets/js/content.js" defer></script>
<script src="assets/js/main.js" defer></script>
```

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
