# IGNAI Next.js + Payload 统一架构迁移计划

记录日期：2026-07-29
状态：已确认目标架构，进入迁移实施
迁移分支：`codex/payload-architecture-migration`

## 1. 架构决策

IGNAI 的目标架构确定为 **Next.js + Payload CMS + PostgreSQL + 对象存储**。

这不是在现有 NotionNext 旁边长期增加第二套后台。迁移完成后的生产系统只有一个应用和一份领域模型：

```text
浏览器
  -> Next.js 页面 / Route Handlers
      -> Payload Local API（同进程、同类型）
          -> PostgreSQL（结构化内容与关系）
          -> S3 兼容对象存储（图片与视频）
```

Payload Admin、公开前台、预览接口和 AI 接口属于同一个 Next.js 项目。前端不再把 Notion 字段、`ext` JSON、静态 fallback 和主题配置分别解释一遍。

## 2. 当前为什么无法统一

现在的生产链路同时承担了四种职责：

| 领域       | 当前事实源                      | 当前问题                                         |
| ---------- | ------------------------------- | ------------------------------------------------ |
| 内容与状态 | Notion 数据库                   | `type/status/ext` 需要二次解释，关系与校验能力弱 |
| 正文       | Notion blocks                   | 获取、规范化、构建缓存与页面渲染强耦合           |
| 站点配置   | Notion Config + 本地配置        | 同一字段可能有多套 fallback 和优先级             |
| 媒体       | Notion 临时 URL + R2 + 本地文件 | 生命周期、裁剪、迁移和归属不统一                 |
| 前台       | NotionNext + IGNAI 主题         | 领域模型被塞进博客框架的 page props 和主题层     |
| 运营写入   | Join API + Notion/MCP           | 写入目标、审核状态和公开状态分散                 |

`apps/site` 又建立了 Payload 的 `Events / Media / Users / SiteSettings` 新模型。如果不明确退出旧链路，就会形成两套后台、两套 slug、两套发布状态和两套预览。

因此这次迁移的核心不是“把 API 地址换掉”，而是把内容模型、权限、预览、发布和前台查询合并为一份契约。

## 3. 最终代码边界

目标应用以 `apps/site` 为新生产应用，内部按领域而不是按“前端/后端”拆分：

```text
apps/site/
  src/
    app/
      (frontend)/       公开页面
      (payload)/        Payload Admin 与 API
    collections/        Payload Collections
    globals/            全站配置
    blocks/             CMS 可编排页面区块
    features/           members/events/records/posts/join
    components/         通用展示组件
    lib/content/        唯一查询层
    lib/migrations/     Notion -> Payload 导入与校验
    payload.config.ts
    payload-types.ts    自动生成，前后台共用
```

规则：

1. Server Component 优先通过 Payload Local API 读取，避免内部再走 HTTP。
2. 页面和组件只消费生成类型或稳定 View Model，不读取 Notion 原始字段。
3. 所有公开状态统一使用 Payload drafts/versions；不再增加前端隐藏黑名单。
4. slug、关系、媒体和 SEO 在 CMS 层校验，不在多个页面中分别 fallback。
5. Notion 导入信息只保存在 `source.notionPageId` 等追踪字段中，不参与新页面运行时查询。

## 3.1 拼接后的完整技术栈

### 应用与内容

| 层       | 采用技术                                      | 责任                                  |
| -------- | --------------------------------------------- | ------------------------------------- |
| 应用框架 | Next.js 16 App Router + React 19 + TypeScript | 页面、RSC、Route Handlers、SEO        |
| CMS      | Payload CMS 3.86                              | Admin、schema、权限、草稿、版本、预览 |
| 富文本   | Payload Lexical                               | Posts、Records、Events 正文           |
| 查询     | Payload Local API                             | 同进程读取，前台不再请求远程 CMS      |
| 类型     | `payload generate:types`                      | 前后台唯一实体类型契约                |
| 数据库   | PostgreSQL + Payload/Drizzle migrations       | 内容、关系、版本、运营数据            |
| 媒体     | Payload S3 adapter + 自有媒体域名             | R2 / OSS / COS / MinIO 可替换         |
| AI       | Payload MCP plugin                            | 只读公开内容、创建/更新 Draft、审计   |

### 前端与交互

| 层         | 采用技术                       | 使用边界                                |
| ---------- | ------------------------------ | --------------------------------------- |
| 基础 UI    | Server Components + CSS tokens | 所有普通页面，默认零客户端运行时        |
| 组件动效   | Motion for React               | reveal、数字、导航、局部滚动映射        |
| 长章节导演 | GSAP ScrollTrigger             | 只用于 Home/About 标志性章节            |
| 3D 场景    | React Three Fiber + Three.js   | 只保留一个持久社区信号场                |
| 平滑滚动   | 暂不全局引入 Lenis             | P2 可选，必须路由级、可关闭、有性能证据 |
| 视觉编排   | Theatre.js 暂列 P2             | 只有需要设计师可视化关键帧时采用        |
| 无障碍     | 原生语义 DOM + reduced motion  | Canvas 不承载唯一文本或操作             |

### 工程与运行

| 层            | 采用技术                                          | 责任                                              |
| ------------- | ------------------------------------------------- | ------------------------------------------------- |
| 包管理        | pnpm                                              | 新应用独立锁文件，后续再决定 workspace 根收束     |
| 单元/契约测试 | Vitest                                            | access、slug、转换器、查询与迁移幂等              |
| E2E/视觉      | Playwright                                        | Admin、Preview、核心路由、移动端、Canvas 像素检查 |
| 部署          | Docker/Node                                       | Vercel 与国内服务器均可运行                       |
| 观测          | Sentry/PostHog 逐步接入                           | 错误、Web Vitals、关键发布与表单事件              |
| CI            | lint + typecheck + test + build + migration check | 阶段门与生产保护                                  |

品牌 token 延续现有事实：`#07080c` 基底、`#ff7a18` Heat、`#5da9ff` Signal。Hubtown 只提供结构和交互参考，不替换 IGNAI 品牌色。

### 依赖准入顺序

`apps/site` 当前只需要保留已经安装的 Payload、Next.js、PostgreSQL adapter、Lexical、S3 adapter、MCP plugin 和 Motion。其他交互依赖不进入 M0/M1：

| 阶段          | 允许新增                                           | 条件                                     |
| ------------- | -------------------------------------------------- | ---------------------------------------- |
| M0-M1         | 不新增 3D/滚动库                                   | 先完成后台、类型、预览、关系模型与 build |
| M2            | Zod 或等价边界校验库                               | 导入器需要验证外部 Notion 数据时         |
| M3 基础页     | Playwright                                         | 开始做 Admin、Preview 和路由 E2E 时      |
| M3 About 原型 | `gsap`                                             | Motion 无法清晰表达跨章节时间线时        |
| M3 信号场     | `three`、`@react-three/fiber`、`@react-three/drei` | DOM 原型通过且性能预算已定义             |
| P2            | Theatre.js / Lenis                                 | 有明确编辑或滚动收益，并通过独立技术验证 |

每个新增运行时依赖都要回答：是否能由现有技术完成、增加多少客户端体积、移动端如何降级、无障碍路径是什么。不能为了接近参考站而一次性安装整套动画库。

## 3.2 当前前端的保留与退出边界

“在当前前端基础上”指保留已经验证的产品事实与品牌资产，不等于把 NotionNext 组件原样复制进新应用。

必须保留：

- 现有公开 URL、导航信息架构和 SEO 意图。
- `#07080c / #ff7a18 / #5da9ff` 品牌色与 logo、torch、真实活动媒体。
- Members、Events、Records、Join 已验证的业务规则和文案事实。
- 已验证的移动端、对比度、缓存、图片 fallback 和安全经验。

按领域重写或迁移：

- `src/components` 中与业务无关的展示组件，可在 `apps/site` 重建为 typed components。
- Hero、About、内容卡片只保留信息层级，不保留当前零散硬编码颜色和特效实现。
- 真实内容先迁 Payload，再由新组件消费，不从旧 page props 直接桥接。

明确退出：

- `react-notion-x` block 渲染链路和 Notion build-time 拉取。
- `ext` JSON、静态 fallback、主题 config 之间的运行时优先级判断。
- NotionNext theme wrapper、全量 page props 和旧插件集合。
- 全站 Lenis RAF、随机外部图片和无法观测的 CDN 动效脚本。

这能让新站继承当前工作的价值，同时真正摆脱导致前后端分裂的框架边界。

## 4. 目标领域模型

### 第一组：平台基础

- `users`：管理员与编辑者权限。
- `media`：图片、视频、alt、caption、裁剪版本和对象存储信息。
- `site-settings`：品牌、导航、默认 SEO、社交链接和全站 CTA。
- `pages`：About、Join 说明和未来可编排页面。

### 第二组：社区核心

- `members`：成员资料、角色、城市、关注方向、公开状态。
- `events`：活动详情、时间地点、报名、组织者与参与者。
- `records`：社区记录、现场素材、关联活动与参与成员。
- `posts`：文章、多作者、分类、标签与关联项目。

### 第三组：运营

- `join-submissions`：申请、去重、审核状态、来源和处理记录。
- `redirects`：迁移期间旧 URL 到新 URL 的显式映射。

关键关系必须使用 Payload relationship 字段：

```text
Member <-> authored Posts
Member <-> organized/participated Events
Event  <-> Records
Record <-> Media
Page   -> layout Blocks
```

不再用 `relatedEventSlug`、`relatedRecordSlugs` 或 `ext` JSON 模拟数据库关系。

## 5. 唯一事实源与迁移期规则

### 迁移完成后

- Payload/PostgreSQL：唯一内容与配置事实源。
- 对象存储：唯一公开媒体事实源。
- Git：组件、设计系统、迁移代码与基础设施配置事实源。
- Notion：可保留为知识库和历史档案，但不再作为生产 CMS。

### 迁移期间

- 旧生产站继续只读 Notion，保证线上稳定。
- 新应用只读 Payload，不在渲染时回退 Notion。
- 数据只允许 **Notion -> Payload 单向导入**，禁止双向同步。
- 每条导入记录使用 `source.notionPageId` 保证幂等，可重复执行而不制造副本。
- 开始内容冻结后，新内容统一进入 Payload；如冻结前仍在 Notion 编辑，则重新执行全量导入。

这个边界用于避免“到底改哪边才生效”的长期混乱。

## 6. 迁移阶段与阶段门

### M0：固定契约与可运行地基（当前）

- [x] 创建独立 `apps/site` 迁移切片，不修改旧生产运行链路。
- [x] 建立 Users、Media、Events、Site Settings 初始模型。
- [x] 接入草稿、版本、预览入口、Postgres 与可选 R2。
- [x] 补齐缺失样式与生成类型，使新应用首次 build 通过。
- [x] 建立数据库 migration，而不是依赖生产 schema push。
- [x] 增加最小权限、公开查询和预览回归测试。
- [x] 固定 Node/pnpm 版本并生成锁文件，禁止未锁定依赖进入 CI。
- [x] 补齐 `site.css`、`payload-types.ts`、import map 和环境变量校验。
- [x] 增加 `/api/health`，报告应用与数据库状态；对象存储在启用 R2 后补充探测。

阶段门：新应用可以从空数据库启动、进入 `/admin`、创建并预览一个 Event，lint/typecheck/test/build 全部通过。

### M1：完成社区领域模型

- [x] 建立 Members、Records、Posts、Pages、Join Submissions、Redirects。
- [x] 用 relationship 字段实现成员、活动、记录和文章关系。
- [x] 把导航、SEO、首页基础内容收进 Site Settings / Pages。
- [x] 生成并提交 `payload-types.ts`，前端禁止手写重复实体类型。
- [x] 建立 `blocks/` 注册表，内容 block 与交互 scene block 分离。
- [ ] 建立 SEO、redirect、slug reservation 和删除保护 hooks。
- [x] 建立 Editor/Admin/AI Service Account 三类最小权限；AI Service Account 写入被强制保存为草稿。

阶段门：管理员能在后台完成草稿、预览、发布、定时发布和关系编辑；前台能使用同一类型读取所有核心实体。

### M2：幂等数据与媒体迁移

- [ ] 建立只读 Notion 抽取器和字段映射清单。
- [ ] 先迁移 Config/Media，再迁移 Members/Events/Records/Posts。
- [ ] 迁移 Notion blocks 到 Lexical，生成无法自动转换的人工复核报告。
- [ ] 把本地文件、Notion 临时图片和现有 R2 资产统一到对象存储。
- [ ] 输出数量、slug、状态、关系、正文与媒体校验报告。
- [ ] 每次导入生成 manifest，记录来源 ID、目标 ID、checksum 和结果。
- [ ] 所有写入先支持 `--dry-run`，失败项进入人工复核清单。
- [ ] 验证中文 slug、历史 URL、Notion block 和 R2 object key。

阶段门：重复执行导入结果不变；Published 数量、稳定 slug、关系和核心正文通过抽样比对；无页面依赖 Notion 临时媒体 URL。

### M3：按路由切换新前台

推荐顺序：

1. `/events` 与 `/events/[slug]`
2. `/records` 与 `/records/[slug]`
3. `/members` 与 `/members/[slug]`
4. `/about`、首页与导航
5. `/join`
6. Posts、Archive、Search、RSS 与 Sitemap

每个路由切换都必须同时完成列表、详情、SEO、预览、空状态、移动端和回归测试，不保留“列表走 Payload、详情走 Notion”的半迁移状态。

基础页面迁移后再进入交互底座：

- [ ] 建立 `StoryRenderer / SceneRegistry / SceneShell / ScrollDirector`。
- [ ] 使用真实 Members / Events / Records 关系制作社区信号场。
- [ ] 首个原型只覆盖 About：沉浸标题、事实数据、价值观、加入入口。
- [ ] 完成 320/375/414/768/1440 断点、reduced-motion 和无 WebGL fallback。
- [ ] 设定场景资源体积、LCP、INP、CLS、FPS 和 DPR 性能预算。

阶段门：所有核心 URL 在 Payload 数据下通过视觉与内容验收，旧 URL 重定向表完整，生产环境不需要 Notion Token 才能启动。

### M4：切换生产与退出旧架构

- [ ] 迁移前创建数据库与对象存储备份。
- [ ] 设置短内容冻结窗口，执行最终增量导入和校验。
- [ ] 新应用先部署到 staging，再切换正式域名。
- [ ] 保留旧部署为限时只读回滚点，不允许继续编辑。
- [ ] 观察错误率、核心页面、表单写入、媒体与搜索后关闭回滚窗口。
- [ ] 将根目录 NotionNext 标记为 legacy/archive，移除生产 Notion 凭证。

阶段门：生产连续稳定，Payload 成为唯一写入入口，Notion 与旧站不再承担线上职责。

## 7. AI 接入边界

Payload 可以比 Notion 映射层更自然地接入 AI，但 AI 必须遵循发布权限：

- 第一阶段只允许读取 Published 内容和站点配置。
- 第二阶段允许创建 Draft、补全摘要、alt、SEO 和关系建议。
- AI 不直接发布、删除或修改权限；发布由编辑者确认。
- 所有 AI 写入保留操作者、时间、来源和变更记录。
- MCP/API 使用和后台相同的 Payload access control，不另建旁路数据库脚本。

## 8. 部署与国内托管

目标架构不是绑定 Vercel：

- Next.js + Payload 可以构建为 Node/Docker 应用。
- PostgreSQL 可使用托管实例或自建实例。
- 对象存储通过 S3 兼容接口接入 R2、阿里云 OSS、腾讯云 COS 或 MinIO。
- 媒体对外使用自有域名，迁移存储供应商时避免改写正文 URL。

因此未来迁入国内服务器是可行的。需要提前控制的是备案、域名、CDN、数据库备份、对象存储跨境流量和第三方服务可访问性，而不是更换 CMS。

## 9. 明确不做

- 不建设 Notion 与 Payload 的长期双向同步。
- 不继续为 `ext` JSON 增加新业务字段。
- 不在旧主题和新应用中同时开发同一个功能。
- 不为了前端炫技阻塞数据模型和迁移工具。
- 不在没有校验报告和回滚点时直接替换生产站。

## 10. 当前下一步

当前只推进 M0：先让 `apps/site` 成为可启动、可编辑、可预览、可测试的完整垂直切片。M0 通过后再补齐全量集合与导入器，不提前重做 Hubtown 级交互首页。

方案对比与重新选型触发条件见 `docs/architecture/cms-options-research-2026-07-29.zh-CN.md`。除非 M0 出现其中定义的硬阻断，否则不再更换 CMS 主方案。
