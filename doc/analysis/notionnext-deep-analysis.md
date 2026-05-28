# NotionNext 深度研究报告 — 横纵分析法

> 研究对象：NotionNext — 基于 Notion 的开源博客/网站框架
> 研究目的：全面理解项目的技术架构、发展脉络和工程实践，建立驾驭能力
> 分析时间：2026-05-28

---

## 一、纵向分析：一个个人项目如何长成 11K+ Stars

### 1. 起源：一个前端开发者的个人需求（2021）

2021 年底，一个叫 tangly1024 的前端开发者遇到了一个很具体的问题：他想搭一个博客，但不想用 WordPress 那套重东西，也不想自己写 CMS。他日常用 Notion 做笔记，于是想——能不能直接把 Notion 当后端，用前端框架渲染成博客？

这不是一个新想法。早在 2020 年，一个叫 [nobelium](https://github.com/craigary/nobelium) 的项目就走了这条路：Next.js + Notion API = 静态博客。但 nobelium 很简洁，功能有限，主题只有一个。

tangly1024 在 nobelium 的基础上做了大量扩展。2021 年 12 月 21 日，NotionNext 的第一个 commit 诞生了——一条 `feature: 微调` 的消息，代码里已经有了完整的 Next.js Pages Router 结构、Notion API 集成、和一个叫 `next` 的默认主题。

**这个起点决定了 NotionNext 的基因：它不是一个从零设计的项目，而是一个在 nobelium 基础上不断叠加功能的"生长型"项目。** 这个基因一直影响到今天——代码里有很多"历史层"，不同时期的代码风格不同，抽象层次不一致，但整体能跑。

### 2. 疯狂生长期：从 v1 到 v4（2022-2023）

NotionNext 的版本迭代速度在开源项目里算非常快的：

- **v1 → v2**（2022 年 1 月）：不到一个月。核心变化是**主题系统的引入**——把 UI 从核心代码里剥离出来，变成了可切换的主题。这是一个关键的架构决策，让 NotionNext 从"一个博客模板"变成了"一个博客框架"。
- **v2 → v3**（2022 年 4 月）：三个月。加入了更多主题（hexo、fukasawa、nobelium），完善了多语言支持。
- **v3 → v4**（2023 年 7 月）：经过 15 个月的 v3.x 迭代，v4.0.0 发布。这是最大的一次升级，引入了 Clerk 认证、Supabase 集成、Algolia 搜索、Redis 缓存等企业级功能。

**v3 到 v4 的 15 个月是最关键的成长期。** 在这段时间里，NotionNext 从一个纯静态博客生成器，进化成了一个支持 ISR（增量静态再生）、用户认证、全文搜索的动态网站框架。主题数量也从几个增长到了 20+ 个。

### 3. 社区爆发：Star 数从 1K 到 11K

NotionNext 的增长不是靠营销，而是靠两个因素：

**第一，Notion 的普及。** 2022-2024 年，Notion 在中国用户中爆发式增长。大量用户想要一个"把 Notion 笔记变成网站"的工具，NotionNext 正好踩中了这个需求。

**第二，主题多样性。** 26 个主题意味着用户几乎总能找到一个自己喜欢的风格。这降低了使用门槛——用户不需要懂代码，只需要 fork 项目、改配置、部署到 Vercel 就能用。

**第三，中文生态。** NotionNext 的文档、Issue、讨论区都是中文为主，这对中国开发者非常友好。tangly1024 本人也积极回复 Issue，维护了一个活跃的社区。

### 4. 当前状态（2026 年 5 月）

| 指标 | 值 |
|------|-----|
| Stars | 11,489 |
| Forks | 14,635 |
| Open Issues | 385 |
| 总代码量 | 107,674 行（JS/TS） |
| 主题数 | 26 |
| 版本 | v4.9.5.7 |
| 核心贡献者 | tangly1024（~3,700 commits，占 95%+） |

**一个值得注意的事实：这个项目的 95% 以上代码是一个人写的。** tangly1024 用不同的 git 配置（tangly1024、tangly1024.com、tangly）提交了 3,683 次 commit。这意味着项目的架构决策、代码风格、功能取舍都高度依赖一个人的判断。

---

## 二、横向分析：NotionNext 在什么位置

### 1. 赛道定义

NotionNext 所在的赛道是 **"Notion-as-CMS"**——把 Notion 数据库当作内容管理系统，用前端框架渲染成网站。这个赛道有几个特点：

- **品类较新**：2020 年左右才出现，随着 Notion 普及而兴起
- **竞品不多**：因为需要同时懂 Notion API 和前端框架
- **用户画像明确**：个人博客、小型社区、文档站点

### 2. 竞品对比

| 项目 | Stars | 技术栈 | 定位 | 优势 | 劣势 |
|------|-------|--------|------|------|------|
| **NotionNext** | 11.4K | Next.js 14 + Pages Router | 博客/网站框架 | 主题多、中文生态、功能全 | 代码质量参差、单人维护风险 |
| **nobelium** | 3.5K | Next.js + Pages Router | 极简博客 | 代码干净、轻量 | 功能少、主题单一 |
| **Notion Blog** | 1.2K | Next.js App Router | 博客模板 | 现代架构 | 社区小 |
| **react-notion-x** | 5.8K | React 组件库 | Notion 渲染器 | 底层能力强 | 不是完整网站方案 |

**NotionNext 的生态位**：它是这个赛道里功能最全、主题最多、中文支持最好的方案。但它也是代码最复杂、维护负担最重的。

### 3. 技术栈深度分析

#### 核心依赖关系图

```
用户访问 URL
    │
    ▼
Next.js 14 (Pages Router)
    │
    ├── pages/index.js → getStaticProps()
    │       │
    │       ▼
    │   lib/db/SiteDataApi.js
    │       │
    │       ├── notion-client (非官方 API)
    │       │       │
    │       │       ▼
    │       │   notion.so/api/v3
    │       │
    │       ├── @notionhq/client (官方 API，Member 补充)
    │       │
    │       └── lib/cache/ (三级缓存)
    │               │
    │               ├── memory-cache (进程内)
    │               ├── local_file_cache (磁盘)
    │               └── ioredis (Redis)
    │
    ▼
themes/theme.js → DynamicLayout
    │
    ▼
themes/${THEME}/index.js → LayoutIndex / LayoutSlug / ...
    │
    ▼
React 组件渲染 → HTML
```

#### 关键技术点

**1. 双 API 模式**

NotionNext 同时使用两个 Notion API：

- **非官方 API**（`notion-client`）：直接调用 `notion.so/api/v3`，不需要 API Token，但可能被限流或数据格式变动影响。这是主要数据来源。
- **官方 API**（`@notionhq/client`）：需要 `NOTION_API_TOKEN`，更稳定但需要配置。用于补充读取 Member 等被非官方 API 过滤的 entry type。

**为什么用非官方 API？** 因为它不需要用户创建 Notion Integration，使用门槛更低。但代价是——每次 Notion 改内部 API 格式，NotionNext 就可能崩溃（Issue #3882 就是这个问题）。

**2. 三级缓存架构**

```
请求 → 内存缓存（最快，进程内）
         │ miss
         ▼
       文件缓存（磁盘，构建时用）
         │ miss
         ▼
       Redis 缓存（生产环境，分布式）
         │ miss
         ▼
       Notion API（最慢，有速率限制）
```

**3. 主题动态加载**

```js
// themes/theme.js
const DynamicLayout = ({ theme, layoutName, ...props }) => {
  const LayoutComponent = dynamic(() =>
    import(`@/themes/${theme}`).then(mod => mod[layoutName])
  )
  return <LayoutComponent {...props} />
}
```

这意味着：
- 主题是一个独立的 npm 模块（目录）
- 切换主题不需要重新构建，只需要改配置
- 每个主题必须导出 `LayoutIndex`、`LayoutSlug` 等标准接口

**4. 配置优先级**

```
Notion 数据库中的 CONFIG 页面（最高优先级）
    ↓
环境变量（NEXT_PUBLIC_*）
    ↓
blog.config.js
    ↓
conf/*.js 分配置
    ↓
主题 config.js（最低优先级）
```

这意味着用户可以在 Notion 里直接修改网站配置，不需要改代码。这是一个很聪明的设计，但也让调试变得复杂——你不知道某个配置值是从哪层来的。

### 4. 竞品用户口碑

**NotionNext 用户最常见的评价：**
- 好评："主题多，选择多"、"中文文档完善"、"部署简单（Vercel 一键）"
- 差评："文章多了构建超时"、"Notion 改格式就崩"、"代码质量参差不齐"

**nobelium 用户最常见的评价：**
- 好评："代码干净"、"轻量"、"容易二次开发"
- 差评："功能太少"、"主题只有一种"、"不支持多语言"

---

## 三、横纵交汇：你在这个项目中的位置

### 你做的事 vs 项目需要的事

| 项目需要 | 你做的 | 缺口 |
|---------|--------|------|
| 社区化方向（Member/Event） | #4035 路线图 + #4113 数据管道 | ✅ 你在推动 |
| 核心基础设施（缓存同步） | #4126 On-Demand Revalidation | ✅ 你解决了 3 年老问题 |
| 多主题 bug 修复 | #4124, #4125 等 | ✅ 你在维护 |
| 构建性能优化 | #4033, #4034 | ✅ 你有贡献 |
| 核心架构（SiteDataApi, 缓存层） | 暂时没有 | 🔴 需要深入 |
| 测试覆盖 | 暂时没有 | 🔴 需要补 |

### 你需要掌握的知识清单

按优先级排序：

**第一层：必须掌握（现在就能做贡献）**

| 知识点 | 对应文件 | 学习方式 |
|--------|---------|---------|
| Next.js Pages Router | `pages/` | 读 Next.js 官方文档的 "Pages" 章节 |
| getStaticProps / ISR | `pages/index.js` | 追踪一次完整的数据流 |
| React 组件和 JSX 语法 | `themes/*/components/` | 读一个主题的组件代码 |
| CSS/Tailwind | `themes/*/style.js` | 改一个主题的样式 |
| Notion 数据库结构 | `conf/notion.config.js` | 理解 type/status/slug/title 字段 |

**第二层：应该掌握（3 个月内）**

| 知识点 | 对应文件 | 学习方式 |
|--------|---------|---------|
| Notion API（官方 + 非官方） | `lib/db/notion/` | 读 notion-client 源码 |
| 缓存策略 | `lib/cache/` | 理解三级缓存的选择逻辑 |
| 构建流程 | `next.config.js` | 跑一次 `yarn build`，看日志 |
| 动态路由 | `pages/[prefix]/[slug]/` | 理解 `[...suffix]` 捕获路由 |
| Webpack 配置 | `next.config.js` 的 webpack 部分 | 理解 alias 和 fallback |

**第三层：深入掌握（6 个月内）**

| 知识点 | 对应文件 | 学习方式 |
|--------|---------|---------|
| 多语言 i18n | `next.config.js` 的 i18n 配置 | 理解 locale 路由 |
| Clerk 认证 | `middleware.ts` | 理解 SSR 认证流程 |
| ISR / On-Demand Revalidation | `pages/api/revalidate.js` | 你已经做了这个 PR |
| 并发控制 | `lib/build/` | 理解 p-limit 和 Worker 协调 |

### 你驾驭这个项目的路线图

```
当前：能改主题 UI、能修 CSS bug、能回复 Issue
  │
  ▼ （1 个月）
能读懂 lib/db/ 的数据流，能改数据管道
  │
  ▼ （3 个月）
能改缓存策略、能优化构建性能、能 Review 核心 PR
  │
  ▼ （6 个月）
能设计新功能架构、能指导新贡献者、能独立发版
```

---

## 四、JS/TS 在这个项目里的角色

你提到"TS 大概是一些脚本"——这个理解需要修正。

### 这个项目的语言构成

| 语言 | 文件数 | 角色 |
|------|--------|------|
| JavaScript (.js) | 1,222 | **绝对主力** — 所有业务逻辑、组件、配置 |
| TypeScript (.ts) | 21 | 少量 — 类型定义、middleware、部分 API |
| TSX (.tsx) | 1 | 几乎没有 — 只有一个文件 |

**这不是一个 TypeScript 项目。** 它是一个 JavaScript 项目，加了少量 TypeScript。

### JS 在这个项目里的三个角色

**1. 配置文件（conf/）**

```js
// conf/notion.config.js — 纯配置，没有逻辑
module.exports = {
  NOTION_PROPERTY_NAME: {
    type: process.env.NEXT_PUBLIC_NOTION_PROPERTY_TYPE || 'type',
    status: process.env.NEXT_PUBLIC_NOTION_PROPERTY_STATUS || 'status',
    // ...
  }
}
```

这些文件就像"菜单"——告诉程序有哪些选项，默认值是什么。

**2. 组件文件（themes/*/components/）**

```jsx
// themes/ignai/components/Header.js — React 组件
export default function Header({ navItems }) {
  return (
    <header className="fixed top-0 w-full">
      {navItems.map(item => (
        <Link href={item.href}>{item.label}</Link>
      ))}
    </header>
  )
}
```

这些文件就像"乐高积木"——每个组件负责一块 UI，可以组合成页面。

**3. 数据处理文件（lib/）**

```js
// lib/db/SiteDataApi.js — 数据获取和处理
export async function fetchGlobalAllData({ from, locale }) {
  const cacheKey = `site_${pageId}_${locale}`
  return getOrSetDataWithCache(cacheKey, async () => {
    const allPages = await notionAPI.getPage(pageId)
    return convertNotionToSiteData(allPages)
  })
}
```

这些文件就像"厨房"——从 Notion 取原材料（数据），加工成菜品（页面数据），交给组件端上桌。

### 读代码的方法

不要试图从头到尾读。带着问题读：

```
问题：首页怎么渲染的？
  → pages/index.js → getStaticProps() → fetchGlobalAllData()
  → 看它返回什么 → 传给 <DynamicLayout>
  → themes/ignai/index.js → LayoutIndex
  → 看 LayoutIndex 用了哪些组件

问题：为什么文章不更新？
  → pages/index.js → 看 revalidate 值
  → blog.config.js → NEXT_REVALIDATE_SECOND = 60
  → lib/cache/ → 看缓存逻辑
```

**每一个问题都是一条链路，沿着链路读代码，比随机翻文件有效 10 倍。**
