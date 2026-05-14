# IGNAI 技术选型调研报告：NotionNext 二开可行性分析

> 作者：千逐 / Lucien
> 日期：2026-05-06
> 背景：IGAI 自建架构（Sanity + Supabase）使用体验差、维护成本高，评估基于 NotionNext 二开重建社区官网的可行性

---

## 0. 结论先行

**IGNAI 当前自建版本可以放弃。基于 NotionNext 二开是更优路径。**

理由：
1. 你已经在用 NotionNext 跑博客（qianzhu_blog），工具链熟悉度零成本
2. NotionNext 的内容模型（Notion Database + type 列）天然支持多内容类型分离
3. 成员登记、活动发布、文章管理——这些全部可以在 Notion 里完成，不需要 Supabase
4. 自建 vs 二开的维护成本比大约是 5:1

---

## 1. Hexo vs NotionNext：Hexo 根本不该进入讨论

先说 Hexo，因为它是最经典的静态博客方案，然后把它划掉。

### Hexo 是什么

Hexo 是一个基于 Node.js 的**静态站点生成器**。内容是 Markdown 文件，通过 Git 管理，`hexo generate` 生成 HTML，部署到任何静态托管。

### 为什么 Hexo 不适合 IGNAI

| 维度 | Hexo | NotionNext |
|------|------|-----------|
| **内容编辑** | Markdown 文件 + Git | Notion 可视化编辑器 |
| **手机编辑** | 几乎不可能（需要 Git 客户端） | Notion APP 直接编辑 |
| **多人协作** | Git 合并冲突噩梦 | Notion 原生多人实时协作 |
| **结构化数据** | 只有 front-matter（扁平 key-value） | Notion Database（类型化列、关系、Rollup） |
| **活动管理** | 自定义 front-matter + 模板 hack | Database 加列就行 |
| **成员目录** | YAML 数据文件 + 自定义模板 | Notion Database 天然支持 |
| **搜索** | 需要插件 | 内置 |
| **图片管理** | 手动放 `source/images/` | Notion 里直接上传 |
| **主题** | 300+（生态最大优势） | 17+（够用） |
| **非技术人员使用** | 不可能 | 可以 |

**一句话：Hexo 是给写代码的人用的博客工具。NotionNext 是给用 Notion 的人用的博客工具。** 你每天在用 Notion，选 Hexo 毫无道理。

Hexo 唯一的优势是 300+ 主题库和纯静态输出（不需要服务器）。但 NotionNext 部署在 Vercel 上同样是零运维，17+ 主题里也有 dark 主题（heo、gitbook、fuwari 等），完全够用。

**结论：Hexo 出局。** 接下来的讨论只在 NotionNext 和自建之间进行。

---

## 2. NotionNext 架构深度解析

### 2.1 它到底怎么工作的

```
┌─────────────────────────────────────────────────┐
│  你的 Notion Workspace                           │
│  ┌─────────────────────────────────────────────┐ │
│  │  一个 Notion Database                       │ │
│  │  每一行 = 一篇内容                           │ │
│  │  type 列决定内容类型：                       │ │
│  │    Post → 博客文章                          │ │
│  │    Page → 独立页面                          │ │
│  │    Notice → 公告                            │ │
│  │    Menu → 导航菜单                          │ │
│  │    (可自定义) → Event, Member, Record...    │ │
│  └─────────────────────────────────────────────┘ │
└──────────────────┬──────────────────────────────┘
                   │ Notion API (非官方)
                   │ ISR 每 60 秒刷新
                   ▼
┌──────────────────────────────────────────────────┐
│  Vercel (Next.js)                                │
│  ┌──────────┐ ┌──────────┐ ┌──────────────────┐  │
│  │ 首页     │ │ 文章列表  │ │ 独立页面         │  │
│  │ /        │ │ /category │ │ /about, /join    │  │
│  └──────────┘ └──────────┘ └──────────────────┘  │
└──────────────────────────────────────────────────┘
```

关键点：**一个 Notion Database 就是整个后端。** 所有内容——文章、页面、菜单、公告——都存在同一个 Database 的不同行里，通过 `type` 列区分。

### 2.2 type 列是核心机制

NotionNext 的 `conf/notion.config.js` 明确定义了 type 映射：

```javascript
type_post: 'Post',       // 博客文章
type_page: 'Page',       // 独立页面
type_notice: 'Notice',   // 公告
type_menu: 'Menu',       // 菜单
type_sub_menu: 'SubMenu', // 子菜单
```

**这些值全部可以通过环境变量覆盖。** 也就是说，你可以加自己的 type：

```
NOTION_PROPERTY_TYPE_POST=Post
NOTION_PROPERTY_TYPE_PAGE=Page
→ 你可以加：Event, Record, Story, Member
```

NotionNext 原生对自定义 type 的支持是：
- 在 Notion Database 里加一行，type 设为自定义值
- 在 `layout-map.config.js` 里配置这个 type 对应的布局组件
- 或者直接用 `category` 列来分类（更简单的方式）

### 2.3 多内容类型分离的两种策略

#### 策略 A：单 Database + category 分类（推荐）

```
Notion Database:
┌──────────┬────────┬──────────┬─────────┐
│ title    │ type   │ category │ status  │
├──────────┼────────┼──────────┼─────────┤
│ AI 线下聚会 │ Post   │ 活动     │ Published│
│ 千逐：从零到一 │ Post  │ 故事     │ Published│
│ AGI 研究笔记 │ Post   │ 记录     │ Published│
│ 社区月报 #3  │ Post   │ 文章     │ Published│
│ 关于 IGNAI  │ Page   │ -        │ Published│
└──────────┴────────┴──────────┴─────────┘
```

NotionNext 原生支持按 category 分组展示，URL 自动变成 `/category/活动`、`/category/故事` 等。

导航菜单可以直接链接到这些分类页面。

#### 策略 B：多 Database（需要二开）

NotionNext 默认只连接一个 Notion Database（通过 `NOTION_PAGE_ID`）。但 `NOTION_PAGE_ID` 支持逗号分隔的多语言配置：

```javascript
NOTION_PAGE_ID: '02ab3b...,en:7c1d57...'
```

理论上可以 hack 成多个 Database，但这需要修改核心数据获取逻辑。**不推荐。** 策略 A 已经够用了。

### 2.4 成员登记方案

这是你明确提到的需求：存储成员头像、简介，做社区成员展示。

#### 方案 A：Notion Database 作为成员目录（推荐）

创建一个独立的 Notion Database，专门存成员信息：

```
成员 Database:
┌──────┬────────┬────────┬────────┬────────┬─────────┐
│ 姓名  │ 头像    │ 简介    │ 角色    │ 技能    │ 加入时间  │
├──────┼────────┼────────┼────────┼────────┼─────────┤
│ 千逐  │ [photo] │ AI 产品  │ 发起人  │ AI, 写作 │ 2025-01 │
│ 小明  │ [photo] │ 全栈开发  │ 成员    │ React   │ 2025-03 │
└──────┴────────┴────────┴────────┴────────┴─────────┘
```

然后二开一个 `/members` 页面，通过 Notion API 读取这个 Database，渲染成头像卡片网格。

**工作量估算**：新增一个 API 路由 + 一个 React 组件，约 1-2 天。

#### 方案 B：NotionNext 主 Database 里的 Member type

在主 Database 里加 `type: Member` 的行，用 Notion 的 cover image 做头像，summary 做简介。但这会把成员和内容混在同一个 Database 里，不推荐。

#### 方案 C：外部表单 + Notion

成员通过表单（飞书表单、Notion Form、或 Tally.so）提交信息，数据自动写入 Notion Database。网站端读取展示。

**这是最优雅的方案**——提交端和展示端都走 Notion，不需要自建任何后端。

### 2.5 活动发布管理

在 NotionNext 里做活动管理比 IGNAI 自建方案简单得多：

```
Notion Database 活动行:
┌──────────┬────────┬──────────┬──────────┬──────────┬──────────┐
│ title    │ type   │ category │ date     │ cover    │ ext      │
├──────────┼────────┼──────────┼──────────┼──────────┼──────────┼──────────┤
│ AI 线下聚会 │ Post  │ 活动     │ 2025-06  │ [image]  │ {"location":"长沙"...} │
└──────────┴────────┴──────────┴──────────┴──────────┴──────────┘
```

- `ext` 字段可以存 JSON，放 location、registrationUrl、agenda 等结构化数据
- 活动列表页通过 `/category/活动` 自动生成
- 活动详情页用 Notion 页面正文写介绍、议程、报名方式
- 封面图直接用 Notion 的 cover image
- 手机上用 Notion APP 就能发活动

### 2.6 内容分开处理

你要求把活动、记录、文章分开。NotionNext 原生支持：

| 内容类型 | Notion 里怎么分 | 网站上怎么展示 |
|---------|----------------|-------------|
| 活动 | category = "活动" | `/category/活动` |
| 记录 | category = "记录" | `/category/记录` |
| 文章 | category = "文章" | `/category/文章` |
| 故事 | category = "故事" | `/category/故事` |
| 公告 | type = "Notice" | 顶部横幅 |

导航菜单在 Notion 里用 `type: Menu` 的行来配置，可以加"活动"、"记录"、"文章"的链接。

---

## 3. NotionNext 二开能做什么、不能做什么

### 3.1 能直接做到的（不改代码）

- [x] 博客文章发布
- [x] 多 category 分类（活动、记录、文章、故事）
- [x] 独立页面（关于、加入）
- [x] 导航菜单自定义
- [x] 公告横幅
- [x] 全文搜索
- [x] RSS 订阅
- [x] 评论系统（Giscus / Gitalk / Waline 等）
- [x] 暗色主题（`APPEARANCE: 'dark'`）
- [x] SEO（sitemap、OG tags）
- [x] 移动端适配
- [x] ISR 自动更新（60 秒）
- [x] 多语言

### 3.2 需要少量二开的（1-3 天）

- [ ] **成员展示页**：新增一个 API 路由读取成员 Database + 一个卡片网格组件
- [ ] **活动详情模板**：为 category=活动 的文章定制详情页布局（展示地点、报名链接、议程）
- [ ] **首页定制**：替换默认首页为社区风格的 Hero + 活动卡片 + 成员头像
- [ ] **自定义主题**：基于现有主题（heo / fuwari / landing）做 dark 主题定制

### 3.3 做不到或代价很大的

- [x] ~~活动在线报名（需要写入 Notion）~~ → 用外部表单解决（飞书/Notion Form）
- [x] ~~用户登录/权限系统~~ → 不需要。社区用 Notion 协作就行
- [ ] **实时数据看板**（如在线人数、申请统计）→ 需要 Supabase 或其他实时数据库，但不重要
- [ ] **付费内容/会员权限** → 需要 Clerk 等认证系统，NotionNext 已有 Clerk 集成

---

## 4. NotionNext 17 个主题一览

| 主题 | 风格 | 暗色模式 | 适合社区 | 备注 |
|------|------|---------|---------|------|
| **heo** | 现代、卡片式 | 支持 | 非常适合 | 最接近当前 IGNAI 风格 |
| **fuwari** | 日系简约 | 支持 | 适合 | 动画效果好 |
| **landing** | 落地页风格 | 支持 | 非常适合 | 有 Hero section |
| **gitbook** | 文档风格 | 支持 | 一般 | 适合知识库 |
| **next** | 经典博客 | 支持 | 一般 | 简洁 |
| **hexo** | Hexo 经典 | 支持 | 一般 | 类似 Hexo NexT |
| **medium** | Medium 风格 | 支持 | 适合 | 阅读体验好 |
| **matery** | Material 风格 | 支持 | 适合 | 卡片布局 |
| **nobelium** | 极简 | 支持 | 一般 | Nobelium 原版风格 |
| **fukasawa** | 瀑布流 | 支持 | 适合图片 | 瀑布流布局 |
| **plog** | 图片博客 | 支持 | 适合展示 | 以图片为主 |
| **commerce** | 电商风格 | 支持 | 可定制 | 有商品展示 |
| **movie** | 影视风格 | 支持 | 可参考 | 卡片网格 |
| **magzine** | 杂志风格 | 支持 | 可定制 | 排版丰富 |
| **proxio** | 作品集 | 支持 | 可参考 | 适合展示 |
| **simple** | 极简 | 支持 | 一般 | 默认主题 |
| **typography** | 排版为主 | 支持 | 一般 | 重视阅读体验 |

**推荐**：`heo` 主题最接近 IGNAI 当前的暗色社区风格，支持卡片布局、Hero section、暗色模式。或者选 `landing` 主题做落地页风格。

---

## 5. 迁移方案：从 IGNAI 自建到 NotionNext 二开

### Phase 0：准备工作（1 天）

```
1. 创建新的 Notion Database
2. 按以下 schema 建列：

   | 列名     | 类型        | 用途         |
   |---------|-------------|-------------|
   | title   | Title       | 标题         |
   | type    | Select      | Post/Page/Notice/Menu |
   | status  | Select      | Published/Draft/Invisible |
   | category| Select      | 活动/记录/文章/故事 |
   | tags    | Multi-select| 标签         |
   | date    | Date        | 发布日期      |
   | slug    | Text        | URL 路径      |
   | summary | Text        | 摘要         |
   | icon    | Text        | 图标         |
   | ext     | Text        | JSON 扩展字段  |
```

### Phase 1：基础部署（1 天）

```
1. Fork NotionNext 到新仓库
2. 配置环境变量：
   - NOTION_PAGE_ID = <你的 Database ID>
   - NEXT_PUBLIC_THEME = heo
   - NEXT_PUBLIC_APPEARANCE = dark
   - NEXT_PUBLIC_AUTHOR = IGNAI
3. 部署到 Vercel
4. 验证基础功能
```

**环境变量数量：IGNAI 自建需要 18 个，NotionNext 只需要 3 个。**

### Phase 2：内容迁移（1-2 天）

```
1. 把 IGNAI 的活动内容 → 复制到 Notion，category 设为 "活动"
2. 把记录内容 → category 设为 "记录"
3. 把博客/故事 → category 设为 "文章" 或 "故事"
4. 把社区简介 → type 设为 Page，slug 设为 "about"
5. 把加入页面 → type 设为 Page，slug 设为 "join"
6. 配置导航菜单 → type 设为 Menu
```

**对比**：IGNAI 的内容分散在 Sanity（活动/记录）+ TypeScript 文件（社区简介/站点文案）+ 环境变量（社交链接）三个地方。NotionNext 里全部在一个 Notion Database 里。

### Phase 3：二开定制（3-5 天）

```
1. 主题定制：基于 heo 主题，调整配色为 IGNAI dark 风格
2. 首页定制：Hero section + 近期活动卡片 + 社区简介
3. 成员展示页：
   - 创建成员 Notion Database
   - 新增 /members 路由
   - 头像卡片网格组件
4. 活动详情页模板：为活动类内容定制布局
5. 域名绑定：ignai.community → 新 Vercel 项目
```

### 总工作量：5-9 天

**对比 IGNAI 自建架构的已有工作量**：根据 git log，IGNAI 已经有 50+ 次提交，估计 3-4 周的开发时间。而且核心功能（成员管理、活动模板、首页定制）都还没做完。

---

## 6. 成员登记的具体方案

这是你最关心的需求之一，展开说。

### 方案：飞书表单 / Tally.so → Notion Database → 网站展示

```
┌──────────────┐     ┌──────────────┐     ┌──────────────┐
│  成员填写表单  │────→│  Notion      │────→│  网站展示     │
│  (飞书/Tally) │     │  Database    │     │  /members    │
│              │     │  自动接收     │     │  头像卡片     │
└──────────────┘     └──────────────┘     └──────────────┘
```

**流程**：
1. 想加入社区的人填写表单（姓名、头像上传、简介、角色、技能标签）
2. 表单数据自动写入 Notion 的「成员」Database
3. 管理员在 Notion 里审核（修改 status 列：待审核 → 已通过）
4. 网站的 `/members` 页面读取 status=已通过 的成员，展示为头像卡片

**不需要 Supabase。不需要自建 API。不需要认证系统。** Notion 的分享链接就是权限控制。

### 头像存储

- 方案 A：成员在表单里上传头像图片 → 存到 Notion 的 File 列 → 网站直接用 Notion CDN 的 URL
- 方案 B：成员提供 Gravatar / GitHub 头像链接 → 存为 Text 列
- 方案 C：用 Notion 页面的 cover/icon 作为头像

---

## 7. 风险与局限性

诚实地列出来，不做遮掩。

### 7.1 Notion API 速率限制

Notion 的非官方 API 有速率限制（HTTP 429）。NotionNext 通过 ISR 缓存（60 秒内不重复请求）和应用级缓存来缓解。对日访问量 < 1000 的社区网站来说，这不是问题。

**IGNAI 自建架构没有这个问题**——Sanity CDN 和 Supabase REST 没有这个限制。但如果社区做大了（日访问 > 10k），需要加 Redis 缓存层。

### 7.2 Notion 平台依赖

所有数据存在 Notion 里。如果 Notion：
- 挂了 → ISR 缓存的旧页面继续服务（最多 60 秒前的版本）
- 改 API → NotionNext 社区会修复（用户基数大，修复速度快）
- 停止服务 → 你可以导出所有数据为 Markdown

**IGNAI 的三个 SaaS 依赖（Vercel + Sanity + Supabase）也有同样的平台风险，但三选一挂的概率比一个挂的概率高。**

### 7.3 自定义程度受限于 Notion 的数据模型

Notion Database 的列类型是固定的。如果你需要：
- 复杂的关联查询（比如「参加过 3 次以上活动的成员」）→ Notion Rollup 可以做，但不如 SQL 灵活
- 实时数据写入（比如在线人数统计）→ Notion 不支持
- 事务性操作（比如扣减活动名额）→ Notion 不支持

**但这些对当前阶段的 IGNAI 都不重要。**

### 7.4 主题定制的上限

NotionNext 的 17 个主题都是 React + Tailwind 组件。定制主题需要会 React。

**但这比 IGNAI 的自定义组件架构更容易维护**——NotionNext 的主题是独立目录（`themes/heo/`），不与其他主题耦合。你只需要维护一个主题的代码。

---

## 8. 最终对比表

| 维度 | IGNAI 自建（当前） | NotionNext 二开（推荐） | Hexo（排除） |
|------|-------------------|----------------------|-------------|
| **环境变量** | 18 个 | 3 个 | 1 个（部署配置） |
| **外部服务** | 3 个（Sanity + Supabase + Vercel） | 2 个（Notion + Vercel） | 1 个（静态托管） |
| **内容编辑** | Sanity Studio + 改 TypeScript | Notion APP | Markdown 文件 |
| **手机编辑** | 不可用 | 原生支持 | 不可能 |
| **多内容类型** | Sanity schema（需要改三处） | category 列（加一个选项） | categories hack |
| **成员登记** | Supabase + 自建 API + 自建 admin | Notion Database + 外部表单 | 不支持 |
| **活动管理** | Sanity event schema（216 行） | Notion 页面 + ext 字段 | front-matter hack |
| **胶水代码** | 634 行（35%） | ~50 行（<5%） | ~20 行（<3%） |
| **暗色主题** | 已自建 | heo/fuwari 主题支持 | 300+ 主题可选 |
| **搜索** | 未实现 | 内置 | 需插件 |
| **评论** | 未实现 | Giscus/Waline 等 | 需插件 |
| **部署新环境** | 2 小时+ | 10 分钟 | 5 分钟 |
| **发一篇内容** | 7+ 步，必须电脑 | 2 步，手机可完成 | 3 步（写 md + git push） |
| **二开工作量** | 已投入 3-4 周，核心功能未完成 | 预计 5-9 天完成全部功能 | 不适用 |
| **长期维护** | 需要关注 3 个 SaaS 的更新 | 只需关注 NotionNext 版本 | 只需关注主题更新 |

---

## 9. 建议的下一步

1. **放弃 IGNAI 自建版本的继续开发**，不再投入新功能
2. **保留 IGNAI 仓库作为参考**（UI 设计、文案、配色方案都有价值）
3. **Fork NotionNext**，创建 `ignai-community` 项目
4. **选择 heo 主题**作为基础，做 dark 模式定制
5. **创建 IGNAI 的 Notion Database**，按 Phase 0 的 schema 建列
6. **迁移内容**，先迁活动 → 再迁记录 → 最后迁文案
7. **二开成员展示页**，用独立的 Notion Database + 外部表单
8. **域名切换**，新站点验证无误后，把 ignai.community 指向新 Vercel 项目

**自建一定不如二开——除非你的需求超出了现有工具的能力范围。IGNAI 的需求没有超出 NotionNext 的能力范围。**

---

*本文基于 NotionNext v4.9.x 源码分析、IGNAI `codex/aesthetic-spacing-preview` 分支源码、以及实际使用体验写成。*
