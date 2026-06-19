# NotionNext 社区基础设施 PR Stack 与个人叙事

记录日期：2026-06-04

## 1. 这条项目线是什么

项目线名称：

```text
From Blog to Community Infrastructure:
Extending NotionNext for AI-era Communities
```

中文表达：

```text
把 NotionNext 从个人博客框架扩展为 AI 社区 / 组织官网基础设施
```

这不是单纯给 IGNAI 官网加页面，而是一个双向项目：

1. **社区背书**：IGNAI 有真实成员、活动、记录、报名和运营流程，不只是一个展示页。
2. **开源背书**：基于真实社区压力发现 NotionNext 的框架边界，再把通用能力拆成上游 PR。

最终要形成的能力标签：

- AI 社区建设者
- 开源贡献者
- 产品型工程师
- 能从真实需求抽象架构的人
- 能把本地业务价值转化为开源生态价值的人

## 2. 核心判断

NotionNext 原本非常适合个人博客和创作者发布，但 AI 时代的很多站点已经不只是“一个人发文章”。

新的典型站点包括：

- AI 社区官网
- 开源项目官网
- 创作者组织官网
- 多作者内容站
- AI Lab / Builder Club / Hackathon 社群
- 小型组织的知识与活动门户

这些站点共同需要：

- 成员身份：谁在这个组织里
- 多作者内容：谁写了什么
- 活动和报名：社区如何发生
- 记录和复盘：发生之后沉淀了什么
- 组织表达：这个社区为什么值得被信任

因此，这条 PR Stack 的核心不是“给 NotionNext 加 IGNAI 功能”，而是：

```text
在不破坏个人博客工作流的前提下，让 NotionNext 支持社区、组织和 AI 项目官网所需的多内容类型基础设施。
```

## 3. 两手背书

### 3.1 给 IGNAI 社区背书

通过官网产品线证明：

- 社区不是只有微信群和活动海报，而有可公开访问的组织门面。
- 成员可以被看见，活动可以被追踪，记录可以被沉淀。
- Notion 作为运营后台，降低内容更新、成员维护和活动发布成本。
- 官网把“人、活动、内容、记录”连接起来，增强外部用户对社区的信任。

对外可以说：

```text
IGNAI 正在把社区运营从群聊和临时活动，升级为可沉淀、可展示、可持续迭代的 AI 社区基础设施。
```

### 3.2 给开源经历背书

通过 NotionNext 上游线证明：

- 不是只会魔改模板，而是能识别成熟开源项目的可扩展边界。
- 不是把本地需求粗暴塞上游，而是能拆出数据层、类型层、路由层、性能层和文档层。
- 不是一次性贡献，而是形成连续、可合并、可评审的 PR Stack。
- 能用真实产品验证需求，再用开源 PR 反哺生态。

对外可以说：

```text
我在真实 AI 社区官网建设中发现 NotionNext 对社区 / 组织站支持不足，于是先在本地产品验证 Member、Event、Record、Join 等能力，再把通用部分拆成上游 PR，推动 NotionNext 从个人博客框架向社区内容基础设施演进。
```

## 4. PR Stack 总览

提交原则：

- 每个 PR 只做一件主事。
- 优先数据层和契约层，再做路由和 UI。
- PR 标题要让维护者 30 秒内看懂价值。
- 保持博客行为兼容，不让 `Post / Page` 用户承担社区功能成本。
- 本地品牌、中文文案、IGNAI 视觉和运营后台不进上游。

### P0 已完成 / 已提交

#### PR 0：Event 官方 data source API fallback

- 状态：已创建；2026-06-08 因 required CI 失败被维护者关闭，后续应按更小范围重提
- 链接：[#4169](https://github.com/notionnext-org/NotionNext/pull/4169)
- 标题：`feat: fetch Event entries via Notion data source API`
- 上游价值：让 `Event` 和 `Member` 一样具备官方 API 补拉能力，避免 Notion 当前视图漏掉活动条目。
- 本地来源：IGNAI 活动发布主源收束为 Notion Event 后，发现非官方 collection view 可能漏掉真实活动行。
- 不包含：活动页 UI、IGNAI 主题、Records、运营后台。

## 5. 第一阶段：架构地基 PR

目标：先让上游接受“社区内容类型”不是私货，而是 NotionNext 的合理扩展方向。

### PR 1：Community Content Type Registry

- 状态：已创建；2026-06-08 因 required CI 失败被维护者关闭，保留为架构方向草稿
- 链接：[#4170](https://github.com/notionnext-org/NotionNext/pull/4170)

建议标题：

```text
feat: add community content type registry
```

要做：

- 统一识别 `Post / Page / Notice / Menu / Member / Event`。
- 提供小型 helper：
  - `isKnownContentType(type)`
  - `isCommunityContentType(type)`
  - `isRoutableContentType(type)`
  - `isNavContentType(type)`
- 让 `SiteDataApi.js` 里对类型的判断更集中。

不要做：

- 不新增页面。
- 不新增主题 UI。
- 不引入 `Record`，避免第一步过大。

价值：

- 为后续 `Member / Event / Record` 打地基。
- 降低多内容类型继续扩展时的硬编码成本。

验收：

- 原有 `Post / Page / Menu / SubMenu / Notice` 行为不变。
- `Member / Event` 仍能被现有数据层识别。

### PR 2：Typed Collection Helpers

- 状态：已重新拆成小 PR；2026-06-11 已合并
- 链接：[#4188](https://github.com/notionnext-org/NotionNext/pull/4188)

建议标题：

```text
refactor: add typed collection helpers for Notion content
```

要做：

- 抽出通用筛选函数：
  - `getTypedPages(allPages, type)`
  - `getPublishedTypedPages(allPages, type)`
  - `sortTypedPagesByPublishDate(items)`
- 让 `getAllMembers`、`getAllEvents` 复用这些 helper。
- 保持输出字段不扩大。

不要做：

- 不改主题。
- 不新增 schema。
- 不改变排序默认行为，除非已有行为就是如此。

价值：

- 把“多内容类型”从一次性功能变成可维护架构。
- 为后续 Records 和更多内容类型留扩展口。

实际提交范围（#4188）：

- 新增 `lib/site/typedCollections.js`
- 新增 helper 单测
- `getAllMembers` / `getAllEvents` 复用 helper
- 不包含 Content Type Registry、主题、路由、IGNAI 文案

### PR 2.5：Community Site Database Template Docs

- 状态：已创建；2026-06-11 已合并
- 链接：[#4189](https://github.com/notionnext-org/NotionNext/pull/4189)

建议标题：

```text
docs: add community site database template
```

要做：

- 把本地验证过的 `Member` / `Event` / `Post author` 字段约定抽象成上游文档。
- 接入 Notion 教程索引和 VitePress 侧栏。
- 明确这是渐进数据库模板，不要求换主题或一次性新增页面。

不要做：

- 不加入 IGNAI 品牌。
- 不加入头像上传、Join 后台、运营管理。
- 不承诺所有主题已经内置成员 / 活动 UI。

### PR 3：Page Props Slimming for Community Routes

建议标题：

```text
perf: slim page props for community content routes
```

要做：

- 成员目录只返回目录需要的字段。
- 活动列表只返回列表需要的字段。
- 首页只保留首页组件需要的数据。
- 删除无关 `allPages / notice / customMenu / tagOptions / categoryOptions` 等 page props。

不要做：

- 不混入视觉改版。
- 不混入数据源变更。

价值：

- 证明社区能力不是“越加越重”，而是有性能预算。
- 适合维护者评审，因为是工程质量 PR。

本地候选文件：

- `lib/db/SiteDataApi.js`
- `pages/index.js`
- `pages/events/index.js`
- `pages/members/index.js`

## 6. 第二阶段：Member 体系 PR

目标：让 NotionNext 支持社区 / 组织站最核心的“人”的表达。

### PR 4：Member Data Contract

建议标题：

```text
feat: improve Member data contract for community sites
```

要做：

- 标准化 Member 字段：
  - `title`
  - `slug`
  - `avatar`
  - `bio`
  - `role`
  - `featured`
  - `verified`
  - `website`
  - `social_github`
  - `social_x`
  - `social_linkedin`
  - `author_slug`
- 官方 API 读取支持：
  - `url`
  - `checkbox`
  - `date`
  - `multi_select`
  - `email`
  - `phone_number`
- 补 schema 文档。

不要做：

- 不加入头像上传。
- 不加入 Join 表单。
- 不加入 IGNAI 成员卡片视觉。

价值：

- 让 NotionNext 能支持 team page、creator directory、AI builder community。

### PR 5：Member Directory Minimal Route

建议标题：

```text
feat: add optional member directory route
```

要做：

- 新增 `/members`。
- 使用 `allMembers`。
- 提供极简、主题无关的成员列表。
- 支持缺头像、缺 bio、缺 role。

不要做：

- 不用 IGNAI 暗色视觉。
- 不做复杂筛选。
- 不放品牌文案。

价值：

- 让用户立刻看到 NotionNext 可以从博客变成社区站。

### PR 6：Member Detail Minimal Route

建议标题：

```text
feat: add optional member profile route
```

要做：

- 新增 `/members/[slug]`。
- 展示基础成员信息和外链。
- 支持 `members/<slug>` 与裸 slug 兼容。
- 详情页找不到时走 `notFound`。

不要做：

- 不加入 IGNAI 个人主页布局。
- 不加入复杂相关文章模块，最多预留接口。

价值：

- 成员有公开身份页，社区和组织获得可信表达。

### PR 7：Author to Member Relationship

建议标题：

```text
feat: link post authors to members
```

要做：

- 支持文章通过 `author_slug` 或显式字段映射到 Member。
- 提供 resolver：
  - `resolveAuthorsForPost`
  - `getMemberAuthoredPosts`
- 成员页可展示 authored posts 的数据能力。

不要做：

- 不一次性改所有主题文章卡片。
- 不做模糊匹配为主，优先显式字段。

价值：

- 从“内容列表”升级为“人和内容的关系网络”。
- 这是多作者社区、组织博客、AI 研究小组官网的关键能力。

## 7. 第三阶段：Event / Record 体系 PR

目标：让 NotionNext 不只是发文章，也能承载社区如何发生、如何沉淀。

### PR 8：Event Data Contract

建议标题：

```text
feat: normalize Event content data
```

要做：

- 提供 `normalizeEvent` 或同等数据整理能力。
- 支持字段：
  - `status`
  - `date`
  - `location`
  - `format`
  - `registrationUrl`
  - `registrationQrImage`
  - `hosts`
  - `tags`
  - `ext`
- 支持状态：
  - `planning`
  - `ongoing`
  - `recap`
  - 兼容 `open / closed / finished`

不要做：

- 不加入 IGNAI 活动页面视觉。
- 不加入后台刷新按钮。

价值：

- 活动是社区站和组织站的通用需求。
- 对 AI meetup、hackathon、workshop、webinar 都有价值。

### PR 9：Minimal Event Routes

建议标题：

```text
feat: add optional event listing and detail routes
```

要做：

- 新增 `/events`。
- 新增 `/events/[slug]`。
- 支持活动状态、日期、地点、报名链接。
- 外部活动 URL 可作为入口。

不要做：

- 不放 IGNAI 文案。
- 不做复杂活动运营后台。

价值：

- 把 NotionNext 从“内容发布”推向“社区活动发布”。

### PR 10：Record / Field Notes Content Type

建议标题：

```text
feat: add Record content type for community field notes
```

要做：

- 定义 `Record` 内容类型边界。
- 支持活动复盘、项目记录、成员故事、工具清单。
- 第一版优先数据契约和文档。

不要做：

- 不直接上 IGNAI 的 `/records` 视觉。
- 不把静态 `src/content/records.ts` 搬上游。

价值：

- AI 社区的核心不是只办活动，而是沉淀过程、工具、项目和经验。
- 这是“社区基础设施”叙事里最有差异化的一环。

## 8. 第四阶段：文档和示例 PR

目标：让维护者和用户理解这不是零散功能，而是一条产品方向。

### PR 11：Community Site Architecture Docs

建议标题：

```text
docs: add community site architecture guide
```

要做：

- 解释 NotionNext 可支持：
  - personal blog
  - multi-author site
  - community site
  - organization site
  - AI project / lab site
- 给出 `Member / Event / Record` schema 示例。
- 说明哪些能力是数据层，哪些能力是主题层。

价值：

- 把单个 PR 变成上游可理解的长期方向。
- 也为你的面试和作品集提供公开材料。

### PR 12：Community Starter Theme / Example

建议标题：

```text
docs: add community site example based on typed content
```

或更谨慎：

```text
docs: document community site example patterns
```

要做：

- 不急着把 `ignai` 主题整体上游。
- 先做示例文档、schema、页面结构图。
- 等前面 PR 合并后，再判断是否提供一个轻量 example theme。

价值：

- 避免维护者觉得主题太私货。
- 保留后续贡献空间。

## 9. 四周执行日程

### Week 1：上游架构地基

目标：让维护者接受“社区内容类型”方向。

| 日期 | 任务 | 产出 |
|---|---|---|
| Day 1 | 跟进 #4169 反馈 | 修订 PR / 补测试 / 回复维护者 |
| Day 2 | 拆 PR 1 Content Type Registry | 上游分支 + PR |
| Day 3 | 拆 PR 2 Typed Collection Helpers | 上游分支 + PR |
| Day 4 | 整理 PR 1/2 的评审反馈 | 小修 + 更新文档 |
| Day 5 | 写公开开发日志草稿 | “为什么 NotionNext 需要社区内容类型” |

### Week 2：Member 体系

目标：把“社区是谁构成的”做成上游可复用能力。

| 日期 | 任务 | 产出 |
|---|---|---|
| Day 1 | 拆 PR 4 Member Data Contract | 上游 PR |
| Day 2 | 拆 PR 5 Member Directory Route | 上游 PR |
| Day 3 | 拆 PR 6 Member Detail Route | 上游 PR |
| Day 4 | 拆 PR 7 Author to Member Relationship | 上游 PR 或草案 |
| Day 5 | 写 Member 体系复盘 | “从个人博客到多人社区站” |

### Week 3：Event / Record 体系

目标：把“社区如何发生、如何沉淀”做成可复用能力。

| 日期 | 任务 | 产出 |
|---|---|---|
| Day 1 | 拆 PR 8 Event Data Contract | 上游 PR |
| Day 2 | 拆 PR 9 Minimal Event Routes | 上游 PR |
| Day 3 | 整理 PR 10 Record 内容类型 | 文档 PR 或数据契约 PR |
| Day 4 | 拆 PR 3 Page Props Slimming | 上游 PR |
| Day 5 | 写 Event / Record 复盘 | “AI 社区不是只办活动，而要沉淀经验” |

### Week 4：包装与表达

目标：把工程成果变成可讲述的职业资产。

| 日期 | 任务 | 产出 |
|---|---|---|
| Day 1 | 整理完整 case study | 中文长文 |
| Day 2 | 整理英文 PR series summary | GitHub / LinkedIn / 作品集可用 |
| Day 3 | 打磨简历 bullet | 中文 + 英文 |
| Day 4 | 准备面试 STAR 讲法 | 2 分钟版 + 5 分钟版 |
| Day 5 | 整理作品集页面结构 | IGNAI + NotionNext contributions |

## 10. 每个 PR 的标准提交流程

### 10.1 本地产品验证

先确认这个能力在 IGNAI 里真实使用：

- 是否解决了真实运营问题？
- 是否提升了成员、活动、记录或内容发布体验？
- 是否有明确用户价值？

### 10.2 拆上游候选

按文件分类：

可上游：

- `lib/db/*`
- `lib/utils/*`
- `pages/*` 中主题无关的路由
- schema docs
- tests

留本地：

- `themes/ignai/*`
- IGNAI 文案
- 管理后台
- Join 表单和头像上传
- R2 / OSS 图床配置

### 10.3 开干净上游分支

推荐命名：

```bash
codex/community-content-types
codex/typed-collection-helpers
codex/member-data-contract
codex/member-directory-route
codex/event-data-contract
```

### 10.4 PR 描述模板

```text
## Problem
NotionNext works well for personal publishing, but community and organization sites need reusable support for typed content such as Member and Event.

## What this PR adds
- ...

## What this PR does not include
- no theme-specific IGNAI UI
- no local community copy
- no operations/admin workflow

## Why this is useful
- ...

## Verification
- ...
```

### 10.5 评审策略

- 维护者问为什么需要：强调“个人博客兼容 + 新站点类型扩展”。
- 维护者担心太大：主动拆小，只保留数据层。
- 维护者担心主题私货：明确本 PR 不含 IGNAI 视觉。
- 维护者要求测试：优先补 helper 单元测试，不硬上大 E2E。

## 11. 面试表达

### 11.1 一句话版本

```text
我基于真实 AI 社区官网需求，把 NotionNext 从个人博客框架扩展为支持成员、活动、记录和多作者关系的社区内容基础设施，并将通用能力拆成上游 PR 反哺开源项目。
```

### 11.2 STAR 版本

Situation：

```text
我在搭建 IGNAI AI 社区官网时发现，传统博客框架很适合个人发布，但 AI 社区需要成员、活动、多作者、项目记录和组织表达。
```

Task：

```text
我的目标不是重写一个新系统，而是在 NotionNext 这个成熟框架上做二次开发，同时把可复用能力拆成上游 PR。
```

Action：

```text
我先在真实社区官网中验证 Member、Event、Records、报名和运营后台能力；再把本地定制和通用能力拆开，优先提交数据层、类型系统、字段契约和性能优化类 PR。
```

Result：

```text
最终把一个个人博客框架扩展成可支持 AI 社区和组织官网的内容基础设施，同时形成真实产品案例和连续开源贡献记录。
```

### 11.3 两分钟讲法

```text
我最近在做一个叫 IGNAI 的 AI 社区官网。最开始它只是一个展示页，但做着做着我发现，AI 社区真正需要的不是一个静态落地页，而是一套轻量内容基础设施：成员要有公开身份页，活动要能发布和报名，活动之后要有记录和复盘，文章作者也要能和成员身份连接起来。

我没有选择从零写 CMS，而是基于 NotionNext 二次开发。这样运营者可以继续在 Notion 里维护内容，网站自动同步。过程中我发现 NotionNext 原本更偏个人博客，所以我先在 IGNAI 本地验证 Member、Event、Record、Join 等能力，再把其中通用的部分拆成上游 PR，比如 Event 官方 data source API 补拉、成员数据契约、多内容类型 helper、page props 瘦身等。

这件事对我来说有两个价值：对社区，它让 IGNAI 从群聊和活动海报升级成可沉淀的组织官网；对开源，它推动 NotionNext 从个人博客框架扩展到 AI 时代的社区和组织站场景。
```

## 12. 简历描述

### 中文版本

- 基于 NotionNext 二次开发 IGNAI AI 社区官网，将个人博客框架扩展为支持成员目录、成员详情、活动发布、报名入口、社区记录和轻量运营后台的社区官网系统。
- 在真实社区场景中识别 NotionNext 对 `Member / Event / Record` 等社区内容类型支持不足的问题，拆分数据层、路由层、字段契约和性能优化方案，并向上游提交可复用 PR。
- 设计并落地 Notion 驱动的社区内容模型，连接成员、文章、活动、报名和记录，提升社区可信度与运营效率。
- 推动“真实产品验证 -> 通用能力抽象 -> 上游开源贡献”的开发流程，将本地业务需求转化为开源项目的架构增强。

### 英文版本

- Extended NotionNext from a personal blogging framework into a community-oriented website system for IGNAI, supporting members, events, registrations, field notes, and lightweight operations workflows.
- Identified reusable gaps in community content modeling and contributed upstream-friendly improvements around `Member`, `Event`, typed collections, Notion data source fallbacks, and page props slimming.
- Designed a Notion-first content architecture that connects people, events, posts, registrations, and community records while preserving compatibility with the existing blog workflow.
- Built a product-driven open source contribution workflow: validate in a real AI community, extract generic architecture, and submit focused upstream PRs.

## 13. 需求发现叙事

可以这样讲“我为什么做这件事”：

```text
我一开始只是想给 IGNAI 做一个官网，但实际运营时发现，社区官网和个人博客完全不同。个人博客的核心是文章，而社区官网的核心是关系：人和内容的关系，人和活动的关系，活动和记录的关系，组织和外部用户信任之间的关系。

当时有两个选择：要么从零写一个社区 CMS，要么基于成熟框架做二开。我选择 NotionNext，因为社区早期最重要的是内容和运营效率，不是复杂后台。Notion 已经是很多社区组织者熟悉的工作台，只要把 NotionNext 的内容模型从 Post/Page 扩展到 Member/Event/Record，就能用很低的维护成本承载社区增长。

做完本地验证后，我发现这些能力不只服务 IGNAI，也服务很多 AI 时代的新型站点：AI builder 社群、开源项目、研究小组、创作者组织、活动社区。所以我开始把本地功能拆成上游 PR，希望把个人博客框架扩展成更通用的社区内容基础设施。
```

## 14. 项目意义点

对用户：

- 降低社区官网搭建门槛。
- 让小团队不用维护复杂 CMS，也能有成员、活动和记录。
- 让社区从群聊式运营变成可公开沉淀的组织资产。

对 NotionNext：

- 扩大受众，从个人博客扩展到社区、组织、AI 项目官网。
- 增加新的内容类型，但保持原有博客用户兼容。
- 让项目更契合 AI 时代的多人协作和组织表达需求。

对你个人：

- 展示产品判断力：能发现真实需求。
- 展示架构能力：能拆本地能力和通用能力。
- 展示开源协作能力：能持续提可合并 PR。
- 展示社区思维：不仅写代码，还理解人、活动、内容和信任如何连接。

## 15. 后续跟踪表

| 序号 | PR 方向 | 状态 | 优先级 | 本地依据 |
|---|---|---|---|---|
| 0 | Event 官方 API fallback | #4169 已关闭，待缩小范围重提 | P0 | Notion Event 补拉 |
| 1 | Content Type Registry | #4170 已关闭，待缩小范围重提 | P0 | Member/Event 类型判断分散 |
| 2 | Typed Collection Helpers | #4188 已合并 | P0 | `getAllMembers/getAllEvents` 可复用 |
| 3 | Page Props Slimming | 本地已验证，待拆 | P1 | 首页/成员/活动 pageProps 优化 |
| 4 | Member Data Contract | 待拆 | P0 | 真实成员字段已验证 |
| 5 | Member Directory Route | 待拆 | P1 | `/members` 已本地使用 |
| 6 | Member Detail Route | 待拆 | P1 | `/members/[slug]` 已本地使用 |
| 7 | Author to Member Relationship | 待拆 | P1 | 成员相关文章链路已验证 |
| 8 | Event Data Contract | 待拆 | P1 | `normalizeEvent` 已本地验证 |
| 9 | Minimal Event Routes | 待拆 | P2 | `/events` 已本地使用 |
| 10 | Record Content Type | 待文档化 | P2 | `/records` 已本地使用 |
| 11 | Community Architecture Docs | #4189 已合并首版，后续补 case study | P1 | 面试/上游叙事需要 |
| 12 | Community Example Pattern | 待观察 | P3 | 等数据层 PR 合并后再推 |

## 16. 下一步建议

最近 3 个最应该马上做的动作：

1. 先不要直接重开 #4169 / #4170，按维护者能快速 review 的粒度继续拆小。
2. 基于 2026-06-19 issue triage，从 #4198、#3890/#3901、#3654/#3724、#3703 中选一个高价值 bugfix 线复现。
3. 同步写一篇短复盘，把“从博客到 AI 社区基础设施”的叙事公开化。

#4188 / #4189 已经证明“小而硬”的拆法更容易进入上游；后续继续让每个 PR 只解决一个明确问题。
