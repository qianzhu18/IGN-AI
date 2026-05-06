# IGNAI v2.0.0 开发路线图

> 架构：NotionNext 二开（heo 暗色主题）
> 分支：`notionnext-v2`
> 最后更新：2026-05-06
> 旧版存档：`v1.0.0` tag（Sanity + Supabase 自建架构）

---

## 当前状态

v2.0.0 架构已完成基础搭建：
- NotionNext 源码已 clone 到项目
- `blog.config.js` 已适配 IGNAI 品牌（heo 主题、暗色模式、中文）
- `doc/` 目录完整保留（架构文档、设计规范、需求文档）
- 品牌资产已保留（`public/brand/`, `public/contact/`）

**当前卡点**：需要创建 IGNAI 的 Notion Database 并配置 `NOTION_PAGE_ID`，否则网站无法显示内容。

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
  - 在 Vercel 创建新项目，指向 `notionnext-v2` 分支
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

## Phase 3：外观定制（2-3 天）

> 目标：让网站看起来是 IGNAI，不是 NotionNext 默认

- [ ] **P3-01** heo 主题品牌色调整
  - 主色调：Heat #FF7A18（IGNAI 品牌橙）
  - 辅助色：Signal #5DA9FF
  - 背景：#07080C（IGNAI 暗色）
  - 文件：`themes/heo/config.js` 和 `themes/heo/style.js`
- [ ] **P3-02** 首页 Hero 区域定制
  - 替换默认 banner 为 IGNAI 社区主题图
  - 修改欢迎语和社区简介
  - 参考 `doc/design/design-详细设计.md` 的视觉规范
- [ ] **P3-03** 导航栏定制
  - 菜单项：首页、活动、记录、成员、加入
  - Logo → IGNAI brand lockup
  - 参考 `doc/design/design-开发文档.md` 的导航规范
- [ ] **P3-04** 字体适配
  - 主字体：Noto Sans SC
  - 标题字体：按 IGNAI 品牌规范
  - 文件：`conf/font.config.js`
- [ ] **P3-05** 页脚定制
  - IGNAI 社区信息
  - 社交链接（微信公众号、GitHub）
  - 备案信息（如有）

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
2. **主题修改在 `themes/heo/` 目录下**，不要改 `components/` 的共享组件
3. **配置修改优先用环境变量**，其次改 `blog.config.js`，最后改 `conf/` 下的分配置
4. **每次重大修改后运行 `yarn build`** 验证构建通过
5. **Notion Database 的表头名** 默认是英文（title, status, type...），可以在 `conf/notion.config.js` 里映射中文列名
