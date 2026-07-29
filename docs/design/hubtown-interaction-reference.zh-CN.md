# IGNAI 前端交互参考：Hubtown

记录日期：2026-07-29
参考站点：<https://hubtown.co.in/>、<https://hubtown.co.in/about/>
当前定位：后续前端迭代参考，不阻塞 Payload 后端迁移主线

## 1. 为什么记录这个参考

IGNAI 后续要追求的不是“在现有页面上多加几个动画”，而是一套可持续扩展的场景组件和滚动叙事架构。Hubtown 的价值在于它展示了这种系统的上限：页面更像由滚动驱动的交互影片，而不是普通企业官网的卡片集合。

当前阶段只固定设计 DNA 和工程边界，不立即照着重做首页。现阶段的最高优先级仍是统一前后端与完成 Payload 迁移。

## 2. 可借鉴的设计 DNA

- 全屏场景长期驻留，内容随滚动章节切换。
- 使用统一的几何视觉语言：网格、准星、切角边框、坐标和编号。
- 深色、低噪声、近双色的视觉系统，主要依靠层次和运动制造冲击力。
- Grotesk 承担标题与正文，Mono 承担标签、编号与系统信息。
- 文字遮罩、SVG 描边、空间节点和媒体揭示服从同一条滚动时间线。
- 首屏不是传统宣传 Banner，而是可探索的空间场景。

从公开页面资源可以确认 Lenis 平滑滚动；源码还出现 Theatre 项目配置，因此 Theatre.js / WebGL 是高可信度的实现方向判断。仅凭 HTML 和样式无法完整判断真实滚动手感，正式实现前仍需用桌面和移动端录屏复核节奏。

## 2.1 About 页的结构与技术信号

2026-07-29 对 About 页 SSR HTML、同源 CSS 和静态资源声明进行了复核。以下是可以直接确认的事实：

- 页面由 Nuxt SSR 输出，正文数据状态中出现 Sanity 查询键。
- 页面底层存在全屏 `position: fixed` 视觉层，正文使用独立滚动容器。
- 配置中出现 `theatreProjectName: "hubtown"` 与 Theatre state 地址。
- 全局 CSS 包含 Lenis 滚动容器规则。
- 页面加载 `Grotesk Bold / Regular / Light` 与 `Commit Mono / Bold`。
- 主要颜色仍为深海军蓝 `#020a18` 与淡蓝 `#d5e0ff`。
- 桌面与移动端存在不同的 Values 编排，而不是简单缩放同一组卡片。
- 页面内容结构是：沉浸式标题 -> 品牌宣言 -> 公司数据 -> 巨型数字 -> 价值观场景 -> 行动入口。

About 页的关键不是某一个动画库，而是四层协作：

```text
固定视觉场景层
  + 滚动进度导演层
  + 可访问的 DOM 内容层
  + CMS 内容与关系数据层
```

Headless Chrome 在本次核验中一直停留在资源 Loader，未获得完整运行态截图。因此具体镜头节奏、hover 和滚动阻尼仍属于未完全验证项，不能仅靠源码推断为事实。

## 3. 转译为 IGNAI，而不是复制

建议把 Hubtown 的房地产空间地图转译为“社区信号地图”：

- 节点：Members、Events、Records、Articles、开源 PR 与合作项目。
- 关系线：成员参与活动、活动产生记录、文章引用项目、PR 形成公开证明。
- 滚动章节：社区是谁、发生了什么、共同构建什么、如何加入。
- 数据来源：必须是 Payload 中的真实关系数据，而不是纯装饰粒子。

候选场景组件：

- `ImmersiveHero`
- `CommunitySignalMap`
- `ScrollChapter`
- `MemberConstellation`
- `EventTimeline`
- `MediaReveal`
- `MetricRail`
- `JoinPortal`

后台只允许编辑内容、媒体、布局变体和经过验证的运动预设，不暴露任意 CSS、像素位置和时间线参数。

### About 页对应的 IGNAI 组件

| Hubtown 模式      | IGNAI 转译                                | 数据来源                       |
| ----------------- | ----------------------------------------- | ------------------------------ |
| 城市/建筑空间场景 | 社区信号场：成员、活动、记录、PR 关系     | Payload relationships          |
| 公司历史与事实    | IGNAI 起源、城市、社区定位                | `site-settings` / `pages`      |
| 交付面积巨型数字  | 真实 Members / Events / Records / PR 数量 | Payload 聚合查询；无数据不展示 |
| Values 卡片场景   | 真实、开放、共建、长期主义                | `pages.layout` blocks          |
| Work with us      | 加入活动、成为成员、发起合作              | `join-submissions` + CTA 配置  |

现有品牌不改成 Hubtown 的蓝色复制品。新系统继续使用：

- 基底：`#07080c` 黑色空间。
- Heat：`#ff7a18`，表示点火、行动和现实发生。
- Signal：`#5da9ff`，表示连接、信息和数字系统。
- Warm ink：现有暖白/浅金层，用于正文和可信度信息。

Hubtown 的几何秩序可以借，但品牌锚点必须是 IGNAI 的“火焰 + 信号”双系统。

## 4. 未来前端技术边界

- React Server Components 负责内容读取、SEO 和普通内容渲染。
- Client Components 只用于确实需要交互的场景岛。
- Motion for React 负责组件微动效和普通滚动映射。
- GSAP ScrollTrigger 只负责标志性长章节的时间线编排，不接管普通页面。
- React Three Fiber / Three.js 只承载一个持久化社区信号场景，避免全站 WebGL 化。
- Theatre.js 作为 P2 视觉编排工具候选；只有在设计人员确实需要可视化关键帧编辑时才加入运行栈。
- Lenis 不做全站默认依赖。旧站已经验证全局 RAF 会损伤跳转和低端设备体验；若以后引入，只允许路由级开关并经过性能测试。
- 必须提供移动端简化场景和 `prefers-reduced-motion` 降级。
- 不照搬隐藏原生滚动、强制 Loader 和 `500vh–1000vh` 超长章节。

建议的组件底座：

```text
StoryRenderer        Payload Blocks -> 页面组件
SceneRegistry        场景类型 -> 实现场景
SceneShell           固定画布与 DOM 内容的边界
ScrollDirector       单一滚动进度与章节状态
MotionProvider       easing、duration、reduced-motion
MediaPreloader       场景资源优先级与错误降级
PerformanceBudget    DPR、FPS、内存与资源体积阈值
```

普通内容页继续使用原生滚动和 Server Components。只有 About / Home 等少量品牌页面进入 SceneShell，避免整站为一个效果付出性能和维护成本。

## 5. 启动条件

满足以下条件后，再进入交互原型阶段：

1. Payload 成为唯一生产内容主源。
2. Members、Events、Records 的关系模型稳定。
3. 新前台已能使用同一份生成类型完成基础页面渲染。
4. 核心迁移回归测试与生产切换方案通过。

第一版只验证“社区信号地图 + 3 个滚动章节 + 移动端降级”，不直接重做整站。

## 6. 参考资料

- [Hubtown 首页](https://hubtown.co.in/)
- [Hubtown About](https://hubtown.co.in/about/)
- [Motion `useScroll`](https://motion.dev/docs/react-use-scroll)
- [GSAP ScrollTrigger](https://gsap.com/docs/v3/Plugins/ScrollTrigger/)
- [React Three Fiber](https://r3f.docs.pmnd.rs/getting-started/introduction)
- [Lenis](https://github.com/darkroomengineering/lenis)
- [Theatre.js + React Three Fiber](https://www.theatrejs.com/docs/latest/getting-started/with-react-three-fiber)
