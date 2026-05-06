好，我直接给你一份**可落地的官网动效设计方案**。
目标不是堆炫技，目标是：

**让 IGNAI 这套首页从“排得不错的静态品牌页”，升级成“有 production 感的动态品牌官网”。**

我会按这几个层次讲：

1. 先定动效总原则
2. 再定整站动效系统
3. 逐个 section 出动效方案
4. 再给技术实现建议
5. 再给性能和优先级方案

---

# 一、先定目标：你到底要什么动效

你对标的视频，真正强的不是“动画多”，而是这三件事：

## 1. 页面一直是活的

即使用户不滚动，也能感觉：

* 背景在呼吸
* 光在流动
* 场在变化

## 2. 滚动像镜头推进

不是“页面往下翻”，而是：

* 一层退场
* 一层接管
* 焦点在移动
* 内容被推出来

## 3. 动效和品牌叙事是同一件事

你这个站的核心词是：

* Ignite
* Signal
* Expression
* Action
* Connection
* Community

所以动效语言不能随便来。
它应该统一围绕：

* **点燃**
* **流动**
* **显现**
* **连接**
* **聚焦**
* **共振**

---

# 二、整站动效总原则

## 原则 1：动效是结构，不是装饰

不要理解成“页面写完再补一点动画”。
应该理解成：

* Hero 靠动效定调
* Section 切换靠动效建立节奏
* 卡片 hover 靠动效建立交互层次
* CTA 靠动效完成情绪收束

---

## 原则 2：全站动效语言统一

建议统一为四类视觉感受：

### A. Glow

发光、呼吸、点燃感

### B. Drift

缓慢漂移、轻微视差、空间流动

### C. Reveal

遮罩显现、模糊到清晰、逐层进入

### D. Pulse

轻微脉冲、信号感、能量感

不要一屏一种风格。
所有 section 都从这四类里选组合。

---

## 原则 3：重特效集中在少数关键区

真正 production 的做法，不是每屏都炸。
而是：

* 首屏最重
* 中段有 1 到 2 个高潮段
* 结尾 CTA 再收束一次

所以你的重点应该放在：

* Hero
* Why now
* Culture
* Join CTA

---

## 原则 4：动效节奏要分层

建议把全站动效分成四层。

### 第 1 层：Ambient Motion

页面一直存在的低频环境动效

### 第 2 层：Scroll Motion

滚动触发的 section 进入和退场

### 第 3 层：Interactive Motion

hover、mouse move、按钮、卡片等交互动效

### 第 4 层：Hero / CTA Signature Motion

品牌级标志性动效，只在关键区域出现

---

# 三、整站动效系统设计

---

# 1. Ambient Motion System 环境动效系统

这一层是你现在最缺的。
它决定整站是不是“活”的。

## 目标

让页面在静止状态下也有微妙生命感。

## 建议组成

### 1.1 背景噪声层

用途：

* 防止大面积纯黑背景太死
* 提升画面颗粒感和高级感

效果：

* 极低透明度 noise
* 轻微位置偏移
* 10 到 20 秒循环即可

实现：

* PNG noise texture + CSS translate
* 或 canvas 噪声贴图缓慢位移

---

### 1.2 Glow Orb 层

用途：

* 形成“点燃”主题
* 给页面空间感

效果：

* 橙色、紫色、蓝色 3 到 5 个大光团
* 缓慢 scale / opacity / position 漂移
* 不要太明显，要像空气在发亮

实现：

* absolute div + radial-gradient + blur
* GSAP / CSS keyframes 控制位移和呼吸

建议参数：

* 单次循环 12 到 20 秒
* scale 在 0.95 到 1.08 间变化
* opacity 变化不要超过 0.12

---

### 1.3 微粒子层

用途：

* 让页面产生“信号 / 火花 / 能量”感

效果：

* 少量粒子慢漂
* 不要太密
* 有些区域偶尔微亮一下

实现：

* canvas 粒子系统
* 或极轻 SVG / div 粒子

适合区域：

* 首屏 skyline 上方
* Why now 区
* Join CTA 区

---

### 1.4 光流纹理层

用途：

* 提升“视频感”
* 让 section 之间不只是硬切

效果：

* 非常轻的横向或弧线流纹
* 像能量线或空气中的光痕

实现：

* SVG path + blur + opacity
* CSS animated gradient mask
* canvas line trails

---

# 2. Scroll Motion System 滚动叙事系统

这一层决定你的网站像不像 production site。

## 目标

让用户滚动时感觉像镜头推进，而不是简单翻页面。

---

## 2.1 Section Enter Reveal

每个 section 进入都应该有统一的 reveal 方式。

建议统一使用：

* opacity: 0 → 1
* y: 40 → 0
* blur: 8px → 0
* duration: 0.8 到 1.2s
* stagger: 0.08 到 0.15

但不要所有元素一起动。
分层：

### 第一层进入

eyebrow / section label

### 第二层进入

主标题

### 第三层进入

supporting text

### 第四层进入

cards / media / buttons

这样页面会显得有秩序。

---

## 2.2 Background Handoff

每个 section 进入时，背景状态也要跟着变。

也就是：

* 上一屏的 glow 慢慢退
* 下一屏的 glow 慢慢接管
* 不同 section 的背景重心略不同

例如：

### Hero

右上橙紫能量核最强

### What is IGNAI

右侧轨道感 / orbital glow

### Why now

中部偏聚焦，像被点亮

### Culture

背景更收，更深，强调黑场和文字冲击

### Identity / Traits

暖一点，发光点更分散

### Join

底部流线重新变强，形成收束

实现方式：

* 每个 section 内部有独立 background layer
* 用 ScrollTrigger 控透明度和 transform

---

## 2.3 Sticky Narrative

建议至少做一个 sticky 叙事区。
最适合放在：

* Why now
* Culture

### 方案 A：Why now sticky

左边标题和 supporting text 固定
右边 4 张点燃卡片逐张高亮接管

滚动时：

* 卡片 1 亮
* 卡片 2 接管
* 卡片 3 接管
* 卡片 4 接管

用户会感觉像一段品牌宣言被讲出来。

### 方案 B：Culture sticky

左边大字“不是围观，而是上场”固定
右边四张 culture 卡片逐张进场

这个效果会非常强。

---

## 2.4 Section Exit Motion

不要只做进入，也要做退场。

退场建议很轻：

* opacity: 1 → 0.7
* scale: 1 → 0.98
* blur: 0 → 2px

这样下一屏上来时，会有镜头衔接感。

---

# 3. Interactive Motion System 交互动效系统

这一层让你页面从“能看”变成“能玩”。

---

## 3.1 Button Motion

按钮一定要统一动效，不然会散。

### 主按钮

用于“加入社区”这类按钮

效果：

* hover 时整体上浮 2px
* box-shadow glow 增强
* 内部箭头轻微右移
* 背景有微弱扫光

实现：

* transform y
* shadow opacity
* pseudo-element 做线性高光 sweep

### 次按钮

用于“了解更多”“联系合作”

效果：

* 边框亮度上升
* 文字颜色更亮
* 内部小图标旋转或移动一点点

---

## 3.2 Card Hover

卡片动效建议统一，不要每类卡片都不一样。

### 卡片 hover 基础规则

* translateY(-4px)
* border-color 变亮
* shadow 更深
* 内部 title 稍微提亮
* icon 轻微 scale 1.03
* 卡片表面出现极弱高光渐变

### 禁忌

* 不要大幅旋转
* 不要过于强烈 3D tilt
* 不要过快

你要的是高级感，不是游戏 UI。

---

## 3.3 Mouse Parallax

可以加，但一定要轻。

适合：

* Hero 主视觉
* Join CTA 背景流线

实现思路：

* 前景和背景不同位移速度
* 鼠标移动只影响 4px 到 12px 范围
* 不要全站都跟着动

---

## 3.4 Magnetic Interaction

CTA 按钮可以加轻量磁吸效果。
鼠标靠近时按钮轻微向指针方向偏移。

适合：

* Hero 主按钮
* Join CTA 主按钮

不适合：

* 普通列表按钮
* 太多按钮同时做

---

# 四、逐个 Section 的动效方案

下面我按你现在的首页结构，一屏一屏给方案。

---

# 01 Hero 动效方案

这是全站最重要的一屏。

## 目标

一进站就让人感觉：

* 页面是活的
* 品牌是有能量场的
* 不是静态海报

---

## Hero 结构建议

分成 5 层：

### 层 1：Base Background

深色渐变底

### 层 2：Noise Layer

低透明颗粒纹理

### 层 3：Glow / Energy Field

右上或中右的主能量核

### 层 4：Signal Layer

星点、连接线、微粒

### 层 5：Foreground Content

标题、说明、按钮

---

## Hero 动效细节

### A. 主标题 Reveal

“IGNAI / Ignite before AGI.”

效果：

* 先文字 mask reveal
* 再轻微 blur sharpen
* 最后一个很弱的 glow settle

时序：

* Logo: 0s
* Eyebrow: 0.15s
* Title: 0.3s
* Supporting text: 0.6s
* Buttons: 0.9s

---

### B. Hero 能量核

这是最关键的 signature motion。

效果：

* 中心 glow 轻微脉冲
* 周围光带缓慢流动
* 粒子绕中心做缓慢漂移
* 偶尔一点点星火闪烁

实现分级：

#### 轻量版

CSS blur orbs + animated SVG paths

#### 中配版

Canvas 粒子 + path trails

#### 高配版

Three.js / shader + bloom

---

### C. Skyline / Signal Layer

你现在首屏底部 skyline 已经有感觉了，可以升级成“活的城市信号层”。

效果：

* 少量点亮节点
* 节点间偶尔 line pulse
* 一些点轻轻闪烁
* 像夜景中的信号网络

实现：

* canvas 节点系统
* 或 SVG line network

---

### D. Hero Scroll Out

滚动离开 Hero 时：

* 主标题 scale 1 → 0.94
* opacity 1 → 0.75
* 背景 glow 稍微向上漂移
* section 下方内容开始上接

这样会更像“镜头离开首屏”。

---

# 02 What is IGNAI 动效方案

## 目标

从情绪过渡到定义。
这一屏要比 Hero 更稳，更理性一点。

---

## 动效设计

### A. Section 背景

Hero 的强能量感在这里稍微收敛。
改成更“轨道 / 网络 / 结构化”的氛围。

效果：

* 一组轻微 orbital lines
* 柔和橙紫 glow
* 右侧可有低频轨迹感旋转

---

### B. 标题与定义句 Reveal

“what is IGNAI” 和定义句做两段 reveal：

* 标题先出来
* 定义句再出来
* 最后 keywords chip stagger

---

### C. Keyword Chips

每个 chip 不要只是静态块。

hover 效果：

* 外框亮起
* 内部字稍亮
* icon 小幅弹性上浮
* 一个 150ms 的微脉冲

---

### D. 右侧图形

如果有主图或轨道图形，可以缓慢旋转或呼吸。

不要真的转得明显。
只要给人一种它是“有状态”的。

---

# 03 Why now 动效方案

## 目标

把“点燃人”做成一次明确的品牌宣言。

---

## 动效形式建议

这里最推荐 sticky narrative。

---

## 方案：左固定 + 右接管

### 左侧

标题和 supporting text 固定

### 右侧

四张点燃卡片逐个接管焦点

每张卡接管时：

* scale 0.96 → 1
* opacity 0.5 → 1
* blur 4px → 0
* 背景 glow 对应高亮

例如：

* Curiosity 高亮时偏橙
* Expression 高亮时偏紫
* Action 高亮时偏金橙
* Collaboration 高亮时偏蓝

---

## 卡片内动效

当前高亮卡：

* icon 有轻微 pulse
* 标题 glow 更强
* 卡片边缘有 very subtle sweep

非当前卡：

* dim 一些
* 仍然可见，但不抢焦点

---

## 额外建议

四张卡上方那张主视觉图，也可以随着焦点变化略变状态：

* 粒子向当前卡片方向流动一点
* glow 中心位置轻微偏移

这会非常接近参考视频的“镜头带着内容走”的感觉。

---

# 04 Culture 动效方案

这是最值得打磨的一区。

## 目标

把文化 statement 做成全站第二个高潮。

---

## 推荐形式

左边大字固定，右边四张卡片逐张亮起。

---

## 左侧大标题

“不是围观，而是上场。”

进入方式：

* mask reveal
* 大字有一点点纵向拉开的进入感
* 不要 bounce，不要花

---

## 右侧四卡

建议一开始不是同时亮。

滚动逻辑：

* 第 1 张出现
* 第 2 张出现
* 第 3 张出现
* 第 4 张出现
* 最后四张一起成立

这样会有“文化被建立”的感觉。

---

## 卡片 hover

这一屏的卡片 hover 可以比别的卡片更强一点，但仍然保持克制。

效果：

* 边框更亮
* title 上浮 1px
* 英文副句从 0.7 → 1
* 内部一条极弱亮线扫过

---

## 背景处理

这一屏背景建议更深，减少花哨图形。
因为这里重点是文字冲击。

但可以保留：

* 非常轻的橙蓝竖向渐变
* 左边大字后有低透明度 glow fog

---

# 05 Identity 动效方案

## 目标

从品牌主张过渡到品牌人格。
这里要有“静下来”的感觉。

---

## 动效策略

这一屏不需要大动。
主要做“质感动效”。

---

## A. 大图 / 大面板 Reveal

你现在这一区有大图和双身份卡，很适合做：

* 大图先整体 fade + scale in
* 再左右卡片 stagger 进入
* 最后底部 tag chips 出现

---

## B. IGNAI / 洋来社 双卡

hover 时可以做微弱人格差异：

### IGNAI 卡

更克制

* glow 稍微冷一点
* 边框更利落
* hover 是轻微升起

### 洋来社 卡

更暖一点

* glow 偏橙
* 背景亮一点点
* hover 更有温度感

这样会让双身份更立体。

---

## C. 大图上粒子

这一区上方那张图可以做轻量 spark drift：

* 火花点慢漂
* 一些星点轻闪
* 不要太多

---

# 06 Traits 动效方案

## 目标

把“本地土壤 / 国际视野 / 技术密度 / 真实连接”做成整齐而高级的品牌特质展示。

---

## 动效策略

这一段更适合“秩序感动效”。

### 进入方式

四张卡按顺序 stagger reveal

### hover

* 边框提亮
* icon 轻微发光
* subtitle opacity 增强
* 背景内层有一点微亮 gradient

---

## 可加的细节

hover 到每张卡时，section 背景右侧有对应色轻微增强：

* Local roots 偏橙
* Global vision 偏蓝
* Technical depth 偏紫
* Human connection 偏暖白或金橙

这样会增强精致感。

---

# 07 Join CTA 动效方案

这是最后一个高潮。

## 目标

做成“情绪收束 + 行动召唤”。

---

## 背景动效建议

这一区最适合做流线能量波。

效果：

* 多条弧形流线缓慢移动
* 中心 glow 很低频脉冲
* 流线方向整体朝向主按钮或标题区域
* 像信号汇聚

实现方式：

* SVG path 动画
* Canvas trails
* shader ribbon

---

## CTA 标题进入

“Join the fire. Bring your signal.”

建议：

* 分两行逐行 reveal
* 第二行略有延迟
* 标题出来后背景流线亮一下再归于平稳

---

## CTA 按钮

主按钮要有更明显的响应感。

hover：

* glow 增强
* 按钮上浮
* 箭头移动
* 背景流线同步亮一点点

这个“按钮和背景联动”的小细节很 production。

---

## 社媒入口

入口 chip hover：

* 单个高亮
* icon scale 1.04
* 外框 glow
* 字体提亮

不要再加太复杂。

---

# 五、技术实现建议

你现在问的是“怎么完成实现”，所以我直接给技术路线。

---

# 1. 最推荐的技术组合

## 基础层

* **Next.js**
* **Tailwind CSS**
* **Framer Motion**

## 滚动编排

* **GSAP**
* **ScrollTrigger**

## 平滑滚动

* **Lenis**

## 粒子 / 背景

* **Canvas 2D**
* 必要时少量 **React Three Fiber**

---

# 2. 各类动效分别用什么做

## 用 CSS / Tailwind 就够的

* blur glow
* gradient 呼吸
* button hover
* card hover
* noise 层平移
* 轻量光带 sweep

## 用 Framer Motion 更顺手的

* 元素 enter / exit
* text reveal
* stagger children
* hover / tap states

## 用 GSAP + ScrollTrigger 的

* sticky narrative
* section 背景接管
* scroll linked scale / opacity / blur
* 多元素编排时序

## 用 Canvas 的

* 粒子
* 节点网络
* 信号点
* 流线拖尾

## 用 React Three Fiber 的

* Hero 能量核
* 高级流体 / shader 主视觉
* 空间感 glow object

---

# 3. 推荐工程分层

建议你把动效拆成几个独立层，而不是写死在 section 里。

## motion/

* `ambient-background.tsx`
* `hero-energy-field.tsx`
* `signal-network.tsx`
* `glow-orbs.tsx`
* `section-reveal.tsx`
* `magnetic-button.tsx`
* `light-sweep.tsx`
* `cta-wave-field.tsx`

## hooks/

* `useScrollProgress.ts`
* `useMouseParallax.ts`
* `useReducedMotion.ts`

## lib/

* `motion-tokens.ts`
* `easings.ts`
* `section-timelines.ts`

这样后期会很好维护。

---

# 六、性能控制方案

这部分很重要，不然容易做炸。

---

## 1. 动效预算原则

全站同时高频刷新的图层不要太多。

控制：

* Hero 最重
* 中段轻
* CTA 再中等
* 其他地方克制

---

## 2. 移动端降级

移动端不要硬上全套特效。

建议：

* 关闭复杂 canvas 粒子
* 关闭 mouse parallax
* sticky narrative 简化
* glow 和 reveal 保留
* CTA 流线保留简化版

---

## 3. respects reduced motion

支持 `prefers-reduced-motion`

降级逻辑：

* 保留静态排版
* reveal 简化为淡入
* 关闭长时间背景运动
* 关闭 hover exaggeration

---

## 4. Three.js 只在必要时加载

如果做 Hero 3D：

* dynamic import
* 只首屏加载
* 离开首屏后可暂停部分更新
* 降低分辨率和粒子数

---

# 七、实施优先级

如果你现在就要开始做，我建议按这个顺序推进。

---

## Phase 1：最低成本，收益最大

先做这 5 件事：

1. 全站 ambient glow + noise
2. section reveal 系统重做
3. card hover 系统统一
4. button hover 系统统一
5. Join CTA 的流线背景

做完这一轮，网站会立刻高级很多。

---

## Phase 2：补滚动叙事

再做：

1. Hero scroll out
2. Why now sticky narrative
3. Culture sticky narrative
4. section background handoff

这一轮做完，网站就开始有“镜头感”。

---

## Phase 3：补 signature motion

最后做：

1. Hero 能量核
2. skyline signal network
3. CTA 背景联动

这一轮是你最接近参考视频的一层。

---

# 八、给你一版“最推荐实现组合”

如果我替你做技术选型，我会这样定：

## Hero

* CSS glow orbs
* canvas 粒子 + 节点网络
* GSAP text reveal
* scroll linked parallax

## What is IGNAI

* orbital background using SVG/CSS
* reveal + chip stagger

## Why now

* sticky + ScrollTrigger
* 四卡逐张接管

## Culture

* 左文固定 + 右卡逐张 reveal
* hover 统一

## Identity / Traits

* 轻 reveal + 质感 hover
* 不上重特效

## Join

* SVG/Canvas 流动能量线
* CTA hover 联动背景亮度

这是投入产出比最高的一套。

---

# 九、你最终应该追求的效果

不是“像视频一样复杂”。

而是让用户在浏览时感受到：

* 页面是活的
* 品牌是有能量的
* 内容不是堆出来的，是被动效推出来的
* 滚动不是翻页，是在进入一个更深的叙事空间

做到这一步，你的网站就会很接近你想对标的 production 级别。

---

# 十、给你的下一步建议

你现在最适合的动作不是继续想“还能不能更像视频”，而是立刻把动效拆成开发任务。

建议按模块排工：

### 模块 1

全站 ambient motion

### 模块 2

Hero signature motion

### 模块 3

Section reveal system

### 模块 4

Sticky narrative for Why now / Culture

### 模块 5

CTA wave field

如果你愿意，我下一步可以继续直接给你出一份
**《IGNAI 官网动效开发任务拆解表》**，我会把每个 section 拆成：

* 视觉目标
* 技术实现
* 动效参数
* 开发优先级
* 验收标准

这样你就可以直接给前端开工。
