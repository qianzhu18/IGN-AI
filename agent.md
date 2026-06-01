# agent.md — AI 开发指引

> 本文件指导 Codex、Claude Code 及其他 AI 工具完成后续开发。
> 最后更新：2026-06-02 | 架构版本：v2.0.0 (NotionNext 二开)

---

## 1. 项目速览

| 项目 | 值 |
|------|-----|
| 名称 | IGNAI 社区官网 (长沙 AI 社区 — "Ignite before AGI") |
| 架构 | NotionNext v4.9.5+ (Pages Router) 二开 |
| 主题 | ignai (IGNAI 自定义，基于 heo 骨架，复刻 v1.0.0 UI) |
| 后端 | Notion（唯一后端，不需要数据库/API key） |
| 部署 | Vercel (主) / Docker (备用) |
| 包管理 | **yarn**（不要用 npm） |
| 当前分支 | `feat/member-avatar-showcase` |
| 主分支 | `main`（当前集成主线） |
| 旧版存档 | `release-1.0.0` + tag `v1.0.0`（Sanity + Supabase 自建架构） |

---

## 2. 启动与验证

```bash
# 安装依赖
yarn

# 启动开发服务器（端口 3000）
yarn dev

# 生产构建验证
yarn build

# 代码检查
yarn lint
yarn format:check
```

---

## 3. 目录结构速查

```
IGN AI 官网/
├── agent.md                # ★ 本文件 — AI 开发指引（你正在读的）
├── AGENTS.md               # 仓库级工作约束
├── AI_HANDOFF.md           # AI 切换交接文档
├── CLAUDE.md               # Claude Code 专属指引
├── blog.config.js          # 主配置 — 所有站点级设置
├── .env.local              # 环境变量
│
├── conf/                   # 分配置文件 — 按功能拆分
│   ├── comment.config.js   #   评论系统
│   ├── contact.config.js   #   社交联系方式
│   ├── font.config.js      #   字体
│   ├── image.config.js     #   图片
│   ├── notion.config.js    #   Notion 字段映射
│   ├── post.config.js      #   文章列表
│   ├── analytics.config.js #   统计分析
│   ├── animation.config.js #   动效
│   ├── performance.config.js # 性能
│   ├── plugin.config.js    #   插件（Algolia 等）
│   ├── layout-map.config.js #  路由布局映射
│   └── ...                 #   其他配置
│
├── themes/
│   ├── ignai/              # ★ 当前使用的 IGNAI 自定义主题
│   │   ├── config.js       #   主题配置（品牌文案、导航、Hero、Footer）
│   │   ├── style.js        #   主 CSS（design tokens、动画、品牌色）
│   │   ├── index.js        #   主题入口（LayoutBase, LayoutIndex 等 Section）
│   │   └── components/     #   主题组件
│   │       ├── Header.js   #     导航栏（BrandLockup + 移动端汉堡菜单）
│   │       ├── Footer.js   #     页脚（IGNAI 暗色主题）
│   │       ├── BackgroundFX.js  # Canvas 粒子背景
│   │       └── sections/   #     首页区块组件
│   │           ├── HeroSection.js
│   │           ├── WhatIsSection.js
│   │           ├── UpcomingEventsSection.js
│   │           └── MemberScatterSection.js
│   └── heo/                # 基础骨架（参考，非活跃主题）
│
├── pages/                  # 路由（Pages Router，不是 App Router）
│   ├── index.js            #   首页（getStaticProps 数据获取）
│   ├── about.tsx           #   关于页
│   ├── members/            #   成员系统
│   │   ├── index.js        #     成员目录页
│   │   └── [slug].js       #     成员详情页
│   ├── events/             #   活动系统
│   │   ├── index.js        #     活动列表页
│   │   └── [slug].js       #     活动详情页
│   ├── join.tsx            #   成员登记表单
│   ├── archive/            #   归档
│   ├── category/           #   分类
│   ├── tag/                #   标签
│   ├── search/             #   搜索
│   ├── [prefix]/           #   NotionNext 动态路由前缀
│   └── api/                #   API 路由
│
├── lib/                    # 核心逻辑
│   ├── db/
│   │   ├── SiteDataApi.js  #   ★ 主数据获取（合并 unofficial + official API）
│   │   └── notion/         #   Notion API 辅助函数
│   ├── cache/              #   ISR 缓存
│   ├── plugins/            #   插件系统
│   ├── config.js           #   配置加载
│   └── utils/              #   工具函数（robots.txt、rss、sitemap、redirect）
│
├── components/             # 跨主题共享组件
│   └── SEO.js              #   SEO Head（canonical、hreflang、OG、JSON-LD）
│
├── src/                    # v1.0.0 UI 参考（不参与构建，复刻时对照用）
│   ├── components/         #   原始 TSX 组件（sections、ui、layout、motion）
│   ├── content/            #   原始文案数据
│   └── styles/             #   原始 CSS（tokens.css、globals.css）
│
├── public/
│   ├── brand/              # ★ IGNAI 品牌资产（logo）
│   ├── contact/            # ★ 联系方式资产（二维码）
│   └── images/             # 通用图片资源
│
├── doc/                    # 文档（不参与构建）
│   ├── todo/TODO.md        #   ★ 开发路线图（主任务追踪）
│   ├── issues/ui-issues.md #   ★ 前端 UI 问题清单（待修复）
│   ├── roadmap/            #   长期规划与排期
│   ├── architecture/       #   架构文档
│   ├── design/             #   设计规范（品牌色、动效、排版）
│   ├── requirements/       #   需求文档
│   ├── dev/                #   开发指南
│   ├── issues/             #   问题追踪
│   ├── contribution/       #   贡献相关
│   └── changelog/          #   周报与变更日志
│
└── scripts/                # 工具脚本
    └── seed-members-200.js #   批量创建测试成员
```

---

## 4. 按场景读取文件

### 场景 A：首次接触项目

**必读文件（按顺序）：**

1. `agent.md` — 本文件，了解全局
2. `AGENTS.md` — 仓库工作约束
3. `AI_HANDOFF.md` — 最近一次 AI 交接记录
4. `doc/todo/TODO.md` — 当前开发路线图（主任务追踪）
5. `doc/issues/ui-issues.md` — 前端 UI 问题清单
6. `CLAUDE.md` — Claude Code 专属指引（命令、架构摘要）

---

### 场景 B：修改主题外观（颜色、字体、布局、UI 打磨）

**这是当前最活跃的场景。**

**读取顺序：**

1. `doc/issues/ui-issues.md` — 已知 UI 问题清单
2. `themes/ignai/style.js` — 主 CSS（所有样式在这里修改）
3. `themes/ignai/config.js` — 主题配置（品牌文案、导航、Hero）
4. `themes/ignai/index.js` — 主题入口（LayoutBase, LayoutIndex, Section 组件）
5. `themes/ignai/components/` — 主题组件（Header、Footer、BackgroundFX 等）
6. `src/` — v1.0.0 原始 UI 参考（设计稿源头，复刻时对照）

**IGNAI 品牌规范：**

| Token | 值 | 用途 |
|-------|-----|------|
| Heat | `#FF7A18` | 主色（强调色） |
| Signal | `#5DA9FF` | 辅色（信息色） |
| Dark BG | `#07080C` | 页面背景 |
| Dark Card | `#0D0E14` | 卡片表面 |
| Font | Noto Sans SC | 正文字体 |

**修改原则：**
- **只改 `themes/ignai/` 下的文件**，不动 `components/` 共享组件
- CSS 统一在 `themes/ignai/style.js` 注入
- 组件级修改在 `themes/ignai/components/` 下
- 参考 v1.0.0 时对照 `src/` 目录

---

### 场景 C：修改站点配置

| 配置目标 | 文件 |
|---------|------|
| 站点名称/简介/关键词/语言 | `blog.config.js` |
| 社交联系方式 | `conf/contact.config.js` |
| 评论系统 | `conf/comment.config.js` |
| SEO/站点地图 | `next-sitemap.config.js` |
| Notion 字段映射 | `conf/notion.config.js` |
| 文章列表样式 | `conf/post.config.js` |
| 统计分析 | `conf/analytics.config.js` |
| 性能调优 | `conf/performance.config.js` |
| 搜索 (Algolia) | `conf/plugin.config.js` |
| 字体 | `conf/font.config.js` |

**环境变量（`.env.local`）：**

```bash
NOTION_PAGE_ID=主库ID,members:成员库ID,events:活动库ID
NOTION_API_TOKEN=ntn_xxx           # 成员数据管道需要
NOTION_MEMBERS_DATA_SOURCE_ID=xxx  # 成员数据管道需要
```

---

### 场景 D：添加新页面或功能

1. 在 `pages/` 下创建路由文件（Pages Router，不是 App Router）
2. 在 `lib/db/SiteDataApi.js` 中添加数据获取函数
3. 在 `themes/ignai/components/` 中创建页面组件
4. 如果需要新数据库，在 `NOTION_PAGE_ID` 中添加前缀
5. 更新 `doc/todo/TODO.md` 中对应任务状态

---

### 场景 E：调试 / 排查问题

1. `conf/dev.config.js` — 调试开关
2. `lib/db/SiteDataApi.js` — 数据获取（Notion API）
3. `lib/cache/` — ISR 缓存
4. `middleware.ts` — Next.js 中间件
5. `next.config.js` — Next.js 配置

**常见问题：**
- 内容不更新 → 检查 `NEXT_REVALIDATE_SECOND`（默认 60 秒）
- Notion 连接失败 → 检查 `NOTION_PAGE_ID`
- 样式不生效 → 确认在 `themes/ignai/style.js` 中修改
- 页面加载慢 → 检查 ISR 缓存是否启用（`ENABLE_CACHE=true`）

---

## 5. 当前开发状态

### 已完成（截至 2026-05-29）

| Phase | 完成度 | 备注 |
|-------|--------|------|
| P1 基础搭建 | 100% | NotionNext 集成、品牌适配 |
| P2 内容迁移 | 70% | 数据管道通，内容待填充 |
| P3 外观定制 | 90% | 剩 P3-11 间距打磨 |
| P4 功能开发 | 70% | members/events/join 已有，缺评论系统 |
| P5 生产就绪 | 30% | SEO 完成，性能部分完成 |

**最近完成的工作：**
- 首页成员散点布局（200+ 人 golden angle）
- 成员目录页编号手风琴分组 + 搜索/筛选
- 成员详情页社交链接图标 + featured 光晕
- 移动端全面适配（P3-09）
- 首页 Hero / 移动端导航品牌 UI 收束（桌面首屏品牌层级增强、移动端内容重排、蓝色控件清理）
- SEO 优化（P5-01）：canonical、hreflang、OG、JSON-LD
- 首页数据精简（allMembers 104KB → 46KB）

### 当前待处理

- **前端 UI 打磨** — 见 `doc/issues/ui-issues.md`
- P3-11 间距打磨
- P4-05 评论系统
- P5-02 性能优化（图片压缩、ISR 调优）
- P5-03 域名绑定
- P5-04 国内访问优化
- P5-05 上线检查清单

---

## 6. 关键约束

1. **包管理器用 yarn**，不用 npm
2. **主题修改只在 `themes/ignai/`**，不动共享组件或其他主题
3. **`src/` 是 v1.0.0 的 UI 参考**，不参与构建
4. **配置优先级**：环境变量 > `blog.config.js` > `conf/` 分配置
5. **每次重大修改后运行 `yarn build`** 验证构建
6. **Pages Router** — 不是 App Router，不要用 `app/` 目录
7. **v1.0.0 代码已存档** — 不要修改 `v1.0.0` tag 的内容
8. **禁止截图验证 UI** — 改用 curl 测量页面大小、检查 HTML 内容、或让开发人员自行验证

---

## 7. Git 工作流

### 分支约定

| 分支 | 用途 |
|------|------|
| `main` | 主集成分支 |
| `feat/member-avatar-showcase` | 当前活跃开发分支 |
| `feature/ignai-motion-system` | 历史迁移分支（已归档） |

### Commit 格式

```
feat(scope): 描述     # 新功能
fix(scope): 描述      # 修复
docs(scope): 描述     # 文档
perf(scope): 描述     # 性能优化
refactor(scope): 描述 # 重构
```

scope 可选：`P1-01`、`P3-09`、`members`、`SEO`、`UI` 等任务 ID 或模块名。

### 工作流

1. 修改前：读 `doc/todo/TODO.md` 确认任务 ID
2. 修改中：只改 `themes/ignai/` 下文件
3. 修改后：`yarn build` → 更新 TODO → commit → push

---

## 8. 设计文档索引

| 文档 | 位置 |
|------|------|
| 品牌视觉方向 | `doc/design/品牌视觉方向与色彩系统.md` |
| 动效迁移设计文档 | `doc/design/动效迁移设计文档.md` |
| 动画样式体系 | `doc/design/动画样式体系全景.md` |
| 文字排布规范 | `doc/design/文字排布与布局规范.md` |
| 架构迁移记录 | `doc/architecture/arch-v2架构迁移记录.md` |

---

## 9. 参考资源

| 资源 | 位置 |
|------|------|
| NotionNext 官方文档 | https://docs.tangly1024.com |
| NotionNext GitHub | https://github.com/tangly1024/NotionNext |
| heo 主题说明 | `themes/heo/` 源码 |
| IGNAI 设计规范 | `doc/design/` |
| v1.0.0 架构文档 | `doc/architecture/` |
