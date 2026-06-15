# IGNAI 社区官网排期

记录日期：2026-05-11
最近校准：2026-06-13
说明：这是一个滚动排期，会随着开发实时更新。

## 1. 排期方法

用 4 个时间层来管理：

- 本周
- 近 2 周
- 近 4 周
- 长期

## 2. 本周目标（05-27 ~ 06-02）

### 本周主目标
从”功能完成”推进到”可公开访问的社区站”。

### 本周任务
- [ ] **紧急** 排查 Vercel 部署超时问题
- [ ] **紧急** Notion 内容填充（确保成员、活动、文章数据充足）
- [ ] Hero 区域改为 Notion 驱动
- [ ] 移动端适配检查
- [ ] 首页各区块数据渲染验证

## 3. 近 2 周目标（06-02 ~ 06-16）

### 目标
打磨前端体验，达到可对外展示的品质。

### 任务
- [x] **P0** 成员头像上传、OSS URL、Notion `avatar` 回写闭环代码落地
- [x] **P0** 成员头像历史库与前台 revalidate 闭环代码落地
- [x] **P0** 官网环境实配 OSS / S3 图床并完成真实头像上传复测
- [x] **P0** 成员详情页构建期全量预渲染收敛，降低 Notion 429 风险
- [x] **P0** 活动发布数据源确认：收束为 Notion Event
- [x] **P0** 活动首页、列表页、详情页读取同一份 Notion Event 契约
- [x] **P0** 活动详情页支持 Notion 报名链接 / 报名二维码展示
- [x] **P0** 活动官方 API 补数与真实 Event slug 路由映射完成
- [x] **P0** 活动后台支持 Notion 发布后刷新首页、活动列表和活动详情缓存
- [x] **P0** 活动支持 Notion `ext.status=planning/ongoing/recap` 与 `ext.eventDateText` 时间段展示
- [x] **P0** 社区记录 `/records`、`/records/[slug]` 与首页 Field Notes 前台入口补齐
- [x] **P0** 头像上传 API 12 路并发烟测通过，确认 R2 上传链路可用
- [x] **P0** 本地 `yarn build` 完整通过，日报入口已从桌面 / 移动导航移除
- [x] **P0** Notion 生成成员清理 dry-run 工具完成，等待确认后批量隐藏测试成员
- [x] **P0** 点击跳转性能优化：裁剪首页 / 成员 / 活动 pageProps，并关闭批量成员链接自动 prefetch
- [x] **P0** 点击跳转流畅度优化：移除全站 Lenis RAF，首页动态背景只在首页运行，canvas 降频并降低成员散点渲染负载
- [x] **P1** 公开站点 title、description、link、canonical fallback 收束为 IGNAI
- [x] **P1** 首页明暗主题切换、美术资料库接入、Header / Hero / Footer 品牌一致性首轮完成
- [x] **P1** Post 详情页接入 Member / Event 关系展示，补齐文章内容的社区上下文使用闭环
- [x] **P1** 首页文章区与 Archive / Category / Tag / Search 文章集合页完成 IGNAI 卡片排布，并保留首页薄数据出口
- [ ] Join 高并发保护与图床资产迁移预案
- [ ] featured members / 角色分组展示增强
- [ ] 成员目录页视觉打磨
- [ ] 首页成员区块从卡片升级为组织表达
- [ ] 活动与成员关系预埋
- [ ] 评论系统启用（Giscus 或 Waline）
- [ ] 官网内容定位校准：明确官网用于证明开源经历与社区经历，官号用于传播型长文
- [ ] 评论 / 讨论入口决策：文章、社区记录、活动详情是否启用 Giscus 或 Waline
- [ ] 高级视觉参考调研：3D / WebGL / 视频 / 互动叙事，基于现有 IGNAI 主题增强而非重构
- [ ] IGNAI 现有品牌资产增强计划：logo 点火处理、torch ignition loop、Proof Engine Hero、活动素材墙和品牌视频短循环
- [ ] 活动记录沉淀机制：群友评论、活动照片、作品简介进入官网前的筛选 / 上传 / 审核流程
- [x] 官网内容资产层首版：官方介绍、合作方案文字版、PPT 母稿结构、社区运营缺口清单已整理
- [ ] 官网内容素材持续填充：后续上传文字和图片先归档到内容资产层，再筛选进入公开页面
- [x] 当前生产域（yanglaishe.cn）与站点默认 URL / SEO 输出对齐
- [ ] 域名绑定（ignai.community）
- [x] 梳理 NotionNext 社区基础设施 PR Stack 与面试 / 简历叙事
- [x] 拆架构型上游 PR：Content Type Registry（#4170）
- [x] 重新拆更小的上游 issue 修复 PR：HEO_INFOCARD_GREETINGS 配置解析（#4187）
- [x] 重新拆 Typed Collection Helpers 上游 PR（#4188）
- [x] 拆社区站数据库模板文档 PR（#4189）
- [ ] 跟进 #4187 / #4188 / #4189 CI 与 maintainer review

## 4. 近 4 周目标（06-16 ~ 07-14）

### 目标
生产级品质上线 + 持续上游贡献。

### 任务
- [ ] SEO 优化（sitemap、RSS、正式 OG 图、结构化数据）
- [ ] 轻量生产观测栈上线（PostHog Cloud + Clarity + Umami + UptimeRobot + Sentry / PostHog Error Tracking）
- [ ] 国内访问优化（Vercel CNAME 或 Docker 部署）
- [ ] 性能优化（图片压缩、ISR 缓存调优）
- [ ] 高级视觉门面第一版原型：Hero / 活动 / Field Notes 选一个入口做 3D 或视频互动层
- [ ] Proof Engine Hero 第一版：基于真实 Members / Events / Records / Articles / PR 节点，而不是纯装饰 3D
- [ ] IGNAI motion pack 第一版：logo 点火、torch pulse、扫描光、移动端静态 fallback
- [ ] 品牌视频短循环素材预案：活动现场、GitHub PR、成员作品、官号封面、隐私处理规则
- [ ] 对外材料第一版：官方介绍 PPT、合作方案 PPT、赛事 PPT、自我介绍 PPT 基于内容资产层生成可展示版本
- [ ] 社区证明链路上线：开源 PR、活动记录、成员项目、官号文章互链
- [ ] 上线检查清单通过
- [ ] ignai 主题作为社区站示例贡献上游
- [ ] Member 页面组件贡献上游
- [ ] 完成社区基础设施 PR Stack 第一阶段：类型注册、集合 helper、pageProps 瘦身（#4188 已开，继续跟进）
- [ ] 形成一篇可对外发布的项目 case study：从博客到 AI 社区基础设施

## 5. 长期目标

- [ ] 社区成员体系持续完善
- [ ] 内容系统分层清晰化
- [ ] 后台 / 运营支持能力增强
- [ ] 上游贡献形成连续记录
- [ ] 让 IGNAI 成为”真实产品 + 开源贡献”双线案例
- [ ] 让官网成为可公开证明“真实开源经历 + 真实社区经历”的长期档案，而不是单纯内容站
