# 2026-07-17 社区记录时间线与 Notion 同步

## Files changed

- `src/content/records.ts`
- `lib/records.ts`
- `pages/records/index.js`
- `themes/ignai/components/sections/FieldNotesSection.js`
- `src/components/sections/FieldNotesSection.tsx`
- `src/components/sections/ShowcaseSection.tsx`
- `src/components/sections/UpcomingEventsSection.tsx`
- `pages/manage/content.tsx`
- `docs/notion-frontend-linkage-status.zh-CN.md`
- `doc/roadmap/master-todo.md`

## Community-facing value

- 往期记录只采用 `活动记录/` 中可核验的原文、海报与截图事实。
- 5 条可确认日期的记录按发生时间倒序展示；4 条日期不足的记录进入独立待补区。
- 首页 Field Notes 自动读取最新 3 条已确认记录，不再维护手工 slug 列表。
- Notion 中 7 条含错误数字、错误日期或内部话术的旧 Record 已设为 `Invisible`。
- Notion 新建 9 条与前台同 slug 的 Published Record，正文、摘要、日期状态与官网一致。

## Upstreamable pieces

- `RecordItem.timelineDate` / `dateStatus` 与稳定排序函数可以抽成通用社区记录能力。
- “未知日期不进入时间线”的展示规则可以作为 NotionNext 组织型站点的通用内容规范。

## Remaining work

- Record 前台仍由 `src/content/records.ts` 渲染，Notion 目前是同 slug 内容镜像，不是唯一主源。
- 后续需补 Record 官方 data source 拉取、Notion blocks 规范化和 `/records/[slug]` 缓存刷新。
- LEV0、观猹共学营、花猫参展、观猹长理分园仍需当事人补充准确发生日期。
