# IGNAI v2.0.0 开发路线图

> 架构：NotionNext 二开（ignai 自定义主题）
> 状态：历史迁移路线图（当前集成主线：`main`）
> 最近校准：2026-05-26
> 旧版存档：`v1.0.0` tag（Sanity + Supabase 自建架构）

---

## 当前状态

> 说明：本文件主要保留 v2 迁移与主题落地阶段的 checklist。当前真实执行优先级请以 `doc/ROADMAP/*` 和 `docs/member-execution-roadmap.zh-CN.md` 为准。

v2.0.0 架构已完成基础搭建 + v1.0.0 UI 动效迁移：

- [x] NotionNext 源码集成
- [x] `blog.config.js` IGNAI 品牌适配
- [x] ignai 自定义主题创建（基于 heo 骨架，复刻 v1.0.0 UI）
- [x] **动效迁移 P0**：11 个 CSS @keyframes + utility classes + CTA 扫光 + Reveal blur
- [x] **动效迁移 P1**：Canvas BackgroundFX（76/42 粒子 + 流线 + 脉冲）+ 92px 网格 + SVG 噪点 + 光晕
- [x] **动效迁移 P2**：滚动视差（WhatIs / Culture）+ Join 品牌图浮动
- [x] **卡片特效清理**：移除 presence-card / energy-card / ignai-card 多余效果
- [x] 品牌资产保留（`public/brand/`, `public/contact/`）
- [x] 设计文档完善（`doc/design/09-动效迁移设计文档`、TODO-animation-migration）

**当前重点**：Member 真实数据链路已经落地，现阶段重点转向 featured members、组织表达、Event / Member 关系预埋和 upstream diff 收束。

---

## Phase 1：基础运行（1-2 天）

> 目标：让网站能跑起来，显示 IGNAI 的内容

- [ ] **P1-01** 在 Notion 创建 IGNAI 主 Database
  - 复制 NotionNext 模板：https://tanghh.notion.site/02ab3b8678004aa69e9e415905ef32a5
  - 填入至少 3 篇测试文章（类型：Post）
  - 填入至少 1 个活动公告（类型：Notice）
- [ ] **P1-02** 配置 `.env.local`
  - 只需要一行：`NOTION_PAGE_ID=你的数据库ID`
- [ ] **P1-03** 安装依赖并启动
  - `yarn install && yarn dev`
  - 访问 `http://localhost:3000` 验证
- [ ] **P1-04** 部署到 Vercel
  - 在 Vercel 创建新项目，指向 `main` 分支
  - 配置环境变量 `NOTION_PAGE_ID`
- [ ] **P1-05** 替换品牌资产
  - favicon → IGNAI logo
  - 默认头像 → IGNAI 品牌图
  - og:image → IGNAI 社交分享图

## Phase 2：内容迁移（2-3 天）

> 目标：把 v1.0.0 的内容搬到 Notion

- [ ] **P2-01** 迁移活动数据
  - v1.0.0 中的 3 条活动（fallback 数据）→ Notion Database 行
  - 字段映射：title → 标题列, slug → slug列, date → 日期列, type → Event
- [ ] **P2-02** 迁移社区记录
  - v1.0.0 中的记录内容 → Notion Database 行
  - type 设为 Post
- [ ] **P2-03** 迁移社区简介和文化文案
  - 在 Notion 创建对应的 Page 类型内容
  - 内容参考 `doc/design/design-文字排布.md`
- [ ] **P2-04** 验证所有页面
  - 首页、文章列表、文章详情、分类、标签
  - 确认 ISR 缓存正常（60 秒更新）

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
- [ ] **P3-10** 字体精确匹配（确认 Cormorant Garamond 和 Noto Sans SC 加载正确）
- [ ] **P3-11** 间距打磨（对照 v1.0.0 微调 padding/margin）

## Phase 4：功能二开（2-3 天）

> 目标：添加社区特有的功能（超出 NotionNext 默认能力）

- [ ] **P4-01** 多数据库配置
  - `NOTION_PAGE_ID='主站ID,members:成员库ID,events:活动库ID'`
  - 在 Notion 创建独立的「成员」Database
  - 在 Notion 创建独立的「活动」Database
- [ ] **P4-02** /members 成员展示页
  - 二开一个新的页面路由：`pages/members/index.js`
  - 读取 Notion 成员 Database
  - 渲染为头像卡片网格
  - 参考 `doc/requirements/req-成员管理.md`
- [ ] **P4-03** 活动详情页模板定制
  - heo 主题默认的文章详情页改为活动风格
  - 显示：时间、地点、报名链接、议程
  - 利用 Notion 的 `ext` 字段存 JSON 扩展数据
- [ ] **P4-04** 成员登记表单
  - 方案 A：Notion Form → 直接写入成员 Database
  - 方案 B：飞书多维表格 → 定期同步到 Notion
  - 方案 C：自建表单页面 → Notion API 写入
- [ ] **P4-05** 评论系统
  - 配置 Giscus（基于 GitHub Discussions）或 Waline
  - 文件：`conf/comment.config.js`

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
