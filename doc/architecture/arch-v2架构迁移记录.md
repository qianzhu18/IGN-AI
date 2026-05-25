# IGNAI 架构迁移记录：从自建全栈到 NotionNext 二开

> 作者：千逐 / Lucien
> 日期：2026-05-06
> 版本：v2.0.0 — 架构迁移正式记录

---

## 0. 执行摘要

IGNAI 社区官网从 **v1.0.0（Next.js 15 + Sanity + Supabase 自建架构）** 迁移至 **v2.0.0（NotionNext 二开架构）**。

旧架构现以 `release-1.0.0` 分支和 tag `v1.0.0` 保留。新架构最初在 `notionnext-v2` 分支完成迁移，当前产品集成主线已回到 `main`。

**一句话决策理由**：自建架构的维护成本远超其技术收益，NotionNext 以 Notion 为唯一后端的模式，将维护负担从"三个 SaaS 的集成调试"降为"在 Notion 里写内容"。

---

## 1. 为什么要放弃 v1.0.0 架构

### 1.1 v1.0.0 架构是什么

```
Next.js 15 + React 19 (App Router)
    ├── Sanity v4 — 内容 CMS（活动、记录、故事）
    ├── Supabase — 业务数据（加入申请）
    ├── Vercel — 部署平台
    └── 18 个环境变量
```

技术上完整、可工作、有 fallback 机制。但它有一个根本问题。

### 1.2 核心矛盾：维护成本 vs 团队规模

| 指标 | 数据 |
|------|------|
| 代码中胶水代码占比 | 35%（634 行 / 总代码） |
| 核心文案可编辑性 | 6 个 TypeScript 文件里的文案无法通过 CMS 编辑 |
| 发布一篇活动的步骤 | 7+ 步（Sanity Studio 表单） |
| 配置一个新环境的时间 | 18 个环境变量 + 3 个 SaaS 注册 |
| SaaS 供应商数量 | 3 个（Vercel + Sanity + Supabase） |
| 日常维护者 | 1 人 |

**一个维护者面对三个 SaaS 的集成，这不是架构问题，是工程经济性问题。**

### 1.3 Fallback 的隐性风险

v1.0.0 有一个精心设计的 fallback 机制：Sanity 无数据时使用 `src/content/` 里的硬编码数据。

问题在于：你无法区分「Sanity 挂了」和「Sanity 被清空了」。如果运营者误删所有活动，网站会静默显示 3 条假活动，没有告警。这比直接报错更危险。

### 1.4 认证方案的天花板

v1.0.0 的认证是 `SHA256(password)` 当 Cookie value。没有 nonce、没有过期签名、没有单 session 撤销、所有人共享同一个密码。对一个人运营没问题，但一旦有多个管理员就是安全隐患。

---

## 2. 为什么选择 NotionNext 二开

### 2.1 决策依据

这个决策不是"技术选型"，而是"工程约束下的最优解"。核心约束是：

1. **维护者只有 1 人**（偶尔 2-3 人协作）
2. **核心需求是内容展示**（活动、记录、成员介绍），不是复杂的业务逻辑
3. **运营者的 Notion 熟练度是已有资产**，不需要额外学习
4. **社区处于 0→1 阶段**（< 100 人），不需要企业级架构

### 2.2 NotionNext 的数据

| 指标 | 数据 |
|------|------|
| GitHub Star | 11.4k |
| GitHub Fork | 14.6k |
| Open Issues | 389（活跃社区） |
| 最后提交 | 2026-05-03（3 天前） |
| 可用主题 | 25+（含 heo 暗色主题） |
| 部署方式 | Vercel / Docker / VPS / Netlify / EdgeOne |
| 环境变量 | 只需 1 个（`NOTION_PAGE_ID`） |

### 2.3 关键能力

- **多数据库**：`NOTION_PAGE_ID='主站ID,members:成员库ID,events:活动库ID'` 支持多个 Notion Database 对应不同板块
- **heo 暗色主题**：专为中文开发者社区设计的暗色主题，和 IGNAI 品牌定位一致
- **Docker 部署**：官方 Dockerfile，支持国内 VPS 一键部署
- **ISR 缓存**：60 秒更新周期，Notion 挂了也有缓存兜底
- **已有经验**：运营者已经在 qianzhu_blog 项目上完整走过 NotionNext 二开的流程

### 2.4 与 v1.0.0 的直接对比

| 维度 | v1.0.0（自建） | v2.0.0（NotionNext） |
|------|---------------|---------------------|
| 后端数量 | 3 个（Vercel + Sanity + Supabase） | 1 个（Notion） |
| 环境变量 | 18 个 | 1 个 |
| 发布活动 | 7+ 步 | 2 步 |
| 内容编辑入口 | Sanity Studio（仅网页，移动端差） | Notion APP（手机/电脑/网页） |
| 胶水代码 | 35% | ~5% |
| 改社区简介 | 改 TypeScript → git push → 等 Vercel 构建 | 在 Notion 里改一行 |
| 国内部署 | 需要 VPS + 手动配置 | Docker 官方支持 + CNAME 加速 |
| 成员管理 | 需要建 Supabase 表 + 写 API | Notion Database + 表单工具 |
| 认证 | 自建共享密码 | 不需要（Notion 自带权限） |

---

## 3. 为什么不选择其他架构

### 3.1 Payload CMS（42.2k Star）

**优势**：技术上最优解——可以把 Sanity + Supabase 合并为一个系统，内置 Auth、关系数据库、管理后台。

**为什么放弃**：
- 仍然是自建架构，需要开发者维护
- 不解决「非技术用户编辑内容」的核心问题
- Payload 的编辑体验不如 Notion（对运营者而言）
- 没有利用运营者已有的 Notion 熟练度
- 迁移工作量 7-12 天，不比 NotionNext 的 5-9 天短

**判断**：如果社区发展到 500+ 人、需要真正的用户系统和权限管理，Payload 是合理的升级路径。但不是现在。

### 3.2 Nextra（13.8k Star）

**优势**：Next.js 原生的文档/博客框架，MDX 驱动，暗色主题极好。

**为什么放弃**：
- **只适合文档/博客**，没有活动管理、成员展示等社区功能
- 内容在 Git 仓库里（MDX 文件），不是 CMS
- 改内容需要 git commit + push，和 v1.0.0 的问题一样
- 不支持多内容类型（活动 vs 文章 vs 成员）

**判断**：如果 IGNAI 是一个纯技术文档站，Nextra 是更好的选择。但 IGNAI 是社区官网，需要多种内容类型和动态数据。

### 3.3 WordPress + BuddyBoss

**优势**：功能最全——成员管理、活动、博客、社交、论坛，开箱即用。

**为什么放弃**：
- 技术栈老旧（PHP + MySQL），和团队的技术方向不匹配
- 维护负担重（插件更新、安全补丁、数据库备份）
- 安全风险高（WordPress 是全球最大被攻击目标）
- 定制暗色主题的成本比 NotionNext 高
- 国内部署需要 ICP 备案才能用国内 CDN

**判断**：如果社区需要完整的论坛和社交功能，且有人专职维护 WordPress，可以考虑。但对当前阶段来说太重了。

### 3.4 Ghost

**优势**：写作体验最好，专注内容。

**为什么放弃**：
- 没有活动管理功能
- 成员模型是「订阅者」，不是「社区成员」
- 需要自托管或付费使用 Ghost Pro
- 不支持多内容类型

**判断**：纯博客场景的完美工具，但不是社区官网。

### 3.5 Hexo / VuePress / VitePress

**为什么放弃**：
- 全部是静态博客/文档生成器
- 没有动态功能（表单提交、成员管理、状态流转）
- 内容在 Markdown 文件里，改内容需要 git push
- 不适合社区官网场景

### 3.6 为什么不用传统博客建站（Typecho / Halo / Hugo）

传统博客建站解决的是"个人发布内容"的问题，IGNAI 需要解决的是：

1. **多角色展示**（成员头像卡片、活动组织者信息）
2. **动态内容类型**（活动有报名链接、地点、议程；记录有作者、分类）
3. **非技术编辑**（运营者应该能在手机上用 Notion APP 发一篇活动公告）
4. **成员登记**（通过表单收集信息，审核后展示）

这些需求超出了传统博客工具的能力范围。NotionNext 通过多数据库 + Notion 的灵活性覆盖了这些需求，而不需要写后端代码。

---

## 4. 迁移执行记录

### 4.1 执行步骤

```
✅ 1. 将当前代码整理为 v1.0.0 存档基线（历史阶段曾使用 `codex/aesthetic-spacing-preview`）
✅ 2. 打 tag v1.0.0，附注说明为"自建架构存档"
✅ 3. 创建迁移分支 `notionnext-v2`
✅ 4. git clone NotionNext 最新版本到项目目录
✅ 5. 保留 doc/ 目录（架构文档、设计规范、需求文档）
✅ 6. 保留 CLAUDE.md，更新为 NotionNext 架构说明
✅ 7. 保留 public/brand/ 和 public/contact/ 品牌资产
✅ 8. 修改 blog.config.js 为 IGNAI 品牌配置
     - THEME: heo（暗色主题）
     - APPEARANCE: dark
     - AUTHOR: IGNAI
     - BIO: 长沙 AI 社区 — 连接创造者，点燃可能性
     - LANG: zh-CN
     - SINCE: 2025
⬜ 9. 创建 IGNAI 的 Notion Database（需要运营者在 Notion 操作）
⬜ 10. 配置 NOTION_PAGE_ID 为多数据库格式
⬜ 11. 部署到 Vercel 验证
⬜ 12. 迁移内容（活动 → 记录 → 文案）
⬜ 13. 二开定制页面（/members, 活动详情, 首页 Hero）
```

### 4.2 文件变化

| 操作 | 说明 |
|------|------|
| 删除 | `src/` 整个目录（Sanity schema, Supabase 集成, 自建组件） |
| 删除 | `sanity.config.ts`, `sanity.cli.ts`, `supabase/` |
| 删除 | `.env.example` 中 18 个环境变量 |
| 新增 | NotionNext 完整源码（themes/, lib/, pages/, components/） |
| 保留 | `doc/` 目录（所有架构文档、设计规范） |
| 保留 | `public/brand/`, `public/contact/`（品牌资产） |
| 修改 | `blog.config.js`（IGNAI 品牌配置） |
| 修改 | `CLAUDE.md`（架构说明更新） |

---

## 5. 后续定制路线图

### Phase 1：基础运行（1-2 天）

- [ ] 在 Notion 创建 IGNAI 的 Database（按 NotionNext 模板）
- [ ] 配置 `NOTION_PAGE_ID`
- [ ] 部署到 Vercel，验证 heo 主题正常显示
- [ ] 替换 logo、favicon 等品牌资产

### Phase 2：内容迁移（2-3 天）

- [ ] 将活动数据迁移到 Notion「活动」Database
- [ ] 将记录/故事迁移到 Notion「文章」Database
- [ ] 将社区简介、文化描述写入 Notion Page
- [ ] 验证所有页面内容正确

### Phase 3：外观定制（2-3 天）

- [ ] heo 主题颜色调整为 IGNAI 品牌色（Heat #FF7A18, Signal #5DA9FF）
- [ ] 首页 Hero 区域定制
- [ ] 导航栏定制
- [ ] 字体适配（Noto Sans SC）

### Phase 4：功能二开（2-3 天）

- [ ] /members 页面（读取 Notion 成员 Database）
- [ ] 活动详情页模板定制
- [ ] 成员登记表单集成（Notion Form / 飞书表单）
- [ ] 评论系统配置（Giscus / Waline）

---

## 6. 架构师视角的总结

如果有人问我"为什么做出这个决策"，我的回答是：

**架构选择的核心不是技术先进性，而是约束条件下的最优解。**

IGNAI 社区的约束条件是：
- 1 人维护
- 内容更新频率高（每周活动）
- 运营者技术背景有限（会 Notion，不会 TypeScript）
- 社区处于冷启动阶段

在这些约束下，NotionNext 的"Notion 即一切"模式是唯一能让运营者**独立完成内容更新**的方案。其他所有方案——无论是自建、Payload CMS、WordPress——都需要开发者参与日常内容维护。

**最好的架构是你感受不到它存在的架构。** NotionNext 让运营者感受不到"架构"的存在——打开 Notion，写内容，网站自动更新。这才是社区官网应该有的样子。

v1.0.0 的代码没有白写。它产出了完整的设计规范（`doc/design/`）、需求文档（`doc/requirements/`）和架构调研（`doc/architecture/`）。这些知识资产会指导 v2.0.0 的定制方向。技术选型改变了，但对社区的理解和对产品品质的追求没有变。

---

*当前集成主线：`main`*
*迁移阶段分支：`notionnext-v2`（历史）*
*v1.0.0 存档：`release-1.0.0` + tag `v1.0.0`*
