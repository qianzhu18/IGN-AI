# 动效迁移 TODO — v1.0.0 → NotionNext ignai 主题

> 设计文档：`doc/design/09-动效迁移设计文档-v1到NotionNext.md`
> 分支：`notionnext-v2`（历史实施分支，当前集成主线为 `main`）
> 状态：主体迁移已完成，保留作对照 TODO
> 创建日期：2026-05-07

---

## P0：CSS 动效层（纯 CSS，零风险）

### P0-01: CSS 关键帧动画库补全
- [ ] 迁移 11 个缺失的 @keyframes 到 `style.js`
  - [ ] `ignai-pulse-glow`（发光呼吸 7s）
  - [ ] `ignai-drift-x`（水平漂移 18s）
  - [ ] `ignai-drift-rotate`（旋转漂移 24s）
  - [ ] `ignai-ambient-fade`（淡入淡出 12s）
  - [ ] `ignai-ignite-breathe`（Hero 场呼吸 14s）
  - [ ] `ignai-ignite-ring`（脉冲环 9s）
  - [ ] `ignai-energy-border-flow`（边框流光 16s）
  - [ ] `ignai-card-energy-pulse`（卡片脉冲 10s）
  - [ ] `ignai-presence-hold`（微妙亮度 16s）
  - [ ] `ignai-converge-ray`（汇聚射线 9s）
  - [ ] `ignai-cta-heat`（CTA 脉冲 7s）
- [ ] 添加 7 个 utility class
  - [ ] `.ignai-float-slow`
  - [ ] `.ignai-float-delayed`
  - [ ] `.ignai-pulse-glow`
  - [ ] `.ignai-drift-x`
  - [ ] `.ignai-drift-rotate`
  - [ ] `.ignai-ambient-fade`
  - [ ] `.ignai-motion-cta`
- [ ] 添加 `@media (prefers-reduced-motion: reduce)` 全局禁用
- [ ] `yarn build` 验证
- [ ] git commit

### P0-02: button-shine 扫光效果
- [ ] 在 `.ignai-cta-primary` 添加 `::after` 伪元素
  - [ ] `skewX(-24deg)` 白色渐变条
  - [ ] 悬停时 `translateX(360%)` 过渡
  - [ ] `transition: transform 0.8s cubic-bezier(0.22, 1, 0.36, 1)`
- [ ] `yarn build` 验证
- [ ] git commit

### P0-03: energy-card + energy-panel 悬停效果
- [ ] `.energy-panel::before` — 旋转渐变边框（115deg, 260% bg-size, 16s 流动）
- [ ] `.energy-card` — 默认脉冲动画 + 悬停增强
  - [ ] `brightness(1.08) contrast(1.04)` 滤镜
  - [ ] `translateY(-4px)` 位移
  - [ ] 多层 box-shadow（inset + deep + brand glow）
- [ ] 在 Hero 品牌图和关键卡片上应用新 class
- [ ] `yarn build` 验证
- [ ] git commit

### P0-04: Reveal 组件添加 blur 滤镜
- [ ] 修改 `index.js` 内联 `Reveal` 组件
  - [ ] 初始状态添加 `filter: blur(10px)`
  - [ ] 进入状态 `filter: blur(0px)`
  - [ ] transition duration 保持 800ms
- [ ] 检查所有使用 Reveal 的 section 是否正常
- [ ] `yarn build` 验证
- [ ] git commit

---

## P1：Canvas + 全局背景层

### P1-01: BackgroundFX Canvas 粒子系统
- [ ] 创建 `themes/ignai/components/BackgroundFX.js`
  - [ ] 从 `src/components/motion/BackgroundFX.tsx` 转译为 JS
  - [ ] 去掉 TypeScript 类型注解
  - [ ] `useRef(null)` 替代 `useRef<HTMLCanvasElement>(null)`
  - [ ] 粒子系统：76/42 个粒子 + 7/4 条流线
  - [ ] 滚动 68% 后汇聚效果
  - [ ] 双脉冲环（Heat + Signal）
  - [ ] `prefers-reduced-motion` 支持
- [ ] 在 `LayoutBase` 中用 `dynamic({ ssr: false })` 加载
- [ ] Canvas 样式：`fixed inset-0 z-[1] opacity-40 mix-blend-screen pointer-events-none`
- [ ] `yarn build` 验证
- [ ] git commit

### P1-02: 全局背景层
- [ ] 在 `LayoutBase` 中注入 4 层背景
  - [ ] GridLines：92px 网格图案（品牌色细线）
  - [ ] NoiseOverlay：SVG feTurbulence 噪点（opacity 5%）
  - [ ] GlowOrb：径向渐变辉光球
  - [ ] 渐变背景 + 中心线
- [ ] 可直接在 `LayoutBase` 中用 JSX + 内联 style 实现（无需独立组件文件）
- [ ] `yarn build` 验证
- [ ] git commit

---

## P2：交互增强

### P2-01: 多节滚动视差
- [ ] WhatIs section — `useScroll` + `useTransform` 视差
  - [ ] 图片区域 `mediaY` 偏移
  - [ ] `mediaScale` 1 → 1.04
- [ ] Culture section — 同上
- [ ] Join section — 同上
- [ ] `yarn build` 验证
- [ ] git commit

### P2-02: AnimatedHeading 独立组件
- [ ] 创建 `themes/ignai/components/AnimatedHeading.js`
  - [ ] eyebrow：opacity + translateY 600ms
  - [ ] title：opacity + translateY + blur(10px) 800ms delay 50ms
  - [ ] description：opacity + translateY 750ms delay 120ms
- [ ] 在 Hero section 使用替代当前硬编码标题
- [ ] `yarn build` 验证
- [ ] git commit

### P2-03: Join 图片漂浮 + 全站 a11y
- [ ] Join section 图片添加 `motion.div` 无限漂浮
  - [ ] `animate={{ x: [0, -14, 0], y: [0, 10, 0] }}`
  - [ ] `transition={{ duration: 18, repeat: Infinity, ease: "easeInOut" }}`
- [ ] 全站 `useReducedMotion()` 检查
  - [ ] BackgroundFX — 检查
  - [ ] Hero 视差 — 检查
  - [ ] 所有 section Reveal — 检查
  - [ ] Join 漂浮 — 检查
- [ ] `yarn build` 验证
- [ ] git commit
