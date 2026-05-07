# 09 — 动效迁移设计文档：v1.0.0 → NotionNext ignai 主题

> 目标：将 v1.0.0（3004 端口）的全部动效系统迁移到 NotionNext ignai 主题（3003 端口）
> 创建日期：2026-05-07
> 分支：`notionnext-v2`

---

## 1. 现状差距总览

### v1.0.0 动效资产（源）

| 类型 | 文件 | 行数 | 说明 |
|------|------|------|------|
| Canvas 粒子系统 | `src/components/motion/BackgroundFX.tsx` | 219 | 漂浮粒子 + 流线 + 汇聚 + 脉冲环 |
| 全局背景层 | `src/components/layout/PageBackdrop.tsx` | 15 | 多层渐变背景 |
| 网格线 | `src/components/ui/GridLines.tsx` | 13 | 92px 细线网格 |
| 噪点纹理 | `src/components/ui/NoiseOverlay.tsx` | 12 | SVG feTurbulence 噪点 |
| 辉光球 | `src/components/ui/GlowOrb.tsx` | 35 | 可配置径向渐变发光 |
| 标题动画 | `src/components/ui/AnimatedHeading.tsx` | 62 | blur-enter 逐层进入 |
| 12 个 CSS keyframe | `src/styles/globals.css:389-545` | 156 | 全套品牌动画 |
| button-shine | `src/styles/globals.css:76-94` | 18 | CTA 扫光效果 |
| energy-panel | `src/styles/globals.css:220-239` | 20 | 面板流光边框 |
| energy-card | `src/styles/globals.css:242-259` | 18 | 卡片高能悬停 |
| 多节视差 | HeroSection + WhyNow + Identity | ~45 | useScroll + useTransform |
| Join 图片漂浮 | `src/components/sections/JoinSection.tsx:81-99` | 18 | 无限漂浮循环 |
| a11y reduced-motion | 4 组件 + CSS media query | ~15 | prefers-reduced-motion |

### ignai 主题当前状态（目标）

| 类型 | 状态 | 文件 |
|------|------|------|
| 3 个 CSS keyframe | 仅有 ignai-float, ignai-slow-pan, ignai-presence | `style.js:396-424` |
| Hero 视差 | 有（contentY, imageY） | `index.js:372-398` |
| Reveal 进入动画 | 有（opacity + translateY） | `index.js:72-90` |
| CSS 粒子模拟 | 用 radial-gradient 星点 | `style.js:300-394` |
| 其余全部 | **缺失** | — |

---

## 2. 迁移策略

### 原则

1. **TSX → JS**：所有组件从 TypeScript 转写为 JavaScript（NotionNext 主题体系）
2. **Tailwind → styled-jsx**：CSS 类通过 `<style jsx global>` 注入，不改 NotionNext 样式体系
3. **按优先级分 3 批**：P0（CSS 层）→ P1（Canvas + 背景）→ P2（交互增强）
4. **每步可独立验证**：每完成一个子任务，`yarn build` 验证 + 浏览器对比

### 技术约束

- Pages Router：不能使用 Server Components，Canvas 组件需 `dynamic({ ssr: false })`
- styled-jsx：CSS 变量和 keyframe 定义在 `<style jsx global>` 中
- framer-motion：已安装 v12.38.0，直接可用

---

## 3. 详细实施计划

### P0：CSS 动效层（低风险，高感知）

#### P0-01: CSS 关键帧动画库补全

**源**：`src/styles/globals.css:389-545`（12 个 keyframe）+ `globals.css:355-386`（6 个 utility class）
**目标**：`themes/ignai/style.js`

需要迁移的 keyframe（当前缺失 9 个）：

| keyframe | 用途 | 优先级 |
|----------|------|--------|
| `pulse-glow` | 发光呼吸 7s | 高 |
| `drift-x` | 水平漂移 18s | 高 |
| `drift-rotate` | 旋转漂移 24s | 中 |
| `ambient-fade` | 淡入淡出呼吸 12s | 中 |
| `ignite-breathe` | Hero 场呼吸 14s | 高 |
| `ignite-ring` | Hero 脉冲环 9s | 高 |
| `energy-border-flow` | 边框渐变流光 16s | 高 |
| `card-energy-pulse` | 卡片亮度脉冲 10s | 高 |
| `presence-hold` | 微妙亮度 16s | 中 |
| `converge-ray` | 汇聚射线 9s | 中 |
| `cta-heat` | CTA 脉冲 7s | 高 |

同时需要补全的 utility class：

| class | 说明 |
|-------|------|
| `.ignai-float-slow` | float 9s |
| `.ignai-float-delayed` | float 11s delay 1.4s |
| `.ignai-pulse-glow` | pulse-glow 7s |
| `.ignai-drift-x` | drift-x 18s |
| `.ignai-drift-rotate` | drift-rotate 24s |
| `.ignai-ambient-fade` | ambient-fade 12s |
| `.ignai-slow-pan` | slow-pan 18s（已有） |
| `.ignai-motion-cta` | cta-heat 7s |

#### P0-02: button-shine 扫光效果

**源**：`src/styles/globals.css:76-94`
**目标**：`themes/ignai/style.js`

在 `.ignai-cta-primary` 上添加 `::after` 伪元素扫光：
- `skewX(-24deg)` 白色渐变条
- 悬停时 `translateX(360%)` 扫过
- `transition: transform 0.8s cubic-bezier(0.22, 1, 0.36, 1)`

#### P0-03: energy-card + energy-panel 悬停效果

**源**：`src/styles/globals.css:220-259`
**目标**：`themes/ignai/style.js`

**energy-panel**：`::before` 伪元素旋转渐变边框（115deg, background-size 260%, energy-border-flow 16s）

**energy-card**：
- 默认 `animation: card-energy-pulse 10s`
- 悬停 `brightness(1.08) contrast(1.04)` + `translateY(-4px)` + 多层 box-shadow + 品牌色 glow

#### P0-04: Reveal 组件添加 blur 滤镜

**源**：`src/components/ui/AnimatedHeading.tsx:41-48`
**目标**：`themes/ignai/index.js` 内联 Reveal 组件

当前 Reveal 只有 `opacity + translateY`，需要添加：
- `filter: blur(10px) → blur(0)` 过渡
- 错位延迟（eyebrow 0ms, title 50ms, body 120ms）

---

### P1：Canvas + 全局背景层（核心视觉差距）

#### P1-01: BackgroundFX Canvas 粒子系统

**源**：`src/components/motion/BackgroundFX.tsx`（219 行 TSX）
**目标**：`themes/ignai/components/BackgroundFX.js`（JS 版本）

迁移要点：
1. 去掉 TypeScript 类型注解（`type Particle`, `type FlowLine`）
2. `useRef<HTMLCanvasElement>` → `useRef(null)`
3. 在 `LayoutBase` 中用 `dynamic({ ssr: false })` 加载
4. Canvas 固定定位 `fixed inset-0 z-[1] opacity-40 mix-blend-screen`
5. 粒子 76/42 个（桌面/移动），7/4 条流线
6. 滚动 68% 后粒子汇聚 + 脉冲环
7. `prefers-reduced-motion` 支持

#### P1-02: 全局背景层

**源**：
- `src/components/ui/GridLines.tsx`（13 行）
- `src/components/ui/NoiseOverlay.tsx`（12 行）
- `src/components/ui/GlowOrb.tsx`（35 行）
- `src/components/layout/PageBackdrop.tsx`（15 行）

**目标**：在 `themes/ignai/index.js` 的 `LayoutBase` 中注入

4 层背景堆栈：
1. GridLines：92px 网格 + 品牌色细线
2. NoiseOverlay：SVG feTurbulence 噪点 opacity 5%
3. GlowOrb：径向渐变辉光球
4. PageBackdrop：渐变 + 视差 + 中心线

---

### P2：交互增强（从 90% 到 95%+）

#### P2-01: 多节滚动视差

**源**：HeroSection, WhyNowSection, IdentitySection 各 ~15 行
**目标**：`themes/ignai/index.js` 各 section

在 WhatIs, Culture, Join 等 section 中添加 `useScroll` + `useTransform`：
- 图片区域 `mediaY` 偏移
- `mediaScale` 1 → 1.04
- 每节独立的 `useRef` target

#### P2-02: AnimatedHeading 独立组件

**源**：`src/components/ui/AnimatedHeading.tsx`（62 行）
**目标**：`themes/ignai/components/AnimatedHeading.js`

封装为可复用组件：
- eyebrow：opacity + translateY 600ms
- title：opacity + translateY + blur(10px) 800ms delay 50ms
- description：opacity + translateY 750ms delay 120ms

#### P2-03: Join 图片漂浮 + 全站 a11y

**源**：`JoinSection.tsx:81-99`
**目标**：`themes/ignai/index.js` Join section

- 图片 `motion.div animate={{ x: [0, -14, 0], y: [0, 10, 0] }}` 18s 循环
- 全站 `useReducedMotion()` 检查
- CSS `@media (prefers-reduced-motion: reduce)` 全局禁用

---

## 4. 修改文件清单

| 文件 | 改动类型 | 涉及任务 |
|------|---------|---------|
| `themes/ignai/style.js` | 新增 keyframe + CSS class | P0-01, P0-02, P0-03 |
| `themes/ignai/index.js` | Reveal 增强 + LayoutBase 改造 + section 视差 | P0-04, P1-02, P2-01, P2-03 |
| `themes/ignai/components/BackgroundFX.js` | 新建文件 | P1-01 |
| `themes/ignai/components/AnimatedHeading.js` | 新建文件 | P2-02 |

---

## 5. 验收方法

每个 P 完成后：
1. `yarn build` 构建通过
2. 3003 端口（NotionNext）浏览器截图
3. 与 3004 端口（v1.0.0）同区域对比
4. 移动端 + 桌面端双验证
5. `prefers-reduced-motion` 测试

---

## 6. 风险与缓解

| 风险 | 概率 | 缓解 |
|------|------|------|
| Canvas SSR 报错 | 中 | `dynamic({ ssr: false })` |
| styled-jsx keyframe 作用域问题 | 低 | 使用 `global` 修饰符 |
| 性能问题（多层背景 + Canvas） | 低 | Canvas 用 requestAnimationFrame，CSS 用 GPU 加速 |
| framer-motion 包体积 | 低 | 已安装，无额外依赖 |
