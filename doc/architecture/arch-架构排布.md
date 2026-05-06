可以，这一版我建议直接从“官网视觉稿”推进到一个**可上线、可维护、可持续更新活动内容的社区官网 MVP**。

这一版的核心目标先不要做太大，先把官网打造成：

> IGNAI / 洋来社的社区门面
> 可以介绍社区、展示近期活动、沉淀往期记录、引导用户加入

成员系统可以先做预留，不作为第一版主线。第一版最重要的是把“活动真实发生”做出来。

---

# 一、这一版产品目标

## 版本定位

```text
IGNAI 社区官网 V1
一个面向外部用户的社区品牌官网 + 活动预览 + 往期活动记录入口
```

## 用户进入官网后要完成三件事

```text
1. 快速理解 IGNAI 是什么
2. 看到近期有什么活动，可以点进去了解
3. 看到过往活动记录，感受到社区真实存在
4. 最后可以加入社区 / 联系合作
```

---

# 二、V1 页面结构

建议第一版直接做成 5 个核心页面。

```text
/                      首页
/events                活动列表页
/events/[slug]         活动详情页
/records               往期活动记录页
/records/[slug]        活动记录详情页
```

后续再加：

```text
/members               成员展示页
/journal               社区文章页
/about                 关于 IGNAI
```

V1 不要一次性做太复杂。先让活动模块跑起来。

---

# 三、首页最终结构

首页建议按照这个顺序实现：

```text
01 Hero
品牌主张 + 加入社区 CTA

02 What is IGNAI
社区介绍

03 Culture
社区文化

04 Upcoming Events
近期活动预览

05 Field Notes
往期活动记录

06 Join
加入社区 / 联系合作
```

你之前的 Why Now、Traits、Identity 可以保留一部分，但要压缩，不要让首页过长。

---

# 四、首页模块具体方案

## 01 Hero

### 目的

让用户第一眼知道这是一个什么社区。

### 推荐内容

```text
Ignite before AGI.

在 AGI 到来之前，
先点燃一群真实行动的人。

IGNAI 是一个 base 长沙、连接本地、面向全球的 AI 社区。
关注 AI、Agent、Product、Startup 与真实行动。
```

按钮：

```text
加入社区
查看近期活动
```

按钮逻辑：

```text
加入社区 → 跳转到微信群/飞书/表单
查看近期活动 → 锚点跳转到 Upcoming Events
```

---

## 02 What is IGNAI

### 推荐排布

左侧文案，右侧 4 张角色卡。

```text
AI Learners
正在学习 AI、工具和未来工作方式的人。

Builders
做 Agent、产品原型和真实项目的人。

Storytellers
愿意分享观点、记录实践和传播信号的人。

Connectors
连接本地资源、全球趋势和更多行动机会的人。
```

---

## 03 Culture

### 推荐文案

```text
不是围观，
是上场。

少一点围观，多一点参与。
少一点内耗，多一点点火。
```

右侧 4 张卡：

```text
先行动
不要等想清楚一切，再开始。

先表达
把想法说出来，让它有机会被连接。

先上场
少一点旁观，多一点参与。

先点火
用热情、项目和协作带动更多人。
```

---

## 04 Upcoming Events

这个是这一版首页的核心。

### 推荐排布

```text
左侧：
UPCOMING EVENTS
近期活动

线下聚会、主题共创、工作坊和社区实验，
都在这里持续发生。

右侧：
1 张主活动大卡
2 张次活动小卡
```

### 活动卡结构

```text
封面图
活动状态
活动标题
时间 / 地点 / 形式
一句话简介
标签
查看详情
```

示例：

```text
长沙 AI Builder 夜谈

2026 / 05 下旬 · 长沙 · 线下

围绕 Agent、产品原型和内容生产，
邀请本地行动者做一次小规模圆桌交流。

线下聚会
长沙
Builder
```

点击整张卡进入：

```text
/events/changsha-ai-builder-night
```

---

## 05 Field Notes

这一块用来展示往期活动记录。

### 推荐命名

```text
FIELD NOTES
社区现场记录
```

这个名字比“往期活动”更有品牌感，也更适合以后沉淀文章、照片、复盘、项目产出。

### 推荐文案

```text
把活动、项目、思考和成员故事，
沉淀成可以被继续阅读的内容。
```

### 卡片结构

```text
封面图
记录类型
标题
时间地点
一句复盘
产出标签
查看记录
```

示例：

```text
第一次 AI Builder 夜谈

2026 / 04 · 长沙

12 位本地行动者围绕 Agent、内容生产和项目启动进行了一次小规模圆桌。

产出：
3 个项目想法
1 份工具清单
2 篇社区记录
```

点击进入：

```text
/records/first-ai-builder-night
```

---

## 06 Join

### 推荐文案

```text
Join the fire.
Bring your signal.

加入一个鼓励表达、持续行动、
彼此点燃的 AI 社区。
```

加入后可以：

```text
参与线下交流
加入主题共创
分享项目与观点
连接长沙与全球 AI 信号
```

按钮：

```text
加入社区
联系合作
```

---

# 五、活动列表页 /events

## 页面目的

让用户集中查看所有即将发生的活动。

## 页面结构

```text
顶部：
Upcoming Events
近期活动

筛选：
全部 / 线下聚会 / 工作坊 / Demo / 共创 / 线上

主体：
活动卡片 Grid
```

## 活动列表卡片

桌面端 3 列，移动端 1 列。

每张卡：

```text
封面图
状态标签：开放报名 / 筹备中 / 已满员 / 已结束
标题
时间
地点
形式
简介
标签
```

---

# 六、活动详情页 /events/[slug]

这是转化关键页。

## 页面结构

```text
活动封面
活动标题
活动状态
时间地点
报名按钮

活动简介
适合谁参加
活动流程
主理人 / 嘉宾
活动说明
相关活动
底部加入社区 CTA
```

## 示例内容结构

```text
长沙 AI Builder 夜谈

状态：开放报名中
时间：2026 / 05 下旬
地点：长沙
形式：线下小规模圆桌

这是一场面向本地 AI 行动者的小型交流。
我们会围绕 Agent、产品原型、内容生产和真实项目展开讨论。
```

### 适合谁参加

```text
正在做 AI 产品的人
正在学习 Agent 的学生
希望找到共创伙伴的 Builder
想加入本地 AI 社区的人
```

### 活动流程

```text
19:00 签到与自由交流
19:30 主题分享
20:10 圆桌讨论
21:00 Demo / 项目自荐
21:30 自由连接
```

### CTA

```text
立即报名
加入社区了解更多
```

报名按钮第一版可以跳转到：

```text
飞书表单 / 问卷星 / 2050 活动页 / 微信二维码弹窗
```

不要第一版就自研报名系统。

---

# 七、往期记录页 /records

## 页面目的

证明社区真实发生过事情。

## 页面结构

```text
顶部：
Field Notes
社区现场记录

说明：
这里记录 IGNAI 的线下活动、主题共创、成员项目和社区产出。

主体：
记录卡片 Grid
```

## 记录卡片

```text
封面图
记录类型：活动复盘 / 项目记录 / 工具清单 / 成员故事
标题
时间地点
摘要
产出标签
```

示例：

```text
活动复盘
第一次 AI Builder 夜谈

12 位本地行动者围绕 Agent、内容生产和项目启动进行了一次小规模圆桌。

3 个项目想法
1 份工具清单
2 篇社区记录
```

---

# 八、记录详情页 /records/[slug]

## 页面目的

让活动沉淀成内容资产。

## 页面结构

```text
标题
基本信息
封面图
活动摘要
现场照片
讨论主题
关键观点
成员产出
相关链接
下一步活动 CTA
```

## 内容模板

```text
# 第一次 AI Builder 夜谈：从群聊到现场

时间：2026 / 04
地点：长沙
形式：线下圆桌
参与人数：12 人

## 这次活动发生了什么

## 我们讨论了什么

## 现场产生了哪些项目想法

## 值得记录的观点

## 下一步
```

这类页面后续可以持续发到公众号、小红书、朋友圈，形成传播闭环。

---

# 九、数据模型设计

第一版建议用 Markdown / MDX 管理内容。你们是大学生团队，这样最轻、最快、最稳定。

## events 数据结构

```ts
export type EventItem = {
  slug: string
  title: string
  subtitle?: string
  status: 'open' | 'planning' | 'closed' | 'finished'
  dateText: string
  location: string
  format: 'offline' | 'online' | 'hybrid'
  cover: string
  excerpt: string
  tags: string[]
  registrationUrl?: string
  content: string
}
```

示例：

```ts
{
  slug: 'changsha-ai-builder-night',
  title: '长沙 AI Builder 夜谈',
  status: 'open',
  dateText: '2026 / 05 下旬',
  location: '长沙',
  format: 'offline',
  cover: '/images/events/builder-night.jpg',
  excerpt: '围绕 Agent、产品原型和内容生产，邀请本地行动者做一次小规模圆桌交流。',
  tags: ['线下聚会', '长沙', 'Builder'],
  registrationUrl: 'https://xxx.com/form'
}
```

---

## records 数据结构

```ts
export type RecordItem = {
  slug: string
  title: string
  type: 'recap' | 'story' | 'resource' | 'project'
  dateText: string
  location?: string
  cover: string
  excerpt: string
  outcomes?: string[]
  tags: string[]
  content: string
}
```

示例：

```ts
{
  slug: 'first-ai-builder-night',
  title: '第一次 AI Builder 夜谈',
  type: 'recap',
  dateText: '2026 / 04',
  location: '长沙',
  cover: '/images/records/first-builder-night.jpg',
  excerpt: '12 位本地行动者围绕 Agent、内容生产和项目启动进行了一次小规模圆桌。',
  outcomes: ['3 个项目想法', '1 份工具清单', '2 篇社区记录'],
  tags: ['活动复盘', 'Agent', '长沙']
}
```

---

# 十、推荐技术方案

## 推荐技术栈

```text
Next.js
TypeScript
Tailwind CSS
MDX
Vercel
```

原因很简单：

```text
开发快
部署快
适合官网
适合内容型页面
以后可以接 CMS
对 SEO 友好
```

## 目录结构建议

```text
ignai-site/
  app/
    page.tsx
    events/
      page.tsx
      [slug]/
        page.tsx
    records/
      page.tsx
      [slug]/
        page.tsx
  components/
    layout/
      Navbar.tsx
      Footer.tsx
      Section.tsx
    home/
      Hero.tsx
      WhatSection.tsx
      CultureSection.tsx
      UpcomingEvents.tsx
      FieldNotes.tsx
      JoinSection.tsx
    cards/
      EventCard.tsx
      RecordCard.tsx
      RoleCard.tsx
    ui/
      Button.tsx
      Badge.tsx
  content/
    events/
      changsha-ai-builder-night.mdx
      ai-workflow-workshop.mdx
    records/
      first-ai-builder-night.mdx
  lib/
    content.ts
    events.ts
    records.ts
  public/
    images/
      events/
      records/
      backgrounds/
```

---

# 十一、页面组件拆解

## 首页组件

```text
Hero
WhatSection
CultureSection
UpcomingEvents
FieldNotes
JoinSection
```

## 内容组件

```text
EventCard
RecordCard
FeaturedEventCard
SectionHeader
Badge
CTAButton
ImageCover
```

---

# 十二、活动卡片组件方案

活动卡不要再做成纯文字表格，要做成封面卡。

```tsx
<EventCard
  title="长沙 AI Builder 夜谈"
  status="开放报名"
  date="2026 / 05 下旬"
  location="长沙"
  format="线下"
  cover="/images/events/builder-night.jpg"
  excerpt="围绕 Agent、产品原型和内容生产，邀请本地行动者做一次小规模圆桌交流。"
  tags={['线下聚会', '长沙', 'Builder']}
  href="/events/changsha-ai-builder-night"
/>
```

视觉规则：

```text
封面图：16:9
卡片圆角：24px
内边距：24px
标题：24px
简介最多两行
整卡点击
hover 轻微上浮
```

---

# 十三、记录卡片组件方案

```tsx
<RecordCard
  type="活动复盘"
  title="第一次 AI Builder 夜谈"
  date="2026 / 04"
  cover="/images/records/first-builder-night.jpg"
  excerpt="12 位本地行动者围绕 Agent、内容生产和项目启动进行了一次小规模圆桌。"
  outcomes={['3 个项目想法', '1 份工具清单', '2 篇社区记录']}
  href="/records/first-ai-builder-night"
/>
```

记录卡要比活动卡更像博客。

```text
封面图
类型
标题
摘要
产出标签
阅读记录
```

---

# 十四、后台管理当前状态

当前已经接入 Sanity Studio，活动和现场记录可以在 `/studio` 里编辑。

当前内容更新方式：

```text
新增活动 = Sanity 近期活动
新增记录 = Sanity 现场记录
上传封面图 = Sanity Image
兜底内容 = src/content/events.ts 和 src/content/records.ts
```

你给的 2050 成员管理界面，本质上是成员资料后台 + 成员公开展示。这个功能已经进入 TODO，但暂不立即开发。

成员管理建议拆成两步：

```text
第一步：Sanity 管公开成员资料，做首页成员预览和 /members
第二步：Supabase 管成员身份、权限、申请、报名和私密字段
```

---

# 十五、成员管理 TODO

详见：

```text
doc/成员管理需求评估.md
```

## 排期

```text
P0 2026-05-03 - 2026-05-05：确认公开字段、授权规则和首页位置
P1 2026-05-06 - 2026-05-08：新增 Sanity member schema 和 Studio 成员编辑
P2 2026-05-09 - 2026-05-12：完成首页成员预览、/members、/members/[slug]
P3 2026-05-13 - 2026-05-17：按需接入 Supabase 成员业务数据
```

## 成员预览区方向

```text
COMMUNITY MEMBERS

这里有谁在行动？

IGNAI 聚集了一群关注 AI、产品、表达和真实行动的人。
```

首页先展示 6-8 位精选成员：

```text
头像
名称
角色
城市
一句话简介
兴趣标签
```

隐私原则：

```text
只展示成员授权公开的字段
联系方式默认不公开
支持 draft，发布前人工确认
允许成员要求修改或下架
```

---

# 十六、视觉布局调整方案

## 首页整体节奏

```text
Hero：强视觉
What：解释
Culture：记忆点
Upcoming Events：内容入口
Field Notes：真实记录
Community Roles：人群画像
Join：转化
```

## 模块宽度

```text
主体 max-width：1200px
内容流 max-width：1280px
左右结构：5 / 7
卡片网格：3 columns
```

## 活动区布局

桌面端：

```text
左侧 4 栏：标题说明
右侧 8 栏：主活动卡 + 次活动卡
```

或者更推荐：

```text
上方标题
下方 3 张图文活动卡
```

活动区要像内容流，不要像信息面板。

---

# 十七、制作任务拆解

## 第 1 天：信息架构和数据准备

```text
确定首页结构
确定活动数据字段
确定记录数据字段
整理 3 个近期活动
整理 3 个往期记录
准备 6 张封面图
```

交付物：

```text
页面结构文档
活动内容表
记录内容表
封面图素材
```

---

## 第 2 天：前端基础搭建

```text
创建 Next.js 项目
配置 Tailwind
搭建 Navbar / Footer
搭建 Section / Button / Badge 基础组件
完成首页静态结构
```

交付物：

```text
可以跑起来的官网骨架
```

---

## 第 3 天：活动与记录模块

```text
实现 EventCard
实现 RecordCard
实现 /events 列表页
实现 /events/[slug] 详情页
实现 /records 列表页
实现 /records/[slug] 详情页
```

交付物：

```text
活动可以点击进入详情
记录可以点击进入详情
```

---

## 第 4 天：视觉打磨

```text
接入背景图
调整深色渐变
调整卡片 hover
调整移动端
优化中文断行
优化 CTA
```

交付物：

```text
接近生产级视觉的官网版本
```

---

## 第 5 天：上线与验证

```text
部署 Vercel
配置域名
检查 SEO title / description
检查移动端
检查按钮跳转
邀请 5 个朋友试用
收集反馈
```

交付物：

```text
V1 上线版本
```

---

# 十八、V1 验收标准

这一版完成后，你们应该能做到：

```text
1. 首页能清楚介绍 IGNAI
2. 用户能看到近期活动
3. 用户能点击活动进入详情页
4. 用户能看到往期活动记录
5. 用户能点击记录进入详情页
6. 用户能通过 CTA 加入社区
7. 移动端阅读正常
8. 内容可以通过 MDX 快速更新
```

如果这些都完成，这个官网就已经有真实产品雏形了。

---

# 十九、后续 V2 规划

## V2 可以做这些

```text
成员展示页
活动报名系统
活动日历
小红书 / 公众号内容同步
成员项目展示
邮件订阅
活动照片墙
```

## V2 的技术升级

```text
Sanity：管理公开内容、活动、记录、成员展示资料
Supabase：管理加入申请、成员身份、报名、权限和私密字段
Resend：发送活动通知邮件
Cloudinary：管理活动图片
```

---

# 二十、当前最应该立刻做的事情

我建议你们现在马上开始做这 4 件事：

```text
1. 把首页的活动区从文字面板改成图文活动卡
2. 新增 /events 和 /events/[slug]
3. 新增 /records 和 /records/[slug]
4. 准备 3 个近期活动 + 3 个往期记录作为内容种子
```

第一版不要追求功能全，先让用户感受到：

```text
这个社区有主张
有现场
有记录
有下一步参与入口
```

这就是 IGNAI 官网 V1 最强的产品闭环。
