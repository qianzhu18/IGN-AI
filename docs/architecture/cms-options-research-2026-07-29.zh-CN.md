# IGNAI CMS 与后端架构方案调研

记录日期：2026-07-29
决策对象：Payload CMS、Directus、Strapi、WordPress、Sanity
结论：继续采用 Next.js + Payload CMS，不切换到其他候选

## 1. 评估前提

IGNAI 需要的不是普通博客后台，而是同时满足：

1. Members、Events、Records、Posts、Join 等关系数据。
2. 草稿、版本、预览、定时发布和媒体治理。
3. Hubtown 级高度定制前端，不受 CMS 模板限制。
4. AI 可以安全读取和创建草稿，但不能绕过人工发布。
5. 可用 Docker、PostgreSQL 和 S3 兼容存储部署到国内服务器。
6. 尽量减少“前端一个应用、后台一个应用、API 再一层”的维护负担。

评分权重：前后端统一 30%、编辑与预览 20%、关系建模 15%、自托管与国内部署 15%、AI 接入 10%、迁移和长期运维 10%。分数是针对 IGNAI 场景的工程判断，不代表产品的通用排名。

## 2. 结论矩阵

| 方案        | IGNAI 适配分 | 优势                                                                                             | 主要代价                                                               | 结论                       |
| ----------- | -----------: | ------------------------------------------------------------------------------------------------ | ---------------------------------------------------------------------- | -------------------------- |
| Payload CMS |           92 | 与 Next.js 同应用、Local API、生成类型、代码式 schema、versions/live preview、Postgres、官方 MCP | 需要团队维护 TypeScript schema 和迁移                                  | 主方案                     |
| Directus    |           82 | 数据库优先、运营后台成熟、Visual Editor、版本、Flows、MCP、自托管                                | 独立服务与 HTTP/SDK 边界；MSCL 许可需随组织规模复核                    | 第一备选                   |
| Strapi 5    |           75 | 内容模型成熟、Draft & Publish、自托管、内置 MCP                                                  | 独立 Node 服务；Live Preview 有商业版边界；前后端类型契约更松          | 不切换                     |
| Sanity      |           73 | 实时协作与 Visual Editing 很强，结构化内容体验好                                                 | Content Lake 是托管服务，国内部署和供应商依赖不符合当前目标            | 视觉编辑优先时的备选       |
| WordPress   |           68 | Gutenberg 编辑体验成熟、插件与人才生态最大、REST API 完整                                        | Headless 后仍是 PHP 后台 + Next 前台；插件、字段和预览整合容易再次分裂 | 常规内容站合适，本项目不选 |

## 3. 为什么 Payload 仍然胜出

### 3.1 它直接解决“前后端无法统一”

Payload Local API 可以在 React Server Components 和 Route Handlers 中直接访问数据库，不需要让 Next.js 服务端再请求一个远程 CMS HTTP API。生成的 TypeScript 类型同时约束后台字段、查询层和前台组件。

这正好对应当前问题：不再维护 Notion 原始字段 -> normalize -> pageProps -> 主题组件的多层映射。

### 3.2 编辑能力已经覆盖当前需要

Payload 官方能力包括：

- Versions、Drafts、Autosave 与版本恢复。
- iframe Live Preview、设备断点和实时编辑消息。
- PostgreSQL adapter 与显式 migration 工作流。
- Lexical 富文本、关系字段、上传集合和细粒度 access control。

### 3.3 AI 接入不必另建旁路

官方 MCP 插件可按 collection/global 分别开放 find/create/update/delete，并要求后台 API key；请求仍执行 Payload access control。IGNAI 可以只开放 Published 读取和 Draft 创建，把 publish/delete 保持关闭。

## 4. 其他方案何时会更合适

### Directus

如果未来出现“运营人员要在后台自由建表、配置字段和自动化，开发者不希望 schema 主要存在代码里”的需求，Directus 会比 Payload 更合适。它支持 Visual Editor、内容版本、Flows 和 MCP，也可通过 Docker 自托管。

本项目暂不选的原因是它重新形成独立后台服务。前台需通过 SDK/REST/GraphQL 访问，类型同步、部署、鉴权和预览跨域都多一个边界。Directus 当前采用 MSCL；官方说明符合规模条件的组织可免费使用，但商业规模变化后需要重新检查许可。

### Strapi 5

Strapi 适合标准 Headless CMS 团队，Draft & Publish、Preview 和自托管都成熟，较新版本还内置了受 Admin token 权限约束的 MCP server。

本项目不切换的原因是它同样是独立服务，而且官方文档明确 Live Preview 只在 Growth / Enterprise 计划提供。对于需要深度预览和单仓类型契约的 IGNAI，收益不够覆盖迁移成本。

### WordPress

WordPress 可以完全自定义前端：既可以写 PHP Theme，也可以通过 REST API 做 Headless Next.js。Gutenberg 对文章、页面和区块编辑非常成熟。

它适合内容运营占主导、关系模型简单、依赖成熟插件的网站。IGNAI 如果使用 Headless WordPress，会变成 PHP/Gutenberg 后台、Next.js 前台、插件字段/API 胶水三套知识体系；Members、Events、Records 的复杂关系和 AI 权限仍需大量定制。它不是“最差”，只是没有解决本项目最痛的统一问题。

### Sanity

Sanity 的 Content Lake、Presentation/Visual Editing 与实时协作很强，Hubtown 页面状态中也出现 Sanity 查询线索。它非常适合追求编辑器与视觉前台协作的品牌团队。

但其核心内容服务是托管式 Content Lake。对计划迁入国内服务器、希望数据库和媒体都掌握在自己基础设施中的 IGNAI，这会引入不必要的外部依赖。

## 5. 失败时的备选顺序

Payload 只有在 M0 阶段出现以下硬阻断时才重新选型：

- Admin/Live Preview 无法在目标部署环境稳定运行。
- 核心关系模型必须依靠大量绕过 Payload 的自建 SQL。
- 国内 Node/Docker 部署无法满足数据库、媒体或运行时要求。
- 编辑人员实测认为代码式 schema 导致日常运营不可接受。

若出现硬阻断：

1. 首选 Directus，保留 PostgreSQL 与 Next.js 前台。
2. 若需求退化为文章和普通页面运营，考虑 WordPress。
3. 若接受海外托管并把视觉协作放在第一位，考虑 Sanity。
4. Strapi 只在团队已有 Strapi 经验或生态插件是决定性条件时采用。

没有触发硬阻断时，不再周期性重开 CMS 选型，避免架构摇摆继续消耗项目。

## 6. 官方资料

### Payload

- [Payload Local API](https://payloadcms.com/docs/local-api/overview)
- [Payload Live Preview](https://payloadcms.com/docs/live-preview/overview)
- [Payload Versions](https://payloadcms.com/docs/versions/overview)
- [Payload PostgreSQL adapter](https://payloadcms.com/docs/database/postgres)
- [Payload MCP plugin](https://payloadcms.com/docs/plugins/mcp)

### Directus

- [Directus architecture and self-hosting summary](https://directus.io/docs/getting-started/architecture)
- [Directus Next.js Visual Editor](https://directus.com/docs/frameworks/nextjs/visual-editor)
- [Directus content versioning](https://directus.com/docs/guides/content/content-versioning)
- [Directus MCP](https://directus.com/docs/guides/ai/mcp)
- [Directus self-hosting](https://directus.com/docs/self-hosting/overview)

### Strapi, WordPress, Sanity

- [Strapi Draft & Publish](https://docs.strapi.io/cms/features/draft-and-publish)
- [Strapi Preview](https://docs.strapi.io/cms/features/preview)
- [Strapi MCP server](https://docs.strapi.io/cms/features/strapi-mcp-server)
- [WordPress REST API](https://developer.wordpress.org/rest-api/)
- [WordPress Block Editor](https://developer.wordpress.org/block-editor/)
- [Sanity Visual Editing](https://www.sanity.io/docs/visual-editing/introduction-to-visual-editing)
- [Sanity Content Lake](https://www.sanity.io/docs/content-lake)
