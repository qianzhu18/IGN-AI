# agent.md — AI 开发指引

> 本文件指导 Codex App 和 Claude Code 完成后续开发。
> 最后更新：2026-05-07 | 架构版本：v2.0.0 (NotionNext 二开)

---

## 1. 项目速览

| 项目 | 值 |
|------|-----|
| 名称 | IGNAI 社区官网 |
| 架构 | NotionNext v4.9.5+ (Pages Router) 二开 |
| 主题 | ignai (IGNAI 自定义，基于 heo 骨架，复刻 v1.0.0 UI) |
| 后端 | Notion（唯一后端） |
| 部署 | Vercel (主) / Docker (备用) |
| 包管理 | yarn |
| 分支 | `notionnext-v2` |
| 旧版存档 | tag `v1.0.0` on `codex/aesthetic-spacing-preview` |

---

## 2. 按场景读取文件

### 场景 A：首次接触项目

**必读文件（按顺序）：**

1. `agent.md` — 本文件，了解全局
2. `CLAUDE.md` — Claude Code 专属指引（命令、架构摘要）
3. `blog.config.js` — 站点核心配置
4. `doc/TO DO/TODO.md` — 当前开发路线图和待办事项
5. `doc/architecture/arch-v2架构迁移记录.md` — 架构决策背景

读完这 5 个文件后，你应该了解项目的来龙去脉、当前状态和下一步要做什么。

---

### 场景 B：修改主题外观（颜色、字体、布局）

**读取顺序：**

1. `themes/ignai/config.js` — IGNAI 主题配置（品牌文案、导航、Hero、Footer）
2. `themes/ignai/style.js` — IGNAI 主题的 CSS（v1 design tokens、动画、品牌色）
3. `themes/ignai/index.js` — 主题入口（LayoutBase, LayoutIndex, 所有 Section 组件）
4. `themes/ignai/components/` — IGNAI 主题组件（复刻自 v1.0.0）
5. `src/` — v1.0.0 原始 UI 参考（设计稿源头，复刻时对照）
6. `conf/font.config.js` — 字体配置
7. `conf/image.config.js` — 图片相关配置
8. `conf/animation.config.js` — 动效配置

**IGNAI 品牌规范（参考 `doc/design/` 目录）：**

| 用途 | 值 |
|------|-----|
| 主色 (Heat) | `#FF7A18` |
| 辅色 (Signal) | `#5DA9FF` |
| 暗色背景 | `#07080C` |
| 暗色卡片 | `#0D0E14` |
| 主字体 | Noto Sans SC |
| 标题字体 | 按品牌规范 |

**修改原则：**
- 只改 `themes/ignai/` 下的文件，不动 `components/` 的共享组件
- CSS 优先在 `themes/ignai/style.js` 注入
- 组件级修改在 `themes/ignai/components/` 下覆盖
- 参考 v1.0.0 原始实现时，对照 `src/` 目录的组件和样式

---

### 场景 C：修改站点配置（站点信息、社交链接、评论、SEO）

**按需读取：**

| 配置目标 | 文件 |
|---------|------|
| 站点名称/简介/关键词/语言 | `blog.config.js` |
| 社交联系方式 | `conf/contact.config.js` |
| 评论系统 | `conf/comment.config.js` |
| SEO/站点地图 | `next-sitemap.config.js` |
| Notion 字段映射 | `conf/notion.config.js` |
| 文章列表样式 | `conf/post.config.js` |
| 分析统计 | `conf/analytics.config.js` |
| 性能调优 | `conf/performance.config.js` |
| 右键菜单 | `conf/right-click-menu.js` |
| 搜索 (Algolia) | `conf/plugin.config.js` |

**环境变量（只需配置一个）：**

```bash
# .env.local — 唯一必需的环境变量
NOTION_PAGE_ID=你的数据库ID
```

多数据库格式：
```
NOTION_PAGE_ID='主库ID,members:成员库ID,events:活动库ID'
```

---

### 场景 D：添加新页面或功能

**读取顺序：**

1. `pages/` — 查看现有路由结构（Pages Router，不是 App Router）
2. `pages/[prefix]/` — NotionNext 的动态路由前缀机制
3. `lib/db/` — 数据获取层（从 Notion 读取数据）
4. `lib/cache/` — ISR 缓存机制
5. `themes/ignai/components/` — 可复用的 heo 主题组件
6. `doc/TO DO/TODO.md` — 确认功能是否在路线图中

**添加页面的步骤：**

1. 在 `pages/` 下创建路由文件（如 `pages/members.js`）
2. 在 `lib/db/` 中添加数据获取函数（从 Notion Database 读取）
3. 在 `themes/ignai/components/` 中创建页面组件
4. 如果需要新数据库，在 `NOTION_PAGE_ID` 中添加对应前缀

**注意：** NotionNext 使用 Pages Router (`getStaticProps` / `getServerSideProps`)，不是 App Router。

---

### 场景 E：修改导航栏 / 页脚 / 布局

**读取顺序：**

1. `themes/ignai/components/` — 查找 Header、Footer、Layout 相关组件
2. `conf/layout-map.config.js` — 路由与布局映射
3. `blog.config.js` — 菜单配置相关

---

### 场景 F：调试 / 排查问题

**读取顺序：**

1. `conf/dev.config.js` — 调试开关和开发配置
2. `lib/` — 核心逻辑
   - `lib/db/` — Notion 数据获取
   - `lib/cache/` — 缓存机制
   - `lib/plugins/` — 插件系统
   - `lib/config.js` — 配置加载逻辑
3. `middleware.ts` — Next.js 中间件
4. `next.config.js` — Next.js 配置

**常见问题：**
- 内容不更新 → 检查 `NEXT_REVALIDATE_SECOND`（默认 60 秒）
- Notion 连接失败 → 检查 `NOTION_PAGE_ID` 是否正确
- 样式不生效 → 确认主题设为 `heo`，检查 `themes/heo/style.js`

---

### 场景 G：内容相关（活动、成员、文章）

**Notion Database 结构：**

NotionNext 通过 Notion Database 的列（properties）来管理内容类型：
- `type` 列：Post（文章）、Page（页面）、Notice（公告）、Menu（菜单）
- `status` 列：Published（已发布）、Draft（草稿）、Invisible（隐藏）
- `title` 列：标题
- `slug` 列：URL 友好的路径
- `category` 列：分类
- `tags` 列：标签
- `date` 列：发布日期
- `summary` 列：摘要

**字段映射可在 `conf/notion.config.js` 中自定义。**

---

### 场景 H：了解架构决策背景

**读取文件：**

1. `doc/architecture/arch-v2架构迁移记录.md` — 完整的架构迁移决策书
2. `doc/architecture/` — 所有架构相关文档
3. `doc/design/` — 视觉设计规范
4. `doc/requirements/` — 需求文档
5. `doc/dev/` — 开发指南

---

## 3. 目录结构速查

```
IGN AI 官网/
├── blog.config.js          # 主配置 — 所有站点级设置
├── CLAUDE.md               # Claude Code 专属指引
├── agent.md                # 本文件 — AI 开发指引
├── .env.local              # 环境变量（只需 NOTION_PAGE_ID）
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
│   ├── ignai/               # ★ 当前使用的 IGNAI 自定义主题
│   │   ├── config.js        #   IGNAI 主题配置（品牌、Hero、导航、Footer）
│   │   ├── style.js         #   IGNAI CSS（v1 design tokens、动画、品牌色）
│   │   ├── index.js         #   主题入口（LayoutBase、LayoutIndex 等）
│   │   └── components/      #   主题组件（Header、Hero、Footer 等）
│   └── heo/                 # 基础骨架（参考，非活跃主题）
│
├── pages/                  # 路由（Pages Router）
│   ├── index.js            #   首页
│   ├── [prefix]/           #   动态路由前缀
│   ├── archive/            #   归档
│   ├── category/           #   分类
│   ├── tag/                #   标签
│   ├── search/             #   搜索
│   └── api/                #   API 路由
│
├── lib/                    # 核心逻辑
│   ├── db/                 #   数据获取层（Notion API）
│   ├── cache/              #   ISR 缓存
│   ├── plugins/            #   插件系统
│   ├── config.js           #   配置加载
│   └── utils/              #   工具函数
│
├── components/             # 跨主题共享组件
│
├── src/                    # v1.0.0 UI 参考（复刻源头，不参与构建）
│   ├── components/         #   原始 UI 组件（sections、ui、layout、motion 等）
│   ├── content/            #   原始文案数据（site、community、events 等）
│   └── styles/             #   原始样式（tokens.css、globals.css）
│
├── public/
│   ├── brand/              # ★ IGNAI 品牌资产（logo 等）
│   ├── contact/            # ★ 联系方式资产（二维码等）
│   └── images/             # 通用图片资源
│
└── doc/                    # 文档（不被构建使用）
    ├── TO DO/TODO.md       #   开发路线图
    ├── architecture/       #   架构文档
    ├── design/             #   设计规范
    ├── requirements/       #   需求文档
    ├── dev/                #   开发指南
    └── ISSUES/             #   问题追踪
```

---

## 4. 前端 UI 同步工作流（v1.0.0 → NotionNext）

> 将 v1.0.0 原版 UI 逐步复刻到 NotionNext ignai 主题。

### 对照流程

每次同步一个 UI 细节时，按此流程操作：

```
1. 开发服务器确认
   - 端口 3003：NotionNext（ignai 主题，目标）
   - 端口 3004：v1.0.0 原版（参考源头）
   - 确保 `yarn dev` 两个都跑着

2. 截图对比
   - 同一滚动位置截图 3003 和 3004
   - 使用 UI diff 工具或人工对比
   - 记录差异点（颜色、间距、动画、卡片特效等）

3. 定位差异源头
   - 3004 的样式 → 查 `src/styles/globals.css`、`src/components/`
   - 3003 的样式 → 查 `themes/ignai/style.js`、`themes/ignai/index.js`

4. 复刻修改
   - 在 `themes/ignai/style.js` 添加/修改 CSS
   - 在 `themes/ignai/index.js` 或 `components/` 修改组件
   - 每次只改一个维度（如：只改 keyframes、只改卡片、只改按钮）
   - 移除 v1.0.0 没有的多余效果

5. 验证 & 提交
   - 刷新 3003 确认效果
   - `yarn build` 验证构建（已知 adminConfig.ts 类型错误可忽略）
   - git commit：`feat(动效/UI): 描述变更`
```

### 关键文件对照表

| v1.0.0（端口 3004） | NotionNext（端口 3003） | 用途 |
|---------------------|------------------------|------|
| `src/styles/globals.css` | `themes/ignai/style.js` | CSS 变量、keyframes、组件样式 |
| `src/components/motion/BackgroundFX.tsx` | `themes/ignai/components/BackgroundFX.js` | Canvas 粒子背景 |
| `src/components/sections/*.tsx` | `themes/ignai/index.js` (内联 Section) | 首页各区块组件 |
| `src/components/ui/*.tsx` | `themes/ignai/components/*.js` | UI 组件（Header、Footer 等） |
| `src/styles/tokens.css` | `themes/ignai/style.js`（:root） | 设计 token（颜色、字体） |

### 动效迁移状态

| 层级 | 内容 | 状态 |
|------|------|------|
| P0 CSS Keyframes | 11 个 @keyframes + utility classes | ✅ 已完成 |
| P0 Button Shine | CTA 按钮 ::after 扫光 | ✅ 已完成 |
| P0 Reveal Blur | 入场 blur(10px)→blur(0) | ✅ 已完成 |
| P1 Canvas BackgroundFX | 76/42 粒子 + 流线 + 脉冲 | ✅ 已完成 |
| P1 Grid + Noise + Glow | 92px 网格、SVG 噪点、径向光晕 | ✅ 已完成 |
| P2 Scroll Parallax | WhatIs / Culture 视差偏移 | ✅ 已完成 |
| P2 Join Float | 品牌图无限浮动 | ✅ 已完成 |
| P3 卡片特效清理 | 移除 presence-card / energy-card | ✅ 已完成 |

### 设计文档索引

| 文档 | 位置 |
|------|------|
| 动效迁移设计文档 | `doc/design/09-动效迁移设计文档-v1到NotionNext.md` |
| 动效迁移 TODO | `doc/TO DO/TODO-animation-migration.md` |
| 品牌视觉方向 | `doc/design/04-品牌视觉方向与色彩系统.md` |
| 动画样式体系 | `doc/design/05-动画样式体系全景(参考百科).md` |
| 文字排布规范 | `doc/design/06-文字排布与布局规范.md` |

---

## 5. 开发工作流

### 修改前

1. 读取 `doc/TO DO/TODO.md`，确认任务对应哪个 Phase 和任务 ID
2. 读取相关配置文件（参考上方按场景读取）
3. 如果涉及主题修改，先读 `themes/ignai/config.js` 和对应组件

### 修改中

1. **只改 `themes/ignai/` 下的文件** — 不要动 `components/` 共享组件或其他主题
2. **配置优先用环境变量**，其次 `blog.config.js`，最后 `conf/` 分配置
3. **保持 yarn 一致** — 不要混用 npm

### 修改后

1. 运行 `yarn build` 验证构建通过
2. 更新 `doc/TO DO/TODO.md` 中对应任务的状态
3. Commit message 格式：`feat(P1-01): 描述` 或 `fix(P3-02): 描述`（关联任务 ID）

---

## 6. IGNAI 定制清单

以下是 v2.0.0 的主要定制方向（详见 `doc/TO DO/TODO.md`）：

### 已完成
- [x] NotionNext 源码集成
- [x] `blog.config.js` IGNAI 品牌适配
- [x] ignai 自定义主题创建（基于 heo 骨架）
- [x] v1.0.0 动效迁移 P0（CSS keyframes + 按钮扫光 + Reveal blur）
- [x] v1.0.0 动效迁移 P1（Canvas BackgroundFX + 网格 + 噪点 + 光晕）
- [x] v1.0.0 动效迁移 P2（滚动视差 + Join 浮动动画）
- [x] 卡片特效清理（移除 presence-card / energy-card 等多余效果）

### 待完成（按优先级）
1. **Phase 1** — 创建 Notion Database，配置 `NOTION_PAGE_ID`，让网站跑起来
2. **Phase 2** — 从 v1.0.0 迁移内容到 Notion
3. **Phase 3** — UI 细节微调（移动端适配、字体精确匹配、间距打磨）
4. **Phase 4** — /members 成员页、活动详情模板、评论系统
5. **Phase 5** — SEO、性能、域名绑定、上线

---

## 7. 关键约束

1. **包管理器用 yarn**，不用 npm
2. **主题修改只在 `themes/ignai/`**，不动共享组件、heo 或其他主题
3. **`src/` 是 v1.0.0 的 UI 参考**，不参与 NotionNext 构建，复刻时对照用
4. **配置优先级**：环境变量 > `blog.config.js` > `conf/` 分配置
5. **每次重大修改后运行 `yarn build`** 验证
6. **Notion 就是后端** — 不需要数据库、不需要 API key（除了 Notion Database ID）
7. **Pages Router** — 不是 App Router，不要用 `app/` 目录的路由方式
8. **v1.0.0 代码已存档** — 不要修改 `v1.0.0` tag 的内容

---

## 8. 参考资源

| 资源 | 位置 |
|------|------|
| NotionNext 官方文档 | https://docs.tangly1024.com |
| NotionNext GitHub | https://github.com/craigary/nobelium (原作者) / https://github.com/tangly1024/NotionNext |
| heo 主题说明 | `themes/heo/` 源码 |
| IGNAI 设计规范 | `doc/design/` |
| v1.0.0 架构文档 | `doc/architecture/` |
| qianzhu_blog（参考项目） | https://github.com/qianzhu18/qianzhu_blog |
