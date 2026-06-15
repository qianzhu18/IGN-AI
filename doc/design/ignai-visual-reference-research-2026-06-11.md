# IGNAI 高级视觉参考调研

记录日期：2026-06-11

## 1. 调研背景

这轮调研来自两条反馈：

1. 官网需要证明真实开源经历与真实社区经历，而不是做一个无流量的普通内容站。
2. 当前 IGNAI 已经是一个完整网站，但可以更有记忆点，更像 AI 社区的门面：可以更炫酷、更有互动、更有 3D / 视频 / WebGL / 现场感。

本轮目标不是推倒重做，而是在现有 NotionNext + IGNAI 主题基础上找更高级的表达方向。

调研产物：

- 参考截图目录：`doc/design/research-assets/ignai-visual-refs-2026-06-11/`
- 扫描结果：`doc/design/research-assets/ignai-visual-refs-2026-06-11/scan.json`
- 效果对标截图目录：`doc/design/research-assets/ignai-effect-benchmarks-2026-06-11/`
- 效果对标扫描结果：`doc/design/research-assets/ignai-effect-benchmarks-2026-06-11/scan.json`

## 2. 官网定位判断

IGNAI 官网的核心理由不是“发内容”。

内容传播主阵地更适合公众号、小红书、社群、活动平台。官网真正不可替代的价值是：

```text
证明这是一段真实发生的开源经历与社区经历。
```

因此官网应该承载：

- 开源 PR、issue、贡献记录
- 社区活动、成员、现场记录
- 成员项目、作品截图、Demo 链接
- 官号文章与活动复盘的索引
- 群友评论、活动照片、作品简介的精选沉淀

官网不是替代官号，而是把分散在 GitHub、群聊、公众号、线下活动里的证据组织成一个可被外部理解的系统。

## 3. 评论插件判断

代码层已经具备评论插件入口：

- `conf/comment.config.js` 支持 Giscus / Waline / Twikoo / Cusdis / Utterances 等。
- `themes/ignai/index.js` 的文章详情已经接入 `<Comment frontMatter={post} />`。

所以评论系统不是大开发，主要是产品决策和部署配置。

建议：

1. 短期优先 Giscus：和开源经历天然一致，适合把讨论沉淀到 GitHub Discussions。
2. 如果希望非开发者评论更低门槛，再选 Waline：适合社区成员、活动参与者、非 GitHub 用户。
3. 不建议全站都开评论。优先开放在：
   - 文章详情
   - 社区记录详情
   - 活动详情 / 活动复盘
4. 活动照片、作品简介不应直接靠评论承载，应该通过 Notion / 管理后台筛选后公开。

需要配置项：

- Giscus：`NEXT_PUBLIC_COMMENT_GISCUS_REPO`、`NEXT_PUBLIC_COMMENT_GISCUS_REPO_ID`、`NEXT_PUBLIC_COMMENT_GISCUS_CATEGORY`、`NEXT_PUBLIC_COMMENT_GISCUS_CATEGORY_ID`
- Waline：`NEXT_PUBLIC_WALINE_SERVER_URL`

## 4. 参考站点观察

### Sahara AI

URL: `https://saharaai.com/`

可借鉴：

- AI 产品 + 生态 + 社区的统一表达。
- 首页不是单纯讲品牌，而是把产品、贡献、生态、竞赛、社区入口组织成一个系统。
- 适合 IGNAI 借鉴“生态目录 / 社区 Hub / 贡献入口”的结构。

对 IGNAI 的启发：

- 可以把“开源贡献 / 社区活动 / 成员项目 / 公众号文章”做成一个证明矩阵。
- 首页不只展示文章，而是展示可被验证的行动证据。

避免：

- Sahara 的企业感较强，IGNAI 不应过度金融化或平台化。

### Spline

URL: `https://spline.design/`

可借鉴：

- 3D 交互是产品本体，首屏可以让用户“按住拖动 / orbit”。
- 互动不只是装饰，而是直接表达能力。

对 IGNAI 的启发：

- Hero 可以做一个轻量 3D “Ignition Core / Fire Node / Community Constellation”。
- 成员、活动、PR、记录可以变成节点网络，而不是普通卡片堆叠。
- 可以先用 Spline embed 或 Three.js 做一个轻量原型，避免直接自研复杂 WebGL。

避免：

- 3D 不要压过内容；移动端必须能降级成静态视觉。

### Runway

URL: `https://runwayml.com/`

可借鉴：

- AI 视觉公司适合用视频和动态画面表达“世界模拟 / 生成能力”。
- 首屏大标题 + 背景视频 / 运动素材，比纯卡片更有冲击。

对 IGNAI 的启发：

- 活动、现场、成员项目可以用短视频 / 动态 montage 做第一视觉。
- 首页可以从“静态品牌站”升级成“真实社区现场感”。

避免：

- 视频资源必须稳定、压缩、可降级，避免影响国内访问和移动端首屏性能。

### AI Engineer

URL: `https://www.ai.engineer/`

可借鉴：

- 技术社区 / 会议站的核心不是花哨，而是高信号：活动、嘉宾、talk、视频、时间地点。
- “Upcoming / Past / Top Talks” 的结构很适合社区证明。

对 IGNAI 的启发：

- 活动页可以升级为“Upcoming / Past / Field Notes / Works”。
- 首页可以突出“开源贡献、线下活动、成员项目、内容输出”的时间线。
- 这比纯文章列表更符合“社区经历证明”。

避免：

- 不要复制会议站的重商业票务感。

### Wispr Flow

URL: `https://wisprflow.ai/`

可借鉴：

- 产品首屏用一个很具体的交互场景解释价值，而不是抽象口号。
- 输入、转写、改写过程适合用动效讲清楚。

对 IGNAI 的启发：

- 可以做一个“群聊信号 -> 活动 -> 记录 -> PR / 作品”的动态转化演示。
- 这比单纯写“连接创造者”更能解释官网为什么存在。

避免：

- 不要把官网做成工具产品 SaaS 风，IGNAI 仍是社区。

### Noomo Storytelling

URL: `https://storytelling.noomoagency.com/`

可借鉴：

- 叙事型滚动体验：文字、光、声音、运动组成沉浸式故事。
- 适合解释抽象命题：“为什么需要这个社区？”

对 IGNAI 的启发：

- About / 首页第二屏可以做更像故事的滚动：AI 很热 -> 真实连接稀缺 -> 长沙本地行动者 -> 开源与社区证明。
- 可以把 “Ignite before AGI” 做成一个可滚动的点火过程。

避免：

- 叙事不要过度玄学；每一屏都要落到真实证据。

## 5. 推荐视觉升级方向

### 方向 A：Community Constellation

把成员、活动、记录、PR、公众号文章做成一个互动星图。

适合位置：

- 首页 Hero 右侧视觉
- 首页成员区块
- About 的社区证明区

优势：

- 能把“开源经历 + 社区经历”变成可视化证据。
- 和 AI / network / community 语义一致。

风险：

- 如果只是散点动画，会像装饰；必须能点开或至少和真实数据对应。

### 方向 B：Ignition Core

做一个 3D 点火核心：火种、节点、信号、能量环。

适合位置：

- 首页首屏
- CTA
- 404 / loading

优势：

- 和 IGNAI / Ignite before AGI 强绑定。
- 视觉记忆点强。

风险：

- 容易变成普通炫光球，需要控制审美，不要落入模板感。

### 方向 C：Proof Timeline

把 GitHub PR、活动、成员项目、文章、记录做成可滚动证明时间线。

适合位置：

- 首页中段
- About
- 未来 case study

优势：

- 最符合“为什么要做官网”的核心理由。
- 可持续维护，不依赖一次性视觉资产。

风险：

- 信息密度高，需要设计得有节奏。

### 方向 D：Event Media Wall

活动详情和记录页加入照片墙、作品截图、Demo 视频、群友评论精选。

适合位置：

- `/events/[slug]`
- `/records/[slug]`

优势：

- 能直接回应“可以开放通道，上传活动照片和作品简介”的建议。
- 让活动过程更像真的发生过。

风险：

- 必须有审核 / 筛选，不应让评论插件直接变成图库。

## 6. 效果级对标

这一组不是用来参考“配色和排版”，而是参考别人不容易低成本复刻的交互机制。

### Epiminds：粒子 AI 人格 / Agent 形象

URL: `https://epiminds.com/`

观察：

- 首屏是由大量粒子构成的人格化 AI 形象。
- 页面检测到 `canvas` 和视频资源，属于“视觉资产 + 实时渲染 / 粒子效果”的混合。
- 它不是普通 SaaS hero，记忆点来自一个具体的 AI 角色。

IGNAI 可借鉴：

- 不建议做“AI 女神 / AI 人脸”这种直接人格化，因为会偏离社区气质。
- 可改造成 “Ignition Core”：由社区节点、PR、活动、成员头像、记录片段组成的火种核心。
- 每个粒子不是随机点，而是映射真实证据：PR、活动、成员、记录、官号文章。

为什么不容易被简单复刻：

- 核心不是粒子本身，而是粒子背后的真实数据和证据链。

### Spline：可拖拽 3D 场景

URL: `https://spline.design/`

观察：

- 首屏明确提示 “Press and drag to orbit”。
- 页面检测到多个 `canvas`、`video`、`iframe`，是交互 3D + 视频说明的组合。
- 互动本身就是产品表达。

IGNAI 可借鉴：

- 首页首屏右侧可以做一个可拖拽 3D 社区星图。
- 节点分层：
  - Members
  - Events
  - Records
  - PRs
  - Articles
- 鼠标 hover 时显示真实标题，点击跳转对应页面。

为什么不容易被简单复刻：

- 静态 3D 很容易复制；但“真实社区数据驱动的可点击星图”不容易复制。

### Runway：视频级 AI 门面

URL: `https://runwayml.com/`

观察：

- 首屏用大面积高质量动态视频建立世界观。
- 页面检测到多个视频资源。
- 文案很少，视觉承担主要情绪。

IGNAI 可借鉴：

- 如果后续有活动照片 / 视频素材，可以做一段 8-12 秒的首页循环视频：
  - 群聊片段抽象化
  - 活动现场
  - 代码 / PR
  - 成员作品
  - 长沙城市夜景
- 视频上叠加 `Ignite before AGI` 和关键 CTA。

为什么不容易被简单复刻：

- 素材必须来自真实社区，别人无法复制同样的现场和证据。

### Ponder：漂浮视频素材墙

URL: `https://ponder.ai/`

观察：

- 首屏使用多个漂浮视频卡片，制造编辑台 / 素材池的感觉。
- 页面检测到多个视频资源。

IGNAI 可借鉴：

- 活动页或首页 Field Notes 可以做“社区素材墙”：
  - 活动照片
  - Demo 截图
  - PR 截图
  - 公众号封面
  - 成员作品
- 滚动时素材卡片轻微错位、视差、聚焦。

为什么不容易被简单复刻：

- 关键不是漂浮卡片，而是卡片内容来自真实社区资产。

### Vertex3D：强 WebGL 工作室感

URL: `https://www.vertex3d.asia/`

观察：

- 首屏直接强调硬件加速和沉浸式 WebGL。
- 这种风格很强，但也很容易变成技术展示。

IGNAI 可借鉴：

- 技术质感可以借鉴，但不要把首页做成 WebGL demo。
- 更适合做一个独立 `/lab` 或 “Community OS” 段落，展示高级实验。

为什么不建议直接复刻：

- IGNAI 是社区，不是 3D 工作室；过度硬核会牺牲内容和可访问性。

### minitap：产品化模拟界面

URL: `https://minitap.ai/`

观察：

- 首屏下方是一个产品模拟界面，表达 “AI QA engineer” 的实际工作流。
- 不靠花哨，而是靠具体产品场景。

IGNAI 可借鉴：

- 做一个 “社区发生器 / 证明链路模拟器”：
  - 群聊信号进入
  - 生成活动
  - 产生记录
  - 形成 PR / 文章 / 项目
  - 最后进入公开档案

为什么不容易被简单复刻：

- 交互流程来自 IGNAI 的真实社区运营方法，而不是通用动效。

## 7. IGNAI 独特点：不要做可复刻模板

更出彩不等于更多动画。

真正不容易被简单复刻的，是这三件事叠加：

1. **真实数据**：成员、活动、记录、PR、公众号文章不是假文案。
2. **真实素材**：活动照片、作品截图、Demo、代码、群友反馈不是图库。
3. **真实交互**：点击节点能进入真实页面，时间线能看到真实发生。

因此 IGNAI 的高级视觉不应只是：

```text
3D 球 + 渐变光 + 大标题
```

而应该是：

```text
一个由真实社区证据驱动的可交互 AI 社区档案。
```

## 8. 推荐落地方案：Proof Engine Hero

建议第一版做一个 “Proof Engine Hero”：

- 左侧：核心文案
  - `Ignite before AGI.`
  - `A living proof system for AI builders in Changsha.`
- 右侧：互动 3D / Canvas 证明引擎
  - 中心是火种 / ignition core
  - 周围是可点击节点
  - 节点来自真实数据：
    - PR
    - Events
    - Members
    - Records
    - Articles
  - hover 显示标题、日期、类型
  - click 跳转真实页面
- 背景：低频视频 / shader noise / 点火光流
- 移动端：降级为静态证据卡片 + 轻量动效

技术可选：

- 第一阶段：Three.js + 本地 JSON 数据，手写轻量星图。
- 快速视觉验证：Spline 做 3D 原型，导出 embed。
- 长期方案：把 Notion / GitHub / Records 数据接入星图。

## 9. 建议执行顺序

1. 先清理上线阻断项：模板文章、RSS/sitemap、域名、OPS 密码、hydration。
2. 评论插件只做配置与验证，不先做复杂自研评论。
3. 活动 / 记录页增加精选素材字段：照片、作品、视频、外部链接。
4. 做 Proof Engine Hero 原型：用真实成员 / 活动 / 记录 / PR 数据驱动，而不是纯装饰 3D。
5. 做 Event Media Wall，把活动照片、作品、视频、群友精选评论挂上去。
6. 做 Proof Timeline，把开源贡献与社区活动挂上去。

## 10. 结论

IGNAI 不需要变成“更花哨的博客”。

更好的方向是：

```text
一个有门面、有现场感、有开源证据、有社区证据的 AI 社区档案。
```

评论插件、活动照片、作品简介、3D / 视频视觉都可以做，但它们应该服务这个核心叙事：真实的人、真实活动、真实贡献、真实沉淀。

## 11. 基于现有品牌资产的视觉增强方案

本阶段不改 IGNAI 的主 logo、主色调、社区识别和当前信息架构。视觉升级应建立在已有品牌资产之上：

- `public/brand/ignai/logo-transparent.webp`
- `public/brand/ignai/logo-horizontal.webp`
- `public/brand/ignai/torch-icon-transparent.png`
- `public/brand/ignai/hero-gradient-brand.webp`
- `public/brand/ignai/storefront-sign.webp`
- `public/brand/ignai/business-card-mockup.webp`

### 11.1 Logo treatment：让 logo 成为动态识别锚点

目标不是重新设计 logo，而是给现有 logo 做一套可复用的运动和图像处理规则。

建议方向：

- 点火版 logo：页面首次进入时，torch icon 从暗态点亮，扩散到完整 IGNAI logo。
- 粒子重组版 logo：logo 由 Members / Events / Records / PR / Articles 节点短暂聚合成形，随后回到稳定品牌标识。
- 证据纹理版 logo：logo 内部使用低透明度的代码、活动照片、PR 截图、文章标题作为 mask / texture，不改变轮廓。
- 扫描光版 logo：用于 loading、404、后台刷新成功等状态，做成短促、低频、可复用的 UI motion。

验收标准：

- logo 轮廓和品牌色不变。
- 动效在 1.2s 到 2.4s 内完成，不影响首屏阅读。
- 移动端可以降级为静态 logo + 一次轻量 opacity / glow。

### 11.2 Torch ignition loop：把火炬做成社区视觉符号

torch icon 是最适合作为“点火 / ignition / community signal”的核心元素。

建议方向：

- 首页 Hero 中心视觉：火炬作为 ignition core，周围连接真实成员、活动、记录节点。
- 页面转场和 CTA：点击加入、查看活动、查看记录时，火炬产生一圈轻量能量波。
- Footer / About：火炬可以作为低频背景纹理，而不是普通装饰图。

避免：

- 不做普通火焰 gif。
- 不做与品牌无关的霓虹球、随机粒子和模板化 glowing orb。

### 11.3 Brand video loop：用真实素材做短循环视频

视频应来自 IGNAI 的真实社区素材，而不是 stock video。

第一版可以做 8-12 秒无声循环：

- 群聊信号抽象化：文字只保留模糊块、时间戳和信息流，不暴露隐私。
- 活动现场：人、屏幕、海报、工作坊画面。
- 开源证据：GitHub issue / PR / merged / review 的视觉片段。
- 成员作品：Demo 截图、项目界面、公众号封面。
- 长沙本地感：如果有可用素材，可做极短城市夜景或活动地点切片。

技术要求：

- 提供 `webm` + `mp4` 双格式。
- 首屏视频必须有 poster fallback。
- 移动端默认降级为 poster 或极短低码率版本。
- 禁止让视频成为 LCP 和国内访问的负担。

### 11.4 Proof Engine Hero：第一优先级视觉原型

推荐第一版把首页从“传统博客 Hero”升级为“社区证明引擎”。

结构：

- 左侧仍保留核心叙事和 CTA。
- 右侧从静态视觉升级为 Canvas / Three.js / Spline 原型。
- 中心是 IGNAI torch / ignition core。
- 周围节点来自真实数据：
  - Members
  - Events
  - Records
  - Articles
  - GitHub PR / issue
- hover 显示真实标题、日期、类型。
- click 跳转到真实页面或外部证据链接。

为什么这比普通动效更难复刻：

- 视觉不是随机生成的，而是由 IGNAI 的真实社区数据驱动。
- 每个节点都能落到真实成员、真实活动、真实记录或真实贡献。
- 站点表达从“我说我做过”变成“你可以点开验证”。

### 11.5 Event Media Wall：让活动和记录有现场感

活动详情页和社区记录页应逐步支持精选素材墙：

- 活动照片
- 现场海报
- 成员作品截图
- Demo 视频
- PR / issue 截图
- 官号文章封面
- 群友精选反馈

这些素材不应直接通过评论无筛选进入页面，应先进入 Notion / 管理后台，由运营筛选后公开。

### 11.6 分阶段落地建议

第一阶段：低风险增强

- logo 点火动效
- torch 轻量 glow / pulse
- Hero 背景光流
- 静态素材墙布局
- 移动端 fallback

第二阶段：数据驱动原型

- Proof Engine Hero Canvas / Three.js 原型
- 真实 Members / Events / Records / Articles 节点
- hover / click / reduce-motion 支持

第三阶段：视频与高级 motion

- 8-12 秒品牌视频循环
- 活动 / 记录页 video poster
- Proof Timeline 滚动叙事
- 可独立复用的 IGNAI motion pack

## 12. 保证边界

可以保证的：

- 在不改变主 logo、主色调、社区定位的前提下，让首页视觉明显脱离传统博客感。
- 通过 logo motion、torch ignition、真实数据星图、活动素材墙和短视频循环，让站点更有冲击力和记忆点。
- 让视觉升级服务“真实开源经历 + 真实社区经历”的证明目标，而不是变成可复制的装饰模板。

不能一次性口头保证的：

- 不经过原型和真实设备验证，就承诺某个 WebGL / 视频方案一定性能稳定。
- 不经过素材整理，就承诺视频效果能达到 Runway 级别。
- 不经过用户观看和移动端验证，就承诺第一版就是最终审美最优解。

正确验收方式：

- 先做 Proof Engine Hero 第一版原型。
- 用桌面 / 移动端截图和性能指标验证。
- 再决定是否进入更重的视频和 3D 制作。
