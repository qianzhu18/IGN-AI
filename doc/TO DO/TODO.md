# IGNAI v2.0.0 开发路线图

> 架构：NotionNext 二开（ignai 自定义主题）
> 状态：**活跃开发中** — 基础功能已完成，进入打磨与上线阶段
> 最近校准：2026-05-27
> 旧版存档：`v1.0.0` tag（Sanity + Supabase 自建架构）
> 上游贡献：8 个已合并 PR（含 #4113 架构级 Member/Event 数据管道）

---

## 当前状态总览

| Phase | 状态 | 完成度 |
|-------|------|--------|
| P1 基础搭建 | **已完成** | 100% |
| P2 内容迁移 | **进行中** | 70%（数据管道通，内容待填充） |
| P3 外观定制 | **已完成** | 90%（剩 P3-09/10/11 微调） |
| P4 功能开发 | **进行中** | 70%（members/events/join 已有，缺评论系统） |
| P5 生产就绪 | **未开始** | 0% |

**当前重点**：Vercel 部署恢复 → 前端页面打磨 → 内容填充 → 生产上线

---

## 当前紧急任务（2026-05-27 ~ 06-03）

按优先级排序，完成一项再做下一项：

- [ ] **紧急-01** 排查 Vercel 部署超时（ign-ai.vercel.app 无法访问）
  - 检查 Vercel dashboard 构建日志
  - 确认环境变量 `NOTION_PAGE_ID`、`NOTION_API_TOKEN`、`NEXT_PUBLIC_THEME=ignai`
  - 检查域名 DNS 解析
- [x] **紧急-02** Hero 区域改为 Notion 驱动 ✅
- [x] **紧急-03** 首页成员区块增强 ✅
  - 200+ 成员散点布局、golden angle、hover/tap 预览、featured 光晕
  - API 分页修复、数据精简、缓存启用
- [x] **紧急-04** 移动端适配检查 ✅
- [x] **紧急-05** Notion 内容填充 ✅ 200 条测试成员已创建

---

## UI 打磨冲刺（2026-05-28 ~ 06-04）

对标 Linear / Vercel / Latent Space 的暗色调品质。逐项推进：

### 视觉细节
- [x] **UI-01** 字体加载优化 ✅
  - 4 个 Google Fonts URL 合并为 1 个
  - 去掉未使用的 Bitter、Noto Serif SC
- [ ] **UI-02** 首页各区块间距统一
  - 对照 v1.0.0 设计稿微调 section 间距（96px/120px）
  - 移动端间距缩小（48px/64px）
- [x] **UI-03** 暗色卡片 hover 状态打磨 ✅ 已统一
  - ignai-unified-card 统一 hover 系统（border、shadow、translateY）
  - 活动卡片、角色卡片均使用 ignai-unified-card 基类

### 首页区块
- [ ] **UI-04** Hero 区域微调
  - 信号卡片排版优化
  - CTA 按钮 hover 效果
- [ ] **UI-05** 成员展示区精调
  - 散点布局在 200 人下的视觉密度
  - 预览卡片信息层次优化
- [x] **UI-06** 活动区块优化 ✅
  - 活动卡片信息密度合理（日期、地点、标签、摘要）
  - 空状态处理（无活动时 return null，不渲染空区块）

### 成员系统
- [x] **UI-07** 成员目录页改版 ✅ 编号手风琴分组
  - [ ] 搜索/筛选功能（后续迭代）
- [ ] **UI-08** 成员详情页打磨
  - 社交链接展示优化
  - 移动端布局微调

### 移动端
- [x] **UI-09** 导航栏移动端体验 ✅
  - 汉堡按钮 → X 动画（CSS transform + transition）
  - 菜单面板 scale + opacity 动画过渡
  - 菜单项间距优化（圆角 hover、分隔线、层级缩进）
  - aria-label / aria-expanded 无障碍属性
- [x] **UI-10** Footer 改为 IGNAI 暗色主题 ✅
- [ ] **UI-11** 全局滚动性能检查

---

## 体验优化 Backlog（持续迭代）

### 成员展示（亮点功能，需重点打磨）
- [x] **成员-01** 成成员列表百人级扩展方案 ✅ 基础修复完成
  - [x] AvatarRing viewport 自适应（移动端 scatterC=18, 桌面 26）
  - [x] 移动端限制 40 人，桌面 100 人，超出显示 "+N more"
  - [x] 提取共享 getMemberAvatar() 消除三处重复
  - [ ] 成员目录页仍无分页/搜索（后续迭代）
- [x] **成员-02** 成员目录页视觉打磨 ✅ 基础完成
  - [x] 分页加载（每页 20 人，Load more 按钮）
  - [x] 成员计数显示
  - [x] 移动端适配（头像/文字/间距响应式）
  - [x] Quote 在移动端隐藏（节省空间）
  - [ ] 搜索/筛选功能（后续迭代）
- [x] **成员-03** 成员详情页层级优化 ✅ 基础完成
  - [x] 移动端头像缩小（80px vs 96px）
  - [x] 返回链接增大点击区域
  - [x] 移动端 padding 优化
- [x] **成员-04** 移动端成员卡片体验 ✅ 新方案已实现
  - [x] tap 触发预览卡片（显示姓名、角色、简介、quote）
  - [x] 再次 tap 进入详情页
  - [x] ResizeObserver 自适应容器大小
  - [x] CSS transform scale 响应式定位
  - [x] featured 成员头像更大 + 光晕效果
  - 分支：`feat/member-avatar-showcase`

### 活动与内容系统
- [ ] **活动-01** 活动生命周期管理
  - 活动状态：未开始 → 进行中 → 已结束 → 已复盘
  - UpcomingEventsSection 只展示未结束活动
  - FieldNotesSection 只展示已结束活动
  - 需要确保状态流转正确，复盘内容关联到活动
- [ ] **活动-02** 活动与成员关系
  - 活动参与者/组织者与 Member 关联
  - 活动详情页展示相关成员
- [ ] **活动-03** 活动复盘内容模板
  - 已结束活动的复盘格式（成果、照片、反馈）
  - 与 FieldNotes 区块的数据打通

### 社区运营
- [ ] **运营-01** 内容分流导航优化
  - 文章 / 活动 / 成员 / 记录 四条线更清晰
- [ ] **运营-02** 组织表达层增强
  - 社区不只是成员列表，要有"组织感"

---

## Phase 1：基础运行 ✅ 已完成

- [x] **P1-01** 在 Notion 创建 IGNAI 主 Database
- [x] **P1-02** 配置 `.env.local`
- [x] **P1-03** 安装依赖并启动（`yarn dev` 正常）
- [x] **P1-04** 部署到 Vercel（已部署，需排查访问超时）
- [x] **P1-05** 替换品牌资产（favicon、logo 均已就位）

## Phase 2：内容迁移（进行中 — 70%）

- [x] **P2-01** 迁移活动数据（数据管道已通，Notion 数据可读取）
- [x] **P2-02** 迁移社区记录（数据管道已通）
- [x] **P2-03** 迁移社区简介和文化文案 ✅
  - Hero 通过 `resolveSection(notionConfig, 'HERO', siteContentFallback)` 支持 Notion 优先
  - WhatIs / Culture / Join 均通过 `resolveSection` 模式支持 Notion 驱动
- [ ] **P2-04** 验证所有页面（需 Vercel 部署恢复后验证线上表现）

## Phase 3：外观定制（已完成）

> 目标：让网站看起来是 IGNAI，不是 NotionNext 默认

- [x] **P3-01** ignai 自定义主题创建（基于 heo 骨架）
- [x] **P3-02** 首页 Hero 区域定制（品牌色、渐变背景、ignite field 粒子）
- [x] **P3-03** 导航栏定制（BrandLockup + IGNAI 导航）
- [x] **P3-04** 页脚定制（IGNAI 社区信息、社交链接）
- [x] **P3-05** v1.0.0 动效迁移 P0（CSS keyframes + 按钮扫光 + Reveal blur）
- [x] **P3-06** v1.0.0 动效迁移 P1（Canvas BackgroundFX + Grid + Noise + Glow）
- [x] **P3-07** v1.0.0 动效迁移 P2（滚动视差 + Join 浮动）
- [x] **P3-08** 卡片特效清理（移除多余动画效果）

### 待微调

- [ ] **P3-09** 移动端适配检查（卡片网格在小屏幕的响应式表现）
- [x] **P3-10** 字体精确匹配 ✅
  - Cormorant Garamond 已添加到 `conf/font.config.js` 的 FONT_URL 和 FONT_SERIF
  - Noto Sans SC 已在 FONT_URL 中加载
- [ ] **P3-11** 间距打磨（对照 v1.0.0 微调 padding/margin）

## Phase 4：功能二开（进行中 — 70%）

- [x] **P4-01** 多数据库配置（`NOTION_PAGE_ID` 支持多库前缀）
- [x] **P4-02** /members 成员展示页（`pages/members/index.js` + `[slug].js` 均已就位）
- [x] **P4-03** 活动详情页模板（`pages/events/index.js` + `[slug].js` 均已就位）
- [x] **P4-04** 成员登记表单（`pages/join.tsx` + `JoinApplicationForm.tsx` 已就位）
- [ ] **P4-05** 评论系统（`conf/comment.config.js` 已有脚手架，未启用任何 provider）

## Phase 5：优化与上线（1-2 天）

> 目标：生产级品质

- [ ] **P5-01** SEO 优化
  - `next-sitemap.config.js` 配置
  - Open Graph 图片
  - 结构化数据
- [ ] **P5-02** 性能优化
  - 图片压缩（WebP）
  - ISR 缓存时间调优
  - 参考 `conf/performance.config.js`
- [ ] **P5-03** 域名绑定
  - ignai.community 或 ignai.community
  - Vercel CNAME 加速：`cname-china.vercel-dns.com`
- [ ] **P5-04** 国内访问优化
  - 如果 Vercel CNAME 不够快，考虑 Docker 部署到国内 VPS
  - Dockerfile 已有，按 `DEPLOYMENT.md` 操作
- [ ] **P5-05** 上线检查清单
  - 所有页面可访问
  - 品牌资产正确
  - 移动端适配
  - 暗色模式正常
  - 内容完整

---

## 长期计划（v2.1+）

> 社区规模增长后的迭代方向

- [ ] Docker 一键部署到国内 VPS
- [ ] 成员自主编辑个人资料（需要自建 Auth 或用 Notion OAuth）
- [ ] 活动报名系统（按活动维度，而非统一入口）
- [ ] 社区数据面板（成员数、活动数、参与率）
- [ ] 多语言支持（英文版本）
- [ ] 搜索功能（Algolia 集成）

---

## 数据管理说明（v2 架构）

v2 架构下数据全部在 Notion 管理：

| 数据类型 | 存储位置 | 编辑方式 | 展示页面 |
|----------|---------|---------|---------|
| 文章/博客 | Notion 主 Database | Notion APP | /archive, /[slug] |
| 活动公告 | Notion 活动 Database（或主库 type=Notice） | Notion APP | 首页, /archive |
| 成员信息 | Notion 成员 Database | Notion APP | /members（需二开） |
| 社区简介 | Notion Page | Notion APP | 首页 Hero |
| 网站配置 | `blog.config.js` + `conf/` | 代码编辑 | 全站 |

**不需要数据库、不需要 API key、不需要后台管理系统。Notion 就是你的后端。**

---

## 注意事项

1. **包管理器用 yarn**，不用 npm（NotionNext 官方推荐）
2. **主题修改在 `themes/ignai/` 目录下**，不要改 `components/` 的共享组件
3. **配置修改优先用环境变量**，其次改 `blog.config.js`，最后改 `conf/` 下的分配置
4. **每次重大修改后运行 `yarn build`** 验证构建通过
5. **Notion Database 的表头名** 默认是英文（title, status, type...），可以在 `conf/notion.config.js` 里映射中文列名
