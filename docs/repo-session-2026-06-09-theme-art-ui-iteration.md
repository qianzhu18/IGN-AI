# Repository Session Record - 2026-06-09

## 1. 本次目标

```text
在 glm/feat/rig-ai-redesign 外观分支上完成首页明暗主题首轮迭代，
接入 IGNAI 美术资料库，并让 Header、Hero、CTA、Footer 的品牌语言统一起来。
同时补齐 Post 详情页对 Member / Event 社区关系的展示空间。
继续补齐首页与文章集合页的 Post 展示排布，让内容文章不再只藏在旧 Blog 列表里。
```

## 2. 本次范围

### 本地产品层文件
- `blog.config.js`
- `themes/ignai/components/Header.js`
- `themes/ignai/components/PostCollection.js`
- `themes/ignai/components/PostCommunityContext.js`
- `themes/ignai/config.js`
- `themes/ignai/index.js`
- `themes/ignai/style.js`
- `lib/utils/post.js`
- `pages/index.js`
- `__tests__/lib/utils/post.test.js`
- `public/brand/ignai/`

### 协作文档
- `doc/roadmap/master-todo.md`
- `doc/roadmap/schedule.md`
- `docs/community-mvp.md`
- `docs/member-schema.md`
- `docs/notion-community-schema-template.zh-CN.md`
- `docs/repo-session-2026-06-09-theme-art-ui-iteration.md`

## 3. 分支约束

```text
本轮只基于当前 glm/feat/rig-ai-redesign 外观设计分支继续做。
不从过时的 feat/dark-light-toggle 分支迁移实现。
不改 main / yanglaishe.cn 主线。
```

## 4. 为什么现在做这件事

```text
旧版明暗主题实现绑定在过时 UI 上，放到当前 RIG 风格首页会失效。
这次先把主题变量系统、品牌资产入口和核心首屏体验接稳，
为后续 members / events / records / about 等页面的统一明暗主题打基础。
```

## 5. 实现步骤

1. 从 `/Users/mac/qianzhu Vault/重要图片存储/IGNAI-f` 挑选并压缩品牌素材，放入 `public/brand/ignai/`。
2. Header 改为透明火炬图标 + 文字锁定，并增加桌面端与移动端明暗切换按钮。
3. 首页 RIG Hero 改为文案区 + 品牌视觉区：暗色使用店招图，浅色使用红橙渐变品牌图。
4. 将 Header、Hero、ticker、卡片、terminal、CTA、Footer 的颜色收敛到 CSS 变量。
5. 移动端隐藏 Hero 视觉 caption，避免窄屏遮挡。
6. 更新 favicon 默认值到 IGNAI 本地品牌图标。
7. Post 数据层解析 `authors`、`relatedMembers`、`relatedEvents`，兼容顶层字段和 `ext` JSON。
8. Post 详情页新增社区上下文模块，展示作者、相关成员和相关活动。
9. 新增 `PostCollection`，让首页文章区、Archive、分类、标签和搜索结果共用 IGNAI 文章卡片排布。
10. 首页保留 4 篇轻量 `latestPosts` 数据出口，只传卡片需要的字段，避免把完整 `allPages` 塞回首页。
11. 回写路线图、schema 文档和本次 session 记录。

## 6. 验收标准

- [x] 当前外观分支可独立完成明暗切换，不依赖旧 UI 分支
- [x] Header 的品牌图标不再带烘焙棋盘格背景
- [x] 桌面端和移动端都有可用的明暗切换入口
- [x] 首页首屏在暗色和浅色下都能展示对应品牌视觉资产
- [x] Footer 不再停留在默认浅色样式，而是跟随 IGNAI 主题变量
- [x] Post 详情页能展示关联作者、成员和活动，不再只把关系字段藏在数据层
- [x] 首页活动区块之后出现文章区，且只接收轻量文章数据
- [x] Archive / Category / Tag / Search 文章集合页切换到 IGNAI 卡片布局
- [x] 文章卡片展示分类、日期、作者、标题、摘要、标签和封面
- [x] 路线图记录本轮完成项，并保留后续页面一致性待办

## 7. 验证动作

- [x] `yarn lint --file lib/utils/post.js --file themes/ignai/components/PostCommunityContext.js --file themes/ignai/index.js --file themes/ignai/style.js --file themes/ignai/components/Header.js`
- [x] `yarn build`
- [x] Playwright 检查桌面端暗色首页
- [x] Playwright 检查桌面端浅色首页
- [x] Playwright 检查移动端暗色首页
- [x] Playwright 检查移动端浅色首页
- [x] `yarn test --runTestsByPath __tests__/lib/utils/post.test.js`
- [x] 本地服务 `http://localhost:3002/` 启动并可访问
- [x] Chrome/Playwright 检查首页文章区桌面 / 移动端
- [x] Chrome/Playwright 检查 Archive 文章卡片桌面 / 移动端
- [x] `curl` 验证首页 `pageProps.latestPosts` 为 4 篇且不包含 `allPages`
- [x] `curl` 验证 Category 路由能返回文章列表数据

## 8. 结果记录

### 改动文件
- `blog.config.js`
- `doc/roadmap/master-todo.md`
- `doc/roadmap/schedule.md`
- `docs/community-mvp.md`
- `docs/member-schema.md`
- `docs/notion-community-schema-template.zh-CN.md`
- `lib/utils/post.js`
- `__tests__/lib/utils/post.test.js`
- `themes/ignai/components/Header.js`
- `themes/ignai/components/PostCollection.js`
- `themes/ignai/components/PostCommunityContext.js`
- `themes/ignai/config.js`
- `themes/ignai/index.js`
- `themes/ignai/style.js`
- `pages/index.js`
- `public/brand/ignai/business-card-mockup.webp`
- `public/brand/ignai/favicon-512.png`
- `public/brand/ignai/hero-gradient-brand.webp`
- `public/brand/ignai/logo-dark.webp`
- `public/brand/ignai/logo-horizontal.webp`
- `public/brand/ignai/logo-light.webp`
- `public/brand/ignai/logo-transparent.webp`
- `public/brand/ignai/storefront-sign.webp`
- `public/brand/ignai/torch-icon-transparent.png`
- `public/brand/ignai/torch-icon.webp`
- `docs/repo-session-2026-06-09-theme-art-ui-iteration.md`

### 做成了什么
- 官网首页现在有了真正随主题变化的品牌首屏：暗色更像现场店招和夜间社区空间，浅色更像开放、清晰的品牌宣传面。
- Header 从旧的图片拼接感，改成更干净的火炬标识和文字锁定，移动端菜单也跟随主题变量。
- 明暗模式不再只改 body 背景，而是影响导航、首屏、按钮、卡片、终端区和 Footer。
- favicon 默认值切换到 IGNAI 本地资产，避免继续使用旧默认图标。
- 文章详情页新增 `Community context` 区域，Notion 中录入 `author_slug`、`member_slugs`、`event_slugs` 或对应 `ext` JSON 后，前台可以展示作者、相关成员和相关活动。
- 首页现在在活动区之后展示 4 篇最新文章，保留旧文章可见性，由 Notion `status` 控制是否隐藏。
- Archive、分类、标签、搜索结果页面统一使用 IGNAI 文章卡片，文章卡片展示封面、分类、日期、作者、摘要和标签。

### 哪些可以上游
- Header 中明暗切换按钮接入 `useGlobal` 的方式可以整理成主题层参考。
- 主题 CSS 变量分层适合抽出为 NotionNext 自定义主题的实践样例。
- `resolveRelatedMembersForPost` / `resolveRelatedEventsForPost` 的解析策略可以继续整理成上游友好的 Post 关系 helper。
- 首页轻量 `latestPosts` 出口和文章集合组件的分离方式，可以整理成“主题需要内容卡片但不想带全量 allPages”的上游参考。
- 品牌视觉、文案、IGNAI 美术资产选择属于本地产品层，不适合直接上游。

### 剩下什么
- 如果希望运营完全不用 `ext` JSON，需要在 Notion schema 中正式新增 `member_slugs` / `event_slugs` 字段并跑一次 schema-check。
- 旧模板文章仍处于 Published，所以会继续显示在首页文章区和 Archive；投入生产前需要在 Notion 改为 Invisible 或替换成真实内容。
- members / events / records / about 等二级页面仍需逐页复查硬编码暗色 Tailwind 样式。
- 首页后续区块的显隐节奏和完整性感知还需要继续 QA。
- 成员目录页、成员详情页、首页成员区块仍在设计体验待办中。
- 后续如果要合并到主线，需要单独检查资产体积、SEO 图标输出和线上 smoke。

## 9. 生产域名对齐补充（2026-06-09）

### 本次补充
- 将 `blog.config.js` 的默认 `LINK` 从未绑定成功的 `https://ignai.community` 收束为当前 Vercel 生产别名 `https://www.yanglaishe.cn`。
- 将 `src/content/links.ts` 的默认站点 URL 同步为 `https://www.yanglaishe.cn`。
- 将 `pages/robots.txt.js` 的兜底 Sitemap 域名同步为 `https://www.yanglaishe.cn`。
- 在 `.env.example` 中给出 `NEXT_PUBLIC_LINK=https://www.yanglaishe.cn` 示例，避免后续部署忘记显式配置。
- 首页轻量 `latestPosts` 补回 RSS 必需的 `status` / `password` 字段，避免构建期 RSS 因缺少发布状态变成空 feed。
- `generateRss` 改为使用克隆文章对象渲染 Notion 内容，避免把 RSS 用的 `blockMap` 反向挂回首页 props，造成首页 page data 膨胀。
- `/search` 前端搜索页删除完整 `allPages`，并只保留文章卡片和浏览器搜索需要的轻量字段，消除搜索页 page data size 警告。

### 保留事项
- `ignai.community` 还不是当前 Vercel 部署别名，后续完成 DNS / Vercel 绑定后再切换正式 canonical。
- 旧模板文章详情 `article/example-1` 仍有 page data size 警告，需要后续通过隐藏模板文章或优化文章详情 props 单独处理。

## 10. 内容密度压测补充（2026-06-09）

### 本次补充
- 新增本地显式开关 `IGNAI_CONTENT_FIXTURES=stress` / `NEXT_PUBLIC_IGNAI_CONTENT_FIXTURES=stress`，可注入虚拟内容压力测试数据，不污染正式 Notion，也不会默认进入生产构建。
- 虚拟数据规模：36 篇 Post、24 条 Event、28 条 Record；叠加真实数据后，本地压测为文章 48 条、活动 27 条、记录 31 条。
- `/events` 从单列活动列表升级为更适合多活动的双列密度列表，并增加「开放 / 进行中」「筹备中」「已复盘 / 结束」「已满员」统计。
- `/records` 增加类型统计，并将次级记录从两列扩展为桌面三列，保留首条 featured 记录。
- 首页 Field Notes、首页 Events、Archive、Search 均可在本地 fixture 模式下观察高密度内容排布。

### 压测结论
- 桌面和移动截图均未发现水平溢出：`scrollWidth === clientWidth`。
- 首页只展示 3 条活动、4 篇文章、3 条记录，首屏之后不会被几十条内容直接淹没。
- 集合页可以承载 20-50 条内容，但移动端会自然变成长列表；如果正式内容继续增长，下一阶段应增加筛选、分页或按月份 / 类型分组。

## 11. 白天模式可读性补充（2026-06-09）

### 本次补充
- 修复 `section-title`、`display-title`、`section-body` 等首页通用标题 / 正文样式仍硬编码白色的问题，改为读取 `--rig-paper` / `--rig-paper-70`。
- 为首页活动卡、记录卡和通用卡片补充 light mode 覆盖，避免 `text-white/*` Tailwind 类在浅色背景下继续保持低对比。
- 将 `/events`、`/records` 及对应详情页根容器接入主题变量，避免白天模式进入集合页时突然回到纯暗色页面。
- 为活动 / 记录集合页增加 `ignai-themed-page` / `ignai-themed-card` 样式承接，统一统计卡、列表卡、标签和边框的明暗表现。

### 验证
- `yarn lint --file themes/ignai/style.js --file pages/events/index.js --file 'pages/events/[slug].js' --file pages/records/index.js --file 'pages/records/[slug].js'` 通过；仅保留既有 `<img>` 性能警告。
- Playwright light mode 验证首页、活动页、记录页的桌面和移动端均无水平溢出：`overflow=0`。
- 新截图保存于 `/tmp/ignai-light-ui-qa-final/`，包括 `home-mobile-light.png`、`events-mobile-light.png`、`records-mobile-light.png` 等。
- `yarn build` 通过；仍保留旧模板文章 `article/example-1` 的 page data size 警告，和本轮 UI 样式无关。

## 12. 数据埋点与运营分析补充（2026-06-09）

### 本次补充
- 接入 PostHog 客户端 SDK，新增全站 `ProductAnalytics` 组件，用于页面访问、点击埋点、后续 Feature Flag / A-B Testing。
- 将主方案从「自托管 PostHog + Uptime Kuma + GlitchTip」降级为轻量云服务优先：PostHog Cloud、Clarity、Umami、UptimeRobot、Sentry / PostHog Error Tracking。
- 复用现有 Clarity 配置入口 `NEXT_PUBLIC_CLARITY_ID`，并在 `.env.example` 中补齐 PostHog Cloud / Umami / 错误追踪上线变量。
- 为首页首屏 CTA、Header 加入社区、首页活动 / 文章 / 记录、集合页卡片、加入社区表单和微信二维码补充业务事件。
- 同一套 `data-analytics-event` 现在会广播到 PostHog、Umami 和 Clarity API events；PostHog 用于漏斗和实验，Umami 用于轻量事件概览，Clarity 用于按事件过滤录屏。
- 加入表单提交只记录模式、兴趣数量、是否带头像、成功 / 失败状态，不采集姓名、联系方式等敏感信息。
- 新增 `/api/health` 给 UptimeRobot 作为应用健康检查入口。
- 新增 `docs/observability-stack.zh-CN.md`，记录主方案分工、Vercel 环境变量、首批事件、看板建议和 A/B 测试入口。

### 首批事件
- `click_join_community`
- `click_join_submit`
- `submit_join_application`
- `join_application_result`
- `click_wechat_qr`
- `click_view_events`
- `click_event_card`
- `click_view_articles`
- `click_article_card`
- `click_view_records`
- `click_record_card`

- 需要在 PostHog Cloud、Clarity、Umami 和 UptimeRobot 中创建项目 / 监控，并把 key / id 配置到 Vercel。
- `NEXT_PUBLIC_GLITCHTIP_DSN` 本轮仅保留为兼容预留；轻量方案下优先用 Sentry Developer 或 PostHog Error Tracking。
- A/B 测试还未接具体 feature flag，建议第一组实验从首页加入社区 CTA 文案或二维码展示方式开始。
