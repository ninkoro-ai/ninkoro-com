# Ninkoro Wiki 模块 · 项目结构分析报告（Phase 1）

> 任务来源：`#+Ninkoro+Wiki+模块开发任务+V1.0.md`
> 目标：为 ninkoro.com 增加 Wiki 知识库模块，升级为 Personal Knowledge System（Digital Garden / Personal Knowledge OS）。
> 约束：零框架、零数据库、零构建；复用现有 header/footer/nav/card/动画/字体/色彩；不破坏已有页面。

---

## 一、当前架构（已实测）

### 1. 目录结构
```
ninkoro.com/
├── index.html  about.html  thoughts.html  works.html
├── shares.html  links.html  tools.html  ai-agent-handbook.html   # 8 个页面
├── wiki.html                                              # 【新增】Wiki 列表页
├── wiki/                                                  # 【新增】文章目录
│   ├── template.html                                      # 【新增】文章模板
│   ├── ai-agent.html  fitbuddy.html  ninkoro-philosophy.html
├── assets/
│   ├── css/style.css        # 唯一样式源（单文件，含全部组件类）
│   ├── js/main.js           # 导航滚动态、移动菜单、reveal 动画、tabs、active 高亮
│   ├── js/content.js        # 内容系统 v3：单一数据源 DEFAULTS + 渲染器
│   └── js/handbook.js       # 手册长文专用：动态 TOC + 悬浮球（仅 handbook 用）
├── assets/data/person.jsonld
├── _headers  robots.txt  sitemap.xml  og.png  make_og.py
```

### 2. 内容管理（核心机制）
- **单一数据源**：`assets/js/content.js` 内 `DEFAULTS` 对象集中所有内容（works / thoughts / about / shares / links / tools）。
- **按页面路由渲染**：`content.js` 读取 `<body data-page="xxx">`，调用 `R[page]` 渲染器，把 `DEFAULTS` 注入页面中的 `#id` 容器。
- **卡片渲染器集中**：`ITEM_RENDER` 对象含 `works / thought / textCard / share / linkItem / timeline / toolBlock / kv / fact / paragraph`，新页面可复用或扩展。
- **结论**：Wiki 必须接入此体系 —— 在 `DEFAULTS` 加 `wiki:[]`，新增 `R.wiki` 渲染器，未来增删文章只改 `DEFAULTS.wiki`。

### 3. 导航（重点）
- **每页硬编码**：桌面 `.nav-links`（index.html:30-37）与移动 `.mobile-menu`（index.html:42-50）各写一遍，共 8 个页面需同步。
- **自动高亮**：`main.js:68-69` 遍历 `.nav-links a, .mobile-menu a`，`href === 当前路径` 即加 `.active`。→ 新增 Wiki 导航**无需改 JS**，只要每页加 `<a href="wiki.html">`。
- **页脚**：index.html 等 footer 的「站点」链接组也需同步加 Wiki（保持一致）。

### 4. 可复用样式类（来自 style.css）
| 类 | 用途 | 行 |
|---|---|---|
| `.wrap` | 内容居中容器 | 87 |
| `.section` | 区块（含上下 padding、分隔线） | 92 |
| `.sec-head`(`.row`/`.more`) | 区块标题 + "更多"链接 | 276 |
| `.spot` / `.work-card` | 卡片（hover、箭头） | 304 / 326 |
| `.list-row` | 列表行（想法页用） | 374 |
| `.page-head`(`.cn`/`.en`/`.desc`) | 内页页头 | 580 |
| `.reveal` + `data-delay` | 滚动入场动画（main.js 触发） | 594 |
| `.links-grid` | 网格布局 | 456 |

### 5. 长文阅读样式（handbook 参考）
- `ai-agent-handbook.html` 的 `.article-body` / `.toc-inline` / 表格 / 代码块 / 引用 样式**内联在该页 `<style>` 中**（未抽进 style.css）。
- Wiki 文章需同类阅读体验。方案见下文「决策 3」。

---

## 二、修改计划（Phase 2–9 映射）

| Phase | 动作 | 涉及文件 | 做法 |
|---|---|---|---|
| **2** | 新增 `wiki.html` 列表页 | wiki.html（新） | 复用 `.page-head` + `.section`+`.sec-head`，按 `category` 分组渲染卡片；`data-page="wiki"` |
| **3** | 全站加 Wiki 导航 | 8 个 HTML（nav-links + mobile-menu + footer 站点组） | 加 `<a href="wiki.html">知识库</a>`；main.js 自动高亮 |
| **4** | 建 Wiki 数据结构 | assets/js/content.js | `DEFAULTS.wiki = [...]`；新增 `ITEM_RENDER.wikiCard` + `R.wiki`（注入 `#wiki-root`） |
| **5** | 文章模板 | wiki/template.html（新） | `.page-head` + `.article-body`（标题/简介/更新时间/目录/正文/相关文章） |
| **6** | 3 篇示例文章 | wiki/ai-agent.html, wiki/fitbuddy.html, wiki/ninkoro-philosophy.html（新） | 基于 template，填充真实内容（非空） |
| **7** | SEO | 上述 4 个 html + sitemap.xml | 各页补 `title`/`description`/`keywords`；sitemap 追加 4 条 `<url>` |
| **8** | 响应式 | style.css（wiki 相关类） | 复用现有断点（900/760/400），卡片网格 `auto-fill/minmax`，长文 `min-width:0` |
| **9** | 最终检查 | WIKI_FINAL_REPORT.md（新） | 链接/404/CSS/JS 校验，输出报告 |

---

## 三、关键设计决策（请确认）

### 决策 1 · Wiki 数据结构与分组
- `DEFAULTS.wiki` 每条：`{ title, category, description, url, updated }`。
- **分类规范化**为 4 个中文分类（对齐任务 Phase 2）：`AI` / `产品` / `商业` / `思想`。
- `wiki.html` **按分类动态分组**（仅渲染有文章的分类），分类顺序固定 `[AI, 产品, 商业, 思想]`，数据新增即自动归类 —— 完全满足"只改数据文件"。
- 示例数据（Phase 4+6 合并）：
  - `AI Agent` → AI → `wiki/ai-agent.html`
  - `FitBuddy` → 产品 → `wiki/fitbuddy.html`
  - `Ninkoro Philosophy` → 思想 → `wiki/ninkoro-philosophy.html`

### 决策 2 · 导航文案与位置
- 文案：**「知识库 / Wiki」**（中文为主，英文可藏 `aria`）。
- 位置：插在「想法」之后、「分享」之前（与 Works/Thoughts/About 同级，逻辑相邻）。同时更新 footer「站点」组。
- 若你希望放别处（如置顶或末尾），告知即可。

### 决策 3 · 文章阅读样式来源（影响 handbook 是否改动）
- **方案 A（推荐·零风险）**：在 `style.css` 新增共享长文类 `.longread`（标题/段落/引用/代码/表格/图片/`.toc-inline`），Wiki 文章与 template 复用；**handbook.html 保持原样不动**（其内联 CSS 已工作）。代价：handbook 内联 CSS 与 `.longread` 有少量重复（同效果，可接受）。
- **方案 B（更 DRY）**：把 handbook 的内联长文 CSS 抽进 style.css 的 `.longread`，handbook.html 改为引用、删除内联块；Wiki 同样复用。代价：改动一个已上线页面，需回归验证 handbook 渲染一致。
- **建议选 A**，优先保证"不破坏已有页面"。

### 决策 4 · Wiki 文章目录（TOC）
- template / 文章保留「目录」区块。轻量做法：文章页内联一段小脚本（或复用 handbook.js 的 `buildInlineToc`，它按 `.article-body h2/h3` 通用生成）——**若选复用 handbook.js，则悬浮球也会在 Wiki 文章出现（移动端），属加分项**。
- 默认：Wiki 文章含内联 `.toc-inline`（桌面可选显隐），不强制悬浮球。

### 决策 5 · 设计语气（Digital Garden）
- 内容调性：长期积累、知识沉淀、个人认知资产；**不是博客列表、不是新闻**。示例文章按任务要求写真实内容（Agent 架构 Planner/Memory/Tool/Execution；FitBuddy 产品定位/约课/点餐/生活助手；Ninkoro Philosophy 缘起/Personal OS/AI 时代知识资产）。

---

## 四、涉及文件清单（预计）
**新增（6）**：`wiki.html`、`wiki/template.html`、`wiki/ai-agent.html`、`wiki/fitbuddy.html`、`wiki/ninkoro-philosophy.html`、`WIKI_FINAL_REPORT.md`
**修改（10+）**：`assets/js/content.js`（+wiki 数据/渲染器）、`assets/css/style.css`（+.longread 等）、`sitemap.xml`（+4 url）、`index/about/thoughts/works/shares/links/tools/ai-agent-handbook.html`（各加 Wiki 导航 + footer）
**不动**：`main.js`（自动高亮已覆盖）、`handbook.js`（除非选决策 4 复用）。

---

## 五、待你确认后执行
1. 决策 2 导航位置是否接受「想法之后」？
2. 决策 3 选 A（零风险，handbook 不动）还是 B（抽公共 CSS）？
3. 决策 4 Wiki 文章是否复用 handbook.js（连带悬浮球）？
4. 其余按本报告计划推进即可。

> 批准后我将按 Phase 2→9 顺序实施，每阶段产出可验证，完成后输出 `WIKI_FINAL_REPORT.md`。
