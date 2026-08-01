# Repository Session Record - 2026-07-31 Notion Content Loop

## 目标

恢复 NotionNext 的直接编辑体验，让活动、活动回顾和官网展示读取同一组 Notion 顶层字段，不再依赖已清空的 `ext` JSON 或运行时静态关系。

## 文件变更

- `lib/db/notion/eventDataSource.js`
- `lib/db/notion/recordDataSource.js`
- `lib/db/notion/mergeOfficialPages.js`
- `lib/db/SiteDataApi.js`
- `lib/records.ts`
- `lib/site/site.types.ts`
- `pages/records/[slug].js`
- `pages/manage/content.tsx`
- `scripts/sync-notion-community-schema.js`
- `scripts/sync-notion-community-contract.js`
- `package.json`
- 对应回归测试、路线图与联调审计记录

## 社区侧价值

- 运营人员可直接在 Notion 编辑活动状态、形式、公开开关、报名二维码、封面裁剪和关联活动。
- Record 只需填写一个 `related_event_slug`，Event / Record 详情自动形成双向入口。
- Notion 页面正文、页面封面、日期和地点继续沿用 NotionNext 原生编辑与渲染链路。
- Notion 页面封面的 `Reposition` 会自动同步到活动列表与详情；上传文件使用稳定附件地址，不再因官方临时签名过期显示旧静态海报。
- 首页与详情页统一使用官方 API 的完整字段版本，不再出现同一内容不同页面显示不一致。

## 可上游部分

- 官方 data source 行按 ID 覆盖不完整 collection-view 行的合并 helper。
- 官方字段与 NotionNext 原始页面元数据按 ID 合并，保留原生封面 Reposition。
- 官方 Notion 文件 URL 到稳定附件 URL 的转换 helper。
- Event / Record 顶层字段候选名与标准化回归测试。
- 单向内容关系在展示层反向推导的轻量实现。

## 剩余工作

- 本地生产构建已通过，并确认构建产物中的活动 → 回顾、回顾 → 活动双向关系。
- 部署后在生产站刷新缓存，逐页确认首页、活动列表、活动详情、回顾列表和回顾详情。
- 后续只在真实运营需要时增加字段，继续保持 NotionNext + Notion 的轻量生产架构。
