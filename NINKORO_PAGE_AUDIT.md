# NINKORO 页面审计报告（Phase 1）

> 目标：整理现有网站结构，通过重新分类 + 降低入口复杂度提高一致性。
> 原则：保留历史页面、不删除已有内容、不新增功能。
> 审计基准：磁盘真实文件 + `assets/js/content.js` 的 `DEFAULTS` 数据源（2026-07-29）。

---

## 一、当前页面清单（13 个 HTML）

| # | 文件 | data-page | 内容来源 | 当前一级导航入口 |
|---|------|-----------|---------|----------------|
| 1 | `index.html` | home | DEFAULTS.home / works(前3) / thoughts(前3) | （logo 首页） |
| 2 | `about.html` | about | DEFAULTS.about | 关于我 |
| 3 | `thoughts.html` | thoughts | DEFAULTS.thoughts | 想法 |
| 4 | `works.html` | works | DEFAULTS.works | 作品集 |
| 5 | `shares.html` | shares | DEFAULTS.shares | 分享 |
| 6 | `links.html` | links | DEFAULTS.links | 导航 |
| 7 | `tools.html` | tools | DEFAULTS.tools | 工具 |
| 8 | `wiki.html` | wiki | DEFAULTS.wiki | 知识库 |
| 9 | `ai-agent-handbook.html` | （无） | 内联静态长文 + handbook.js | （无，仅 thoughts 一条链接） |
| 10 | `wiki/template.html` | — | 模板 | 非公开 |
| 11 | `wiki/ai-agent.html` | — | 内联静态 | 经 wiki.html 进入 |
| 12 | `wiki/fitbuddy.html` | — | 内联静态 | 经 wiki.html 进入 |
| 13 | `wiki/ninkoro-philosophy.html` | — | 内联静态 | 经 wiki.html 进入 |

**当前导航结构问题**
- 一级入口 8 个 + logo + 外部 LifeOS 官网，密度过高。
- `works / shares / links / tools / wiki` 五者主题可归纳为「创造物」与「知识沉淀」两类，当前平铺。
- `ai-agent-handbook.html` 是高质量长文，却无稳定入口（藏于 thoughts 列表一条链接）。
- 页脚「站点」组重复了导航（works/thoughts/wiki/shares/links/tools/LifeOS），信息冗余。
- `links.html`（网址导航）与 `tools.html`（装备清单）本质是「个人知识/工具沉淀」，与 `wiki` 同源，却分属三个入口。

---

## 二、页面审计报告（按规格要求：处理方式 ∈ 保留 / 合并 / 重定向 / 降级入口 / Archive）

| 页面 | 当前作用 | 建议归类 | 处理方式 | 说明 |
|------|---------|---------|---------|------|
| `index.html` | 首页 Hero + 精选 | **Home** | **保留**（重构） | Phase 4 重做：Hero → 三大入口卡 → 精选；移除重复预览堆叠 |
| `about.html` | 个人介绍 | **About** | **保留** | 维持，仅随全局导航改动微调 |
| `thoughts.html` | 随想列表 | **Thoughts** | **保留** | 维持一级入口（按规格保 Thoughts） |
| `works.html` | 作品集 | **Projects** | **降级入口** | 移出一级导航；保留文件 + 加 `canonical` → `projects.html`；页脚/archive 可访问 |
| `shares.html` | 书影音 | **Knowledge** | **降级入口** | 移出一级导航；保留 + `canonical` → `knowledge.html` |
| `links.html` | 网址导航 | **Knowledge** | **降级入口** | 移出一级导航；保留 + `canonical` → `knowledge.html` |
| `tools.html` | 装备清单 | **Knowledge** | **降级入口** | 移出一级导航；保留 + `canonical` → `knowledge.html` |
| `wiki.html` | 知识库列表 | **Knowledge** | **合并** | 内容并入 `knowledge.html`（内联 wiki 卡片区）；保留文件 + `canonical` → `knowledge.html` |
| `ai-agent-handbook.html` | 长文手册 | **Knowledge** | **保留** | 移出一级导航，改由 `knowledge.html` 长文区进入；文件不删 |
| `wiki/*.html`（3 篇） | Wiki 文章 | **Knowledge** | **保留** | 经 `knowledge.html` / `wiki.html` 进入，不删 |
| `wiki/template.html` | 模板 | — | **保留** | 非公开页，不动 |
| `projects.html` | （**新建**）Projects 聚合 | **Projects** | **保留（新增）** | 复用 `works` 渲染器；承载作品集全部内容 |
| `knowledge.html` | （**新建**）Knowledge 聚合 | **Knowledge** | **保留（新增）** | 复用 `wiki` 渲染器内联卡片 + 链接 shares/tools/handbook |
| `archive.html` | （**新建**）历史归档 | — | **保留（新增）** | 收录降级/旧版页面，避免内容资产丢失 |

---

## 三、建议的一级导航（≤5，按 Phase 2）

```
首页 Home         → index.html
作品 Projects     → projects.html      （原 works）
知识 Knowledge    → knowledge.html     （原 wiki + shares + links + tools + handbook）
想法 Thoughts     → thoughts.html
关于 About       → about.html
```

- **取消**的一级入口：分享 / 导航 / 工具 / 知识库（旧 wiki.html）/ LifeOS 官网。
- 外部 `LifeOS 官网`：降级为页脚外链（非本站内容，不占一级）。
- 旧 `works.html / shares.html / links.html / tools.html / wiki.html`：全部保留，仅移出一级导航，加 `canonical` 指向新聚合页，避免 SEO 损失与死链。

---

## 四、归类映射（Phase 3）

**Projects（创造物）**
- `works.html` 全部条目 → `projects.html`
- 未来「产品设计 / 开发记录」类内容统一进 Projects

**Knowledge（长期知识沉淀）**
- `wiki.html` 的 Wiki 卡片 → `knowledge.html` 内联（AI / 产品 / 商业 / 思想 分类保留）
- `shares.html`（书影音）→ `knowledge.html` 的「输入」区（链接进入）
- `links.html`（网址导航）→ `knowledge.html` 的「资源」区（链接进入）
- `tools.html`（装备清单）→ `knowledge.html` 的「工具」区（链接进入）
- `ai-agent-handbook.html` → `knowledge.html` 长文区（链接进入）

**Thoughts（个人观点）** — 维持
**About（个人介绍）** — 维持

---

## 五、旧页面保护策略（Phase 5，待确认 A）

旧页不删，采用 **canonical 指向新聚合页 + 移出一级导航（降级入口）**。
备选方案：①meta refresh 硬跳转；②纯 archive（导航完全移除，仅 archive 收录）。
> ⚠️ 需用户拍板：用 canonical（推荐，SEO 安全、用户仍可访问旧 URL）还是硬跳转。

## 六、待确认决策（影响 Phase 2–8 实施）

1. **旧页面处理**：canonical + 降级入口（推荐） / meta-refresh 跳转 / 纯归档。
2. **knowledge.html 形态**：枢纽页（分区 + 链接进入子页，推荐，避免单页过长）/ 全量内联聚合（wiki+shares+tools 全堆一页）。
3. **handbook 归属**：归 Knowledge（推荐）还是 Projects。
4. **LifeOS 官网**：降级为页脚外链（推荐）还是保留一级。

---

## 七、不涉及（本次不做）

- 不新增任何 JS 交互/组件（沿用现有渲染器与样式）。
- 不删除任何历史 HTML。
- 不改动 `content.js` 数据含义，仅新增 `projects` 渲染路由与 `knowledge` 聚合渲染（复用现有 `ITEM_RENDER`）。
