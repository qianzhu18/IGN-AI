# 08 — UI 对标 v1.0.0 可行性评估与实施路线

> 目标：让 NotionNext 3003 端口（ignai 主题）的 UI 质量完全对标 3004 端口（v1.0.0 原版 Sanity 架构）
> 评估日期：2026-05-07
> 评估人：Claude Code

---

## 1. 两版技术栈对比

| 维度 | 3003 — NotionNext (当前) | 3004 — v1.0.0 原版 (目标) |
|------|--------------------------|---------------------------|
| **框架** | Next.js Pages Router (v14.2) | Next.js App Router (v15.3) |
| **语言** | JavaScript | TypeScript |
| **CSS 方案** | styled-jsx (内联 `<style>` 标签) | Tailwind CSS 3.4 + 全局 CSS |
| **动画库** | CSS animations + Animate.css / WOW.js | Framer Motion 12 |
| **图标库** | Font Awesome 6 (CDN) | Lucide React (SVG inline) |
| **布局引擎** | 单列堆叠式 section | 双栏网格 (左文右图 Hero) |
| **CMS** | Notion | Sanity |
| **源码位置** | `/Users/mac/.../IGN AI 官网/` | `/Users/mac/.codex/worktrees/ignai-v1-preview/` |

---

## 2. UI 差距详细分析（按严重程度排序）

### 2.1 Hero 区域 — 差距最大 ★★★★★

**3004 目标效果：**
- 双栏布局：左侧文字 + CTA 按钮，右侧品牌图片 + signal grid
- Canvas 粒子动画（`<canvas>` 实现 ignite field 效果）
- 多层渐变光晕背景（radial-gradient × 4 层）
- 品牌图片带 slow-pan 缓动 + 渐变遮罩 + pill-shaped 标签
- 布局使用 `section-grid` CSS Grid

**3003 当前状态：**
- 纯文字单栏布局，无右侧品牌图
- 无 canvas 粒子，用 CSS radial-gradient 星点模拟
- signal grid 放在文字最下方，无视觉分隔
- 缺少多层渐变深度感

**改造方案：**
- Hero 组件改为 CSS Grid 双栏布局
- 右栏添加品牌图片 + signal grid 浮层
- 用 `next/dynamic` + `ssr: false` 实现 canvas 粒子
- 添加多层渐变背景 div

---

### 2.2 滚动动画 — 差距大 ★★★★☆

**3004 目标效果：**
- Framer Motion IntersectionObserver 进入动画
- 初始状态：`opacity: 0; translateY(32px); filter: brightness(0.72) contrast(0.92)`
- 进入动画：平滑过渡到 `opacity: 1; translateY(0); filter: none`
- 每个 section、每张卡片独立触发
- Culture 区域的 presence-card 有递增 `animation-delay`

**3003 当前状态：**
- WOW.js + Animate.css 的 `fadeInUp` 类名
- 部分元素未触发动画（缺少 `wow` class 或 `data-wow-delay`）
- 无 brightness/contrast 过渡效果

**改造方案：**
- 安装 `framer-motion`
- 创建 `useScrollReveal` hook 封装 IntersectionObserver + animate
- 替换所有 WOW.js 调用为 framer-motion `motion.div`
- 添加 brightness + contrast 滤镜过渡

---

### 2.3 活动卡片 — 差距大 ★★★★☆

**3004 目标效果：**
- 卡片含封面图 + 渐变遮罩 + hover 缩放
- 状态标签（pill-shaped，半透明背景）
- 日期 + 地点（带 Lucide 图标）
- 标题 + 副标题 + 描述 + 标签组
- hover 时向上位移 + border 颜色变化
- 最小高度保障（`min-h-[580px]` → 响应式）

**3003 当前状态：**
- 纯文字卡片（ignai-card），无图片
- Font Awesome 图标
- 无 hover 缩放效果
- 无封面图和渐变遮罩层

**改造方案：**
- 重写活动卡片组件为图文结构
- 添加图片区域 + 渐变遮罩
- 升级 hover 效果（transform + border transition）

---

### 2.4 背景层 & 视觉深度 — 差距中 ★★★☆☆

**3004 目标效果：**
- 全局固定背景：4 层叠加
  1. 白色顶部渐变（`linear-gradient 180deg, rgba(255,255,255,0.018)`）
  2. 径向光晕（Heat 橙 + Signal 蓝）
  3. 竖线分割（居中 1px 线条渐变）
  4. 网格纹理（92px × 92px 细线）
  5. 噪点纹理（SVG feTurbulence, opacity 5%）
- Canvas 粒子层（`mix-blend-mode: screen, opacity 40%`）

**3003 当前状态：**
- Hero 区域有渐变 + radial-gradient 星点
- 无全局固定背景层
- 无噪点纹理
- 无网格纹理

**改造方案：**
- 在 `_app.js` 或 LayoutBase 中添加全局背景层
- 实现 4 层 CSS 叠加
- Canvas 粒子单独实现

---

### 2.5 排版精细度 — 差距中 ★★★☆☆

**3004 排版规范：**
- eyebrow label: `0.75rem, uppercase, letter-spacing 0.06em, border pill`
- section-eyebrow: `0.8rem, #f0d48d/84, letter-spacing 0.04em`
- display-title: `5.6rem (lg), 4rem (md), 3rem (base), letter-spacing -0.02em, line-height 1.1`
- section-title: `2rem, font-semibold`
- section-lead: `1.125rem, #e4e4e7`
- section-body: `0.9375rem, rgba(255,255,255,0.72), line-height 1.7`
- 卡片标题: `1.45-1.55rem, line-height 1.26-1.28`
- 最大字符宽度: `max-w-[14ch]` ~ `max-w-[18ch]`

**3003 当前状态：**
- styled-jsx 定义了 `ignai-display-title`、`ignai-section-eyebrow` 等 class
- 大部分值接近，但缺少精确的 `max-w-[ch]` 限制和 `letter-spacing` 微调

**改造方案：**
- 逐项对比 style.js 中的 CSS 值
- 添加 `max-width: ch` 约束
- 微调 letter-spacing 和 line-height

---

### 2.6 图标系统 — 差距小 ★★☆☆☆

**3004 使用 Lucide React (SVG)**
- `sparkles`, `arrow-right`, `calendar-days`, `map-pin` 等
- 内联 SVG，无需 CDN

**3003 使用 Font Awesome 6 (CDN)**
- `fa-bolt`, `fa-arrow-right` 等
- 需要 CDN 加载

**改造方案：**
- 安装 `lucide-react`
- 逐步替换 FA 图标为 Lucide
- 移除 FA CDN 依赖（非必须，可渐进）

---

### 2.7 Field Notes 区块 — 差距中 ★★★☆☆

**3004 目标效果：**
- 第一张大卡片占 2 列（`lg:col-span-2`）
- 小卡片 1 列
- 每张卡片：标题 + 描述 + 封面图（aspect-[2.05]）+ 底部标签
- hover 时 border 变蓝 + 文字变蓝

**3003 当前状态：**
- 无 Field Notes 区块

**改造方案：**
- 新建 FieldNotes 组件
- 实现大小卡片混排 Grid

---

### 2.8 Footer — 差距小 ★☆☆☆☆

**两版差异较小**，主要是排版细节和链接数量。

---

## 3. 技术可行性评估

### 结论：可行，预计可达 90%+ 视觉对标

| 能力 | 可行性 | 说明 |
|------|--------|------|
| Hero 双栏布局 | ✅ 完全可行 | CSS Grid 调整 |
| Canvas 粒子 | ✅ 可行（需注意） | `next/dynamic` + `ssr: false`，Pages Router 下正常工作 |
| Framer Motion 动画 | ✅ 完全可行 | 安装 framer-motion，在客户端组件中使用 |
| 活动卡片重写 | ✅ 完全可行 | 新组件 |
| 背景层叠加 | ✅ 完全可行 | 纯 CSS |
| 排版微调 | ✅ 完全可行 | CSS 数值调整 |
| Lucide 图标 | ✅ 完全可行 | 安装 lucide-react |
| 多页面路由 | ⚠️ 需适配 | NotionNext 的 `[prefix]` 机制，可用但需映射 |
| Notion CMS 数据 | ⚠️ 需映射 | 活动/记录需要从 Notion Database 获取 |

### 核心约束

1. **Pages Router** — 不能用 Server Components / `app/` 目录，但所有视觉效果都可以在客户端实现
2. **styled-jsx vs Tailwind** — 当前 ignai 主题用 styled-jsx，建议保持不变但精细调整。全面迁移 Tailwind 工作量大且收益有限
3. **NotionNext 主题系统** — 组件需遵循 `themes/ignai/` 结构，不能脱离主题框架

---

## 4. 实施路线（分 3 批次）

### 批次 A：视觉核心（P0，约 6-8 小时）

> 目标：首屏视觉质量从 60% 提升到 90%

| 任务 ID | 任务 | 预估 | 修改文件 |
|---------|------|------|---------|
| VA-01 | Hero 双栏布局改造（左文右图 + signal grid） | 2-3h | `Hero.js`, `style.js` |
| VA-02 | 安装 framer-motion + 创建 useScrollReveal hook | 1h | 新建 hook, `package.json` |
| VA-03 | 全站滚动动画替换（WOW.js → framer-motion） | 2-3h | 所有 section 组件 |
| VA-04 | 背景层升级（渐变 + 噪点 + 网格） | 1-2h | `style.js`, `index.js` |

### 批次 B：内容区块（P1，约 5-7 小时）

> 目标：内容区从「有内容」升级到「有品质」

| 任务 ID | 任务 | 预估 | 修改文件 |
|---------|------|------|---------|
| VB-01 | Canvas 粒子系统 (ignite field) | 1-2h | 新建 `IgniteField.js` |
| VB-02 | 活动卡片组件重写 | 2-3h | 新建/重写 `EventCard.js` |
| VB-03 | Field Notes 区块 | 2h | 新建 `FieldNotes.js` |
| VB-04 | 排版精细对齐 | 1-2h | `style.js` |

### 批次 C：打磨优化（P2，约 3-4 小时）

> 目标：从 90% 到 95%+

| 任务 ID | 任务 | 预估 | 修改文件 |
|---------|------|------|---------|
| VC-01 | Lucide 图标替换 | 1-2h | 所有组件 |
| VC-02 | Footer 升级 | 1h | `Footer.js` |
| VC-03 | 响应式微调 | 1h | `style.js` |
| VC-04 | 交互打磨（hover, focus, transition） | 1h | 各组件 |

---

## 5. 依赖安装清单

```bash
# 必需
yarn add framer-motion

# 推荐
yarn add lucide-react

# 可选（如果决定替换 styled-jsx）
# 不建议：迁移成本高，收益低
```

---

## 6. 风险与缓解

| 风险 | 概率 | 影响 | 缓解措施 |
|------|------|------|---------|
| framer-motion 与 Pages Router 兼容问题 | 低 | 中 | framer-motion 12 官方支持 Pages Router |
| Canvas 粒子在 SSR 报错 | 中 | 低 | `next/dynamic({ ssr: false })` |
| styled-jsx 性能瓶颈（大量 CSS） | 低 | 低 | 关键动画用 inline style 或 CSS Module |
| NotionNext 主题系统限制组件自由度 | 中 | 中 | 可在 `components/` 下创建独立组件绕过 |

---

## 7. 验收标准

对标 3004 截图进行逐区域对比验收：

- [ ] Hero 区域：双栏布局、品牌图、signal grid、粒子效果
- [ ] 滚动动画：每个 section 平滑渐入，带 brightness 过渡
- [ ] 活动卡片：封面图 + 渐变遮罩 + hover 效果 + 标签系统
- [ ] 背景深度：全局渐变 + 噪点 + 网格 + 竖线
- [ ] 排版精确度：字号、字距、行高、最大宽度与 3004 一致
- [ ] Field Notes：大小卡片混排 + 封面图 + hover 效果
- [ ] 图标一致性：Lucide SVG 图标
- [ ] 整体质感：视觉上难以区分 3003 和 3004
