# 2026-06-15 Lint 与构建清理记录

## 背景

本轮从“排查当前改动”开始，重点检查未提交变更、生成产物、路线文档更新和上线前工程验证状态。

## 本轮完成

1. 排查当前工作树
   - 已确认 `doc/roadmap/master-todo.md`、`doc/roadmap/schedule.md` 是路线更新。
   - 已确认 `public/rss.xml` 是本地构建生成物，并且仍包含 NotionNext 模板文章内容。
   - 已确认新增设计调研文档与内容资产文档属于 IGNAI 本地产品资产。

2. 修复上线主线相关 lint error
   - 移除 `lib/build/staticPaths.js` 中重复的 `getLatestSlugs` 定义，并去掉不必要的 async。
   - 收敛 `lib/events.ts`、`lib/records.ts`、`lib/sanity.ts` 中静态数据 helper 的 async 返回。
   - 修复 `src/components/admin/OpsAccessGate.tsx` 表单 handler 的 Promise 传递 lint error。
   - 修复 `lib/cache/vercel_cache.js`、`lib/db/notion/getNotionAPI.js` 的 require-await error。
   - 收敛 `lib/db/notion/RateLimiter.ts` 的类型，并让队列 inflight key 使用真实请求 key。
   - 收敛 `lib/site/*` 架构骨架和 `lib/utils/*` 中的显式 `any`。

3. 验证
   - `yarn lint` 通过，剩余为历史 warning。
   - `yarn type-check` 通过。
   - `yarn build` 通过，用时约 80 秒。

## 社区面对外价值

- 上线前工程检查从“lint 有 error”推进到“lint/type-check/build 均可通过”。
- Notion 构建期数据拉取、静态页生成、成员/活动/记录路由仍可正常完成。
- 运营后台访问门的代码更符合 React/TypeScript 检查要求。

## Upstreamable Pieces

- `staticPaths` 重复 helper 清理属于可上游化的小修复。
- 静态数据 helper 去掉不必要 async 属于通用 lint 清理。
- `RateLimiter` 使用真实请求 key 做 inflight 标记可作为 Notion 构建稳定性改进候选。

## Remaining Work

- 清理 Notion 数据源中的模板文章污染，避免首页、归档、RSS、sitemap 继续出现示例文章。
- 决定 `public/rss.xml` 是否继续作为 tracked 生成物；当前构建会改写它。
- 处理设计调研截图资产被全局 `*.png` ignore 的问题：要么明确不入库，要么为 `doc/design/research-assets/**` 增加例外。
- 继续处理历史 lint warning，尤其是前台图片、React Hook 依赖和匿名 default export。
