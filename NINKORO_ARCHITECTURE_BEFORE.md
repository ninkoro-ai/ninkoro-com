# NINKORO 架构重构前状态（Phase 0 · Architecture Before）

> 关联指令：`#+NINKORO+信息架构重构执行指令+V1.0.md`
> 基准：git `e802c3b`（Add draggable FAB）磁盘真实文件 + `assets/js/content.js` 的 `DEFAULTS` 数据源
> 日期：2026-07-29

---

## 一、当前页面清单（13 个 HTML）

| # | 文件 | data-page | 内容来源 | 一级导航入口 |
|---|------|-----------|---------|--------------|
| 1 | `index.html` | home | DEFAULTS.home / works(前3) / thoughts(前3) | （logo 首页） |
| 2 | `about.html` | about | DEFAULTS.about | 关于我 |
| 3 | `thoughts.html` | thoughts | DEFAULTS.thoughts | 想法（Ideas） |
| 4 | `works.html` | works | DEFAULTS.works | 作品集（Works） |
| 5 | `shares.html` | shares | DEFAULTS.shares | 分享（Shares） |
| 6 | `links.html` | links | DEFAULTS.links | 导航（Navigation） |
| 7 | `tools.html` | tools | DEFAULTS.tools | 工具（Tools） |
| 8 | `wiki.html` | wiki | DEFAULTS.wiki | 知识库（Wiki） |
| 9 | `ai-agent-handbook.html` | （无） | 内联静态长文 + handbook.js | （无，仅 thoughts 一条链接） |
| 10 | `wiki/template.html` | — | 模板 | 非公开 |
| 11 | `wiki/ai-agent.html` | — | 内联静态 | 经 wiki.html 进入 |
| 12 | `wiki/fitbuddy.html` | — | 内联静态 | 经 wiki.html 进入 |
| 13 | `wiki/ninkoro-philosophy.html` | — | 内联静态 | 经 wiki.html 进入 |

---

## 二、当前导航结构

**一级导航（8 个本站入口 + logo + 外部 LifeOS 官网）**
```
首页 (logo)   作品集   关于我   想法   知识库   分享   导航   工具   [LifeOS 官网 外链]
```
- 桌面 `.nav-links` 与移动 `.mobile-menu`、页脚「站点」组三处字符串各自硬编码、需同步维护。
- 页脚「站点」组重复了几乎全部导航（works/thoughts/wiki/shares/links/tools/LifeOS），信息冗余。

---

## 三、页面之间关系

- `index.html` 首页精选：拉取 `works` 前 3 + `thoughts` 前 3，与 `works.html`/`thoughts.html` 内容重叠。
- `works.html` / `shares.html` / `links.html` / `tools.html` / `wiki.html` 五者平铺为独立一级入口，但主题可归纳为「创造物（Projects）」与「知识沉淀（Knowledge）」两类。
- `wiki.html` 是 Wiki 文章（`wiki/*.html`）的唯一入口；`ai-agent-handbook.html` 高质量长文却无稳定入口（仅藏身 thoughts 列表一条链接）。
- `links.html`（网址导航）与 `tools.html`（装备清单）本质是「个人知识/工具沉淀」，与 `wiki` 同源，却分属三个入口。
- 所有动态内容集中在 `assets/js/content.js` 的 `DEFAULTS`，由 `R` 渲染器 + `ITEM_RENDER` 卡片渲染器驱动（单一内容源）。

---

## 四、修改风险

| 风险 | 等级 | 说明 / 缓解 |
|------|------|------------|
| 破坏历史 URL（外部已有引用、书签） | 高 | 禁止删除页面；采用 canonical 指向新聚合页，旧 URL 永久可访问 |
| SEO 重复内容 | 中 | 旧页 canonical → 新聚合页；不滥用 canonical（仅用于内容重复/迁移场景） |
| 入口复杂度过高导致跳出 | 中 | 一级入口从 8 收敛到 ≤5 本站 + 外链 |
| 大规模重写引入回归 | 中 | 采用 Incremental Refactor；优先复用 `R`/`ITEM_RENDER`，不新写渲染逻辑 |
| 导航三处硬编码不同步 | 低 | 改导航须同步 9 顶层页 + 4 wiki 子页 + 模板（本次已逐页落地） |

---

## 五、保留内容资产列表（严禁删除）

- 全部 13 个 HTML（含 `wiki/template.html` 母版）。
- `assets/`：css / js / data（`person.jsonld`）。
- 根资源：`_headers`、`robots.txt`、`sitemap.xml`、`og.png`。
- 内容资产：`DEFAULTS.works`（4 项）、`DEFAULTS.thoughts`（7 条）、`DEFAULTS.shares`（书影音 12 条）、`DEFAULTS.links`（4 组）、`DEFAULTS.tools`（6 块 + 3 原则）、`DEFAULTS.wiki`（3 篇）。
- `wiki/*.html` 3 篇长文（AI Agent / FitBuddy / Ninkoro Philosophy）。

> 结论：重构只做「重新分类 + 降低入口复杂度 + 加迁移提示」，不删页面、不删 URL、不改数据含义、不新增功能。
