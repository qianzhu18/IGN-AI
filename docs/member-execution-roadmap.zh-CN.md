# Member 体系详细执行文档

记录日期：2026-05-11

## 1. 文档目的

这份文档不是概念说明，而是执行文档。

它服务 4 个目标：

1. 让你自己知道这条线接下来每一步做什么
2. 让 AI 进入仓库后可以直接接着干
3. 让“本地社区产品”和“上游开源贡献”两条线并行推进
4. 让未来拆 PR、写复盘、写简历时都有清晰材料

## 2. 当前项目现实

这个仓库不是一个干净的上游 fork 演示仓库，而是：

1. 一个正在演进的 IGNAI 社区官网仓库
2. 一个基于 NotionNext 做社区化二次开发的真实产品仓库
3. 一个未来要把通用能力反向整理成开源贡献的试验场

所以所有工作都必须遵守一个原则：

```text
先在真实产品里验证
再把通用部分整理成上游贡献
```

而不是反过来。

## 3. 总目标

围绕 `Member` 能力，建立一条完整链路：

```text
Notion 数据定义
-> 仓库数据层识别
-> 路由层可访问
-> 社区首页可见
-> 成员详情可承载身份信息
-> 后续文章作者、活动、组织结构都能挂接
```

这条链路一旦跑通，后面就能自然扩展到：

- 多作者文章
- Event 主体页
- 成员与活动关联
- 社区组织页
- Admin / Ops 管理视图

## 4. 当前已完成

### 4.1 数据层
- 已支持 `Member` 作为 page type
- 已暴露 `allMembers`
- 已保持原有 `Post` 列表逻辑兼容

### 4.2 路由层
- 已有 `/members`
- 已有 `/members/[slug]`
- 已做 member slug fallback 兼容

### 4.3 产品接入
- `ignai` 导航已增加 `Members`
- footer 已增加 `Members`
- 首页成员区块已支持优先使用真实 member 数据

### 4.4 文档骨架
- 已有 `AGENTS.md`
- 已有 `AI_HANDOFF.md`
- 已有 Member schema / checklist / execution playbook

## 5. 接下来要完成的阶段

下面按优先级拆成 5 个阶段。建议严格按顺序推进。

---

## Phase 1: 稳定 Member MVP

### 目标
让 Member 不只是“能访问”，而是“可持续使用”。

### 子任务

#### 1. 清理和统一成员字段读取
要确认并统一这些字段在实际 Notion 数据中的命名情况：

- `title`
- `slug`
- `avatar`
- `bio`
- `role`
- `featured`
- `social_github`
- `social_x`
- `social_linkedin`
- `website`

#### 2. 明确 slug 规范
推荐统一为：

```text
members/<person-slug>
```

例如：

```text
members/qianzhu
members/alice-chen
```

#### 3. 强化目录页展示
`/members` 页面后续应补：

- featured 排序是否符合预期
- 缺头像时的视觉 fallback
- bio 过长时的截断策略
- 社交字段缺失时的 UI 处理

#### 4. 强化详情页展示
成员详情页后续应补：

- 更清晰的身份信息层级
- related posts 预留位
- related events 预留位

### 涉及文件
- `lib/db/SiteDataApi.js`
- `lib/db/notion/getPageProperties.js`
- `pages/members/index.js`
- `pages/members/[slug].js`
- `src/components/members/MemberDirectoryPage.js`
- `src/components/members/MemberProfilePage.js`

### 验收标准
- Notion 中新增一个 `Member` 页面后，目录页能看到
- 点击目录卡片能进入详情页
- 缺失部分字段时页面不报错、不塌
- 不影响原有博客首页、归档、分类、标签页

---

## Phase 2: 让 Member 体系接进内容系统

### 目标
把“成员系统”从独立功能变成“内容系统的一部分”。

### 子任务

#### 1. 文章作者链接到成员页
如果文章存在作者信息，优先尝试映射到 `Member` 页面。

可选方式：

1. 通过作者名匹配 member title
2. 通过 author slug / handle 匹配
3. 通过扩展字段显式绑定

推荐路线：

```text
先支持显式绑定
再考虑模糊兼容
```

#### 2. 成员页展示相关文章
成员详情页可以展示：

- authored posts
- mentioned posts
- future related events

第一阶段先做 authored posts 即可。

#### 3. 首页成员区块进一步增强
当前首页已能使用真实 member 数据，下一步建议补：

- featured member 优先展示
- “查看全部成员”之外再加一层角色感
- 与社区身份叙事更紧密地结合

### 涉及文件
- `lib/db/SiteDataApi.js`
- `lib/utils/post.js`
- 相关主题文章组件
- `src/components/members/MemberProfilePage.js`
- `themes/ignai/index.js`

### 验收标准
- 至少一种作者字段能正确跳转到成员页
- 成员详情页能看到相关文章列表
- 首页成员模块不只是展示头像，而是开始承载“组织感”

---

## Phase 3: 把 Member 体系升级为社区组织层

### 目标
让 Member 不只是个人页，而是组织结构的一部分。

### 子任务

#### 1. 增加组织属性
可逐步加入：

- `team`
- `city`
- `status`
- `focus`
- `intro`
- `join_year`

#### 2. 支持成员分组
例如：

- Core
- Contributors
- Community Hosts
- Fellows

#### 3. 支持首页 / 组织页专题模块
例如：

- Featured Members
- Organizers
- Builders this month

### 涉及文件
- `docs/member-schema.md`
- `src/components/members/*`
- `themes/ignai/index.js`
- 未来新增组织页组件

### 验收标准
- 成员数据不再只是个人卡片，而具备组织分层表达能力
- 首页和目录页能表达“这个社区是谁在构成”

---

## Phase 4: 为 Event 和多作者能力做准备

### 目标
让 `Member` 成为后续 Event / authors / ops 的基础锚点。

### 子任务

#### 1. 准备多作者文章结构
建议后续支持：

- `author`
- `authors`
- `author_slugs`

#### 2. 准备 Event 与 Member 关联
建议后续支持：

- organizer
- co-host
- speaker
- related members

#### 3. 准备活动报名 / 内容发布链路
使 `Member` 成为：

- 活动组织者展示入口
- 线下活动 credibility signal
- 社区关系网络的一部分

### 验收标准
- Event / Post 的 schema 扩展不会推翻现有 Member 设计
- 后续功能可以在现有结构上平滑扩张

---

## Phase 5: 拆成可上游贡献的 PR

### 目标
把你在真实社区产品里验证过的部分，转成漂亮的上游贡献。

### 拆分原则

#### 可以上游的
- `Member` page type 支持
- `allMembers` 数据出口
- 基础成员路由约定
- 通用 schema 文档
- member filtering / ordering helper

#### 不建议直接上游的
- `ignai` 品牌表达
- 社区首页的定制文案
- 你自己的组织 narrative
- 本地运营策略

### 推荐 PR 顺序

#### PR 1
docs / roadmap / community-site rationale

#### PR 2
data layer: `Member` support + `allMembers`

#### PR 3
generic route / member detail conventions

#### PR 4
tests + docs refinement

### 验收标准
- 每个 PR 的 scope 小而清晰
- 上游维护者能一眼看懂“这不是私货定制，而是通用能力扩展”

## 6. 文件级执行地图

### A. 共享层文件
这些文件优先按照“未来可上游”的方式写：

- `lib/db/SiteDataApi.js`
- `lib/db/notion/getPageProperties.js`
- `lib/site/site.types.ts`
- `lib/site/processors/*`
- `pages/members/*`
- `docs/member-schema.md`

### B. 本地产品层文件
这些文件主要服务你的社区官网表达：

- `themes/ignai/index.js`
- `themes/ignai/config.js`
- `themes/ignai/components/*`
- `src/components/members/*`

### C. AI 协作层文件
这些文件用来持续接力：

- `AGENTS.md`
- `AI_HANDOFF.md`
- `docs/community-mvp.md`
- `docs/execution-playbook.md`
- `tasks/member-mvp-checklist.md`

## 7. 每次工作 Session 的推荐流程

每次继续开发时，建议按下面 7 步走：

### 1. 先读文档
至少先看：

- `AGENTS.md`
- `AI_HANDOFF.md`
- `docs/member-execution-roadmap.zh-CN.md`
- `tasks/member-mvp-checklist.md`

### 2. 确认当前目标
每次只做一个明确目标，例如：

- 让首页成员区块变成 live data
- 让 author 链接到 member
- 为上游准备一个最小 diff

### 3. 确认改动边界
开始前就先标出来：

- 哪些文件属于共享层
- 哪些文件属于本地层

### 4. 做实现
优先小步提交，不做大杂烩。

### 5. 做验证
至少要跑：

- 定点 lint
- 必要时跑页面验证
- 确认不影响现有博客主流程

### 6. 记录结果
每次都记录：

- 改了哪些文件
- 本地产品价值是什么
- 哪些可上游
- 下一个动作是什么

### 7. 判断是否可以拆 PR
不是每次都要拆，但每次都要问：

```text
这次新增里，有没有一小块已经成熟到可以独立上游？
```

## 8. 风险清单

### 风险 1：Notion 字段不统一
不同成员页字段命名不统一，会导致 UI 表现不稳定。

应对：

- 严格文档化 schema
- 在代码里做有限兼容
- 最终推动内容录入规范统一

### 风险 2：本地 UI 改动污染上游逻辑

应对：

- 共享层只处理数据与基础路由
- 主题视觉表达留在 `ignai`

### 风险 3：一次改动 scope 太大

应对：

- 严格按 phase 推进
- 每次只完成一个子目标

### 风险 4：为了上游而提前抽象

应对：

- 先在本地产品里被真实使用
- 观察是否稳定，再决定抽象

## 9. 当前推荐的下一步

按照现在仓库状态，最推荐的顺序是：

### Next 1
让文章作者链接到成员页

### Next 2
在成员详情页展示相关文章

### Next 3
补 member filtering / ordering tests

### Next 4
准备第一版 upstreamable diff

## 10. 以后给 AI 的标准指令

以后如果你想让 AI 接着干，最稳的一句是：

```text
请先阅读 /AGENTS.md、/AI_HANDOFF.md、/docs/member-execution-roadmap.zh-CN.md、/docs/member-schema.md、/docs/execution-playbook.md、/tasks/member-mvp-checklist.md，然后继续推进 Member 体系。优先说明这次改动的共享层和本地层边界，再开始实现。
```

这句话的作用是：

1. 把 AI 拉回当前项目上下文
2. 防止 AI 误把本地定制全都往上游抽
3. 让每次工作都能接到同一条长期主线

## 11. 配套文件

为了让这份路线图真正可执行，仓库里还配了两份辅助文件：

- `tasks/member-session-template.md`
  - 每次开发一个新子任务时，用它来约束范围、验证和结果记录
- `docs/upstream-pr-split-checklist.zh-CN.md`
  - 每次准备把本地验证过的能力拆成上游 PR 时，用它检查是否混入了本地定制
