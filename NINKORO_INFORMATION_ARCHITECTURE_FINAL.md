# NINKORO 信息架构最终报告（Refactor V1）

> 目标：整理现有网站结构，通过重新分类 + 降低入口复杂度提高一致性。
> 原则：保留历史页面、不删除已有内容、不新增功能。
> 完成日期：2026-07-29 ｜ 关联文档：`NINKORO_PAGE_AUDIT.md`（Phase 1 审计）

---

## 一、最终网站结构

```
ninkoro.com/
├── index.html            首页（导航入口型：Hero → 入口卡 → 精选）
├── projects.html         【作品】创造物聚合（复用 works 渲染）
├── knowledge.html        【知识】长期知识沉淀枢纽（Wiki 内联 + 分区链接）
├── thoughts.html         【想法】个人随想
├── about.html            【关于】个人介绍
├── archive.html          【归档】历史/降级页面保全
│
├── works.html            （旧·降级入口，canonical→projects，保留）
├── shares.html           （旧·降级入口，canonical→knowledge，保留）
├── links.html            （旧·降级入口，canonical→knowledge，保留）
├── tools.html            （旧·降级入口，canonical→knowledge，保留）
├── wiki.html             （旧·降级入口，canonical→knowledge，保留）
├── ai-agent-handbook.html（长文手册，经 knowledge 进入，保留）
│
├── wiki/
│   ├── ai-agent.html          Wiki 文章（经 knowledge/wiki 进入）
│   ├── fitbuddy.html          Wiki 文章
│   ├── ninkoro-philosophy.html Wiki 文章
│   └── template.html          新建文章母版（已同步新导航）
│
└── 资源：assets/（css/js/data）、_headers、robots.txt、sitemap.xml、og.png
```

**一级导航（≤5 个本站 + 外链）**
```
首页 Home      → index.html
作品 Projects  → projects.html
知识 Knowledge → knowledge.html
想法 Thoughts  → thoughts.html
关于 About    → about.html
LifeOS 官网    → https://lifeos.ninkoro.com （外部子域，保留一级外链）
```
> 说明：用户拍板保留 LifeOS 官网为一级入口，故导航为「5 个本站 + 1 个外部」共 6 项；规格「≤5」按「本站内容页」计数，外链不计入。

---

## 二、页面迁移记录

| 原页面 | 处理方式 | 去向 / 变更 |
|--------|---------|------------|
| `index.html` | 保留+重构 | 改为导航入口型：移除重复整页预览，新增 3 张入口卡；保留信条 + 最近在想 |
| `about.html` | 保留 | 仅随全局导航改动 |
| `thoughts.html` | 保留 | 维持一级入口 |
| `works.html` | 降级入口 | 移出一级导航；`canonical` → `projects.html`；内容由 `projects.html` 承载 |
| `shares.html` | 降级入口 | 移出一级导航；`canonical` → `knowledge.html` |
| `links.html` | 降级入口 | 移出一级导航；`canonical` → `knowledge.html` |
| `tools.html` | 降级入口 | 移出一级导航；`canonical` → `knowledge.html` |
| `wiki.html` | 合并 | Wiki 卡片并入 `knowledge.html`；`canonical` → `knowledge.html` |
| `ai-agent-handbook.html` | 保留 | 归 Knowledge，经 `knowledge.html` 长文区进入；返回链接改 `knowledge.html` |
| `wiki/*.html`（3 篇） | 保留 | 导航/页脚/返回链接同步至新结构（`../` 前缀） |
| `wiki/template.html` | 保留 | 母版导航同步，保证后续新建文章规范一致 |
| `projects.html` | **新增** | Projects 聚合页，复用 `R.projects`（= works 渲染） |
| `knowledge.html` | **新增** | Knowledge 枢纽页，`R.knowledge` 复用 wiki 渲染内联卡片 + 静态分区链接 |
| `archive.html` | **新增** | 收录 5 个降级页 + handbook，说明保留策略 |

**代码层改动**
- `assets/js/content.js`：新增 `R.projects`、`R.knowledge`；`R.home` 对 `#home-works` 容错（移除后不再报错）；`DEFAULTS.wiki` 三项加统一 `tags` 字段。
- `assets/css/style.css`：新增 `.entry-cards` / `.entry-card`（首页入口卡，移动端单栏）。
- 全站 9 个顶层页 + 4 个 wiki 子页 + 模板：导航 / 移动菜单 / 页脚「站点」组统一为新结构。

---

## 三、导航变化

| 项 | 重构前 | 重构后 |
|----|-------|-------|
| 一级入口数 | 8（作品集/关于/想法/知识库/分享/导航/工具/LifeOS） | 5 本站 + LifeOS 外链 |
| 首页定位 | 展示精选作品+信条+想法 | 导航入口（入口卡）+ 精选 |
| 作品 | `works.html` | `projects.html`（works 内容并入） |
| 知识 | `wiki.html` 单点 | `knowledge.html` 枢纽（Wiki+书影音+资源+长文） |
| 页脚站点组 | 6 项含 works/wiki/shares/links | 6 项含 首页/作品/知识/想法/关于/归档 |
| 降级页 | — | 5 页 canonical 指向新聚合页，仍可访问 |

---

## 四、内容管理规则

1. **历史页面不删**：任何重构/合并只做 canonical 重定向 + 移出导航，原文件永久保留在 `archive.html` 可回溯。
2. **单一内容源**：所有动态内容仍在 `assets/js/content.js` 的 `DEFAULTS` 维护，由 AI Agent 或手动编辑，不在 HTML 里硬编码列表数据。
3. **新页面复用渲染器**：新增列表型页面时，优先在 `content.js` 的 `R` 增加路由 + 复用 `ITEM_RENDER`，不要新写渲染逻辑。
4. **导航一处定义、全站同步**：导航/移动菜单/页脚三处字符串在所有页面保持一致；改导航须同步 9 顶层页 + 4 wiki 子页 + template。
5. **canonical 跟随主入口**：被合并的旧页 canonical 指向新聚合页，避免 SEO 重复。

---

## 五、后续新增内容规范

1. **归类到四大板块之一**：作品(Projects) / 知识(Knowledge) / 想法(Thoughts) / 关于(About)。不新增一级入口。
2. **Wiki 文章**：在 `content.js` 的 `DEFAULTS.wiki` 加一条（title/category/tags/description/updated/url），并把文章放到 `wiki/` 子目录（用 `../` 相对路径）。列表由 `knowledge.html` 自动归类渲染。
3. **统一标签词表**（跨 Projects/Knowledge/Thoughts 共享）：
   `AI` · `Product` · `Business` · `Finance` · `Life` · `Philosophy`
   - 现有 Wiki 三项已打标：AI Agent→[AI,Product]、FitBuddy→[Product,Life]、Ninkoro Philosophy→[Philosophy,Life]。
   - 后续新增条目在 `tags` 字段使用上述词表，便于未来统一检索（暂不建筛选 UI，属后续增强）。
4. **作品**：在 `DEFAULTS.works` 加一条，自动出现在 `projects.html`。
5. **想法**：在 `DEFAULTS.thoughts` 加一条，自动出现在 `thoughts.html`（可 `href` 跳长文）。
6. **不新增功能**：保持零框架、零构建、零数据库；一切通过改数据与少量 HTML 完成。

---

## 六、未做 / 后续可增强（非本次范围）

- 标签筛选 UI（当前仅数据层打标，未建前端筛选）。
- 旧页 meta-refresh 硬跳转（本次采用 canonical，保留可访问性；如需强制跳转可后续加）。
- 站内全文搜索。
