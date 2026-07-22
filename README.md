# Ninkoro.com

Ninkoro 的个人网站 —— 作品、想法与审美的集合地。

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

## 脚本加载顺序（每个内容页）

```html
<script src="https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2/dist/umd/supabase.min.js"></script>
<script src="assets/js/supabase-config.js"></script>
<script src="assets/js/db.js"></script>
<script src="assets/js/content.js"></script>
<script src="assets/js/main.js"></script>
<script src="assets/js/edit.js"></script>
```

- `db.js`：Supabase 数据层（`load` / `save` / `session` / `signIn` / `signOut`，离线降级）
- `content.js`：默认内容 + 渲染 + 暴露 `window.NINKORO_CMS`
- `edit.js`：仅当存在有效会话时浮出编辑工具条

## 本地预览

```bash
cd ninkoro.com
python -m http.server 8080
# 打开 http://localhost:8080
```

## 部署

任意静态托管（根目录直接指到本文件夹）：

- **Vercel / Netlify**：导入仓库，Root Directory 设为 `ninkoro.com`
- **GitHub Pages**：推到独立仓库，Settings → Pages → `main` / root
- **Nginx / CDN**：`root` 指向本目录即可

绑定 `ninkoro.com` 域名时在托管平台添加 CNAME / A 记录。

## 许可

© 2026 Ninkoro. All rights reserved.
