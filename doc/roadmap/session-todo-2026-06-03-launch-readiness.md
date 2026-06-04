# 2026-06-03 上线与运营闭环 TODO

状态：进行中

## P0：上线稳定性

- [x] 验证 `localhost:3001` 首页、成员、加入、活动、后台入口均可访问。
- [x] 修正成员详情页构建期全量预渲染，避免大量 Notion block 请求触发 429。
- [x] 修正成员目录标题与描述，移除 NotionNext 默认站点文案。
- [x] 再跑一次生产构建，确认 `/members/[slug]` 构建耗时明显下降。
- [x] 本地复验 `yarn build`：2026-06-04 构建完整通过，生成 56 个静态页，之前 `.next` vendor chunk 缺失未复现。
- [ ] Vercel / 干净远端构建环境复验；本地构建已通过，但仍需线上环境确认 Node、环境变量和 Notion 访问稳定。
- [x] 梳理并收敛 lint 红灯，至少清掉当前新增路由相关错误。
- [x] 移除 Header 桌面端与移动端“日报”入口，导航收束为成员 / 活动 / 记录 / 关于 / 加入社区。

## P0：成员资料上传与 Notion 回写

- [x] 确认官网环境可用的 OSS / S3 兼容配置：Endpoint、Bucket、Region、AccessKey、Secret、Public Base URL、Path Prefix。
- [x] 抽出服务端 `cloudImageUploader`，支持压缩后上传并返回公网 URL。
- [x] 增加管理员头像上传 API，写入 Notion `avatar` URL。
- [x] 增加成员资料更新 API，白名单更新 `bio`、`role`、`website`、`social_github`、`social_x`、`social_linkedin`。
- [x] 管理后台接入上传与更新表单。
- [x] 增加成员头像历史列表 API，支持按成员读取最近 300 张头像。
- [x] 管理后台支持点击历史头像切换当前头像，再保存回 Notion。
- [x] 成员资料保存后触发 `/members` 与 `/members/[slug]` 重验证。
- [x] `getAllMembers` 保留 `website` 与 social fields，确保 Notion 字段能进入前台展示。
- [x] 成员提交后的展示控制交给 Notion `status`，不再单独实现审批后台。
- [x] 公开 `/join` 成员草稿表单支持直接选择并上传头像 / 个人形象照，上传后随申请写入 Notion `avatar`，并同步为 Notion 页面图标。
- [x] 头像上传 API 完成 12 路并发烟测：12/12 成功，总耗时约 3.36s，公开 URL 可 200 访问。

备注：2026-06-04 已将 Cloudflare R2 / S3 兼容图床配置接入官网 `.env.local`，真实上传返回 `img.qianzhu.online/ignai/members/avatars/...webp` 公网 URL，并通过 Notion 反查确认 Join 申请写入 `avatar` 属性和页面 icon。当前图床不是阿里云 OSS，而是 Cloudflare R2；公网资产域名使用 `img.qianzhu.online`，后续迁移优先保持自有域名和对象路径不变，降低 Notion `avatar` URL 批量改写成本。

## P1：活动发布、报名与记录

- [x] 保持当前活动展示与 `/join` 报名可用。
- [x] 确认活动数据主源：Notion Event。
- [x] 首页活动区块、活动列表页、活动详情页共用 Notion Event 规范化逻辑。
- [x] 活动详情页补齐 `registrationUrl` / `registrationQrImage` 展示。
- [x] 管理页文案从 Studio 收束为 Notion Event 字段说明。
- [x] 管理页增加 Notion 发布后的前台即时刷新入口，支持刷新首页、活动列表和指定活动详情页。
- [x] 补齐 `/records` 社区记录列表页与 `/records/[slug]` 详情页。
- [x] 首页 Field Notes 区块接入 `src/content/records.ts`，记录入口从 `/events` 收束到 `/records`。
- [ ] 高并发增强：Join 提交增加 Notion 写入限速 / 队列 / 幂等保护，避免公开发布时被 Notion API 限流打断。
- [ ] 图床资产治理：为头像对象沉淀 `storageKey` / 迁移脚本，确保从 Cloudflare R2 迁到阿里云 OSS 时可批量复制并保持 URL 策略可控。

## P1：前后端一致性

- [ ] Notion `Member` 字段与前台展示字段逐项核对。
- [x] Notion `Event` 字段与活动页展示字段逐项核对。
- [x] 友链 / 友情链接后续接入准备：Header 默认使用本地导航，避免当前 Notion 模板 Menu 覆盖；清理 Notion Menu 后可通过 `IGNAI_NAV_USE_NOTION_MENU` 开启 Notion 菜单。
- [x] 清理“IGNAI 洋来官网 / NotionNext 博客”等不适合公开上线的默认文案。
- [x] 修正站点 `siteInfo`、成员页、活动页的标题与描述 fallback，避免 NotionNext 默认值进入公开前台。
- [x] 修正 SEO canonical / OG URL fallback，避免 `/undefined`。
- [x] 修正 IGNAI 主题壳在自定义页面重复挂载导致 `/join` 内容重复显示的问题。
- [ ] 检查 sitemap、RSS、结构化数据和正式 OG 图是否符合生产站。

备注：2026-06-03 复验 `/events` 与 `/members`，`siteInfo.title=IGNAI`、`description=长沙 AI 社区 — 连接创造者，点燃可能性`、`link=https://ignai.community`，且未发现 `/undefined` canonical。

## P1：上游贡献推进

- [x] 当前产品分支 `glm/feat/rig-ai-redesign` 已推送到 `origin`，保留社区站完整产品成果。
- [x] 已从 `notionnext-org/NotionNext` 的 `main` 创建上游分支 `codex/community-event-data-source`。
- [x] 已创建上游 PR [#4169](https://github.com/notionnext-org/NotionNext/pull/4169)：为 `Event` 增加 Notion 官方 data source API 补拉管道，并修正 `ext` JSON 空格解析。
- [ ] 下一批上游拆分候选：社区记录 / Records 的通用内容类型、Member directory 的主题无关组件、社区站示例主题说明。

备注：#4169 刻意只包含数据层能力，不包含 IGNAI 主题、活动页 UI、Records 页面或运营后台，方便上游维护者独立评审。

## 本轮文件列表

### 成员资料上传与 Notion 回写

- `.env.example`
- `lib/server/cloudImageUploader.ts`
- `lib/server/notionMemberUpdater.ts`
- `pages/api/admin/member-avatar-upload.ts`
- `pages/api/admin/member-avatar-list.ts`
- `pages/api/admin/member-profile-update.ts`
- `pages/api/join/avatar-upload.ts`
- `pages/manage/members.tsx`
- `src/components/forms/JoinApplicationForm.tsx`
- `src/components/admin/MemberProfileAdminPanel.tsx`
- `src/components/admin/adminConfig.ts`
- `lib/db/SiteDataApi.js`

### 活动发布与报名

- `lib/utils/event.js`
- `pages/events/index.js`
- `pages/events/[slug].js`
- `themes/ignai/components/sections/UpcomingEventsSection.js`
- `pages/manage/content.tsx`
- `pages/api/admin/content-revalidate.ts`
- `src/components/content/ContentAdminPanel.tsx`

### 社区记录与 Field Notes

- `src/content/records.ts`
- `pages/records/index.js`
- `pages/records/[slug].js`
- `themes/ignai/components/sections/FieldNotesSection.js`
- `themes/ignai/index.js`
- `themes/ignai/config.js`

### 公开站点信息与 SEO fallback

- `components/SEO.js`
- `lib/config.js`
- `lib/db/SiteDataApi.js`
- `themes/ignai/index.js`
- `pages/members/index.js`
- `pages/members/[slug].js`
- `pages/events/index.js`
- `pages/events/[slug].js`

### Roadmap / TODO

- `doc/roadmap/master-todo.md`
- `doc/roadmap/schedule.md`
- `doc/roadmap/session-todo-2026-06-03-launch-readiness.md`

### 上游贡献

- `lib/db/SiteDataApi.js`
- `lib/db/notion/eventDataSource.js`
- `lib/db/notion/memberDataSource.js`
- `lib/db/notion/getPageProperties.js`

### 已知未归属本轮的脏工作区

- `public/rss.xml`
- `doc/contribution/`
- `public/copyweb-demos/`
- `doc/design/成员资料上传与前端对标方案-2026-06-03.md`

## 本轮判断

外观已经接近可展示状态，但运营闭环还没有完成。当前最优先不是继续大改视觉，而是先让成员资料上传、Notion 回写、活动发布源和生产构建稳定性形成闭环。
