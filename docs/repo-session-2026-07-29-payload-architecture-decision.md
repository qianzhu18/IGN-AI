# 2026-07-29 Payload 统一架构决策记录

## Files changed

- `docs/architecture/payload-unified-migration-plan.zh-CN.md`
- `docs/architecture/cms-options-research-2026-07-29.zh-CN.md`
- `docs/design/hubtown-interaction-reference.zh-CN.md`
- `doc/roadmap/overall.md`
- `doc/roadmap/schedule.md`
- `doc/roadmap/master-todo.md`
- `apps/site/README.md`
- `apps/site/package.json`
- `apps/site/pnpm-lock.yaml`
- `apps/site/eslint.config.mjs`
- `apps/site/src/payload.config.ts`
- `apps/site/src/payload-types.ts`
- `apps/site/src/migrations/`
- `apps/site/src/app/(payload)/api/health/route.ts`
- `apps/site/src/app/(payload)/admin/importMap.js`
- `apps/site/src/lib/env.ts`
- `apps/site/src/lib/env.test.ts`
- `apps/site/src/lib/slug.ts`
- `apps/site/src/lib/slug.test.ts`
- `apps/site/src/access/roles.test.ts`
- `apps/site/src/styles/site.css`
- `apps/site/src/blocks/`
- `apps/site/src/collections/Members.ts`
- `apps/site/src/collections/Records.ts`
- `apps/site/src/collections/Posts.ts`
- `apps/site/src/collections/Pages.ts`
- `apps/site/src/collections/JoinSubmissions.ts`
- `apps/site/src/collections/Redirects.ts`
- `apps/site/src/fields/shared.ts`
- `apps/site/src/hooks/`
- `apps/site/src/components/admin/AdminBrand.tsx`
- `apps/site/src/components/admin/AdminDashboardOverview.tsx`
- `apps/site/src/app/(payload)/custom.scss`

## Community-facing value delivered

- 明确 Payload/PostgreSQL 是迁移后的唯一内容事实源，消除 Notion、静态 fallback 与前端隐藏规则并存的问题。
- 明确新后台、公开前台、预览和 AI 接口属于同一个 Next.js + Payload 应用，共用生成类型与权限模型。
- 为 Members、Events、Records、Posts、Join 和媒体建立分阶段迁移顺序与验收门，旧生产站在切换前保持可回滚。
- 将 Hubtown 级交互设计沉淀为后续参考，不再干扰当前后端迁移主线。
- 补充 Hubtown About 的 Nuxt/Sanity/Lenis/Theatre/WebGL 技术信号，并转译为 IGNAI 品牌场景组件底座。
- 使用官方资料对比 Payload、Directus、Strapi、WordPress 与 Sanity，确认 Payload 仍是当前约束下的主方案。
- 跑通 Payload Admin 首位管理员、Event 富文本编辑、草稿隔离、版本记录、认证预览、Live Preview 与发布闭环。
- 建立 PostgreSQL 16 本地运行环境、初始 schema migration、环境变量校验与数据库健康检查。
- 补齐 Payload 类型、Admin import map、迁移前端样式和 9 个基础单元测试，确保迁移切片可以安装、校验和构建。
- 完成 M1 六个集合、Pages Blocks、SEO/source 共享字段与 Member/Event/Record/Post 原生关系，后台已显示全部运营入口。
- 增加 AI Service Account 角色并强制其内容写入为草稿；匿名 Join 申请不能伪造审核状态、内部备注或幂等键。
- 从独立空数据库顺序执行 M0 + M1 migrations，55 张表创建成功，避免把开发模式 schema push 当成迁移验证。
- 修复 Admin 主题变量污染：深色 elevation 不再覆盖 light theme，首用户页不再出现黑色加载幕和黑底黑字。
- 后台默认切换为简体中文，并增加 IGNAI 品牌标识、内容运营总览、四类核心内容实时统计和发布流程提示。

## Upstreamable pieces identified

- Notion 到 Payload 的幂等导入、校验报告与 source tracking 模式可抽象为通用迁移实践。
- Payload relationship 替代 slug/JSON 关系的社区内容模型可形成独立参考实现。
- Local API + generated types + Server Components 的同应用查询边界可形成技术说明。

这些内容不适合作为 NotionNext 功能 PR；当前应先在 IGNAI 新架构中验证，再决定是否独立开源。

## Remaining work

1. 完成 M1：补齐 Members、Records、Posts、Pages、Join Submissions、Redirects 与跨集合关系。
2. 完成 M2：构建 Notion 数据、正文、关系和媒体的幂等迁移工具及校验报告。
3. 完成 M3/M4：按完整路由迁移、staging 验收、生产切换与旧站退出。
4. 配置生产邮件适配器、对象存储和正式密钥；当前本地邮件只输出到控制台。
5. 基础路由稳定后，以 About 为第一个 Hubtown 级交互原型，不提前重做整站。

## Verification evidence

- `pnpm typecheck`：通过。
- `pnpm lint`：通过。
- `pnpm test`：4 个测试文件、11 个测试通过。
- `payload migrate:status`：`20260729_131637` 已执行，batch 1。
- `/api/health`：Payload 与 PostgreSQL 均返回 `ok`。
- 未认证访问 Event 草稿：API 返回 0 条，公开页面返回 404。
- 认证预览草稿：预览入口返回 307，草稿页面返回 200。
- 发布 Event 后：公开 API 返回 1 条，公开页面返回 200。
- 浏览器验证：后台 Dashboard、Event Lexical 编辑器和左右分栏 Live Preview 均正常，无应用级控制台错误。
- M1 关系验证：Event 通过 relationship 展开关联 Member；AI Service Account 请求发布 Post 时被保存为 draft，公开查询返回 0 条。
- Admin 可视验证：`/admin` 正确进入首用户页；light/dark 均可读；390px 下 `scrollWidth === viewport`；创建草稿后 Dashboard 动态显示 1 个活动草稿，Event 编辑器无控制台错误。
