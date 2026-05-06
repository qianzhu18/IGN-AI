# IGNAI 社区官网架构决策：全面调研与最终方案

> 作者：千逐 / Lucien
> 日期：2026-05-06
> 定位：基于 NotionNext 官方文档、11 种替代方案对比、Vercel 国内加速方案的最终决策参考

---

## 0. 你的问题，我的回答

在展开报告之前，先直接回答你提出的几个问题。

### Q1: NotionNext 做成员管理的界面效果怎么样？

**NotionNext 本身没有成员管理功能。** 但有两个路径可以实现：

**路径 A（推荐）：多数据库 + 二开**

NotionNext 的 `NOTION_PAGE_ID` 支持绑定多个 Notion Database，格式如下：

```
NOTION_PAGE_ID = '主库ID,members:成员库ID,events:活动库ID'
```

你创建一个专门的「成员」Notion Database，存头像、简介、角色、技能。然后二开一个 `/members` 页面，读取这个 Database 渲染成头像卡片网格。

每个子路径甚至可以配置不同的主题。比如主站用 heo 暗色主题，成员展示页用专门的卡片主题。

**路径 B：外部表单 + Notion**

成员通过飞书表单/Tally.so 提交信息（姓名、头像上传、简介），数据自动写入 Notion。管理员在 Notion 里审核。网站端展示。

**界面效果取决于你的二开质量。** NotionNext 是 React + Tailwind，你完全可以做出 IGNAI 当前暗色风格的成员卡片页面。但需要自己写组件。

### Q2: Vercel 绑定到国内服务器效果怎么样？

三种方案，效果递增：

| 方案 | 速度 | 成本 | 难度 |
|------|------|------|------|
| **Vercel + CNAME 加速** | 中等（可用） | 免费 | 低 |
| **Vercel + 国内 CDN** | 快 | 需 ICP 备案 | 中 |
| **直接部署到国内 VPS** | 最快 | VPS 费用 | 中 |

**方案 1：Vercel CNAME 加速（推荐起步）**

Vercel 为中国用户提供了专用 DNS 记录：
- CNAME: `cname-china.vercel-dns.com`
- A 记录: `76.223.126.88` 或 `76.76.21.98`

在域名 DNS 设置里把解析指向这些地址，中国访问速度会有明显提升。不需要备案，不需要额外费用。

**方案 2：ICP 备案 + 国内 CDN**

如果域名已完成 ICP 备案，可以用腾讯云 CDN 或 EdgeOne 做国内加速。NotionNext 官方文档已经支持 EdgeOne 部署。

**方案 3：国内 VPS 部署（完全脱离 Vercel）**

NotionNext 官方文档有完整的 VPS 部署教程（Docker 方案推荐）：

```bash
# Docker 部署（国内镜像）
docker build --build-arg NEXT_DEBUG=true -t ignai-site .
docker run -d -p 3000:3000 --name ignai --restart unless-stopped ignai-site
```

然后 Nginx 反向代理到 80 端口，绑定域名。**这是国内访问最快的方式。**

**我的建议**：先用方案 1（CNAME 加速），零成本。如果不够快，再考虑方案 3（VPS）。

### Q3: 是否有其他成熟架构能解决你的问题？

调研了 11 种方案。结论在下面。

---

## 1. NotionNext 官方文档发现的关键能力

通过翻阅 docs.tangly1024.com 的完整文档，发现了几个之前不知道的重要能力：

### 1.1 多数据库：多板块（不只是多语言）

`NOTION_PAGE_ID` 支持任意前缀，不限于语言代码：

```
NOTION_PAGE_ID = '主站ID,blog:博客库ID,events:活动库ID,members:成员库ID'
```

这意味着：
- `ignai.community` → 主站（heo 暗色主题）
- `ignai.community/events` → 活动板块（独立 Notion Database）
- `ignai.community/members` → 成员板块（独立 Notion Database）
- `ignai.community/blog` → 博客板块（独立 Notion Database）

**每个板块可以有独立的主题和 Notion 配置。** 这就是 NotionNext 的「站点组合」功能。

**限制**：不支持静态导出部署。如果用 VPS 或 Vercel 动态部署就没问题。

### 1.2 NotionNext 的 ext 字段

每条 Notion 数据有一个 `ext` 文本列，可以存 JSON 字符串。这相当于一个灵活的扩展字段：

```json
{
  "location": "长沙高新区",
  "registrationUrl": "https://lu.ma/xxx",
  "agenda": ["签到", "主题分享", "自由交流"],
  "capacity": 50
}
```

活动详情页的二开模板可以解析这个 JSON 来展示结构化数据。

### 1.3 自定义数据库表头

`conf/notion.config.js` 里所有字段名都可以通过环境变量覆盖。如果你的 Notion Database 用的中文列名（"标题" 而不是 "title"），只需要：

```
NEXT_PUBLIC_NOTION_PROPERTY_TITLE=标题
NEXT_PUBLIC_NOTION_PROPERTY_STATUS=状态
```

### 1.4 外部扩展生态

NotionNext 预置的扩展插件：

| 类别 | 可用插件 |
|------|---------|
| **评论** | Giscus, Gitalk, Waline, Twikoo, Artalk, Utterance, Cusdis, Valine |
| **AI 聊天** | Coze, ChatBase |
| **客服聊天** | SaleSmartly, TIDIO |
| **搜索** | Algolia（付费）, 内置搜索 |
| **统计** | UMAMI, Clarity, 51LA, Ackee |
| **变现** | Google AdSense, 公众号导流（TechGrow）, Mailchimp 邮件订阅 |
| **趣味** | Live2D 宠物, 音乐播放器 |
| **部署** | Vercel, CloudFlare Pages, Netlify, EdgeOne, VPS, Zeabur, 4EverLand |

### 1.5 部署选项完整列表

| 方式 | 国内速度 | 成本 | ISR 支持 |
|------|---------|------|---------|
| Vercel + CNAME | 中 | 免费 | 支持 |
| Vercel + 国内 CDN | 快 | 需备案 | 支持 |
| 国内 VPS (Docker) | 最快 | VPS 费用 | 支持 |
| EdgeOne | 快 | 付费 | 支持 |
| CloudFlare Pages | 慢 | 免费 | 不支持（静态） |
| Netlify | 慢 | 免费 | 支持 |
| Zeabur | 中 | 付费 | 支持 |

---

## 2. 11 种替代方案全对比

对每种方案按你的 6 个核心需求打分（1-5 分）：

| 方案 | 活动管理 | 成员登记 | 多内容类型 | 暗色主题 | 国内可用 | 非技术编辑 | 总分 |
|------|---------|---------|-----------|---------|---------|-----------|------|
| **NotionNext** | 3 | 2 (需二开) | 4 | 5 | 4 | 5 | **23** |
| **Payload CMS** | 5 | 5 | 5 | 5 | 5 | 3 | **28** |
| **WordPress+BuddyBoss** | 4 | 5 | 5 | 4 | 5 | 5 | **28** |
| **Ghost** | 1 | 2 | 2 | 4 | 3 | 5 | **17** |
| **Discourse** | 4 | 5 | 2 | 5 | 4 | 4 | **24** |
| **飞书多维表格** | 3 | 4 | 2 | 3 | 5 | 4 | **21** |
| **Gridea** | 1 | 0 | 1 | 3 | 5 | 3 | **13** |
| **VuePress/VitePress** | 0 | 0 | 1 | 5 | 5 | 1 | **12** |
| **Hexo** | 1 | 0 | 2 | 5 | 5 | 1 | **14** |
| **Wix/Squarespace** | 4 | 4 | 3 | 3 | 1 | 5 | **20** |
| **IGNAI 自建（当前）** | 4 | 4 | 5 | 5 | 4 | 2 | **24** |

### 各方案一句话评价

| 方案 | 评价 |
|------|------|
| **NotionNext** | 最适合你的工作流。内容管理体验最好，但成员管理需要二开。你的 Notion 熟练度是核心优势。 |
| **Payload CMS** | 技术上最优解——把 Sanity + Supabase 合并为一个系统。但需要开发者维护，没解决「非技术编辑」问题。 |
| **WordPress+BuddyBoss** | 功能最全（成员、活动、博客、社交）。但维护负担重，安全风险高，技术栈老旧。 |
| **Discourse** | 讨论社区最强。但它是论坛，不是社区官网。可以作为后期附加。 |
| **Ghost** | 写作体验最好。但没有活动管理，成员模型是订阅者不是社区成员。不适合。 |
| **飞书多维表格** | 国内数据管理好工具。但不是建站平台。可以作为内部运营工具补充。 |
| **Wix/Squarespace** | 国内访问太慢/被墙。直接排除。 |
| **Gridea / Hexo / VuePress** | 静态博客工具，没有动态功能。排除。 |

---

## 3. 三条可行路径

综合所有调研，IGAI 社区官网有三条可行路径：

### 路径 A：NotionNext 二开（推荐）

**适合你的理由**：
- 你已经在用 NotionNext 跑博客，工具链零学习成本
- Notion 是你日常使用的工具，内容管理零摩擦
- 多数据库功能支持活动、成员、博客分开管理
- VPS 部署方案成熟，国内访问无障碍

**需要二开的部分**：
1. 成员展示页（~2 天）
2. 活动详情模板（~1 天）
3. 首页定制（~2 天）
4. 主题暗色定制（~1 天）

**总工作量：5-9 天**

**代价**：
- 成员登记需要外部表单（飞书/Notion Form）
- 丢失 IGNAI 当前的申请状态流转（submitted → reviewing → ...）
- 设计自由度受限于 NotionNext 的主题框架

### 路径 B：Payload CMS 替代 Sanity + Supabase

**适合你的理由**：
- 保留当前 Next.js 前端和暗色设计
- 把两个后端（Sanity + Supabase）合并为一个（Payload）
- 内置认证系统，支持真正的用户管理
- 数据关系支持（活动关联成员、记录关联作者）

**工作量**：
- Sanity schema → Payload collection 迁移（~3 天）
- Supabase REST → Payload API 迁移（~2 天）
- 前端 API 调用适配（~2 天）
- 测试和验证（~2 天）

**总工作量：7-12 天**

**代价**：
- 仍然是自建架构，需要开发者维护
- 不解决「非技术用户编辑内容」的问题
- Payload 的编辑体验不如 Notion

### 路径 C：NotionNext 主站 + Payload CMS 数据层

**混合方案**：
- NotionNext 做内容展示（活动、记录、博客、首页）
- Payload CMS 做业务数据（成员登记、申请管理）
- 两个系统通过 API 对接

**优点**：兼顾 Notion 的编辑体验和 Payload 的数据管理能力
**缺点**：复杂度最高，又回到了「多系统缝合」的问题

---

## 4. 我的最终推荐

### 如果只能选一个：路径 A（NotionNext 二开）

理由很简单：

1. **你的时间是最大的约束**。NotionNext 二开 5-9 天，Payload 迁移 7-12 天，当前自建已经投入 3-4 周还没完成。
2. **你的 Notion 熟练度是不可复制的优势**。这不是技术选型问题——这是「什么工具让你最愿意持续产出内容」的问题。
3. **社区官网的核心不是架构，是内容**。一个每天更新的 Notion 驱动的网站，远比一个架构精良但内容陈旧的自建网站有价值。
4. **国内部署方案成熟**。NotionNext 有完整的 VPS Docker 部署教程，10 分钟就能在国内服务器上跑起来。

### 成员管理的务实方案

不要试图在网站里做完整的成员管理系统。用这个方案：

```
成员提交表单（飞书/Notion Form）
        ↓
数据自动写入 Notion「成员」Database
        ↓
管理员在 Notion 里审核
        ↓
NotionNext 多数据库功能读取「成员」Database
        ↓
/members 页面展示头像卡片
```

**不需要数据库，不需要 API，不需要认证系统。** Notion 就是你的后端。

### 部署建议

1. **起步**：Vercel + CNAME 加速（`cname-china.vercel-dns.com`），零成本
2. **如果不够快**：迁移到国内 VPS Docker 部署，按 NotionNext 官方文档操作即可
3. **域名**：如果有 ICP 备案，加腾讯云 CDN 加速

---

## 5. 行动清单

如果你想走 NotionNext 路径，下一步按这个顺序做：

```
□ 1. 创建 IGNAI 的 Notion Database（按文档模板）
□ 2. Fork NotionNext，创建 ignai-community 项目
□ 3. 配置 NOTION_PAGE_ID 为多数据库格式
□ 4. 选择 heo 主题，开启暗色模式
□ 5. 部署到 Vercel，验证基础功能
□ 6. 迁移 IGNAI 内容到 Notion（活动 → 记录 → 文章 → 文案）
□ 7. 二开成员展示页（/members）
□ 8. 二开活动详情模板
□ 9. 首页定制（Hero + 活动卡片 + 社区简介）
□ 10. 域名切换 ignai.community → 新站点
```

**IGAI 自建版本可以归档。** 它的 UI 设计和文案有参考价值，但架构方向不值得继续投入。

---

## 6. 关于架构选择的心法

这次调研让我看清了一件事：**架构选择不是技术问题，是人的问题。**

| 问题 | 自建架构的回答 | NotionNext 的回答 |
|------|--------------|------------------|
| 谁来写内容？ | 开发者（需要懂 TypeScript） | 任何人（需要懂 Notion） |
| 谁来维护服务？ | 开发者（需要关注 3 个 SaaS） | 没人（Vercel + Notion 自维护） |
| 内容更新的瓶颈在哪？ | 开发者时间 | 无瓶颈（Notion 即时更新） |
| 出了问题谁排查？ | 开发者 | NotionNext 社区 |

**当你是一个人或小团队时，架构应该服务于你的内容产出效率，而不是你的技术探索欲望。**

IGNAI 自建架构的技术选型没有错——Sanity 是好的 CMS，Supabase 是好的数据库，Next.js 是好的框架。但把它们缝在一起维护的成本，对一个社区官网来说太高了。

NotionNext 不完美——成员管理需要二开，活动管理不如专门的活动平台，Notion API 有速率限制。**但它让你把时间花在社区运营上，而不是在配置 Supabase RLS 策略上。**

这就是正确的取舍。

---

*本文基于 NotionNext v4.9.5.2 官方文档（docs.tangly1024.com）、11 种替代方案调研、Vercel 国内加速方案研究写成。*
