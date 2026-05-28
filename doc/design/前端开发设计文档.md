# IGNAI 官网前端开发设计文档

## 1. 项目概述

### 1.1 项目名称

IGNAI Community Landing Page

### 1.2 品牌主张

**IGNAI | Ignite before AGI.**

### 1.3 项目目标

构建一个具有品牌感、动效表达力、国际化气质与社区温度的单页官网，用于对外介绍 IGNAI 社群，并承载以下目标：

* 对外建立清晰、统一、有辨识度的品牌形象
* 吸引本地开发者、产品人、创业者、内容创作者与行动者加入社区
* 传达 IGNAI 的核心文化：点燃、表达、行动、协作、被看见
* 形成可持续复用的官网模板，后续可扩展活动页、加入入口、内容发布页
* 以 Vercel 为部署平台，完成快速上线、预览、迭代发布

### 1.4 官网定位

这不是一个传统“介绍型”静态页面，而是一个兼具以下特征的品牌官网：

* 社区品牌主页
* 青年 AI 行动者宣言页
* 社群招募与入口页
* 可持续扩展的前端品牌基座

---

## 2. 用户与传播目标

### 2.1 核心目标用户

#### A. 本地技术圈人群

* 长沙及周边的开发者、AI 工程师、算法同学、学生开发者
* 对 AI、Agent、产品、创业有兴趣的行动者

#### B. 泛 AI 产品与内容人群

* AI 产品经理
* 独立开发者
* 内容创作者
* 社群组织者
* 创业者

#### C. 潜在合作伙伴

* 本地高校组织
* 创业社群
* 技术活动主办方
* 企业或创业团队

### 2.2 用户进入页面后的核心感受目标

用户进入页面后，应快速形成以下认知：

* 这是一个有审美、有判断、有行动力的 AI 社群
* 这个社区有本地根基，也有全球视野
* 这里强调真实表达、公开输出、协作成长
* 这不是围观型社群，而是鼓励上场的社区
* 我愿意进一步了解并加入

### 2.3 页面转化目标

#### 一级转化

* 点击加入社区按钮
* 跳转微信群 / 飞书 / Telegram / 表单 / Notion / 小红书 / 公众号等入口

#### 二级转化

* 浏览社区理念与文化
* 关注官方账号
* 收藏页面并转发

---

## 3. 品牌叙事提炼

### 3.1 品牌关键词

* Ignite
* Action
* Community
* AI Native
* Local to Global
* Expression
* Co-creation
* Youthful
* Warm but sharp
* Future-facing

### 3.2 中文核心表达

IGNAI 是一个 base 长沙、面向国际、立足本地技术连接与行动实践的 AI 社群。我们关注 AI、Agent、AGI、产品、内容、创业与新技术协作方式，也关注人在这个时代如何通过表达、行动、连接与正反馈持续成长。

### 3.3 核心精神提炼

* 先行动，再优化
* 先表达，再迭代
* 少一点围观，多一点上场
* 少一点内耗，多一点点火

### 3.4 品牌语气

页面文案与视觉语气应体现：

* 年轻
* 有判断
* 热烈
* 不装腔
* 有未来感
* 有组织感
* 有人的温度

### 3.5 英文辅助表达

* Ignite before AGI.
* Build local. Think global.
* Less watching. More building.
* Speak. Ship. Connect. Grow.
* A living AI community rooted in Changsha and connected to the world.

---

## 4. 设计方向定义

### 4.1 总体视觉方向

参考高端科技品牌官网与创意工作室落地页的结构节奏，形成以下视觉特点：

* 深色为主的沉浸式背景
* 局部高亮橙黄火花色作为“点燃”隐喻
* 结合紫蓝色营造 AI 感与未来感
* 大字号排版与留白形成高级感
* 滚动驱动的内容揭示与转场增强叙事节奏
* 以光、粒子、模糊、流动、噪声、渐变构建品牌氛围

### 4.2 视觉关键词

* Dark premium
* Futuristic editorial
* Motion-led storytelling
* AI glow
* Human warmth
* Local energy
* Digital sparks

### 4.3 色彩建议

#### 主背景色

* #07070A
* #0B1020
* #111827

#### 主文字色

* #F5F7FB
* #DDE4F0

#### 强调色

* Ignite Orange: #FF7A18
* Neon Yellow: #F5FF65
* Electric Blue: #6D7CFF
* Violet Glow: #8B5CF6

#### 辅助灰

* #A1AAB8
* #6B7280
* #2B3240

### 4.4 字体建议

#### 中文

* 优先使用思源黑体 / HarmonyOS Sans / 阿里巴巴普惠体 / Inter 与中文混排方案

#### 英文

* Inter / Geist / Sora / Space Grotesk

### 4.5 视觉原则

* 避免廉价赛博朋克堆砌
* 避免过度复杂的装饰性图层影响信息可读性
* 动效服务叙事，不做无意义炫技
* 既要有“AI 品牌感”，也要保留“青年社群感”

---

## 5. 信息架构

### 5.1 页面结构建议

采用单页滚动官网结构，按叙事逻辑展开：

1. Hero 首屏
2. What is IGNAI / 社区定义区
3. Why now / 为什么是现在
4. Core spirit / 核心文化与价值观
5. Who is here / 社区连接对象
6. Community scenes / 社区状态与氛围
7. Join us / 加入方式与 CTA
8. Footer / 品牌尾部信息

### 5.2 页面阅读节奏

* 第一屏抓情绪与记忆点
* 第二屏讲清“IGNAI 是什么”
* 中段逐渐建立价值观、对象与氛围
* 末段集中完成转化

---

## 6. 页面详细设计

## 6.1 Section 01 - Hero 首屏

### 目标

第一屏完成品牌印象建立，让用户在 3 至 5 秒内感受到：

* IGNAI 是 AI 时代的青年行动社区
* 有未来感，有火花，有人
* 品牌口号清晰，气质鲜明

### 布局

左文右视觉，或居中大标题 + 背景动效的结构。

#### 文案层级建议

* Eyebrow: BASED IN CHANGSHA · CONNECTED TO THE WORLD
* Main Title: IGNAI
* Subtitle: Ignite before AGI.
* Paragraph: 一个 base 长沙、面向国际、立足本地技术连接与行动实践的 AI 社群。
* CTA 1: 加入社区
* CTA 2: 了解我们的文化

### 动效建议

* 首屏背景使用模糊流体渐变、粒子、缓慢呼吸光效
* 标题逐字或分段浮现
* 副标题与 CTA 延迟出现
* 背景中加入轻微视差移动
* 滚动时 hero 轻微缩放并淡出，为第二屏让位

### 背景视觉建议

可选三种方案：

#### 方案 A：流体光团

橙黄与蓝紫色光团在暗背景中缓慢流动，表达“点燃”和“AI 能量场”。

#### 方案 B：青年协作抽象场景

以模糊人物剪影、笔记本、对话框、草图板构建半抽象视觉。

#### 方案 C：抽象网络与火花

以节点连接、能量线、火花粒子组成视觉中心，更偏品牌科技感。

---

## 6.2 Section 02 - What is IGNAI

### 目标

明确解释社区定义，解决“这是什么”的问题。

### 建议内容

标题：What is IGNAI?
副标题：A living AI community rooted in Changsha and connected to the world.

正文可拆成两列：

#### 左侧

IGNAI 是一个 base 长沙、面向国际、立足本地技术连接与行动实践的 AI 社群。

#### 右侧

我们关注 AI、Agent、AGI、产品、内容、创业与新技术协作方式，也关注人在这个时代如何通过表达、行动、连接与正反馈持续成长。

### 动效

* 左右列错位进入
* 文本在滚动中逐段 reveal
* 关键词可高亮动效处理，例如 AI / Agent / Product / Startup / Community

---

## 6.3 Section 03 - Why Now

### 目标

解释 IGNAI 出现的时代背景与必要性。

### 文案方向

标题：Why ignite now?

正文：
在 AGI 到来之前，最重要的不是空谈未来，而是先点燃一群人：点燃好奇心，点燃表达欲，点燃行动力，点燃彼此协作的可能。

### 视觉形式建议

可做四个关键词模块：

* Curiosity
* Expression
* Action
* Collaboration

每个模块在 hover 或滚动时出现对应短句。

### 动效

* 四个关键词依次亮起
* 中心光点扩散
* 背景噪声粒子轻微移动

---

## 6.4 Section 04 - Core Spirit 核心文化

### 目标

把社区文化做成最有辨识度的内容区。

### 结构建议

做成 4 组 statement cards：

1. 先行动，再优化
2. 先表达，再迭代
3. 少一点围观，多一点上场
4. 少一点内耗，多一点点火

### 设计建议

* 采用大卡片或横向排布
* 每个卡片有独立的微动效
* 卡片 hover 时出现英文补充短句

### 英文辅助文案

* Start first. Refine later.
* Speak first. Iterate in public.
* Less watching. More showing up.
* Less friction. More ignition.

### 动效

* 卡片 scroll reveal
* hover 浮起、边框高亮、背景 glow
* 可做轻量倾斜效果

---

## 6.5 Section 05 - Who is Here 社区对象

### 目标

让潜在用户知道“这里欢迎谁”。

### 内容建议

标题：Who is IGNAI for?

可用 6 张标签卡片展示：

* Developers
* Product Builders
* Founders
* Creators
* Students
* Organizers

每张卡片下方配一句短解释。

### 动效

* 卡片 stagger 进入
* hover 出现更具体说明
* 小图标或抽象线条增强识别

---

## 6.6 Section 06 - Community Vibe 社区氛围

### 目标

把“洋来社”的气质做出来，让页面从品牌叙事走向真实人味。

### 内容方向

标题：A community with technical depth and human warmth.

可将以下表达拆成三列或时间轴：

* 本地连接
* 国际视野
* 真实共创

加入一段关于“洋来社”俗名的文字：
洋来社是我们的内部俗名，保留了最初那种野生、热闹、会整活、也真的会彼此点燃的社区气质。

### 视觉形式建议

* 使用横向滚动卡片展示社区状态
* 或做成 quote wall / vibe board
* 如后期有活动照片，可替换成真实素材模块

### 动效

* 横向滚动视差
* 图片卡片 hover 放大
* quote 区域淡入淡出

---

## 6.7 Section 07 - Join Us CTA

### 目标

完成加入转化。

### 文案建议

主标题：If you care about AI, product, agents, and the future, welcome to IGNAI.

副标题：加入一个 base 长沙、连接本地、面向全球的成长型技术社区。

按钮建议：

* 加入社区
* 联系我们
* 关注动态

### 入口建议

可预留以下链接位：

* 微信 / 飞书 / Telegram / Discord
* 公众号
* 小红书
* 官网邮箱
* 活动报名表单

### 动效

* 大面积渐变背景光晕
* CTA 按钮 hover 带光带扫过
* 底部 slogan 缓慢漂浮

---

## 6.8 Footer

### 内容建议

* Logo / IGNAI
* Ignite before AGI.
* 俗名：洋来社
* Based in Changsha, connected to the world.
* 社媒入口
* Email
* Copyright

---

## 7. 动效系统设计

### 7.1 动效原则

* 动效用于增强信息层级和品牌氛围
* 用户滚动时有“被引导叙事”的感觉
* 动效节奏统一，避免杂乱
* 移动端动效适当减弱

### 7.2 动效类型

#### A. Entrance Motion

* 标题上移淡入
* 卡片 stagger 淡入
* 图片 scale + fade

#### B. Scroll-linked Motion

* section 视差位移
* hero 缩放与 opacity 变化
* 背景 glow 位置缓慢偏移

#### C. Hover Motion

* 卡片浮起
* 边框光晕增强
* 按钮光带扫过

#### D. Ambient Motion

* 粒子漂浮
* 流体背景缓慢变化
* 渐变噪声层轻微移动

### 7.3 动效技术建议

* 基础过渡：Framer Motion
* 滚动编排：GSAP + ScrollTrigger
* 平滑滚动：Lenis
* 背景粒子 / 3D 轻交互：React Three Fiber 或 canvas shader

### 7.4 性能控制原则

* Hero 区重动效集中，后续 section 以轻动效为主
* 移动端关闭复杂背景 shader 或降低刷新率
* 图片与媒体资源做懒加载
* 避免多个高频 repaint 叠加

---

## 8. 技术方案

### 8.1 推荐技术栈

* Framework: Next.js
* Language: TypeScript
* Styling: Tailwind CSS
* Animation: Framer Motion + GSAP + ScrollTrigger
* Smooth Scroll: Lenis
* Optional 3D: React Three Fiber
* Icons: Lucide React
* Deployment: Vercel

### 8.2 推荐项目形态

首版建议采用单页 landing page + 可扩展路由结构。

#### 当前路由

* /

#### 预留路由

* /about
* /events
* /join
* /manifesto

### 8.3 数据方式

首版建议静态内容为主，使用本地配置文件驱动页面。

例如：

* `src/content/site.ts`
* `src/content/community.ts`
* `src/content/social-links.ts`

后续可升级为 CMS 或 Notion API 驱动。

---

## 9. 组件拆分建议

### 9.1 页面级组件

* `HeroSection`
* `IntroSection`
* `WhyNowSection`
* `SpiritSection`
* `AudienceSection`
* `VibeSection`
* `JoinSection`
* `Footer`

### 9.2 通用组件

* `SectionContainer`
* `GradientBackground`
* `GlowOrb`
* `AnimatedHeading`
* `RevealText`
* `CTAButton`
* `SpiritCard`
* `AudienceCard`
* `QuoteCard`
* `NoiseOverlay`
* `GridLines`

### 9.3 基础交互组件

* `SmoothScrollProvider`
* `PageTransitionProvider`
* `MagneticButton`（可选）
* `MouseGlowLayer`（可选）

---

## 10. 推荐目录结构

```txt
src/
  app/
    layout.tsx
    page.tsx
    globals.css
  components/
    layout/
    sections/
    ui/
    motion/
  content/
    site.ts
    community.ts
    links.ts
  lib/
    utils.ts
    motion.ts
  styles/
    tokens.css
public/
  images/
  icons/
  og/
```

---

## 11. 响应式设计要求

### 11.1 断点建议

* Mobile: < 768px
* Tablet: 768px - 1279px
* Desktop: >= 1280px

### 11.2 移动端策略

* 首屏保留核心信息与简化版背景动效
* 减少横向复杂布局
* 大块内容改为纵向堆叠
* 降低 3D / shader 特效强度

### 11.3 桌面端策略

* 强调版式张力与留白
* 保持大标题与多层视觉景深
* 滚动驱动动效完整呈现

---

## 12. 可访问性与内容可读性

### 12.1 可访问性要求

* 文本与背景对比度达标
* 按钮 hover / focus 状态清晰
* 键盘可访问 CTA
* 图片与图形有必要的 aria 或语义替代

### 12.2 降级方案

* 尊重 `prefers-reduced-motion`
* 对低性能设备关闭复杂动画
* 动效失败时内容仍完整可读

---

## 13. 性能优化要求

### 13.1 首屏优化

* Hero 背景尽量使用 CSS 渐变 + 少量 canvas，不要一开始引入大体积 3D 资产
* 关键文案优先渲染
* 主要视觉素材压缩为 WebP / AVIF

### 13.2 代码优化

* 按 section 分组件
* 动效库仅在必要处客户端加载
* 背景重组件动态导入
* 避免首屏包体过大

### 13.3 指标目标

* Lighthouse Performance 目标 85+
* 移动端保持可接受加载速度
* Core Web Vitals 不明显失控

---

## 14. 开发优先级建议

### Phase 1：首版可上线

* 基础页面结构
* 品牌视觉
* Hero 动效
* 核心 section
* CTA 与链接
* Vercel 上线

### Phase 2：增强版

* 更强滚动叙事
* 粒子 / shader 背景
* 更丰富 hover 反馈
* 多语言支持
* 社区活动内容模块

### Phase 3：内容化与增长化

* 博客 / 活动页
* 报名表单
* 数据埋点
* CMS / Notion 驱动内容

---

## 15. Vercel 部署方案

### 15.1 部署模式

推荐通过 GitHub 仓库接入 Vercel，实现：

* 自动构建
* Preview 部署
* Production 部署
* 多次快速迭代

### 15.2 推荐流程

1. 本地创建 Next.js 项目
2. 推送至 GitHub
3. 在 Vercel 导入仓库
4. 配置环境变量
5. 首次部署
6. 绑定自定义域名
7. 每次 push 自动生成预览链接

### 15.3 环境变量预留

即使首版是静态页面，也建议预留：

* `NEXT_PUBLIC_SITE_URL`
* `NEXT_PUBLIC_COMMUNITY_JOIN_URL`
* `NEXT_PUBLIC_CONTACT_EMAIL`
* `NEXT_PUBLIC_XIAOHONGSHU_URL`
* `NEXT_PUBLIC_WECHAT_URL`

### 15.4 域名建议

推荐使用：

* `ignai.org`
* `ignai.cn`
* `ignai.community`
* `join.ignai.org`

### 15.5 上线后建议

* 配置 Open Graph 图片
* 配置 favicon
* 配置 SEO title / description
* 提交站点到搜索引擎
* 接入基础分析工具

---

## 16. SEO 与元信息建议

### 16.1 Title

IGNAI | Ignite before AGI.

### 16.2 Description

IGNAI 是一个 base 长沙、面向国际、立足本地技术连接与行动实践的 AI 社群。关注 AI、Agent、AGI、产品、内容、创业与新技术协作方式。

### 16.3 Keywords

IGNAI, AI 社群, 长沙 AI, Agent 社区, AI 产品, 青年技术社区, AGI, 长沙开发者

### 16.4 Open Graph 文案

Ignite before AGI. A living AI community rooted in Changsha and connected to the world.

---

## 17. 首版交付清单

### 必做

* 单页官网
* 桌面端与移动端适配
* 完整品牌文案上屏
* Hero 动效
* 关键区块 reveal 动效
* 加入社区 CTA
* Vercel 部署上线

### 建议做

* 深色主题品牌视觉系统
* 自定义 icon / logo 占位
* 社媒链接
* 页脚信息
* 基础 SEO

### 后续扩展

* 活动页模板
* 社群相册 / 照片墙
* 多语言切换
* 表单收集
* CMS 内容管理

---

## 18. 实施建议

### 18.1 最优落地方式

建议先做“高质量首版单页”，不要一开始做过多功能。先把品牌感、叙事、动效、转化入口做强。

### 18.2 推荐推进顺序

1. 先定视觉方向与参考风格
2. 再完成线框与 section 排序
3. 开发静态版页面
4. 补动效系统
5. 接链接与 SEO
6. Vercel 部署上线

### 18.3 实际开发注意点

* 页面最重要的是节奏与留白
* 文案不要一次性堆满，需做层级分发
* 动效数量要克制，重点在首屏与核心 statement 区
* 加入入口要清晰，避免用户看完却找不到下一步

---

## 19. 总结

IGNAI 官网首版应该做成一个兼具品牌感、叙事力、行动召唤与社区温度的单页官网。它的核心不是简单展示信息，而是把“IGNAI 为什么存在、服务谁、相信什么、邀请谁加入”这四件事通过视觉、文案和动效完整传达出来。

首版建议以 Next.js + Tailwind + Framer Motion + GSAP + Vercel 为基础搭建，先完成高质量 landing page，再逐步扩展成社区品牌站点。
