# NotionNext 社区能力提案

记录日期：2026-05-11

## 目标

把 IGNAI 在社区官网建设里遇到的真实需求，拆成两类：

```text
1. 适合在 IGNAI 本地项目内实现的业务能力
2. 适合抽象成 NotionNext 上游 issue / PR 的通用能力
```

这样做的原因很直接：

```text
不是所有“社区运营能力”都适合塞进 NotionNext
但其中一部分“内容模型、列表模板、内容分流能力”确实有上游价值
```

## 你的原始需求，翻译成产品语言后是什么

当前需求可以整理成 6 个点：

```text
成员添加与展示管理
活动发布与报名入口
表格收集信息
内容发布分流
成员头像预览与 bio 展示
把社区沉淀成博客 / 故事 / 资源库
```

这些需求表面上都叫“内容管理”，但底层其实分成三层：

### A. 展示层

```text
成员卡片
成员详情页
活动列表与详情页
博客 / 故事 / 资源分开的入口与路由
首页精选预览区
```

### B. 内容模型层

```text
member / people
event
story
article
resource
```

### C. 业务层

```text
谁能编辑
谁只能预览
表单收集到哪里
报名状态怎么流转
加入申请是否转成员
```

其中：

```text
A + B 有机会抽象成 NotionNext 通用能力
C 更像 IGNAI 自己的社区运营系统，应该留在本地实现
```

## 先说结论：哪些该提上游，哪些不该

### 适合提 NotionNext issue / PR

```text
支持多内容类型 collection，而不只把数据库默认为博客文章
支持 People / Members 类型的列表与详情模板
支持 Event 类型的结构化字段和展示模板
支持按内容类型拆分导航、列表页、详情页和首页精选区
支持更清晰的示例文档：社区站、活动站、成员目录站
```

### 不建议直接提给 NotionNext 的需求

```text
管理员与成员账号体系
登录、权限、审核流
报名数据存储
表格回收与状态流转
申请转成员
私密联系方式管理
```

原因不是这些需求不重要，而是：

```text
它们需要数据库、认证、RLS、后台工作流
已经超出 NotionNext 作为静态内容框架的天然边界
```

## 建议的上游 issue 拆法

下面这 5 条最适合先发 issue。

---

## Issue 1

### 标题

```text
Feature: support typed content collections beyond blog posts
```

### 要解决的问题

NotionNext 现在非常强在“博客文章”这条主链路，但如果拿它做社区官网，会遇到一个典型问题：

```text
活动、成员故事、资源、成员目录都只能绕着 post/page 思路去适配
```

结果就是：

```text
内容模型不清晰
页面模板复用困难
首页推荐区和列表页都需要大量二开
```

### 建议能力

支持为不同数据库声明内容类型，例如：

```text
article
event
story
resource
person
```

并允许每种类型配置：

```text
列表页路由
详情页路由
卡片字段映射
默认排序规则
首页精选规则
```

### 验收标准

```text
至少支持 3 种以上 collection type 的独立路由与列表页
配置方式不依赖硬编码主题二开
旧版 blog-only 配置保持兼容
```

### PR 可切范围

```text
先做 collection type 配置层与路由映射
不必一次性把所有模板都做完
```

---

## Issue 2

### 标题

```text
Feature: add a people/member directory template
```

### 要解决的问题

很多社区站、组织站、创作者团队站，都需要一个轻量的成员目录：

```text
头像
名字
角色
一句话 bio
标签
外部链接
```

但 NotionNext 当前缺少一套现成的 People 模型和成员页模板，导致用户只能：

```text
把成员当文章发
或者完全自己手搓列表与详情页
```

### 建议字段

```text
name
slug
avatar
title
bio
tags
location
links
featured
sortOrder
```

### 建议页面

```text
/members
/members/[slug]
首页 featured members 区块
```

### 验收标准

```text
成员卡片支持头像预览
支持短 bio 与标签展示
支持精选成员
支持空状态与移动端适配
```

### PR 可切范围

```text
先提供 schema 约定 + 基础列表模板
详情页和首页精选区可以第二步补
```

---

## Issue 3

### 标题

```text
Feature: add an event collection template with registration CTA
```

### 要解决的问题

社区官网里的活动，不等于普通博客文章。除了正文，还需要结构化字段：

```text
时间
地点
活动状态
线上 / 线下
报名链接
报名二维码
适合谁参加
```

如果没有事件模板，活动发布就会变成“用博客字段硬凑”，编辑体验和前台展示都会很别扭。

### 建议能力

支持 Event collection 的字段映射和默认卡片：

```text
title
slug
cover
dateText
location
status
format
registrationUrl
registrationQr
summary
tags
```

### 验收标准

```text
活动列表卡支持时间 / 地点 / 状态
详情页支持报名 CTA
支持未开始 / 报名中 / 已结束等基础状态
```

### PR 可切范围

```text
先做事件字段映射和列表卡
二维码与复杂报名逻辑保持可选
```

---

## Issue 4

### 标题

```text
Feature: support content hubs separated by type
```

### 要解决的问题

当一个站点同时有：

```text
博客
活动
故事
资源
成员
```

用户需要的不是一个混在一起的大列表，而是：

```text
分开的导航入口
分开的 archive / hub 页面
首页按类型精选
```

### 建议能力

允许配置独立的内容入口，例如：

```text
/blog
/events
/stories
/resources
/members
```

并支持首页按类型抓取：

```text
最新文章
近期活动
精选成员
故事 / 记录
```

### 验收标准

```text
不同类型内容可独立展示
同一主题内可配置多个内容 hub
不破坏原有单博客站点
```

### PR 可切范围

```text
先做 hub 路由与查询分组
主题层首页模块可以先提供一个参考实现
```

---

## Issue 5

### 标题

```text
Docs: add a community-site example for NotionNext
```

### 要解决的问题

现在 NotionNext 的心智模型主要还是：

```text
博客
个人站
主题切换
```

但越来越多用户想拿它做：

```text
社区官网
活动站
组织站
成员目录站
```

缺的不是灵感，而是一份“官方推荐做法”。

### 建议文档内容

```text
如何把数据库拆成 article / event / people / resource
哪些需求建议继续用外部表单或 Supabase
哪些适合仅用 Notion 管
一个最小社区站目录结构示例
```

### PR 可切范围

```text
纯文档 PR 就能先发
风险小，也更容易被合并
```

## 哪些更适合先提 PR，而不是先提 issue

如果你想提高命中率，建议优先顺序如下：

### 第一优先级：文档 PR

最稳，原因：

```text
不碰核心数据流
不触发大范围兼容风险
最容易让维护者看到“这个场景是真实存在的”
```

可以先提：

```text
Docs: community site use cases and recommended data model
```

### 第二优先级：Events 模板 PR

这是最接近 NotionNext 现有内容链路的增强。

```text
活动本质上仍然是内容
只是字段比博客更结构化
```

### 第三优先级：People / Members 模板 PR

这个也很有价值，但要多处理一点：

```text
列表卡设计
详情页布局
空状态
头像与 bio 的展示策略
```

### 最后再碰 collection type 总抽象

因为这一层一旦做，就会影响：

```text
配置
查询
路由
主题适配
```

它是最有价值的一层，但也是最容易变大的。

## IGNAI 本地项目建议怎么落

上游 issue 是一条线，本地建设是另一条线。IGNAI 这边建议继续按下面拆：

### 本地立即做

```text
成员资料页：头像、bio、角色、标签、链接
首页成员预览区
活动和记录的发布分流
博客 / 故事 / 资源分开的内容入口
```

### 本地继续保留，不上游

```text
Join 表单收集
Supabase 申请池
成员状态流转
管理员密码门
后续成员权限 / 审核流
```

### 本地与上游之间的接口层

本地实现时，尽量把数据结构写得像未来可上游抽象的样子，例如：

```text
MemberCard
MemberProfile
EventItem
ContentHubConfig
CollectionType
```

这样以后无论你要继续二开，还是回头提 PR，迁移成本都会小很多。

## 建议发 issue 的顺序

```text
1. Docs: community-site example
2. Feature: event collection template
3. Feature: people/member directory template
4. Feature: content hubs separated by type
5. Feature: typed content collections beyond blog posts
```

顺序这么排，是为了：

```text
先证明场景真实存在
再提局部能力
最后再提更底层的通用抽象
```

## 一句话结论

可以提，而且值得提。

但不要把“社区运营系统”作为一个大而全需求提给 NotionNext，而是应该把它拆成：

```text
内容类型抽象
成员目录模板
活动模板
内容分流能力
社区站文档示例
```

这样更容易被理解，也更容易真正推进成 issue 或 PR。
