# IGNAI 社区官网架构选型决策书

> 作者：千逐 / Lucien
> 日期：2026-05-06
> 版本：v2.0（融合 7 份前置分析文档的最终决策参考）
> 前置文档：`全栈社区架构.md`、`当前项目架构分析.md`、`架构排布.md`、`成员管理需求评估.md`、`IGNAI 架构分析.md`、`IGNAI 技术选型调研报告：NotionNext 二开可行性分析.md`、`IGNAI vs NotionNext 架构锐评.md`、`IGNAI 架构决策：全面调研与最终方案.md`

---

## 0. 这份文档解决什么问题

IGNAI 社区官网已开发 3-4 周（50+ 提交），但遇到三个核心矛盾：

1. **成员管理需求**：需要让用户自助填入资料、管理员审核后公开展示，当前架构（Sanity + Supabase）实现这个功能链路长、成本高
2. **维护体验差**：18 个环境变量、35% 胶水代码、内容编辑必须电脑端操作 Sanity Studio
3. **部署灵活性不足**：Vercel 很方便，但 Docker 一键部署在当前三平台缝合架构下难以实现

这份文档融合之前的所有分析，结合 NotionNext 官方文档（docs.tangly1024.com）的最新信息，给出 **最终架构推荐和实施路线图**。

---

## 1. IGNAI 现状总结

### 1.1 当前技术栈

| 层级 | 技术 | 职责 |
|------|------|------|
| 框架 | Next.js 15 + React 19 | SSR/SSG 前端 |
| CMS | Sanity v4 | 活动和记录的内容管理 |
| 数据库 | Supabase (PostgreSQL) | 加入申请业务数据 |
| 认证 | 自写 SHA256 Cookie 门 | 管理后台保护 |
| 部署 | Vercel | Git-push 自动部署 |
| 样式 | Tailwind CSS 3 + Framer Motion | 暗色主题 |

### 1.2 当前痛点（按严重程度排序）

| 痛点 | 描述 | 严重程度 |
|------|------|---------|
| **内容编辑体验差** | 7+ 步发布活动、必须电脑端、Sanity Studio 移动端不可用 | 高 |
| **核心文案无法 CMS 编辑** | `src/content/` 下 6 个 TS 文件的内容只能改代码 | 高 |
| **成员管理无法闭环** | 用户无法自助填资料，缺少完整用户系统 | 高 |
| **胶水代码占比高** | `src/lib/` 634 行全为连接/降级/转换逻辑 | 中 |
| **部署依赖多** | 18 个环境变量、3 个外部 SaaS、配置一个新环境 2 小时+ | 中 |
| **三重类型冗余** | 每个 content 类型需维护 Sanity schema + TS fallback + 中间层转换 | 中 |

### 1.3 已投入和已完成的工作

- 首页 7 个 Section 组件 + 暗色主题设计
- 活动列表和详情页
- 记录列表和详情页
- 加入申请流程（Supabase + 本地 JSON 三级降级）
- 运营后台（/manage, /ops/join）
- 嵌入式 Sanity Studio
- Framer Motion 动画体系

**UI 设计和文案有参考价值，可以迁移到任何新架构。**

---

## 2. 成员管理需求深度分析

### 2.1 你真正需要什么

成员管理的核心需求不是"完整的用户系统"，而是：

```
用户自助填写资料（头像、简介、技能、联系方式）
        ↓
管理员审核（通过/拒绝/编辑）
        ↓
公开展示（首页精选 + 成员列表页 + 成员详情页）
```

这个流程的关键约束是：**用户需要能"自助填入"**，而不是由管理员代为录入。

### 2.2 不同架构下实现成员管理的方式

| 方案 | 用户填资料 | 管理员审核 | 网站展示 | 复杂度 |
|------|----------|----------|---------|--------|
| **A: NotionNext + Notion Form** | Notion Form / 飞书表单 | Notion 里改 status 列 | 多数据库功能读取成员 Database | 极低 |
| **B: 当前架构 + Supabase** | 网站内申请表 → Supabase | /ops/join 后台管理 | Sanity member schema 展示 | 高 |
| **C: Payload CMS** | 内置 Admin Panel | Admin Panel 内操作 | 前端读取 Payload API | 中 |
| **D: WordPress + BuddyBoss** | 注册页面 | 后台仪表板 | 主题模板自动渲染 | 低（但维护重） |
| **E: Clerk/Auth.js + Supabase** | 用户注册 → Supabase profile | 管理员后台 | 前端组件渲染 | 高 |

### 2.3 最简方案：NotionNext + 外部表单

这是实现成员管理成本最低的路径：

```
┌──────────────┐     ┌──────────────┐     ┌──────────────┐
│  成员填表单   │────→│  Notion      │────→│  网站展示     │
│  (Notion Form │     │  成员 Database│     │  /members    │
│   / 飞书表单)  │     │  自动接收     │     │  头像卡片     │
└──────────────┘     └──────────────┘     └──────────────┘
```

- Notion Form 原生支持表单提交 → 数据自动写入 Database
- 管理员在 Notion 里修改 status 列（待审核 → 已通过）
- NotionNext 多数据库功能读取成员 Database 渲染卡片
- **零后端代码、零认证系统、零数据库运维**

---

## 3. 四条可选架构路线

### 路线 A：NotionNext 二开（推荐）

**核心理念**：Notion 是万能后端，NotionNext 是渲染引擎。

**架构图**：

```
┌─────────────────────────────────────────┐
│  Notion Workspace                       │
│  ├── 主 Database（活动/记录/文章/故事）    │
│  ├── 成员 Database（头像/简介/技能）       │
│  └── Pages（关于/加入/菜单配置）          │
└─────────────────┬───────────────────────┘
                  │ Notion API + ISR
                  ▼
┌──────────────────────────────────────────┐
│  NotionNext (Fork + 二开)                │
│  ├── heo 暗色主题                        │
│  ├── / → 首页（Hero + 活动 + 成员预览）    │
│  ├── /category/活动 → 活动列表            │
│  ├── /category/记录 → 记录列表            │
│  ├── /members → 成员卡片（二开页面）       │
│  ├── /join → 加入引导                     │
│  └── Notion Form → 成员自助注册           │
└─────────────────┬───────────────────────┘
                  │
        ┌─────────┴──────────┐
        ▼                    ▼
   Vercel 部署          VPS Docker 部署
   (CNAME 加速)        (国内最快)
```

**优势**：

| 维度 | 描述 |
|------|------|
| 环境变量 | 3 个（NOTION_PAGE_ID, THEME, APPEARANCE）vs 当前 18 个 |
| 内容编辑 | Notion APP，手机可用，2 步发内容 vs 当前 7+ 步 |
| 成员管理 | Notion Form + Notion Database，零后端代码 |
| 外部依赖 | 1 个（Notion）vs 当前 3 个（Sanity + Supabase + Vercel） |
| Docker 部署 | 官方文档有完整 Docker 方案，国内镜像可用 |
| 社区生态 | 229k+ 用户，评论/统计/AI 聊天等插件齐全 |
| 主题 | heo 主题接近当前 IGNAI 暗色风格 |

**需要二开的部分**：

1. 成员展示页（`/members`）—— 读成员 Database，渲染头像卡片
2. 首页定制 —— 替换默认首页为社区 Hero + 活动卡片 + 成员预览
3. 活动详情模板 —— 为活动类内容定制布局（展示地点、报名链接）
4. 暗色主题微调 —— heo 主题基础上调配色

**总工作量：5-9 天**

**代价**：
- 丢失申请状态流转（submitted → reviewing → contacted → ...），简化为 Notion 的 status 列
- Notion API 有速率限制（日访问 < 1000 无影响）
- 设计自由度受限于 NotionNext 主题框架

### 路线 B：Payload CMS 替代 Sanity + Supabase

**核心理念**：用 Payload 替代 Sanity + Supabase，合并为一个后端。

**架构图**：

```
┌──────────────────────────────────────────┐
│  Next.js 前端（保留当前暗色主题）           │
│  ├── Payload 内置 Admin Panel             │
│  ├── Collections: event, record, member   │
│  ├── 用户注册/登录（内置 Auth）            │
│  └── 文件上传（头像等）                    │
├──────────────────────────────────────────┤
│  Payload CMS（嵌入 Next.js）              │
│  ├── SQLite / PostgreSQL                  │
│  ├── REST + GraphQL API                   │
│  └── 内置认证 + RBAC                       │
└──────────────────────────────────────────┘
```

**优势**：
- Sanity + Supabase 合并为一个系统，胶水代码大幅减少
- 内置认证系统，支持真正的用户自助注册和管理员审核
- 数据关系支持（活动关联成员、记录关联作者）
- 保留当前 Next.js 前端和暗色设计

**劣势**：
- 仍然是自建架构，需要开发者维护
- Payload 的编辑体验不如 Notion 直观
- 不解决"非技术用户编辑内容"的问题
- 工作量 7-12 天

### 路线 C：继续当前架构，补齐成员管理

**核心理念**：在现有 Sanity + Supabase 架构上补齐成员管理功能。

**需要做的**：
1. Sanity member schema（P1，约 2 天）
2. 成员展示页面 /members（P2，约 3 天）
3. Supabase 成员自助注册（P3，约 5 天）—— 需要加 Auth、RLS、Storage
4. Docker 镜像化（Phase 1，约 2 天）

**总工作量：10-15 天**

**适用条件**：如果你认为 IGNAI 未来一定会需要复杂用户系统（付费内容、权限管理、报名签到等），可以承受短期高成本。

### 路线 D：NotionNext 主站 + Payload CMS 数据层（混合方案）

**核心理念**：NotionNext 做内容展示，Payload 做业务数据。

**劣势**：复杂度最高，又回到"多系统缝合"的问题。不推荐。

---

## 4. 框架选项横向对比

基于 NotionNext 官方文档（v4.9.5.2）和实际使用体验，按 IGNAI 的 6 个核心需求打分：

| 方案 | 成员自助管理 | 内容编辑体验 | Docker 部署 | 维护成本 | 设计自由度 | 扩展性 | 总分 |
|------|-----------|------------|------------|---------|-----------|--------|------|
| **A: NotionNext 二开** | 4 (Notion Form) | 5 (Notion 原生) | 5 (官方 Docker 方案) | 5 (1 个依赖) | 3 (受主题约束) | 3 (Notion API 限制) | **25** |
| **B: Payload CMS** | 5 (内置 Auth) | 3 (Admin Panel) | 4 (Next.js standalone) | 3 (需维护) | 5 (完全控制) | 5 (无限扩展) | **25** |
| **C: 继续当前架构** | 3 (需补齐) | 2 (Sanity 体验差) | 3 (多 SaaS 依赖) | 1 (18 变量/3 平台) | 5 (完全控制) | 5 (已搭建好) | **19** |
| **D: WordPress** | 5 (BuddyBoss) | 4 (经典编辑器) | 4 (Docker 成熟) | 2 (安全/插件维护) | 3 (主题受限) | 4 (插件生态大) | **22** |

### 各方案一句话评价

| 方案 | 评价 |
|------|------|
| **NotionNext** | 你的 Notion 熟练度是核心优势，内容管理体验最好，成员管理用 Notion Form 零代码解决 |
| **Payload CMS** | 技术上最优解——合并两个后端为一个系统，内置 Auth 解决成员自助注册。但需要开发者持续维护 |
| **当前架构** | 技术选型没错，但缝合三个 SaaS 的维护成本对一个社区官网来说太高了 |
| **WordPress** | 功能最全但技术栈老旧、安全风险高、维护负担重 |

### 关键判断维度：你的时间花在哪

| 问题 | NotionNext | Payload CMS | 当前架构 |
|------|-----------|-------------|---------|
| 谁来写内容？ | 任何人（Notion） | 开发者（Admin Panel） | 开发者（Sanity Studio） |
| 发一篇活动？ | 2 步，手机可完成 | 4 步，需电脑 | 7+ 步，需电脑 |
| 成员自助注册？ | Notion Form，零代码 | 内置 Auth，需开发 | 需加 Supabase Auth，大量开发 |
| 配置新环境？ | 10 分钟 | 1 小时 | 2 小时+ |
| Docker 部署？ | 官方文档有完整方案 | Next.js standalone | 只能打包应用壳 |

---

## 5. NotionNext 关键能力确认（基于官方文档）

通过阅读 docs.tangly1024.com 的完整文档，确认了以下能力：

### 5.1 多数据库：多板块（不仅限于多语言）

`NOTION_PAGE_ID` 支持任意前缀：

```
NOTION_PAGE_ID = '主站ID,members:成员库ID,events:活动库ID'
```

这意味着：
- `ignai.community/` → 主站内容
- `ignai.community/members` → 成员板块（独立 Notion Database）
- 可以直接用来做成员展示

**注意**：不支持静态导出部署（`yarn export`、CloudFlare Pages 等）。Vercel 或 VPS 动态部署没有问题。

### 5.2 ext 字段

每条 Notion 数据有一个 `ext` 文本列，可以存 JSON：

```json
{
  "location": "长沙高新区",
  "registrationUrl": "https://lu.ma/xxx",
  "agenda": ["签到", "主题分享", "自由交流"]
}
```

活动详情页的二开模板可以解析这个 JSON 展示结构化数据。

### 5.3 自定义数据库表头

`conf/notion.config.js` 里所有字段名都可以通过环境变量覆盖：

```
NEXT_PUBLIC_NOTION_PROPERTY_TITLE=标题
NEXT_PUBLIC_NOTION_PROPERTY_STATUS=状态
```

### 5.4 外部扩展生态

| 类别 | 可用插件 |
|------|---------|
| 评论 | Giscus, Gitalk, Waline, Twikoo, Artalk 等 8+ |
| AI 聊天 | Coze, ChatBase |
| 搜索 | Algolia, 内置搜索 |
| 统计 | UMAMI, Clarity, 51LA, Ackee |
| 变现 | Google AdSense, 公众号导流, Mailchimp |

### 5.5 VPS Docker 部署方案（已验证）

官方文档提供了完整的 Docker 多阶段构建方案：

```dockerfile
# 使用国内华为云镜像
FROM swr.cn-north-4.myhuaweicloud.com/ddn-k8s/docker.io/library/node:20-alpine AS base
# ... 完整的四阶段构建（deps → builder → runner）
```

```bash
docker build --build-arg NEXT_DEBUG=true -t ignai-site .
docker run -d -p 3000:3000 --name ignai --restart unless-stopped ignai-site
```

配合 Nginx 反向代理即可绑定域名。**这是国内访问最快的方式。**

### 5.6 部署选项对比

| 方式 | 国内速度 | 成本 | ISR | Docker |
|------|---------|------|-----|--------|
| Vercel + CNAME (`cname-china.vercel-dns.com`) | 中 | 免费 | 支持 | 不适用 |
| Vercel + 国内 CDN | 快 | 需备案 | 支持 | 不适用 |
| 国内 VPS Docker | 最快 | VPS 费用 | 支持 | 支持 |
| EdgeOne | 快 | 付费 | 支持 | 不适用 |

---

## 6. Docker 一键部署可行性评估

### 6.1 NotionNext 的 Docker 方案

NotionNext 的 Docker 方案**真正能实现一键部署**：

```bash
# 1. 构建镜像
docker build --build-arg NEXT_DEBUG=true -t ignai-site .

# 2. 运行容器
docker run -d -p 3000:3000 \
  -e NOTION_PAGE_ID=xxx \
  --name ignai \
  --restart unless-stopped \
  ignai-site
```

只需要一个环境变量 `NOTION_PAGE_ID`，不需要数据库、不需要额外的 SaaS 账号（Notion 的 API 对公开 Database 是免费的）。

### 6.2 当前架构的 Docker 方案

当前架构即使做了 Docker 化，也**无法实现真正的一键部署**：

```bash
docker run -d -p 3000:3000 \
  -e NEXT_PUBLIC_SANITY_PROJECT_ID=xxx \
  -e NEXT_PUBLIC_SANITY_DATASET=xxx \
  -e SANITY_API_READ_TOKEN=xxx \
  -e SUPABASE_URL=xxx \
  -e SUPABASE_SECRET_KEY=xxx \
  -e OPS_ACCESS_PASSWORD=xxx \
  -e NEXT_PUBLIC_SITE_URL=xxx \
  -e NEXT_PUBLIC_CONTACT_EMAIL=xxx \
  # ... 还有 10+ 个变量
  --name ignai \
  ignai-site
```

而且外部 SaaS（Sanity Cloud、Supabase Cloud）仍然在 Docker 之外。

### 6.3 对比结论

| 维度 | NotionNext | 当前架构 |
|------|-----------|---------|
| Docker 构建难度 | 低（官方 Dockerfile） | 中（需 standalone 输出） |
| 环境变量数量 | 1 个核心 | 18 个 |
| 外部服务依赖 | 1 个（Notion） | 2 个（Sanity + Supabase） |
| 真正一键部署 | 可以 | 不可以 |
| 国内加速 | VPS Docker 最快 | 需额外处理 |

---

## 7. 最终推荐

### 推荐路线：A（NotionNext 二开）

理由：

1. **成员管理零代码解决**：Notion Form → Notion Database → NotionNext 多数据库展示。这是所有方案中成本最低的
2. **你的时间是最大的约束**：NotionNext 二开 5-9 天，当前架构补齐成员管理 10-15 天，Payload 迁移 7-12 天
3. **你的 Notion 熟练度是不可复制的优势**：你已经在用 NotionNext 跑博客，工具链零学习成本
4. **Docker 一键部署方案成熟**：官方文档有完整的国内镜像构建方案
5. **社区官网的核心不是架构，是内容**：一个每天更新的 Notion 驱动网站远比架构精良但内容陈旧的网站有价值

### 不推荐路线 C（继续当前架构）的原因

不是技术上做不了，而是**工程经济性不成立**：
- 18 个环境变量配置一个社区官网，太重
- 35% 的代码是胶水，太浪费
- 成员自助注册需要 Supabase Auth + RLS + Storage，开发量远超 Notion Form
- 三个 SaaS 供应商的运维认知负担，对个人开发者太多

### 如果未来需要升级

| 社区规模 | 推荐 |
|---------|------|
| 0→1（< 100 人） | **NotionNext**，零运维 |
| 1→10（100-500 人） | **NotionNext + 外部表单** |
| 10→100（500-5000 人） | **考虑 Payload CMS 迁移**，需要真正的用户系统 |
| 100+（5000+ 人） | **必须自建**，微服务 + CDN + 数据库分片 |

IGNAI 目前处于 **0→1 阶段**。先跑通再说。

---

## 8. 实施路线图

### Phase 0：准备工作（1 天）

```
1. 创建 IGNAI 的 Notion Database 结构：

   主 Database 列：
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
   | ext     | Text        | JSON 扩展字段  |

   成员 Database 列：
   | 列名     | 类型        | 用途         |
   |---------|-------------|-------------|
   | name    | Title       | 姓名/昵称     |
   | avatar  | Files       | 头像         |
   | bio     | Text        | 一句话简介    |
   | role    | Select      | Builder/Creator/Connector/Researcher |
   | skills  | Multi-select| 技能标签      |
   | city    | Text        | 城市         |
   | status  | Select      | 待审核/已通过/已拒绝 |
   | links   | Text        | JSON（网站/GitHub 等） |
```

### Phase 1：基础部署（1 天）

```
1. Fork NotionNext，创建 ignai-community 项目
2. 配置环境变量：
   NOTION_PAGE_ID = '主库ID,members:成员库ID'
   NEXT_PUBLIC_THEME = heo
   NEXT_PUBLIC_APPEARANCE = dark
3. 部署到 Vercel，验证基础功能
4. 选 heo 主题，开启暗色模式
```

### Phase 2：内容迁移（1-2 天）

```
1. IGNAI 活动内容 → Notion 主 Database，category = "活动"
2. 记录内容 → category = "记录"
3. 博客/故事 → category = "文章" 或 "故事"
4. 社区简介 → type = Page，slug = "about"
5. 加入页面 → type = Page，slug = "join"
6. 配置导航菜单 → type = Menu
```

### Phase 3：二开定制（3-5 天）

```
1. 主题定制：基于 heo 主题，调整配色为 IGNAI dark 风格
2. 首页定制：Hero section + 近期活动卡片 + 社区简介 + 成员预览
3. 成员展示页：
   - 多数据库读取 members:成员库ID
   - /members 路由渲染头像卡片网格
   - 首页嵌入 6-8 人精选成员预览
4. 活动详情页模板：为活动类内容定制布局
5. 加入页面：嵌入 Notion Form 链接或二维码
```

### Phase 4：部署切换（1 天）

```
1. 域名 ignai.community 指向新 Vercel 项目
2. 验证所有页面正常
3. IGNAI 自建版本归档
```

### 总工作量：5-9 天

---

## 9. Vercel 继续使用 + 国内加速方案

既然 Vercel 很方便，建议的部署策略：

### 起步阶段（现在）

```
Vercel + CNAME 加速
域名 DNS 设置：
  CNAME: cname-china.vercel-dns.com
  或 A 记录: 76.223.126.88 / 76.76.21.98
零成本，中等速度
```

### 如果不够快

```
迁移到国内 VPS Docker 部署
按 NotionNext 官方文档操作即可：
  docker build --build-arg NEXT_DEBUG=true -t ignai-site .
  docker run -d -p 3000:3000 --name ignai --restart unless-stopped ignai-site
然后 Nginx 反向代理绑定域名
```

### 如果有 ICP 备案

```
Vercel + 腾讯云 CDN / EdgeOne
国内访问最快
```

---

## 10. 关于架构选择的心法

这次融合分析让我看清了三件事：

### 10.1 架构选择不是技术问题，是人的问题

| 问题 | 自建架构的回答 | NotionNext 的回答 |
|------|--------------|------------------|
| 谁来写内容？ | 开发者（需要懂 TypeScript） | 任何人（需要懂 Notion） |
| 谁来维护服务？ | 开发者（需要关注 3 个 SaaS） | 没人（Vercel + Notion 自维护） |
| 内容更新的瓶颈在哪？ | 开发者时间 | 无瓶颈（Notion 即时更新） |
| 出了问题谁排查？ | 开发者 | NotionNext 社区 |

### 10.2 成员管理不需要"用户系统"

对 0→1 阶段的社区，你需要的是：
- 用户能提交资料 ✓（Notion Form）
- 管理员能审核 ✓（Notion 里改 status 列）
- 网站能展示 ✓（NotionNext 多数据库读取）

你不需要：
- 用户登录系统 ✗
- 密码重置流程 ✗
- 权限管理后台 ✗
- 数据库 RLS 策略 ✗

**不要为未来可能需要的功能提前买单。**

### 10.3 "最好的架构是你感受不到它存在的架构"

IGNAI 自建架构的技术选型没有错——Sanity 是好的 CMS，Supabase 是好的数据库，Next.js 是好的框架。但把它们缝在一起维护的成本，对一个社区官网来说太高了。

NotionNext 不完美——成员管理需要二开，活动管理不如专门的活动平台，Notion API 有速率限制。**但它让你把时间花在社区运营上，而不是在配置 Supabase RLS 策略上。**

---

## 11. IGNAI 自建版本的归档建议

自建版本（当前仓库）有以下值得保留的资产：

| 资产 | 保留方式 |
|------|---------|
| 暗色主题设计系统（配色、字体、阴影） | 迁移到 NotionNext heo 主题的自定义 CSS |
| 首页 Section 组件逻辑 | 作为 NotionNext 首页二开的参考 |
| 文案内容（Hero、文化、角色描述） | 迁移到 Notion Pages |
| 成员管理需求文档 | 直接用于 NotionNext 的成员 Database 设计 |
| UI 设计参考（间距、排版、动画） | 截图保存，二开时参照 |

**自建版本的代码不需要迁移，但设计和文案需要迁移。**

---

## 12. 行动清单

```
□ 1.  创建 IGNAI 的 Notion Database（按 Phase 0 的模板）
□ 2.  Fork NotionNext，创建 ignai-community 项目
□ 3.  配置 NOTION_PAGE_ID 为多数据库格式
□ 4.  选择 heo 主题，开启暗色模式
□ 5.  部署到 Vercel，验证基础功能
□ 6.  迁移 IGNAI 内容到 Notion（活动 → 记录 → 文章 → 文案）
□ 7.  创建成员 Notion Database + Notion Form
□ 8.  二开成员展示页（/members）
□ 9.  二开活动详情模板
□ 10. 首页定制（Hero + 活动卡片 + 社区简介 + 成员预览）
□ 11. 域名切换 ignai.community → 新站点
□ 12. IGNAI 自建版本归档
```

---

*本文融合了以下文档的分析成果：*
- *全栈社区架构.md — V1 架构定义*
- *当前项目架构分析.md — 技术栈拆解与 Docker 迁移评估*
- *架构排布.md — 部署模型分析*
- *成员管理需求评估.md — 成员管理字段设计*
- *IGNAI 架构分析.md — 系统架构总览*
- *IGNAI 技术选型调研报告：NotionNext 二开可行性分析.md — NotionNext 深度解析*
- *IGNAI vs NotionNext 架构锐评.md — 使用体验对比*
- *IGNAI 架构决策：全面调研与最终方案.md — 11 种替代方案对比*
- *NotionNext v4.9.5.2 官方文档（docs.tangly1024.com）— 多数据库/多板块、VPS Docker 部署*
