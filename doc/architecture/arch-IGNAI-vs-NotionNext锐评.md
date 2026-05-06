# IGNAI vs NotionNext 架构锐评：自建平台到底值不值？

> 作者：千逐 / Lucien
> 日期：2026-05-06
> 触发：实际使用 IGNAI 自建架构后感到「麻烦」，回头对比 NotionNext 的博客项目，做一个诚实的架构判断

---

## 0. 写在前面

这不是一篇吹一个踩一个的对比。NotionNext 有自己的问题，IGNAI 也有它做得对的地方。但如果你是一个**个人开发者 + 小团队运营者**，你需要一个诚实的答案：**自建全栈架构到底是在解决真问题，还是在给自己制造问题？**

我的结论先放这里：**对当前阶段的 IGNAI 社区来说，自建 Sanity + Supabase 双后端架构是 over-engineering。用 NotionNext 的「Notion 即一切」模式来承载这个社区官网，在运维成本、使用体验、持续维护三个维度上都更优。**

下面是完整的论证。

---

## 1. 两种架构的本质区别

先说清楚两个项目到底在做什么：

| 维度 | NotionNext (Nobelium 系) | IGNAI 自建架构 |
|------|--------------------------|---------------|
| **后端数量** | 1 个（Notion） | 3 个（Vercel + Sanity + Supabase） |
| **内容管理** | Notion 原生编辑器 | Sanity Studio（需学习） |
| **业务数据** | Notion Database（同上） | Supabase PostgreSQL（需建表） |
| **部署** | Vercel 一键 | Vercel + 环境变量配置 18 个 |
| **编辑入口** | Notion APP（手机/电脑/网页） | Sanity Studio（仅网页，仅 /studio 路径） |
| **数据迁移** | 导出 Notion 即可 | 需要从 Sanity 导 JSON + Supabase 导 CSV |
| **代码中胶水代码占比** | ~5%（几乎全是渲染逻辑） | ~35%（连接、降级、fallback、认证） |

核心差异一句话：

> **NotionNext 把 Notion 当「万能后端」，IGNAI 把三个 SaaS 缝在一起当「专业架构」。**

问题是——你的社区官网需要「专业架构」吗？

---

## 2. 使用体验：你为什么觉得「麻烦」

### 2.1 发一篇活动公告要几步？

**NotionNext：**
1. 打开 Notion APP
2. 新建一行，type 选 Event，填标题、日期、摘要
3. 在页面里写正文
4. 网站自动同步（ISR 60 秒）

**IGNAI：**
1. 确认 Sanity Studio 能打开（需要 OPS 密码登录）
2. 进入 /studio
3. 找到 Event schema
4. 填写：title、slug（手写）、subtitle、status（下拉）、dateText、location、format（下拉）、coverImage（需要先上传到 Sanity 的 asset 系统）、excerpt、tags（数组）、registrationUrl、audience（数组）、agenda（数组 of 对象）、hosts（数组）、notes（数组）、content（sectionBlock 数组，每个有 heading + body）
5. 发布
6. 等待 ISR revalidate（60 秒）
7. 如果页面显示的还是旧数据，去检查——是 Sanity 查询为空触发了 fallback 吗？还是 GROQ 查询有问题？

**差距：2 步 vs 7+ 步。**

而且 NotionNext 的第 2-3 步你可以在手机上完成。IGNAI 的步骤 2-4 你必须在电脑上完成，因为 Sanity Studio 的移动端体验几乎不可用。

### 2.2 改一下社区简介要几步？

**NotionNext：**
1. 在 Notion 里找到对应的 Page 行
2. 修改正文
3. 完了

**IGNAI：**
1. 打开代码编辑器
2. 找到 `src/content/community.ts`
3. 修改 TypeScript 对象里的中文文案
4. 确认 TypeScript 没报错
5. `npm run check` 验证
6. git commit + push
7. 等 Vercel 构建部署

**为什么？** 因为 IGNAI 的社区简介（Hero 文案、文化描述、身份认同、加入引导）完全**没有 Sanity 对应的 schema**。这些内容只能通过编辑 TypeScript 源码来修改。

`src/content/community.ts` 有 143 行，`src/content/site.ts` 有 37 行，`src/content/links.ts` 有 59 行——这些核心站点文案**永远无法通过 CMS 编辑**。所谓的「Sanity 优先 + fallback」策略，对这些内容根本不适用。

### 2.3 配置一个新的环境要多久？

**NotionNext：**
1. Fork 仓库
2. 设一个环境变量：`NOTION_PAGE_ID`
3. 部署到 Vercel
4. 完了

**IGNAI：**
1. Clone 仓库
2. 配置 18 个环境变量（`.env.example` 有 34 行）
3. 确保 Sanity 项目存在（需要手动创建或在 `env.ts` 里用预填的 project ID）
4. 确保 Supabase 项目存在（需要手动创建 + 运行 SQL migration）
5. 配置 `OPS_ACCESS_PASSWORD`
6. 运行 `npm run sanity:cors:add-local`
7. `npm run dev` 验证一切正常
8. 发现 join 功能不工作 → 检查 Supabase 配置
9. 发现 Sanity 内容为空 → 开始在 Studio 里手动创建测试数据
10. 或者直接投降，让 fallback 数据顶着

---

## 3. 架构层面：自建平台的隐性成本

### 3.1 三重类型冗余

IGNAI 里每个内容类型都要维护**三份定义**：

以 Event 为例：
- `src/sanity/schemaTypes/event.ts`（216 行）—— Sanity 的 schema，定义编辑器 UI 和存储结构
- `src/content/events.ts`（147 行）—— TypeScript fallback 数据，定义了 `EventItem` 类型
- `src/lib/events.ts`（98 行）—— 中间层，定义了 `SanityEvent` 类型，做 GROQ 查询和 `normalizeEvent()` 转换

改一个字段（比如给活动加一个「费用」字段），你需要改**三个文件**，并且确保三边的类型兼容。

NotionNext 里改一个字段？在 Notion Database 里加一列就行。代码会自动读取新的列。

### 3.2 35% 的代码是胶水

我统计了 IGNAI 的 `src/lib/` 目录：

| 文件 | 行数 | 内容 |
|------|------|------|
| `supabase.ts` | 224 | 手写 REST 调用、类型定义、状态管理 |
| `join.ts` | 105 | 三级降级路由（Supabase → local → 503） |
| `opsAuth.ts` | 65 | 手写密码认证、SHA256、Cookie 管理 |
| `sanity.ts` | 64 | GROQ 查询、fallback 逻辑 |
| `events.ts` | 98 | GROQ 查询、类型转换、fallback |
| `links.ts` | 59 | 环境变量到链接的映射 |
| `sanity/env.ts` | 19 | 环境变量读取 |

**总共 634 行，100% 是胶水代码。** 没有一行是业务逻辑——全是连接、配置、降级、转换。

NotionNext 的 `lib/notion/` 目录：
- `getAllPosts.js` — 从 Notion 拿数据
- `getPostBlocks.js` — 拿页面内容
- `filterPublishedPosts.js` — 过滤

总共 ~200 行，全部是数据获取，没有降级逻辑，没有类型转换，没有环境变量路由。

### 3.3 认证系统的隐患

IGNAI 的认证方案：`SHA256(password)` 当 Cookie value。

```typescript
// src/lib/opsAuth.ts:33
export function createOpsSessionValue() {
  return hashValue(opsAccessPassword);
}
```

这意味着：
- Cookie 里存的就是密码的哈希
- 没有 nonce，没有过期签名
- 如果 Cookie 泄露（XSS、日志），等同于密码泄露
- 无法单独撤销某个 session
- 所有人共享同一个密码，无法审计

NotionNext 压根不需要认证——内容在 Notion 里编辑，网站是只读的。管理操作通过 Notion 本身的账号体系完成。

### 3.4 Fallback 是双刃剑

IGNAI 的 fallback 策略看起来很优雅：

```
Sanity 有数据 → 用 Sanity
Sanity 没数据 → 用 src/content/ 的硬编码数据
```

但实际问题是：**你无法区分「Sanity 挂了」和「Sanity 被清空了」。**

如果运营者不小心删了所有活动，网站会静默地显示 fallback 的 3 条假活动。运营者可能以为「内容还在」，实际上用户看到的是占位数据。**没有任何告警。**

NotionNext 没有 fallback——Notion 挂了就是挂了，用户看到的是 ISR 缓存的旧页面。这反而更诚实。

---

## 4. NotionNext 能不能做 IGNAI 的事？

### 4.1 内容展示：完全可以

IGNAI 的核心功能就是内容展示：
- 首页（社区介绍）
- 活动列表 + 详情
- 记录列表 + 详情
- 故事 / 博客
- 社区角色展示
- 加入引导

NotionNext 的 Notion Database 完全可以通过 `type` 列区分 Post / Event / Story / Record / Page。每个 type 可以有不同的详情页模板。Notion 的富文本编辑器支持标题、图片、代码块、嵌入——比 Sanity 的 sectionBlock（只有 heading + body）更灵活。

### 4.2 加入申请：需要变通

IGNAI 的 Supabase 申请系统是它选择自建架构最合理的理由。但——

**Notion 也能存数据。** NotionNext 的 Database 本身就是一个数据库。你可以创建一个「Join Applications」Database，通过 Notion API 或第三方表单工具（比如 Notion Forms、Feishu 多维表格）写入申请。

IGNAI 现在的申请状态流转是 `submitted → reviewing → contacted → accepted / waitlisted / ...`。这个在 Notion 的 Select/Rollup 列里完全可以实现。

代价是：你失去了 Supabase 的 RLS（行级安全）、SQL 查询、并发写入能力。但对一个**月入几十份申请的社区**来说，Notion 的 Database 完全够用。

### 4.3 运营后台：Notion 就是后台

IGNAI 需要 `/ops/join` 来管理申请。NotionNext 里？直接在 Notion 里看 Database，筛选、排序、修改状态，比任何自建的 admin panel 都好用。

### 4.4 哪些是 NotionNext 做不到的

- **实时写入**：Notion API 有速率限制（429），不适合高并发写入
- **复杂关联查询**：Notion Database 不支持 SQL 级别的 JOIN
- **自定义认证**：Notion 的分享链接是唯一的访问控制
- **服务端渲染动态内容**：ISR 有 60 秒延迟

但问题是——**IGNAI 当前用到了这些吗？** 没有。

---

## 5. 鲁棒性：谁更不容易挂？

| 故障场景 | NotionNext | IGNAI |
|----------|-----------|-------|
| CMS 挂了 | ISR 缓存继续服务（最多 60 秒前的内容） | Fallback 到硬编码数据（可能是过时的） |
| 数据库挂了 | 不适用（Notion 既是 CMS 也是数据库） | 申请提交返回 503，无重试机制 |
| Vercel 挂了 | 两边都挂 | 两边都挂 |
| 环境变量配错 | 一个变量，影响范围小 | 18 个变量，任何一个配错都可能导致功能异常 |
| Notion API 改版 | 社区会快速修复（用户基数大） | Sanity SDK 升级可能破坏 GROQ 查询，需要自己修 |
| 运营者误操作 | Notion 有回收站，30 天内可恢复 | Sanity 有历史版本（如果开启了）；Supabase 需要 SQL 恢复 |

**NotionNext 的单点故障更少。** 一个系统（Notion）挂了，你只需要等它恢复。IGNAI 有三个外部依赖（Vercel + Sanity + Supabase），任何一个挂了都需要排查。

---

## 6. 生态工具与 Skill 化趋势

2026 年的 AI 工具生态正在快速进化。Claude Code 的 Skill 系统（如 `choupiyang/ZAI_SKILLS` 的 48+ skills）和 `eze-is/web-access` 的联网能力 Skill，代表了新的方向：**AI Agent 不需要复杂的后端架构，而是需要简单的、可访问的数据接口。**

NotionNext 天然契合这个趋势：
- Notion API 是标准 REST，任何 AI Agent 都能直接读写
- 内容格式（Markdown/Block）是通用的
- 不需要理解 GROQ、PostgREST 或自定义认证

IGNAI 的架构则要求 AI Agent：
- 理解 Sanity 的 GROQ 查询语言
- 理解 Supabase 的 PostgREST API 格式
- 理解 OPS Cookie 认证
- 知道什么时候该走 fallback

每多一层抽象，AI Agent 的使用效率就低一层。

---

## 7. 判断：什么时候自建才有意义

| 阶段 | 社区规模 | 推荐架构 |
|------|---------|---------|
| 0→1（冷启动） | < 100 人 | **NotionNext**。零运维，内容在 Notion 里写，专注社区运营 |
| 1→10（成长） | 100-500 人 | **NotionNext + 外部表单**。用 Feishu/问卷收集申请，Notion 做展示 |
| 10→100（规模化） | 500-5000 人 | **考虑自建**。需要真正的用户系统、权限管理、付费内容 |
| 100+（平台化） | 5000+ 人 | **必须自建**。需要微服务、CDN 优化、数据库分片 |

IGNAI 目前处于**阶段 0→1**。自建架构是在解决**阶段 10→100** 的问题。

这不是技术能力的展示——这是优先级的错位。你应该花时间在社区运营、内容生产、活动组织上，而不是在配置 Supabase RLS 策略和调试 GROQ 查询上。

---

## 8. 诚实的建议

### 短期（现在就该做）

1. **评估迁移到 NotionNext 的成本**。你的博客已经在 NotionNext 上了，证明你熟悉这个工具。把 IGNAI 的内容迁移到一个 Notion Database 里，可能只需要 1-2 天。
2. **如果不想迁移**，至少把 `src/content/` 里的 6 个文件迁移到 Sanity schema 里。让所有内容都可以通过 Studio 编辑，而不是需要改 TypeScript 代码。
3. **Supabase 调用加重试**。当前的零重试意味着网络抖动直接导致申请丢失。

### 中期（1-3 个月）

1. **统一数据层**。如果继续自建，Sanity 和 Supabase 之间的职责划分需要重新审视。当需要「在活动页面展示报名人数」时，你就知道跨数据源的痛苦了。
2. **认证升级**。共享密码门在有多个管理员时是不可接受的。要么用 NextAuth/Clerk，要么至少加 nonce + 服务端 session 存储。
3. **可观测性**。加 Vercel Analytics + 结构化日志。当前出了问题你完全不知道。

### 关于「自建 vs 用现成平台」

自建平台的隐性承诺是：**你可以完全控制一切。** 但控制一切的代价是：**你必须维护一切。**

用现成平台的隐性承诺是：**你受限于平台的能力。** 但受益是：**平台的能力就是你的能力。**

对一个人或两三个人的团队来说，「受限于 Notion 的能力」远比「必须自己维护三个 SaaS 的集成」要好。Notion 的上限够高，而自建架构的维护成本是线性的——每多一个功能，就多一层胶水代码。

---

## 9. 结论

架构师的责任不是选择最复杂的技术栈，而是在约束条件下做出最合适的取舍。

IGNAI 当前的架构在技术上没有错——它是一个完整、可工作、有 fallback 的全栈应用。但它在**工程经济性**上不成立：

- **18 个环境变量**配置一个社区官网，太重了
- **35% 的代码是胶水**，太浪费了
- **6 个 TypeScript 文件**里的核心文案无法通过 CMS 编辑，太荒谬了
- **三个 SaaS 供应商**的账号管理和运维认知负担，对个人开发者来说太多了

如果你问我**现在会怎么做**：

> 用 NotionNext 重建 IGNAI 官网，把活动、记录、故事、博客全部放在一个 Notion Database 里。加入申请用 Notion Form 或飞书多维表格。省下来的时间去做社区真正需要的事：组织活动、连接人、生产内容。

架构是手段，不是目的。**最好的架构是你感受不到它存在的架构。**

---

*本文基于 IGNAI `codex/aesthetic-spacing-preview` 分支源码、NotionNext (Nobelium) 开源项目架构、以及实际使用体验写成。*
