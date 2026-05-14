# 前端动画样式体系全景（Frontend Motion System Atlas）

> 文档定位：帮你建立对前端动画的**全景认知**，从原理到分类、从 CSS 到 JS、从微交互到叙事编排，形成一张可检索、可直接对 AI 描述的动效地图。
>
> 最后更新：2026-05-06

---

## 一、动画的本质：六维坐标系

任何一个动画效果，都可以用以下六个维度精确描述：

| 维度 | 含义 | 典型取值 |
|------|------|---------|
| **属性（Property）** | 什么在变 | transform, opacity, filter, clip-path, background-position, stroke-dashoffset… |
| **方向（Direction）** | 从哪到哪 | Y轴上移、X轴左滑、scale 放大/缩小、rotate 顺/逆时针 |
| **节奏（Easing）** | 快慢曲线 | ease-in-out, cubic-bezier, spring, steps, linear |
| **时长（Duration）** | 持续多久 | 微交互 150-300ms, 入场 400-800ms, 环境 8-20s |
| **触发（Trigger）** | 何时开始 | hover, click, scroll-into-view, page-load, data-change, timer |
| **循环（Iteration）** | 播几次 | 1次, 交错delay, infinite, alternate |

> **给 AI 的描述公式**：`[触发方式] 触发后，[对象] 的 [属性] 从 [起始] 到 [终态]，用 [节奏] 在 [时长] 内完成，[循环方式]`

---

## 二、动画分类体系：7 大类 38 子类

### 2.1 总览地图

```
前端动画
├── A. 入场动画 Entry
│   ├── A1 淡入 Fade In
│   ├── A2 上浮淡入 Reveal Up
│   ├── A3 下落淡入 Drop In
│   ├── A4 侧滑入场 Slide In
│   ├── A5 缩放入场 Scale In
│   ├── A6 旋转入场 Rotate In
│   ├── A7 模糊清晰 Blur In
│   ├── A8 翻转入场 Flip In
│   ├── A9 揭幕/裁剪展开 Clip Reveal
│   ├── A10 交错入场 Stagger
│   └── A11 分字/逐词入场 Word by Word
│
├── B. 退场动画 Exit
│   ├── B1 淡出 Fade Out
│   ├── B2 上移消失 Fly Up
│   ├── B3 缩放消失 Scale Out
│   ├── B4 侧滑离场 Slide Out
│   └── B5 模糊消散 Blur Out
│
├── C. 环境动画 Ambient
│   ├── C1 粒子系统 Particles
│   ├── C2 流线/曲线流动 Flow Lines
│   ├── C3 脉冲扩散 Pulse Rings
│   ├── C4 呼吸光效 Breathing Glow
│   ├── C5 漂浮浮动 Floating/Drift
│   ├── C6 噪声纹理 Noise Texture
│   ├── C7 渐变移动 Gradient Shift
│   ├── C8 星空/点点阵 Starfield
│   └── C9 波纹/涟漪 Ripple
│
├── D. 交互反馈 Interactive
│   ├── D1 Hover 上浮 Lift
│   ├── D2 Hover 光斑追踪 Spotlight
│   ├── D3 磁性吸附 Magnetic
│   ├── D4 按钮微光扫过 Shimmer
│   ├── D5 点击涟漪 Click Ripple
│   ├── D6 拖拽跟随 Drag Follow
│   ├── D7 鼠标视差 Mouse Parallax
│   ├── D8 弹性回弹 Elastic Bounce
│   └── D9 跟随光标 Cursor Trail
│
├── E. 叙事动画 Narrative
│   ├── E1 滚动视差 Scroll Parallax
│   ├── E2 粘性叙事 Sticky Narrative
│   ├── E3 横向时间轴 Horizontal Timeline
│   ├── E4 翻页切换 Page Flip / Stage
│   ├── E5 跑马灯/信息流 Marquee / Ticker
│   ├── E6 进度指示 Progress Indicator
│   ├── E7 背景接管 Background Handoff
│   ├── E8 数字递增 Counter Roll
│   └── E9 路径描绘 SVG Path Draw
│
├── F. 文字动画 Typography
│   ├── F1 打字机 Typewriter
│   ├── F2 逐词高亮 Word Highlight
│   ├── F3 文字变形 Text Morph
│   ├── F4 文字拆分 Text Split Reveal
│   ├── F5 渐变文字流动 Gradient Text Flow
│   └── F6 光标闪烁 Cursor Blink
│
├── G. 数据可视化动画 Data Visualization
│   ├── G1 柱状图增长 Bar Grow
│   ├── G2 折线描绘 Line Draw
│   ├── G3 环形进度 Circular Progress
│   ├── G4 轨道运动 Orbit
│   ├── G5 仪表盘指针 Dashboard Gauge
│   └── G6 散点出现 Scatter Appear
│
└── H. 物理/3D 动画 Physics & 3D
    ├── H1 弹簧物理 Spring Physics
    ├── H2 碰撞检测 Collision
    ├── H3 重力模拟 Gravity
    ├── H4 3D 卡片倾斜 3D Tilt
    ├── H5 3D 旋转展示 3D Carousel
    ├── H6 粒子场/力场 Particle Force Field
    └── H7 流体模拟 Fluid Simulation
```

---

## 三、逐类详解

---

### A. 入场动画 Entry

#### A1 淡入 Fade In

```
属性：opacity 0 → 1
节奏：ease-out
时长：300-600ms
触发：scroll-into-view / page-load
```

**变体**：
- 纯淡入（无位移）
- 带色彩滤镜淡入（`filter: brightness(0.7) saturate(0)` → 正常）
- 带透明度遮罩淡入（`mask-image` 从中心展开）

**适用场景**：几乎任何首次出现的元素。最安全的入场方式。

**CSS 实现**：
```css
@keyframes fadeIn {
  from { opacity: 0; }
  to   { opacity: 1; }
}
/* 或 Framer Motion: initial={{ opacity: 0 }} animate={{ opacity: 1 }} */
```

---

#### A2 上浮淡入 Reveal Up（最常用）

```
属性：opacity 0→1, translateY 20-40px → 0
节奏：cubic-bezier(0.22, 1, 0.36, 1) [ease-out-quint]
时长：500-800ms
触发：whileInView / Intersection Observer
```

**变体**：
- 小幅上浮（16px）—— 轻盈感
- 大幅上浮（40px）—— 重量感
- 带模糊：`filter: blur(6px) brightness(0.7)` → 清晰

**适用场景**：标题、卡片、列表项、section 内容区的标准入场。

**IGNAI 项目现状**：已在 `Reveal.tsx` 中实现基础版（opacity + translateY + brightness），但缺少 blur 变体。

---

#### A3 下落淡入 Drop In

```
属性：opacity 0→1, translateY -30px → 0
节奏：cubic-bezier(0.34, 1.56, 0.64, 1) [带回弹]
时长：600-900ms
触发：scroll-into-view
```

**变体**：
- 带旋转微调（rotate -3deg → 0）
- 带弹性过冲（translateY 过冲到 +4px 再回弹）

**适用场景**：通知条、标签、浮动元素、从顶部"落下"的信息。

---

#### A4 侧滑入场 Slide In

```
属性：opacity 0→1, translateX ±60px → 0
节奏：ease-out
时长：500-700ms
触发：scroll / click(tab切换) / route-change
```

**变体**：
- 从左侧滑入（内容区常见）
- 从右侧滑入（侧边面板、抽屉）
- 全宽滑入（page transition）

**适用场景**：Tab 内容切换、侧栏打开、内容对比、卡片轮播。

---

#### A5 缩放入场 Scale In

```
属性：opacity 0→1, scale 0.85-0.92 → 1
节奏：cubic-bezier(0.34, 1.56, 0.64, 1) [弹性]
时长：400-600ms
触发：scroll-into-view / click(modal打开)
```

**变体**：
- 从中心放大（modal、lightbox）
- 从某一点放大（点击位置展开）
- 带轻微旋转（scale + rotate -5deg → 0）

**适用场景**：模态框、图片放大、卡片弹出、logo 出现。

---

#### A6 旋转入场 Rotate In

```
属性：opacity 0→1, rotate ±15deg → 0, scale 0.9 → 1
节奏：ease-out
时长：500-700ms
```

**适用场景**：图标出现、装饰元素、创意性元素。

---

#### A7 模糊清晰 Blur In

```
属性：opacity 0→1, filter blur(8-12px) → blur(0)
节奏：ease-out
时长：600-1000ms
```

**变体**：
- 高斯模糊渐清（最常见）
- 色彩溢出模糊（`blur + saturate` 先过饱和再恢复正常）

**适用场景**：大标题、背景图片、品牌宣言文字。

---

#### A8 翻转入场 Flip In

```
属性：opacity 0→1, rotateY/rotateX ±90deg → 0
配合：perspective: 800-1400px, backface-visibility: hidden
节奏：ease-out
时长：600-900ms
```

**变体**：
- Y轴翻转（卡片正反面）
- X轴翻转（上下翻）
- 3D 翻书效果

**适用场景**：卡片切换、对比展示、品牌故事翻页。

**GEO 项目现状**：已在 `animation-handbook.html` 中实现 `paperFlip` 效果。

---

#### A9 揭幕/裁剪展开 Clip Reveal

```
属性：clip-path 从 inset(50% 50% 50% 50%) → inset(0)
     或 clip-path: circle(0%) → circle(75%)
节奏：cubic-bezier(0.22, 1, 0.36, 1)
时长：600-1000ms
```

**变体**：
- 圆形展开（从中心向外）
- 矩形展开（从左到右、从上到下）
- 对角线擦除（`polygon` 动画）
- 水平线展开（高度从 0 到 auto）

**适用场景**：图片展示、section 背景切换、全屏页面转场。

---

#### A10 交错入场 Stagger

```
不是独立动画，而是入场动画的编排模式
子元素共享同一入场动画，但通过 animation-delay 依次触发
间隔：80-150ms
```

**编排模式**：
- 纵向交错（列表、卡片网格）
- 横向交错（导航项、标签栏）
- 网格交错（从左上到右下对角线延迟）
- 随机交错（`Math.random() * delay` 范围内）

**适用场景**：卡片列表、导航栏、特性网格、标签墙、团队成员。

**IGNAI 项目现状**：已在 CultureSection 和 CommunityRolesSection 中使用 `index * 0.08s` 交错。

---

#### A11 分字/逐词入场 Word by Word

```
将文字拆分为单个字符或单词
每个单元独立做淡入/上浮，按顺序交错
间隔：30-60ms（字符级）/ 80-120ms（单词级）
```

**变体**：
- 逐字符淡入（打字机感但更流畅）
- 逐单词上浮
- 逐行渐现（每行一个 `Reveal`）
- 从随机位置汇聚到正确位置

**适用场景**：品牌大标题、宣言文字、首页核心文案。

---

### B. 退场动画 Exit

> 退场动画是**最容易被忽略但最能提升品质感**的动画类型。没有退场动画的页面就像只有开场没有谢幕。

#### B1 淡出 / B2 上移消失 / B3 缩放消失 / B4 侧滑离场 / B5 模糊消散

与入场动画镜像，但通常**时长更短**（200-400ms），节奏更干脆。

**关键原则**：
- 退场时长 = 入场时长 × 0.6~0.7
- 退场节奏更偏向 ease-in（加速离开）
- 退场方向通常与入场方向相反或互补

**适用场景**：Modal 关闭、Toast 消失、旧内容让位给新内容、section 滚出视口。

**IGNAI 项目现状**：**完全缺失**。目前所有入场动画 `once: true` 后不再有退场，页面切换也没有过渡。

---

### C. 环境动画 Ambient

> 环境动画是页面的"呼吸"，让静态页面有生命力。特点是：慢、循环、低透明度、不抢焦点。

#### C1 粒子系统 Particles

```
实现：Canvas 2D / WebGL / CSS（少量）
参数：数量(20-200)、大小(1-4px)、速度、颜色、行为模式
行为模式：
  - 随机漂浮（最常见）
  - 向某方向流动（风向感）
  - 向汇聚点收敛（IGNAI 已实现：scroll > 68% 时粒子收敛）
  - 排斥/吸引（鼠标交互）
  - 连线（粒子间距离 < 阈值时画线）
```

**IGNAI 项目现状**：`BackgroundFX.tsx` 已实现 76/42 个漂浮粒子 + 汇聚行为，质量不错。

---

#### C2 流线/曲线流动 Flow Lines

```
实现：Canvas 2D
参数：振幅、频率、速度、颜色、拖尾光点
行为：正弦波叠加，带光点沿路径移动
```

**IGNAI 项目现状**：已实现 7/4 条流线 + 拖尾光点，质量不错。

---

#### C3 脉冲扩散 Pulse Rings

```
属性：scale 0.5 → 1.5+, opacity 0.5 → 0
节奏：ease-out
时长：2-4s
循环：infinite
```

**变体**：
- 单圈脉冲（最常见的"信号扩散"）
- 多圈交错脉冲（延迟递增）
- 从某点向外扩散的水波纹

**适用场景**：Hero 背景点、CTA 按钮、地图定位点、信号节点。

**IGNAI 项目现状**：在 `BackgroundFX.tsx` 中实现了两个脉冲圆（橙 + 蓝）。

---

#### C4 呼吸光效 Breathing Glow

```
属性：opacity 0.4-0.6 ↔ 0.8-1.0, scale 0.97 ↔ 1.04
节奏：ease-in-out
时长：7-14s
循环：infinite
```

**变体**：
- 径向渐变呼吸（`radial-gradient` 大小脉动）
- box-shadow 呼吸（发光范围变化）
- 整体亮度呼吸（`filter: brightness` 循环）

**适用场景**：背景光球、能量场、卡片环境光。

**IGNAI 项目现状**：`ignite-breathe` (14s)、`pulse-glow` (7s)、`card-energy-pulse` (10s)、`presence-hold` (16s)、`cta-heat` (7s) — 已有 5 种呼吸变体，覆盖面不错。

---

#### C5 漂浮浮动 Floating / Drift

```
属性：translateY ±12px / translateX ±24px / rotate ±5deg
节奏：ease-in-out
时长：9-24s
循环：infinite
```

**变体**：
- 垂直漂浮（`float`，上下缓慢移动）
- 水平漂移（`drift-x`，左右缓慢移动）
- 组合漂移（x + y + rotate 叠加）
- 缓慢平移（`slow-pan`，图片内微微移动，Ken Burns 效果）

**IGNAI 项目现状**：`float` (9s)、`drift-x` (18s)、`drift-rotate` (24s)、`slow-pan` (18s) — 覆盖充分。

---

#### C6 噪声纹理 Noise Texture

```
实现：SVG feTurbulence filter 或 Canvas
参数：baseFrequency(0.4-0.8), numOctaves(2-4)
用途：给画面添加"胶片颗粒感"和"数字噪点"
通常透明度很低：0.03-0.06
mix-blend-mode: soft-light / overlay
```

**IGNAI 项目现状**：已在 `PageBackdrop.tsx` 中通过 SVG inline 实现。

---

#### C7 渐变移动 Gradient Shift

```
属性：background-position 或 gradient angle 缓慢变化
时长：12-20s
循环：infinite
效果：渐变色缓慢流动，营造"流动感"而不突兀
```

**变体**：
- 角度旋转渐变（`conic-gradient` rotate）
- 位置平移渐变（`background-position` 移动）
- 颜色呼吸渐变（颜色值缓慢过渡）

**适用场景**：按钮背景、卡片边框流光、section 背景。

**IGNAI 项目现状**：`energy-border-flow` (16s) 实现了边框渐变流光。

---

#### C8 星空/点点阵 Starfield

```
实现：Canvas / CSS multiple box-shadow / WebGL
参数：数量(100-500)、大小(0.5-2px)、闪烁频率
行为：随机分布，微弱闪烁，可能带视差移动
```

**变体**：
- 静态星空（固定位置 + 闪烁）
- 向前飞行（warp speed，从中心向外加速）
- 多层视差（近处大亮快、远处小暗慢）

**适用场景**：深色背景、太空主题、科技感场景。

---

#### C9 波纹/涟漪 Ripple

```
实现：Canvas / CSS / SVG
属性：圆环从中心向外扩散 + 透明度渐隐
参数：波速、波高、衰减、颜色
```

**变体**：
- 单点涟漪（点击触发）
- 环境涟漪（随机位置自动出现）
- 交互涟漪（鼠标移动留下涟漪）

**适用场景**：水主题、点击反馈、背景环境层。

---

### D. 交互反馈 Interactive

> 交互反馈动画是用户**能直接感知到"这个网站很精致"**的关键层。

#### D1 Hover 上浮 Lift

```
属性：translateY -2px 到 -6px, box-shadow 增强
节奏：ease-out / cubic-bezier(0.22, 1, 0.36, 1)
时长：250-400ms
```

**变体**：
- 微上浮 + 阴影加深（最常见，卡片）
- 上浮 + 边框颜色变化（IGNAI 已用）
- 上浮 + 图片轻微放大（`scale(1.03)`）
- 上浮 + 底部发光（`box-shadow` 加颜色光）

**IGNAI 项目现状**：卡片 hover 上浮 `-4px` + 边框变亮，已实现。

---

#### D2 Hover 光斑追踪 Spotlight

```
实现：JS 监听 mousemove，计算鼠标相对卡片的位置
效果：卡片上跟随鼠标的径向渐变光斑
属性：background: radial-gradient(circle at ${x}% ${y}%, rgba(255,255,255,0.08), transparent 60%)
```

**变体**：
- 简单白色光斑（最常见）
- 彩色光斑（跟随品牌色）
- 边框高亮（只在边缘亮，`border-image` 变化）
- 全息效果（`holographic`，彩虹色渐变跟随鼠标）

**适用场景**：卡片、面板、CTA 区域、特性展示块。

**IGNAI 项目现状**：**未实现**。建议优先加入。

---

#### D3 磁性吸附 Magnetic

```
实现：JS 监听 mousemove，当鼠标接近按钮时，按钮向鼠标方向轻微偏移
效果：按钮仿佛被鼠标"吸引"
偏移量：4-12px
节奏：spring 弹性曲线
```

**适用场景**：CTA 按钮、导航项、关键交互元素。

**IGNAI 项目现状**：**未实现**。设计文档中已规划。

---

#### D4 按钮微光扫过 Shimmer

```
属性：::before/::after 伪元素从左侧滑到右侧
实现：linear-gradient 白色半透明光带 + translateX 动画
时长：hover触发时 0.6-0.8s 一次性播放
```

**IGNAI 项目现状**：`button-shine` 已实现，hover 时光带扫过，质量不错。

---

#### D5 点击涟漪 Click Ripple

```
实现：点击时在点击位置创建一个扩散圆环
属性：scale 0 → 2+, opacity 0.4 → 0
时长：400-600ms
```

**变体**：
- Material Design 风格（填充扩散）
- 圆环扩散（只有边框）
- 从点击位置向外扩散

**适用场景**：按钮、卡片、列表项。

---

#### D6 拖拽跟随 Drag Follow

```
实现：touch/mouse 事件驱动，元素跟随手势移动
属性：translate 跟随手指/鼠标
节奏：可选 spring 回弹
```

**适用场景**：轮播、卡片堆栈、滑块、拖拽排序。

---

#### D7 鼠标视差 Mouse Parallax

```
实现：mousemove 事件，不同层以不同速率响应
属性：translateX/Y，深度越远移动越少
系数：前景 0.02-0.05，中景 0.01-0.02，背景 0.005-0.01
```

**变体**：
- 全局鼠标视差（整个页面）
- 局部视差（只在某个 section 内）
- 3D 倾斜视差（`perspective` + `rotateX/Y` 跟随鼠标）

**适用场景**：Hero 区域、产品展示、3D 卡片效果。

**IGNAI 项目现状**：**未实现**。建议加入 Hero 区域。

---

#### D8 弹性回弹 Elastic Bounce

```
属性：scale 或 translateY 过冲后回弹
节奏：spring 弹性曲线 或 cubic-bezier(0.34, 1.56, 0.64, 1)
时长：500-800ms
```

**变体**：
- 弹性缩放（scale 0 → 1.1 → 0.97 → 1）
- 弹性位移（落下过冲后弹回）
- 果冻效果（`scaleX/scaleY` 交替变化）

**适用场景**：按钮点击、图标切换、数据更新、Toggle。

---

#### D9 跟随光标 Cursor Trail

```
实现：自定义光标 + 拖尾效果
效果：光标位置留下渐隐的尾迹
延迟：100-300ms 的 easing 跟随
```

**变体**：
- 圆点拖尾（最常见）
- 光晕跟随（大发光圈跟随鼠标）
- 文字/图标跟随（小标签跟随）
- 磁力线（鼠标附近的元素被"拉动"）

**适用场景**：创意网站、品牌展示、游戏化界面。

---

### E. 叙事动画 Narrative

> 叙事动画是**区分"有动画的网页"和"会讲故事的品牌官网"**的分水岭。

#### E1 滚动视差 Scroll Parallax

```
实现：scroll 事件 / useScroll hook，不同层以不同速率移动
属性：translateY, scale, opacity, rotate
速率比：前景 1.0x, 中景 0.6x, 背景 0.3x
```

**变体**：
- 垂直视差（最常见，前景快背景慢）
- 深度视差（多层不同速度）
- 缩放视差（滚动时近处放大、远处缩小）
- 透明度视差（滚动时某些层淡入淡出）

**IGNAI 项目现状**：HeroSection 已实现基础视差（contentY/imageY/imageScale）。

---

#### E2 粘性叙事 Sticky Narrative

```
实现：position: sticky + scroll progress 驱动内容变化
效果：滚动时，某个 section "粘住"，内容在原地随滚动变化
常见模式：
  - 左侧 sticky 标题，右侧内容随滚动切换
  - 全屏 sticky 卡片，滚动切换不同卡片内容
  - Sticky 进度条 + 内容段落逐步出现
```

**适用场景**：方法论展示、产品功能介绍、品牌故事、服务流程。

**IGNAI 项目现状**：**未实现**。这是最需要补的叙事能力。

---

#### E3 横向时间轴 Horizontal Timeline

```
实现：sticky container + translateX 驱动横向滚动
效果：垂直滚动触发水平内容平移
内容：时间节点 + 卡片内容依次展开
```

**变体**：
- 纯横向滚动（sticky + translateY 换 translateX）
- 3D 时间轴（perspective + rotateY）
- 带节点连接线的时间轴

**适用场景**：发展历程、项目时间线、产品迭代记录。

---

#### E4 翻页切换 Page Flip / Stage

```
属性：rotateY ±90deg, opacity, translateZ
配合：perspective: 1000-1400px, backface-visibility: hidden
模式：多张卡片轮流翻转展示
```

**变体**：
- 书页翻转（Y轴）
- 卡片堆叠切换（Z轴）
- 幻灯片淡入淡出
- 3D 立方体旋转（`rotateY` 四面体）

**GEO 项目现状**：`animation-handbook.html` 中已实现 `paperFlip`。

---

#### E5 跑马灯/信息流 Marquee / Ticker

```
属性：translateX 从 0 → -100%（或反向）
节奏：linear 匀速
时长：20-40s（取决于内容长度）
技巧：复制一份内容拼接实现无缝循环
边缘：mask-image 渐隐遮罩
```

**变体**：
- 单行单方向
- 双行双向（一行正一行反）
- 垂直跑马灯
- 带 hover 暂停

**适用场景**：合作品牌 logo 墙、用户评价、媒体报道、标签云。

**GEO 项目现状**：`animation-handbook.html` 中已实现双行跑马灯。

---

#### E6 进度指示 Progress Indicator

```
属性：scaleX 0 → 1（横向进度条）或 stroke-dashoffset（环形进度）
触发：scroll progress
效果：滚动页面时，进度条同步填充
```

**变体**：
- 顶部细进度条（阅读进度）
- 环形进度（章节进度）
- 步骤指示器（Step 1/2/3 高亮切换）
- 滚动到某 section 时自动高亮对应导航

**适用场景**：长文章、文档页、多步骤流程。

---

#### E7 背景接管 Background Handoff

```
效果：滚动到不同 section 时，背景色/氛围平滑切换
实现：scroll progress 驱动 CSS 变量 或 Intersection Observer 切换 class
过渡：background-color / gradient 的 crossfade
```

**变体**：
- 颜色渐变切换（最常见）
- 光源位置切换（径向渐变中心移动）
- 整体氛围切换（粒子颜色、密度变化）

**适用场景**：多 section 长页面，每个 section 有独立"情绪"。

**IGNAI 项目现状**：**未实现**。所有 section 共享同一背景氛围。

---

#### E8 数字递增 Counter Roll

```
属性：数字从 0 递增到目标值
节奏：ease-out（先快后慢）
时长：1.5-3s
触发：scroll-into-view
```

**变体**：
- 整数递增（0 → 1,200）
- 百分比递增（0% → 98%）
- 货币递增（$0 → $50M）
- 带千分位格式化

**适用场景**：数据展示、成就统计、影响力数字。

---

#### E9 路径描绘 SVG Path Draw

```
属性：stroke-dashoffset 从路径总长度 → 0
配合：stroke-dasharray = 路径总长度
节奏：ease-in-out 或 linear
时长：2-5s
```

**变体**：
- 单线描绘
- 多线依次描绘
- 带节点出现的路径（路径到某点时，节点弹出）
- 流动路径（`stroke-dashoffset` 循环，模拟流动效果）

**适用场景**：流程图、连接线、地图路线、数据链路。

**GEO 项目现状**：`animation-handbook.html` 中已实现流程图描边。

---

### F. 文字动画 Typography

#### F1 打字机 Typewriter

```
效果：文字逐字符出现，伴随闪烁光标
实现：JS 定时器控制 textContent 或 CSS steps()
时长：每字符 50-100ms
```

**变体**：
- 纯打字（逐字出现）
- 打字 + 删除 + 打字（循环多句话）
- 带音效的打字（配合 click 音）
- 多行打字（每行打完光标跳到下一行）

**GEO 项目现状**：`animation-handbook.html` 中已实现打字机 + 删除 + 循环。

---

#### F2 逐词高亮 Word Highlight

```
效果：一段文字中，某些关键词依次被高亮
实现：每个词包裹在 span 中，依次添加高亮 class
间隔：200-400ms
高亮方式：背景色变化 / 颜色变化 / 下划线展开
```

**适用场景**：核心文案中的关键词强调、AI 回答模拟。

---

#### F3 文字变形 Text Morph

```
效果：一组文字变形为另一组文字（形状补间）
实现：SVG text path 或 CSS font-variation-settings 动画
或：两组文字 crossfade + 位移过渡
```

**适用场景**：品牌口号切换、数字变化。

---

#### F4 文字拆分 Text Split Reveal

```
效果：一行文字从中间裂开，上下两半分别向上/下移开
或：文字从分散位置飞入拼合
实现：每个字符独立 transform，用 JS 拆分文字
```

**变体**：
- 水平裂开（上下分离）
- 垂直裂开（左右分离）
- 随机飞入（从各方向飞来拼合）
- 下划线展开（文字下方线条从左到右展开后文字出现）

---

#### F5 渐变文字流动 Gradient Text Flow

```
属性：background-position 动画（渐变文字的背景移动）
效果：文字上的渐变色持续流动
实现：background-clip: text + background-position 动画
时长：3-8s 循环
```

**适用场景**：品牌标题、特色标语。

---

#### F6 光标闪烁 Cursor Blink

```
属性：opacity 1 ↔ 0
节奏：steps(1) 或 ease-in-out
时长：0.8-1.2s
```

**变体**：
- 竖线光标（最常见）
- 下划线光标
- 色块光标（覆盖式）

---

### G. 数据可视化动画 Data Visualization

#### G1 柱状图增长 Bar Grow

```
属性：scaleY 0 → 目标值
节奏：ease-out，每个柱子交错 delay
时长：800ms-1.5s
transform-origin: bottom
```

#### G2 折线描绘 Line Draw

```
属性：stroke-dashoffset 从总长度 → 0
效果：折线从起点到终点逐渐画出
```

#### G3 环形进度 Circular Progress

```
属性：stroke-dashoffset 从周长 → 目标值
配合：SVG circle + stroke-dasharray
```

#### G4 轨道运动 Orbit

```
属性：rotate 0 → 360deg
实现：transform-origin 偏移 + rotate + translate + counter-rotate
效果：元素沿圆形轨道公转，同时自身不旋转
```

#### G5 仪表盘指针 Dashboard Gauge

```
属性：rotate 从最小角度到目标角度
效果：指针弹性旋转到目标位置
```

#### G6 散点出现 Scatter Appear

```
效果：多个数据点从随机位置飞入到正确位置
属性：translateX/Y + opacity
交错：每个点有随机 delay
```

---

### H. 物理/3D 动画 Physics & 3D

#### H1 弹簧物理 Spring Physics

```
实现：spring(t) = amplitude × e^(-damping × t) × cos(frequency × t)
特点：自然的过冲-回弹效果
框架：Framer Motion spring / react-spring / GSAP
参数：stiffness, damping, mass
```

#### H2 碰撞检测 Collision

```
实现：基于距离的圆/矩形碰撞检测
效果：物体间互相碰撞弹开
应用：品牌球碰撞、节点网络
```

#### H3 重力模拟 Gravity

```
实现：每帧 vy += gravity, 位置 += velocity
效果：物体自然下落 + 反弹
```

#### H4 3D 卡片倾斜 3D Tilt

```
属性：perspective + rotateX/rotateY 跟随鼠标
效果：卡片随鼠标位置倾斜，产生 3D 立体感
参数：perspective 800-1200px, max-rotate 10-20deg
增强：光泽层跟随倾斜移动
```

#### H5 3D 旋转展示 3D Carousel

```
属性：translateZ + rotateY 多卡片环形排列
效果：卡片围成一圈，可旋转切换
实现：CSS transform-style: preserve-3d 或 Three.js
```

#### H6 粒子场/力场 Particle Force Field

```
实现：WebGL / Canvas + 向量场
效果：粒子受力的场影响，形成流动、漩涡等形态
参数：引力、斥力、涡旋、噪声场
```

#### H7 流体模拟 Fluid Simulation

```
实现：WebGL shader / metaball
效果：液体般的流动和融合
应用：创意背景、品牌视觉
```

---

## 四、动画编排层次模型

理解了单个动画后，更重要的是**如何编排多个动画形成体验**。

### 4.1 五层动画编排模型

```
┌─────────────────────────────────────────┐
│  Layer 5: 页面转场 Page Transition       │  ← 跨页面
│  (淡入淡出、滑动、共享元素 morph)          │
├─────────────────────────────────────────┤
│  Layer 4: 叙事滚动 Narrative Scroll       │  ← section 级
│  (sticky、视差、背景接管、section handoff) │
├─────────────────────────────────────────┤
│  Layer 3: 入场/退场 Entry & Exit          │  ← 组件级
│  (Reveal、Stagger、Flip、Clip)            │
├─────────────────────────────────────────┤
│  Layer 2: 交互反馈 Interactive            │  ← 元素级
│  (hover、click、drag、magnetic、spotlight) │
├─────────────────────────────────────────┤
│  Layer 1: 环境氛围 Ambient                │  ← 全局
│  (粒子、流线、呼吸、噪声、渐变)            │
└─────────────────────────────────────────┘
```

### 4.2 各层的节奏原则

| 层级 | 时长范围 | 循环性 | 用户感知 |
|------|---------|--------|---------|
| 环境氛围 | 7-24s | 无限循环 | 潜意识（"这个页面有生命力"） |
| 交互反馈 | 150-400ms | 一次性 | 即时（"我的操作被响应了"） |
| 入场退场 | 400-800ms | 一次性 | 有意识（"新内容出现了"） |
| 叙事滚动 | 持续跟随滚动 | 随滚动 | 沉浸（"我在被引导阅读"） |
| 页面转场 | 300-600ms | 一次性 | 过渡（"我到了新页面"） |

---

## 五、缓动曲线速查表

| 名称 | cubic-bezier | 视觉感受 | 适用场景 |
|------|-------------|---------|---------|
| **linear** | (0, 0, 1, 1) | 匀速 | 环境动画、进度条、跑马灯 |
| **ease** | (0.25, 0.1, 0.25, 1) | 标准缓动 | 通用 |
| **ease-in** | (0.42, 0, 1, 1) | 加速结束 | 退场、物体飞出 |
| **ease-out** | (0, 0, 0.58, 1) | 减速结束 | 入场、展开 |
| **ease-in-out** | (0.42, 0, 0.58, 1) | 慢-快-慢 | 位移、缩放 |
| **ease-out-quint** | (0.22, 1, 0.36, 1) | 急停减速 | 入场上浮（最常用） |
| **ease-out-back** | (0.34, 1.56, 0.64, 1) | 过冲回弹 | 弹性入场 |
| **ease-in-back** | (0.6, -0.28, 0.74, 0.05) | 先缩再出 | 退场消失 |
| **spring** | 非贝塞尔，物理模型 | 自然弹性 | 按钮、拖拽、交互 |

> **IGNAI 全局缓动**：项目统一使用 `cubic-bezier(0.22, 1, 0.36, 1)` 即 ease-out-quint，是很好的选择。

---

## 六、技术实现方案对照

### 6.1 CSS vs Framer Motion vs GSAP vs Canvas/WebGL

| 场景 | 推荐方案 | 理由 |
|------|---------|------|
| 简单 hover/入场 | CSS transition + @keyframes | 零依赖、性能最优、声明式 |
| 滚动触发入场 | Framer Motion `whileInView` | React 生态集成好、API 简洁 |
| 复杂滚动叙事 | GSAP + ScrollTrigger | 最强大的滚动编排引擎 |
| 平滑滚动 | Lenis / locomotive-scroll | 替代原生 scroll 的丝滑体验 |
| 粒子/流线/物理 | Canvas 2D | 性能可控、灵活度高 |
| 3D 效果 | React Three Fiber / Three.js | 3D 场景、shader、能量核 |
| 页面转场 | Framer Motion `AnimatePresence` | Next.js App Router 集成好 |
| 弹性物理 | react-spring / Framer Motion spring | 自然物理模型 |

### 6.2 性能优先级

```
性能最优 → 最差：
CSS transform/opacity  >  CSS filter  >  Canvas 2D  >  WebGL  >  DOM layout 属性

只会触发 Composite 的属性（推荐）：
✅ transform (translate, rotate, scale)
✅ opacity
✅ filter (blur, brightness, contrast)

会触发 Layout 的属性（避免动画）：
❌ width, height, top, left, margin, padding
❌ border-width, font-size
```

---

## 七、给 AI 描述动画的 Prompt 模板

### 模板 1：精确描述

```
请在 [页面位置] 实现一个 [效果名称] 动画。
- 视觉对象：[什么元素]
- 运动方式：[属性] 从 [起始值] 到 [终值]
- 节奏：[缓动曲线]
- 时长：[X]ms
- 触发：[scroll-into-view / hover / click / load]
- 循环：[1次 / infinite / alternate]
- 实现约束：[CSS only / Framer Motion / GSAP]
```

### 模板 2：从语义出发

```
我需要表达 "[语义]" 的感觉（例如"AI 在扫描数据" / "品牌信号在扩散" / "数据在流动"）。
请从本文档的动画分类中选择最合适的效果，并说明理由。
页面位置：[X]
技术栈：[Next.js + Tailwind + Framer Motion]
```

### 模板 3：对标参考

```
参考 [网站URL] 的 [具体位置] 效果。
请在我的项目中实现类似但适配我品牌色的版本。
我的品牌色：[橙金 #FF9A3C + 电蓝 #5DA9FF]
技术栈：[Next.js + Framer Motion + Tailwind]
```

---

## 八、IGNAI 项目动画覆盖度盘点

| 分类 | 已实现 | 未实现（推荐优先级排序） |
|------|--------|----------------------|
| **A. 入场** | A2 上浮淡入, A10 交错 | **A7 Blur In, A9 Clip Reveal, A5 Scale In, A11 逐词入场** |
| **B. 退场** | 无 | **B1-B5 全部缺失** ⚠️ |
| **C. 环境** | C1 粒子, C2 流线, C3 脉冲, C4 呼吸, C5 漂浮, C6 噪声, C7 渐变流光 | C8 星空, C9 涟漪 |
| **D. 交互** | D1 Hover 上浮, D4 微光扫过 | **D2 光斑追踪, D3 磁性, D7 鼠标视差, D8 弹性回弹** |
| **E. 叙事** | E1 基础视差 | **E2 Sticky 叙事, E5 跑马灯, E7 背景接管, E8 数字递增, E6 进度指示** |
| **F. 文字** | 无 | **F1 打字机, F4 文字拆分, F5 渐变文字流动** |
| **G. 数据** | 无 | G1-G6 全部可选 |
| **H. 物理** | 无（C2 流线有物理感但非物理引擎） | H4 3D 倾斜可选 |

### 最值得 IGNAI 优先补齐的 8 个动画

1. **E2 Sticky 叙事** — 最大体验提升，让 section 内容在滚动中动态变化
2. **B1 退场动画** — 补全动画闭环，告别"入场后就不动了"
3. **D2 Hover 光斑追踪** — 卡片精致度大幅提升
4. **E7 背景接管** — 每个 section 有独立氛围
5. **A7 Blur In** — 大标题的模糊渐清效果，提升首屏高级感
6. **F5 渐变文字流动** — 品牌标题上的渐变流动
7. **D7 鼠标视差** — Hero 区域的交互深度感
8. **E8 数字递增** — 社区数据展示（成员数、活动数等）

---

## 九、附录：动画效果速查索引

| 我想实现... | 查看分类 |
|------------|---------|
| 标题逐字出现 | F1 打字机 / A11 逐词入场 |
| 卡片滚动时出现 | A2 上浮淡入 / A10 交错 |
| 按钮悬停发光 | D4 微光扫过 / D2 光斑追踪 |
| 背景有粒子飘浮 | C1 粒子系统 / C8 星空 |
| 滚动时背景切换 | E7 背景接管 |
| 流程图线条描绘 | E9 SVG Path Draw |
| 数字从0数到目标 | E8 数字递增 |
| 品牌logo滚动展示 | E5 跑马灯 |
| 点击按钮的反馈 | D5 涟漪 / D8 弹性回弹 |
| 3D卡片效果 | H4 3D 倾斜 / A8 翻转 |
| 页面切换过渡 | Layer 5 页面转场 |
| 数据图表动画 | G1-G6 数据可视化 |
| 图片缓慢移动（Ken Burns） | C5 slow-pan |
| 按钮被鼠标吸引 | D3 磁性吸附 |
| 一组元素依次出现 | A10 交错入场 |
| 信息自动翻页展示 | E4 Stage 切换 |
| 文字上的渐变色流动 | F5 渐变文字流动 |
| 长页面滚动进度 | E6 进度指示 |
| 弹出式模态框 | A5 Scale In |
| 通知消息消失 | B2 上移消失 |
