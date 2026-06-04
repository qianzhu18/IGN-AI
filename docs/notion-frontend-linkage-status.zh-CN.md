# IGNAI Notion 与前台关联现状

记录日期：2026-06-04

## 1. 已经打通

### 文章

- Notion `type=Post`
- 前台：文章详情、归档、分类、标签、搜索
- 状态：沿用 NotionNext 主链路

### 成员

- Notion `type=Member`
- 前台：`/members`、`/members/[slug]`、首页成员区块
- 加入表单：`/join` 可上传头像并创建 Notion Member 草稿
- 展示开关：由 Notion `status` 控制，`Published` 展示，`Invisible` / Draft 隐藏
- 头像：Cloudflare R2 图床 URL 写入 Notion `avatar`，同时可作为页面 icon

### 活动

- Notion `type=Event`
- 前台：`/events`、`/events/[slug]`、首页活动区块
- 字段入口：基础字段 + `ext` JSON
- 数据读取：除 NotionNext collection view 外，服务端会通过 Notion 官方 data_source API 补拉真实 `Event` 行，避免活动被视图过滤后前台退回静态内容
- 路由映射：活动详情页静态路径来自真实 Notion Event slug；`events/foo` 和 `foo` 会归一为 `/events/foo`
- 封面：优先读取 Notion 页面顶部 cover，`ext.cover` / `ext.coverUrl` 只作为历史兼容兜底
- 封面比例：前台活动卡片统一使用 16:9；可通过 `ext.coverPosition` 控制裁剪位置，例如 `center`、`top`、`50% 35%`
- 活动关系：`ext.kind` 用于标记 IGNAI 与活动的关系，可选 `hosted`（成员组织）、`cohosted`（联动活动）、`promoted`（协助宣发）、`participating`（成员参与）
- 活动状态：`ext.status` 推荐使用 `planning`（筹备中）、`ongoing`（进行中）、`recap`（已复盘）；继续兼容 `open` / `closed` / `finished`
- 活动时间：列表优先显示 `ext.eventDateText` / `ext.dateRange` / `ext.period`；如果没有，则显示 `event_start` + `event_end` 组成的时间段，再退回 `date`
- 发布时间：Notion `date` 可以继续作为发布 / 收录日期使用；活动真实发生时间优先放在 `ext.eventDateText`，或用 `event_start` + `event_end`
- 外部活动：如果 Notion `slug` 填写 `https://...`，前台会把它识别为外部活动入口，列表 / 首页点击直接打开外部 URL
- 外部活动默认关系：如果有外部入口但没有填写 `ext.kind`，前台默认显示为 `participating`（成员参与），避免误标为“成员组织”
- OPC 示例 `ext`：

```json
{
  "status": "ongoing",
  "kind": "promoted",
  "eventDateText": "2026 / 06 / 04 起，投票与参与进行中",
  "coverPosition": "50% 42%"
}
```

- 报名：活动详情读取 `registrationUrl` / `registrationQrImage`
- 发布同步：管理后台可手动刷新首页、活动列表和活动详情缓存
- 离线兜底：`src/content/events.ts` 只保留当前 Notion 里已存在的真实活动种子，不再放虚构 mock 活动

### 导航

- Notion `type=Menu` / `type=SubMenu`
- 当前上线策略：Header 默认使用 `themes/ignai/config.js` 的本地导航
- 原因：当前 Notion 里仍有 NotionNext 模板默认 Menu，如 `友链`、`什么是洋来`、`what`、`创始人`
- 后续开启：清理 Notion Menu 后，将 `IGNAI_NAV_USE_NOTION_MENU` 设为 true，即可让 Header 读取 Notion customMenu
- 友链准备：`友链` / `友情链接` / `Link` 不再被标题过滤；清理模板菜单并开启开关后，可作为真实 Menu 接入

## 2. 已有前台，但还不是 Notion 主源

### 社区记录

- 当前前台：`/records`、`/records/[slug]`、首页 Field Notes
- 当前数据源：`src/content/records.ts`
- 后续建议：迁移为 Notion `type=Record` 或继续复用 Post + category/tag，取决于是否需要独立字段

## 3. 仍需上线前关注

- Vercel / 干净远端构建环境需要复验
- Notion 生成成员清理：`yarn notion:members:cleanup` 只做 dry-run；确认后再运行 `yarn notion:members:cleanup:apply` 把生成成员改为 `Invisible`
- Join 提交仍缺 Notion 写入限速、失败重试、幂等去重
- 图床资产需要记录 object key，并准备 R2 / OSS 迁移脚本
- SEO 仍需检查 sitemap、RSS、正式 OG 图和结构化数据
- 页面 data payload 仍偏大，生产可上线但后续要继续压缩
