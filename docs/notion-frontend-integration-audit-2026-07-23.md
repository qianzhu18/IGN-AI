# Notion 与社区官网前后端联调审计

**审计日期**：2026-07-23
**生产站**：`https://www.ignai.cn`
**审计方法**：Notion 官方 data source API、Vercel Production 环境配置、线上 `__NEXT_DATA__` 响应和当前 `main` 代码交叉核对。未写入或修改 Notion 内容。

## 结论摘要

社区内容不是全部同一种数据链路：`Event`、`Record`、`Member` 使用 Notion；`About` 与主导航仍以本地代码为主；Join 是向 Notion 写入的表单，不是从 Notion 读取的展示页。

| 范围                 | 后端现状                                             | 线上现状                                                          | 结论                                          |
| -------------------- | ---------------------------------------------------- | ----------------------------------------------------------------- | --------------------------------------------- |
| Records              | 13 条 `Published Record`                             | `/records` 13 条，均带 Notion page id                             | 已对齐                                        |
| Events               | 11 条 `Published Event`                              | 首页与 `/events` 10 条                                            | 1 条 Published Event 被前端过滤               |
| Members              | 2 条 `Published Member`                              | 首页与 `/members` 2 条                                            | 已对齐；后台未填 slug，前端生成 fallback slug |
| Posts                | 0 条 `Published Post`                                | 首页文章、Archive、Search 都是 0 条                               | 已对齐，但暂无公开文章                        |
| 首页 Config          | 5 条 `Published Config`                              | 首页响应包含 Notion Config，Hero / Culture / WhatIs / Join 使用它 | 已接通                                        |
| Record 与 Event 关系 | 无 relation 字段                                     | 两类内容独立显示、无法互链                                        | 未接通                                        |
| About                | Notion `about` Page 是 `Invisible`                   | `/about` 为本地 TSX 页面                                          | 本地静态页                                    |
| 主导航               | Notion 存在大量历史 Menu / SubMenu                   | 生产 Header 使用本地 fallback 导航                                | 本地静态导航                                  |
| Join                 | 生产有 Notion token；提交优先创建 `Invisible Member` | `/join` 本身不读取 Notion                                         | 写入链路，尚未用真实提交复测                  |

## Notion 数据源

所有已配置的 `NOTION_*_DATA_SOURCE_ID` 指向同一个社区数据源。本次官方 API 查询到 71 行：

- `Record`：13 Published、7 Invisible
- `Event`：11 Published
- `Member`：2 Published、2 Invisible
- `Post`：6 Draft、3 Invisible、0 Published
- `Config`：5 Published
- 其余为历史 Menu / Page / Notice 行

生产已配置 `NOTION_API_TOKEN`、`NOTION_MEMBERS_DATA_SOURCE_ID`、`NOTION_EVENTS_DATA_SOURCE_ID` 和 `NOTION_RECORDS_DATA_SOURCE_ID`。密钥和 ID 未写入本报告。

## 已验证的实时读取

### Records

`/records`、`/records/[slug]` 走官方 data source API，详情页再按 Notion page id 拉取 blocks。

- 线上页面返回 13 条，与后端 Published Record 数量一致。
- `/records/guanchai-fde-camp` 的标题、摘要、标签、`ext.dateText` 与 Notion 行逐字段一致。
- Notion 中存在、旧静态文件中不存在的 `guanchai-million-creator` 在线上返回 200，可作为接通证据。

### Events

`/events`、`/events/[slug]` 读取官方 API，并以 `ext` 解析状态、时间、封面、报名和议程。

- 例如 `guanchai-fde-study-camp-2026` 的标题、开始/结束日期、`ext.eventDateText`、封面、议程和报名链接均与 Notion 官方 API 一致。
- 后端有 11 条 Published Event，生产列表只显示 10 条。`55万奖金！全国首个OPC能力挑战赛来了！` 被 `isMockEvent()` 以归一化 slug `55-opc` 硬编码过滤；它在后端是 Published，因此当前发布开关并不完全等于前台可见性。

### Members 与 Posts

- 2 条 Published Member 均已到达首页和 `/members`。
- 两位 Member 的 Notion `slug` 为空，前端自动生成 `/members/yy`、`/members/member-f188f8f37f77`。这会使后台无法稳定管理公开 URL。
- 当前没有 Published Post，故首页文章、Archive 和 Search 显示 0 条，结果与 Notion 状态一致。

## 当前不协同之处

1. **活动与记录没有关系模型。** 数据源没有 relation / `relatedEventSlug` 字段。观猹 FDE 共学营同时有 Published Event 和 Published Record，但两行没有关联，前台无法说明“活动预热”与“活动复盘”是同一事项的不同阶段。
2. **公开状态存在第二套前端规则。** Event 的 `Published` 之外还会受 `isMockEvent()` 和 `isPublicUpcomingEvent()` 影响；前台不会忠实展示所有 Published Event。
3. **About 与导航并非 Notion 驱动。** `/about` 是本地 `pages/about.tsx`；Header 配置 `IGNAI_NAV_USE_NOTION_MENU: false`。Notion 中保留的历史“洋来社”菜单不会被前台使用。
4. **Join 写入目标硬编码。** `/api/join` 优先写入固定 Notion database id，并设为 `Member + Invisible`；应改为使用 `NOTION_MEMBERS_DATA_SOURCE_ID` 或显式的 database id 环境变量，以免数据源迁移后断链。
5. **公共资源仍有静态 fallback / 技术债。** Event 的标签文案和封面 fallback 仍来自本地文件；这不会覆盖同 slug 的 Notion 行，但会使 Notion 缺字段时由代码补值。

## 建议整改顺序

1. 在数据源增加或规范 `relatedEventSlug` / `relatedRecordSlug`，先关联 FDE、智极松、LEV0、三人行、2050 等重复主题。
2. 决定 Event 的单一发布语义：删除 `55-opc` 的 mock 过滤，或在 Notion 将该行改为 Invisible / Draft；不要同时存在 Published 与前端硬隐藏。
3. 为两条 Published Member 补稳定 slug。
4. 明确哪些“组织介绍”必须 Notion 管理：若 About 与导航也要后台可运营，应把本地文案 / fallback nav 迁入 Config 或 Menu；否则在运营文档中明确它们是代码管理资产。
5. 将 Join 的 Notion parent id 配置化，并在不污染正式成员目录的前提下做一次真实提交 → Invisible Member → 后台审核 → Published 的 smoke 测试。

## 审计边界

本报告验证了读取链路及线上响应；未修改 Notion 行、未提交 Join 表单、未切换任何 Published / Invisible 状态。内容取舍、活动与记录的关系、以及 About / 导航是否应改为 Notion 主源，均需运营侧确认后再实施。

## 整改回执（2026-07-23）

本审计完成后，已按“Notion 为内容主源”的要求实施并用官方 API 复读验证：

- 已创建并发布 `Config:About`（`slug=about`）和 `Config:Navigation`（`slug=navigation`）；`/about` 和 Header 会优先读取这两行 JSON Config，本地文本只在 Notion 不可用时兜底。
- 已移除 Event 本地示例合并和 `55-opc` mock slug 黑名单。所有 `Published Event` 都由 Notion 决定是否进入 `/events`；首页仍仅按 Notion 的活动状态、日期和报名字段筛选“即将发生”。
- 已为 9 组真实 Record / Event 写入双向 `ext.relatedEventSlug` / `ext.relatedRecordSlugs`，详情页会显示对方入口。
- 已为两条 Published Member 回写稳定 slug：`yy`、`xu-quanjun`。
- Join 已改为优先使用 `NOTION_MEMBERS_DATA_SOURCE_ID` 写入；只在旧部署没有该变量时才回退显式 `NOTION_MEMBERS_DATABASE_ID` / 兼容默认值。
- 可复跑脚本：`yarn notion:community:contract`（只读预览）与 `yarn notion:community:contract:apply`（写入）。写入后复读结果为 `planned: []`。

仍未做真实 Join 提交，以避免在未经运营确认时新增申请数据；该链路需在生产环境变量完整的情况下单独 smoke。
