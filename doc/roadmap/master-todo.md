# IGNAI 社区官网总 TO DO

记录日期：2026-05-11
最近校准：2026-06-04
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
- [ ] 文章、活动、成员之间的关系模型梳理
- [ ] 内容分流导航更清晰
- [ ] 组织表达层增强

## C. 设计与体验（进行中）
- [x] 移动端基础适配（Hero 隐藏视觉面板、Header 缩小、scatter overflow、活动卡片高度）
- [x] Hero 区域改为 Notion 驱动（`resolveSection` 模式已就位）
- [x] 字体加载修复（Cormorant Garamond 已添加到 font.config.js）
- [ ] 首页 Hero / Header / CTA 品牌一致性继续打磨
- [ ] 首页后续区块完整性与显隐节奏复查（避免首屏之后出现“页面不完整”的感知）
- [ ] 成员目录页视觉再打磨
- [ ] 成员详情页层级再打磨
- [ ] 首页成员区块表达再增强
- [ ] 图片与加载体验优化
- [ ] Footer 改为 IGNAI 暗色主题（当前使用默认浅色样式）

## D. 工程与验证
- [ ] Member 相关测试补齐
- [ ] 关键页面 lint / build 验证常态化
- [ ] 逐步清理与当前主线相关的类型债
- [x] 收束已合并 AI worktree / 分支残留并统一主分支说明
- [x] 建立每次 session 的结果记录机制
- [x] 公开站点信息优先使用 IGNAI 本地配置，避免 NotionNext 默认 title / description / link 进入前台
- [x] SEO canonical / OG fallback 避免 `/undefined`

## E. 上游贡献 ✅ 核心 PR 已落地
- [x] 整理 `Member` 支持的最小通用 diff
- [x] 整理对应 issue / PR 叙事（#4035 → #4113）
- [x] 拆第一版 upstream PR（#4113 已合并，2026-05-27）
- [x] 建立组织者 issue 修复与上游协作 playbook
- [ ] 持续记录开源贡献素材
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
- [ ] Join 高并发保护：Notion 写入限速、失败重试、幂等去重
- [ ] 图床资产治理：记录对象 key、准备 R2 / OSS 迁移脚本

## G. 生产上线（新增 — 当前最优先）
- [ ] Vercel 部署恢复正常
- [x] 成员详情页构建期全量预渲染收敛，降低 Notion 429 风险
- [ ] Notion 内容填充完成
- [ ] SEO 优化（sitemap、RSS、正式 OG 图、结构化数据）
- [ ] 域名绑定（ignai.community）
- [ ] 国内访问优化
- [ ] 上线检查清单通过

## 结论

```text
只要本文件中仍有未完成项，AGENTS.md 就应默认把本项目视为”长期持续优化中”，而不是”已经完成”。
当前最紧急：G 生产上线 > C 设计体验 > B 内容系统 > E 上游贡献
```
