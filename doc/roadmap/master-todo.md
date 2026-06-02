# IGNAI 社区官网总 TO DO

记录日期：2026-05-11
最近校准：2026-05-27
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

## G. 生产上线（新增 — 当前最优先）
- [ ] Vercel 部署恢复正常
- [ ] Notion 内容填充完成
- [ ] SEO 优化（sitemap、OG 图、结构化数据）
- [ ] 域名绑定（ignai.community）
- [ ] 国内访问优化
- [ ] 上线检查清单通过

## 结论

```text
只要本文件中仍有未完成项，AGENTS.md 就应默认把本项目视为”长期持续优化中”，而不是”已经完成”。
当前最紧急：G 生产上线 > C 设计体验 > B 内容系统 > E 上游贡献
```
