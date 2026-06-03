# NotionNext 上游贡献时间线

> 贡献者：qianzhu18 (千逐)
> 项目：[notionnext-org/NotionNext](https://github.com/notionnext-org/NotionNext) (11K+ Stars)
> 角色：Admin / Core Contributor
> 统计截至：2026-05-29

---

## 贡献概览

| 指标 | 数量 |
|------|------|
| 已合并 PR | 10 |
| 提交 Issue / Comment | 6+ |
| 修复的 Issue | #3765, #3727, #3728, #3914, #3983, #3931, #3872, #1020 |
| 涉及模块 | styles, themes(heo/endspace/thoughtlite), lib/db, lib/cache, pages/api, conf, __tests__ |
| 首次贡献 | 2026-04-29 |
| 贡献周期 | 1 个月 |

---

## 时间线

### Phase 1：试水期（2026-04-29 ~ 04-30）

> 目标：熟悉 PR 流程、建立与 maintainer 的信任

| 日期 | PR | 标题 | 类型 | 难度 |
|------|-----|------|------|------|
| 04-29 | #4108 | fix(notion): open article links in new tabs | Bug fix | ★ |
| 04-30 | #4111 | fix(proxio): keep fallback nav when custom menu is empty | Bug fix | ★★ |
| 04-30 | #4112 | fix(sitemap): skip external slugs and guard invalid dates | Bug fix | ★★ |

**收获**：掌握了 fork → branch → commit → push → PR 的完整流程。学会了读 CI 日志、理解 GitHub Actions 的 label check 权限问题。

---

### Phase 2：深入期（2026-05-09 ~ 05-18）

> 目标：理解核心数据管道、解决长期存在的架构问题

| 日期 | PR | 标题 | 类型 | 难度 |
|------|-----|------|------|------|
| 05-09 | #4113 | Codex/notion data format compat | Feature | ★★★ |
| 05-10 | #4119 | fix: normalize newer Notion heading blocks | Bug fix | ★★ |
| 05-13 | #4120 | docs: add community site roadmap | Docs | ★ |
| 05-13 | #4121 | fix(build): share static path work across export workers | Perf | ★★★ |
| 05-13 | #4122 | perf(rss): avoid duplicate feed generation across locales | Perf | ★★ |
| 05-14 | #4123 | fix: normalize Apple Music song embeds | Bug fix | ★★ |
| 05-18 | #4127 | fix: avoid undefined isExport in slug routes | Bug fix | ★★ |

**收获**：学会了追踪 Notion API 的数据流（`loadPageChunk → collectionQuery → getAllPageIds → getPostBlocks`）。理解了 ISR 构建流程和 Worker 协调。首次接触 Notion 非官方 API 的数据格式变动问题。

**关键事件**：
- Issue #3882：Notion 改了 API 数据格式导致全站 404。tangly1024 用 Claude AI 修复。你从中学到了"非官方 API 的脆弱性"。
- Issue #3890：构建阶段触发 Notion API 429 限流。你理解了 `p-limit` 并发控制和 Worker 间的 block prefetch 协调。

---

### Phase 3：核心贡献期（2026-05-27 ~ 05-29）

> 目标：解决高影响力问题、推动社区方向

| 日期 | PR | 标题 | 类型 | 难度 | 影响 |
|------|-----|------|------|------|------|
| 05-27 | #4124 | fix(endspace): dark mode colors for FloatingRecentLogs drawer | Bug fix | ★★ | 修复 #3765 |
| 05-27 | #4125 | fix(thoughtlite): submenu transparent bg & page bottom gap | Bug fix | ★★★ | 修复 #3727 |
| 05-28 | #4126 | feat(api): on-demand revalidation endpoint (#1020) | Feature | ★★★★ | 解决 3 年老问题 |
| 05-29 | #4130 | perf(members): slim getAllMembers output to reduce pageProps | Perf | ★★ | pageProps 减 60% |
| 05-29 | #4132 | fix(styles,heo): dark mode readability + hide TOC for locked articles | Bug fix | ★★★ | 修复 3 个 issue |
| 05-29 | #4133 | fix(rss): add API fallback for RSS feed generation | Feature | ★★★★ | 修复 3 个 issue |
| 05-29 | #4134 | test: add coverage for Apple Music song embed normalization | Test | ★ | 11 个测试用例 |

**收获**：
- 学会了 `createPortal` 导致 CSS 变量作用域丢失的问题（#4125）
- 理解了 Vercel serverless 的只读文件系统对 RSS 生成的影响（#4133）
- 学会了 On-Demand Revalidation 的完整实现（#4126）
- 学会了 `pageProps` 大小优化的思路（#4130）

---

## Issue 活动记录

| 日期 | Issue | 动作 | 内容 |
|------|-------|------|------|
| 05-15 | #3935 | Comment | isExport 未定义的构建报错 |
| 05-27 | #4035 | Author | 社区官网能力：Member & Event 数据类型 |
| 05-27 | #4124 | Comment | EndSpace 暗黑模式文字看不见 |
| 05-27 | #4125 | Comment | thoughtlite 主题模板 bug |
| 05-29 | #3914 | Comment | Apple Music 嵌入问题的技术分析 |
| 05-29 | #4127 | Comment | Notion 数据库筛选限制的技术分析 |

---

## 技术栈覆盖

```
┌─────────────────────────────────────────────────┐
│                    NotionNext                     │
├─────────────┬─────────────┬─────────────────────┤
│   Frontend  │   Backend   │   Infrastructure    │
├─────────────┼─────────────┼─────────────────────┤
│ CSS/Tailwind│ Notion API  │ Next.js ISR         │
│ React Portal│ cache layer │ Vercel Serverless   │
│ Dark Mode   │ RSS/Feed    │ GitHub Actions      │
│ Theme System│ Data Pipeline│ API Routes         │
└─────────────┴─────────────┴─────────────────────┘
```

| 层级 | 接触过的模块 |
|------|-------------|
| 样式层 | styles/notion.css, themes/*/style.js |
| 组件层 | themes/heo, endspace, thoughtlite 组件 |
| 数据层 | lib/db/SiteDataApi.js, lib/db/notion/* |
| 缓存层 | lib/cache/ |
| API 层 | pages/api/revalidate.js, pages/api/rss.js |
| 配置层 | blog.config.js, conf/*, next.config.js |
| 测试层 | __tests__/lib/notion-data-format.test.js |
| CI/CD | GitHub Actions workflow |

---

## 能力成长曲线

```
能力
  ▲
  │                                    ┌─── 解决 3 年老问题 (#1020)
  │                                ┌───┤    批量修复 3 个 CSS bug
  │                            ┌───┤    │    设计 API fallback
  │                        ┌───┤   │    │
  │                    ┌───┤   │   │    │
  │                ┌───┤   │   │   │    │
  │            ┌───┤   │   │   │   │    │
  │        ┌───┤   │   │   │   │   │    │
  │    ┌───┤   │   │   │   │   │   │    │
  │    │   │   │   │   │   │   │   │    │
  └────┴───┴───┴───┴───┴───┴───┴───┴────┴──→ 时间
     04-29  05-09  05-13  05-18  05-27  05-29
     试水期  深入期  性能优化  稳定期  核心贡献期
```

---

## 下一步：待补齐的能力

| 能力 | 当前状态 | 计划 |
|------|---------|------|
| Code Review | 只被 review | Review 其他贡献者的 PR |
| 版本发布 | 未参与 | 协助 tangly1024 做 release notes |
| Breaking Change | 未经历 | 主动改一个会改变现有行为的功能 |
| 回滚 | 未经历 | 合并后发现问题时的应急处理 |
| 跨项目协作 | 只在 NotionNext | 在其他开源项目提 PR |
