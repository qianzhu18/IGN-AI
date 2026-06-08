# IGNAI 社区官网总 TO DO

记录日期：2026-05-11
最近校准：2026-06-09
说明：这是总 TO DO。只要这里还有未完成项，就代表项目仍处于持续优化阶段。

## A. Member 体系 ✅ 基本完成
- [x] 支持 `Member` 作为 page type
- [x] 暴露 `allMembers`
- [x] 建立 `/members`
- [x] 建立 `/members/[slug]`
- [x] 首页成员区块接入真实数据
- [x] 统一 Member 字段契约
- [x] 作者链接到 Member
- [x] Member 详情页展示相关文章
- [x] member filtering / ordering tests
- [ ] featured members 进一步增强（角色分组、组织表达）

## B. 社区内容系统（进行中）
- [x] 活动详情页结构定制（`pages/events/` 已就位）
- [x] Event 类型字段基本收敛
- [x] 活动发布主源收束为 Notion Event
- [x] 首页活动区块、活动列表、活动详情共用 Event 规范化契约
- [x] 活动详情页支持 Notion Event 报名链接 / 报名二维码展示
- [x] 后台支持 Notion 活动发布后手动刷新前台缓存
- [x] 活动通过 Notion 官方 data_source API 补拉真实 `Event` 行，详情页路径映射到具体 Event slug
- [x] Event 支持成员组织 / 联动 / 宣发 / 参与关系、外部活动入口和 16:9 封面裁剪
- [x] Event 支持 Notion 管理 `planning` / `ongoing` / `recap` 状态与活动时间段展示
- [x] 社区记录 `/records` 与 `/records/[slug]` 前台入口补齐
- [x] 首页 Field Notes 区块接入社区记录
- [x] Post 详情页展示关联 Member / Event 的首轮使用闭环
- [x] 首页文章区与 Archive / Category / Tag / Search 文章集合页改为 IGNAI 卡片排布
- [ ] 文章、活动、成员之间的关系模型梳理
- [ ] 内容分流导航更清晰
- [ ] 组织表达层增强

## C. 设计与体验（进行中）
- [x] 移动端基础适配（Hero 隐藏视觉面板、Header 缩小、scatter overflow、活动卡片高度）
- [x] Hero 区域改为 Notion 驱动（`resolveSection` 模式已就位）
- [x] 字体加载修复（Cormorant Garamond 已添加到 font.config.js）
- [x] 首页 Hero / Header / CTA 品牌一致性首轮打磨（明暗主题切换 + 美术资料库接入 + Header/Hero/Footer 变量化）
- [ ] 首页 Hero / Header / CTA 品牌一致性后续细节继续打磨
- [ ] 首页后续区块完整性与显隐节奏复查（避免首屏之后出现“页面不完整”的感知）
- [ ] 成员目录页视觉再打磨
- [ ] 成员详情页层级再打磨
- [ ] 首页成员区块表达再增强
- [ ] 图片与加载体验优化
- [x] Footer 改为 IGNAI 明暗主题变量样式
- [ ] 二级社区页面（members/events/records/about）明暗主题一致性复查

## D. 工程与验证
- [ ] Member 相关测试补齐
- [ ] 关键页面 lint / build 验证常态化
- [ ] 逐步清理与当前主线相关的类型债
- [x] 首页 / 成员 / 活动列表 pageProps 瘦身，并收敛 Header 与成员列表批量 prefetch
- [x] 点击跳转客户端性能优化：关闭全站 Lenis，首页专属动画不再挂到子页面，背景 canvas 降频，成员散点减少 motion 节点
- [x] 收束已合并 AI worktree / 分支残留并统一主分支说明
- [x] 建立每次 session 的结果记录机制
- [x] 公开站点信息优先使用 IGNAI 本地配置，避免 NotionNext 默认 title / description / link 进入前台
- [x] SEO canonical / OG fallback 避免 `/undefined`

## E. 上游贡献 ✅ 核心 PR 已落地
- [x] 整理 `Member` 支持的最小通用 diff
- [x] 整理对应 issue / PR 叙事（#4035 → #4113）
- [x] 拆第一版 upstream PR（#4113 已合并，2026-05-27）
- [x] 建立组织者 issue 修复与上游协作 playbook
- [x] 创建第二批数据层 upstream PR（#4169：Event 官方 data source API 补拉）
- [x] 梳理社区基础设施 PR Stack、四周日程和面试 / 简历叙事
- [x] 创建架构型 upstream PR（#4170：Content Type Registry）
- [ ] 持续记录开源贡献素材
- [ ] 按 PR Stack 继续拆 Typed Collection Helpers
- [ ] 下一步：ignai 主题作为社区站示例贡献

## F. 长期运营支持
- [ ] 活动和成员关系打通
- [ ] 多作者能力准备
- [ ] 组织页 / 团队页能力
- [ ] 后续后台与运营能力预留

## F2. 成员资料上传与运营闭环（新增 — P0）
- [x] 确认 OSS / S3 兼容图床配置可用于官网服务端
- [x] 实现头像上传、压缩、公开 URL 返回
- [x] 管理员可将头像 URL 回写 Notion `avatar`
- [x] 管理员可更新 `bio` / `role` / `website` / social fields
- [x] 管理后台接入成员选择、头像预览、上传与保存表单
- [x] 公开 Join 表单支持直接选择并上传头像 / 个人形象照
- [x] 支持按成员列出最近 300 张历史头像并切换当前头像
- [x] Notion 更新后触发 `/members` 与成员详情页重验证
- [x] 前端成员数据出口包含 `website` 与 social fields
- [x] Join 申请进入 Notion 草稿后，通过 Notion `status` 控制隐藏 / 展示
- [x] 不再单独实现成员审批后台，Notion `Published` / `Invisible` 作为发布开关
- [x] 完成头像上传 API 并发烟测：12 路并发上传至 Cloudflare R2 全部成功
- [x] **P0 / 9.6** Join 高并发保护：Notion 写入限速、失败重试、幂等去重，目标支撑 200+ 社区成员集中填写
- [ ] 图床资产治理：记录对象 key、准备 R2 / OSS 迁移脚本

## G. 生产上线（新增 — 当前最优先）
- [ ] **P0 / 10.0** Vercel 部署恢复正常：避免 Notion 拉取超时后生成空站或坏 RSS
- [x] 成员详情页构建期全量预渲染收敛，降低 Notion 429 风险
- [x] 本地 `yarn build` 通过，生产构建阻断问题本地已解除
- [x] Notion 生成成员清理 dry-run 工具就绪（默认不改数据，确认后可批量改为 `Invisible`）
- [x] **P0 / 9.9** 成员 / 活动 Published 后刷新链路修复：核心页面直接补拉官方 Notion data source，ISR 上限收敛到 60 秒，手动刷新路径覆盖 `/members` / `/events` / `/records`
- [ ] **P0 / 9.8** Notion 内容填充完成：`/members` 至少展示真实 Published 成员，避免成员目录为空
- [x] **P0 / 9.5** SEO 基础输出修复：`robots.txt`、`sitemap.xml`、RSS、canonical 不出现 `undefined`，并收录成员 / 活动 / 记录 / 加入 / 关于页
- [x] **P0 / 9.2** 公开危险接口收口：`/api/cache` 必须鉴权或关闭公开访问
- [ ] **P0 / 9.0** 生产环境变量核对：`OPS_ACCESS_PASSWORD`、图床、Join 数据落点、正式域名、Notion Token
- [ ] **P1 / 8.2** 域名绑定（ignai.community）和 Vercel 环境中的 `NEXT_PUBLIC_LINK` 对齐
- [ ] 国内访问优化
- [ ] **P1 / 8.0** 上线检查清单通过：构建、核心页面、Join 提交、后台访问、SEO 输出、移动端 smoke
- [ ] **P1 / 8.0** Vercel 新部署完成后线上 smoke：确认 `/members` 显示 3 位 Published 成员并包含「许全均」

## H. QA 发现问题池（2026-06-06 新增）
- [ ] **P0 / 10.0** 修复 Notion 构建超时后的错误降级，避免 `allPages` 空值继续生成坏页面
- [x] **P0 / 9.8** 恢复 `/members` 真实成员数据展示，并清理 QA 测试 / 生成成员数据
- [ ] **P0 / 9.7** Join 生产级持久化保护：把限流 / 幂等 / Notion 写入队列从单实例内存升级为 Supabase / Redis / Vercel KV 等跨 Serverless 实例共享机制
- [x] **P0 / 9.5** 修复 RSS 生成 `undefined`，避免 `public/rss.xml` 被坏内容覆盖
- [x] **P0 / 9.4** 修复 `robots.txt` 中 `Host: undefined`、`Sitemap: undefined/sitemap.xml`
- [x] **P0 / 9.35** 删除 `robots.txt` 中对 Google 无效的 `Host` 指令，仅保留标准 Sitemap
- [x] **P0 / 9.3** 修复 sitemap 缺核心社区页面
- [x] **P0 / 9.2** `/api/cache` 加运营鉴权，禁止匿名 GET 清缓存
- [x] **P0 / 9.0** Join 表单服务端限速、重复提交识别、Notion 失败后可追踪本地/数据库兜底
- [x] **P1 / 8.4** 修复核心社区页面 canonical 全部指向根域名的问题
- [x] **P1 / 8.0** 清理 `.worktrees` 对 Jest 的干扰，让上线前测试结果可信
- [ ] **P1 / 7.8** 修复 `yarn lint` 中与上线主线相关的 error
- [ ] **P2 / 6.5** 修复 `<link rel=preload> has an invalid href value` 控制台警告
- [ ] **P2 / 6.0** 更新 Browserslist / caniuse-lite
- [ ] **P2 / 5.5** 评估是否保留前台 HTML 中的 `NotionNext` generator 标记

## 结论

```text
只要本文件中仍有未完成项，AGENTS.md 就应默认把本项目视为”长期持续优化中”，而不是”已经完成”。
当前最紧急：G 生产上线 > C 设计体验 > B 内容系统 > E 上游贡献
```
