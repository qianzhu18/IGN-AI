# /records 接通 Notion 真实前后端

**日期**：2026-07-23
**分支**：`codex/fix-ai-slop-ui`（worktree）
**状态**：本地验证通过，已准备合并至 `main`

## 背景

线上 `https://www.ignai.cn/records` 此前完全由本地硬编码文件 `src/content/records.ts` 驱动，绕开了 NotionNext 的数据层。这导致两个直接问题：

1. 在 Notion 后端改任何 Record，`/records` 列表和详情页都不会变，违背 CLAUDE.md "Notion 是唯一后端" 的架构约定。
2. 本地文件里 `dateText` 字段直接写"活动日期待补 / 开营日期待补"，`pages/records/index.js` 还专门渲染了一个 "Date pending / 日期待补的真实记录" 分组——审稿语言暴露在公开页面。

诊断阶段还发现：主工作区和 worktree `codex/fix-ai-slop-ui` 的 `pages/records/index.js` 不一致，线上生效的是 worktree 版本。

## 目标

把 `/records` 改成走 Notion Records data source（env 里已有 `NOTION_RECORDS_DATA_SOURCE_ID`），复用 members/events 已建立的"官方 data_source API + normalize"模式，让 Notion 成为唯一内容源。详情页正文走 Notion blocks，不再用本地手写 content。

## 参照模式

直接复用 `members` / `events` 已建立的链路：

- 双管合并：`fetchGlobalAllData`（非官方 collection view）+ `fetchXxxFromOfficialAPI`（官方 `/v1/data_sources/{id}/query`），官方 API 非空时优先
- mapper 在 `lib/db/notion/xxxDataSource.js`，fetcher 在 `lib/db/SiteDataApi.js`
- `ext` 字段解析：`parseJsonObject`（`eventDataSource.js`）
- 块拉取：`fetchNotionPageBlocks`（即 `getPostBlocks`）+ `adapterNotionBlockMap` + `formatNotionBlock`

Notion Records data source 的 `ext` JSON 字段键：`recordType / dateText / timelineDate / timelineEndDate / dateStatus / location / outcomes / cover / sourceFolder`。

## 改动清单

### 新建

| 文件 | 作用 |
|---|---|
| `lib/db/notion/recordDataSource.js` | record 属性 mapper（仿 `eventDataSource.js`），导出 `getRecordDataSourcePropertyCandidates` / `mapOfficialRecordPage` |
| `lib/records.blocks.ts` | Notion blocks → `{heading, body, media}` 适配器，导出 `adaptRecordBlocks` |
| `scripts/notion-records-smoke.js` | smoke test，验证官方 API 能拉到 Published Record 并解析 ext |

### 修改

| 文件 | 改动 |
|---|---|
| `lib/db/SiteDataApi.js` | 加 `fetchRecordsFromOfficialAPI` + `getAllRecords`；`EmptyData`、`convertNotionToSiteData` 的合并阶段、return 对象、`cleanPages` 全部接入 `allRecords` |
| `lib/records.ts` | `RecordItem` / `recordTypeLabel` 从 `src/content/records.ts` 迁入；`getAllRecords` / `getRecordBySlug` / `getFeaturedRecords` 改成接收 `BasePage[]` 参数；新增 `normalizeRecord` |
| `lib/site/site.types.ts` | `SiteData` 接口加 `allRecords: BasePage[]` |
| `lib/site/adapters/notion/notion.normalizer.ts` + `lib/site/processors/empty.processor.ts` | 补 `allRecords: []` 以满足 `SiteData` 类型 |
| `pages/records/index.js` | `getStaticProps` 改 async 走 Notion；删 `undatedRecords` 分组和 "Date pending / 日期待补的真实记录" 区块；`dateText` 为空时 UI 显示"日期未确认" |
| `pages/records/[slug].js` | `getStaticPaths` 改 `fallback: 'blocking'`；`getStaticProps` 调 `getPostBlocks` + `adapterNotionBlockMap` + `formatNotionBlock` + `adaptRecordBlocks` 渲染正文 |
| `themes/ignai/components/sections/FieldNotesSection.js` | 改成接收 `records` props，调用 `getFeaturedRecords(records, 3)` |
| `themes/ignai/index.js` | `LayoutIndex` 调用 `<FieldNotesSection records={props.allRecords || []} />` |
| `src/content/records.ts` | 改成纯 re-export（向前兼容 v1.0.0 残留引用） |
| `src/components/sections/FieldNotesSection.tsx` + `src/components/cards/RecordCard.tsx` | import 路径改 `@/lib/records` |
| `package.json` | 加 `"notion:records:smoke": "node scripts/notion-records-smoke.js"` |
| `.env.local` | 加 `NOTION_RECORDS_DATA_SOURCE_ID`（从主工作区 `.env.notion.local` 复制，未打印值） |

## 关键设计决策

1. **不保留本地 mock fallback**：与 members/events 先例一致。非官方 collection view 读不出 Record 类型，所以 records 只走官方 API 一条路；官方 API 失败时 `/records` 列表为空——与 members/events 在 API 失败时的行为一致。
2. **删除"Date pending"分组**：审稿语言不公开。所有 record 统一按 `timelineDate` 排序，没有 `timelineDate` 的沉底。
3. **`src/content/records.ts` 改成 re-export 而非删除**：v1.0.0 残留的 `src/components/sections/FieldNotesSection.tsx` 和 `src/components/cards/RecordCard.tsx` 仍从 `@/src/content/records` import，re-export 让旧引用不破。
4. **block adapter 合并多段 paragraph**：一个 heading 后跟多个 paragraph 时，用 `\n\n` 合并到同一 body；UI 用 `whitespace-pre-line` 渲染换行。避免改 UI 结构。
5. **env 变量回退**：`fetchRecordsFromOfficialAPI` 优先读 `NOTION_RECORDS_DATA_SOURCE_ID`，回退到 `NOTION_MEMBERS_DATA_SOURCE_ID`（与 `fetchEventsFromOfficialAPI` 同策略）。

## 验证

| 步骤 | 结果 |
|---|---|
| `yarn type-check` | ✓ 通过（修了 4 个 TS 错误：block adapter 的 `orientation` undefined、records.ts 的 `exactOptionalPropertyTypes` 兼容、两个 SiteData processor 缺 `allRecords`） |
| `yarn build` | ✓ 通过。`/records` SSG 3.53 kB；`/records/[slug]` SSG + ISR 60s，预渲染 13 个 slug。并移除首页构建期写入 `public/robots.txt` / `public/sitemap.xml` 的遗留逻辑，避免与动态路由冲突。 |
| `node scripts/notion-records-smoke.js parse-ext` | ✓ 拉到 13 条 Published Record，`recordType/dateText/timelineDate/cover/outcomes` 全部解析正常 |
| `localhost:3000/records` | ✓ 列表显示 13 条（featured 1 + secondary 12），"Date pending" 分组已消失，卡片 `dateText` 不再出现"待补" |
| `localhost:3000/records/geekathon-community-launch-node` | ✓ 详情页正文从 Notion blocks 渲染，3 段 paragraph 合并为 1 section，body 含 `\n\n`，`whitespace-pre-line` 渲染换行 |
| 在 Notion 改 Record 后重新构建 | ✓ 站点同步更新（ISR 60s 或 `yarn build`） |

## 已知遗留（不阻塞接通）

- Notion 里部分 record 正文段落还混着"图片：xxx"占位行和"待补"语言。这是**内容整改**工作，和本计划解耦——先接通前后端，再逐条改 Notion 内容。
- 线上 `https://www.ignai.cn/records` 此前还有 React hydration 报错（#418 / #423）。本次接通未专门处理 hydration，但删掉"Date pending"分组后，列表页结构更简单，建议下次重新核查。
- worktree 的 `node_modules` 是软链到主工作区的（验证用），部署到 Vercel 时不影响。
- 本次接入会从 `NOTION_RECORDS_DATA_SOURCE_ID` 读取数据；生产环境也必须配置该变量，不能误回退到 Member 数据源。

## 后续建议

1. **内容整改**：在 Notion 里逐条清理 9 条 record 的正文——删"图片：xxx"占位行、改"待补"为真实日期或留空、把"待补"语言从 `ext.dateText` 字段里清掉。接通后这些改动会直接反映到站点。
2. **提交策略**：将 Record 接入、页面数据链路、构建冲突修复与本报告保持为一个 scoped commit；构建生成的 `public/rss.xml` 不纳入本次提交。
3. **主工作区同步**：主工作区 `pages/records/index.js` 仍是旧版（Field Notes / 社区现场沉淀成记录）。合并到 main 后，主工作区即可快进同步。
4. **hydration 复查**：接通后用浏览器控制台核查 `/records` 是否还有 #418/#423。如有，常见诱因是主题切换按钮（"切换到浅色模式" pressed 状态）——和 records 接通无关。
