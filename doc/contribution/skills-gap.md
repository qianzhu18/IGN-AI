# 待补齐能力：行动计划

> 四项能力：Code Review / 版本发布 / Breaking Change / 回滚
> 状态：待执行

---

## 1. Code Review（现在就能做）

### 目标
学会从 reviewer 视角阅读代码，提出有价值的反馈。

### 行动

**Review PR #4138**（tangly1024 刚合并，0 个 review）

- 改动文件：`components/PrismMac.js` (+4 -4), `styles/notion.css` (+26 -0)
- 链接：https://github.com/notionnext-org/NotionNext/pull/4138
- 任务：
  1. 读 diff，理解改动意图（fix markdown details/summary rendering）
  2. 检查是否有副作用（会不会影响其他 markdown 元素）
  3. 检查 CSS 选择器是否过于宽泛
  4. 留一条 review comment，格式：

```
LGTM 👍 一个小问题：
[具体问题描述]
建议：[改进方案]
```

### 学到了什么
- Review 的核心是"找副作用"，不是"看懂代码"
- 好的 review comment = 发现问题 + 给出建议，而不只是"这里有问题"

---

## 2. 版本发布（主动提议）

### 目标
参与 release notes 撰写，理解版本发布的流程。

### 背景
- 最新版本：v4.9.5.7（2026-05-27）
- 你的 PR 在 v4.9.5.7 之后合并：#4126, #4130, #4132, #4133, #4134（5 个）
- tangly1024 自己也合了 #4128, #4138

### 行动

给 tangly1024 发一条 Discussion 或 Issue，内容：

```
标题：v4.9.5.8 Release Notes 草稿

## v4.9.5.8 (2026-05-29)

### Features
- feat(api): On-Demand Revalidation endpoint — 刷新 Notion 内容后可立即更新前端缓存 (#4126, fixes #1020)
- fix(rss): RSS feed API fallback — Vercel 部署不再出现 404/502 (#4133, fixes #3983 #3931 #3872)

### Bug Fixes
- fix(styles): 暗黑模式下数据库标签和 link-mention 文字可读性 (#4132, fixes #3765 #3727)
- fix(heo): 上锁文章的目录不再泄露 (#4132, fixes #3728)
- fix(build): 默认禁用 build prefetch 以减少 Notion API 429 (#4128)

### Performance
- perf(members): getAllMembers 输出精简 60%，减少 pageProps 体积 (#4130)

### Tests
- test: Apple Music song embed normalization 覆盖率 (#4134)

---
如果需要我帮忙整理完整 release notes，请告诉我。
```

### 学到了什么
- Release notes 的结构：Features / Bug Fixes / Performance / Breaking Changes
- 版本号的语义：patch (x.y.Z) = bug fix, minor (x.Y.0) = new feature, major (X.0.0) = breaking change
- 发布流程：tag → GitHub Release → Vercel 自动部署

---

## 3. Breaking Change（找个安全的机会）

### 目标
经历一次"改了现有行为"的 PR，学会评估影响范围和迁移成本。

### 行动方案

选一个你熟悉的配置项，改它的默认值。例如：

**方案 A：改 RSS 默认生成策略**
- 当前：RSS 在 build 时写入 `public/rss/feed.xml`（你加了 API fallback）
- 改动：将 API fallback 设为默认方式，不再写静态文件
- Breaking：依赖静态文件路径的用户会受影响
- 迁移：在 release notes 中说明"RSS 现在通过 /api/rss 动态生成"

**方案 B：改 NOTION_INDEX 默认值**
- 当前：`NOTION_INDEX` 默认 0（第一个视图）
- 改动：改为从 Notion CONFIG 读取，没有则报错而不是静默用 0
- Breaking：没有配置 NOTION_INDEX 的用户会看到报错
- 迁移：在报错信息中给出配置指引

**方案 C：弃用旧的 RSS 文件生成**
- 在 `generateRss()` 中加 `console.warn('[DEPRECATED] 静态 RSS 生成将在 v5.0 移除，请使用 /api/rss')`
- 不是 breaking，但为未来 breaking 做准备

### 学到了什么
- Breaking change 的评估：谁会受影响？影响有多大？迁移成本多高？
- Deprecation 周期：warn → error → remove（至少一个版本）
- SemVer 规则：breaking change 必须 bump major version

---

## 4. 回滚（练习 git revert）

### 目标
学会在 PR 合并后发现问题时安全回滚。

### 行动

在你的 fork 上练习（不影响上游）：

```bash
cd /tmp/notionnext-fork

# 1. 模拟"合了之后发现有 bug"
git checkout main
git log --oneline -5  # 找到一个你最近合并的 commit

# 2. 练习 revert
git revert <commit-hash>  # 创建一个"反向 commit"

# 3. 查看 revert 结果
git show HEAD  # 确认改动是反向的

# 4. 推到你的 fork 验证
git push origin main

# 5. 如果确认没问题，reset 回去
git reset --hard HEAD~1
git push origin main --force
```

### 真实场景
如果上游合了你的 PR 后发现问题：
1. 在上游提一个 revert PR：`gh pr create --title "revert: xxx"`
2. 或者提一个 fix PR（更常见）
3. tangly1024 也可以直接 `git revert` 后 push

### 学到了什么
- `git revert` vs `git reset --hard`：revert 是安全的（创建新 commit），reset 是危险的（改写历史）
- 只 revert merge commit 需要 `-m 1` 参数
- 回滚后要重新修 bug，再提一个新 PR

---

## 执行顺序

```
本周：Code Review (#4138) + 版本发布 (release notes 草稿)
  │
  ▼
下周：Breaking Change (选一个方案执行)
  │
  ▼
随时：回滚练习 (git revert 在 fork 上练)
```
