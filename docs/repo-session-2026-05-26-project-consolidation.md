# Repository Session Record - 2026-05-26

## 1. 本次目标

```text
把当前仓库从“多 AI 协作后的分支 / worktree / 文档分裂状态”收束回一个清晰可继续迭代的主线。
```

## 2. 本次范围

### 仓库治理
- 本地 worktree / 分支收束
- GitHub 默认分支对齐

### 协作文档
- `CLAUDE.md`
- `AI_HANDOFF.md`
- `agent.md`
- `doc/ROADMAP/ROADMAP-overall-plan.md`
- `doc/ROADMAP/ROADMAP-master-todo.md`
- `docs/execution-playbook.md`
- `doc/TO DO/TODO.md`
- `doc/TO DO/TODO-animation-migration.md`
- `doc/design/09-动效迁移设计文档-v1到NotionNext.md`
- `doc/architecture/arch-v2架构迁移记录.md`

## 3. 为什么现在做这件事

```text
前几轮协作里已经有多条 AI 分支、多个临时 worktree 和多份过时分支说明同时存在。
如果不先收束，后续无论是继续优化产品、整理 upstream diff，还是让新的 AI 接手，
都会先被错误分支和过期路线图带偏。
```

## 4. 实现步骤

1. 盘点 `git status`、`git branch -vv`、`git worktree list` 和远端默认分支状态。
2. 核对剩余 AI worktree 是否还有未提交内容或独立提交。
3. 移除已无独立成果的 Claude worktree 与本地分支。
4. 保留仍有未提交内容的 `codex/issue-3914-apple-music-embed` PR worktree，不混入本次整理。
5. 统一主入口文档里的当前主线、历史分支和阅读顺序。
6. 把这次仓库收束结果单独记录，方便下一次继续协作。

## 5. 验收标准

- [x] `main` 成为明确的当前产品集成主线
- [x] 已合并的 AI worktree / 本地分支不再堆积
- [x] 关键入口文档不再把历史分支写成当前主线
- [x] 保留仍有未提交内容的独立 PR worktree，避免误删

## 6. 验证动作

- [x] `git worktree list --porcelain`
- [x] `git branch -vv`
- [x] `git remote show origin`
- [x] `rg` 检查关键文档中的过时分支引用

## 7. 结果记录

### 改动文件
- `CLAUDE.md`
- `AI_HANDOFF.md`
- `agent.md`
- `doc/ROADMAP/ROADMAP-overall-plan.md`
- `doc/ROADMAP/ROADMAP-master-todo.md`
- `docs/execution-playbook.md`
- `doc/TO DO/TODO.md`
- `doc/TO DO/TODO-animation-migration.md`
- `doc/design/09-动效迁移设计文档-v1到NotionNext.md`
- `doc/architecture/arch-v2架构迁移记录.md`
- `docs/repo-session-2026-05-26-project-consolidation.md`

### 做成了什么
- 已移除 3 个无独立成果的 Claude worktree。
- 已删除对应的 3 个本地 `claude/*` 分支，减少协作噪音。
- 当前只保留 2 个 worktree：主仓库 `main` 和独立 PR worktree `codex/issue-3914-apple-music-embed`。
- 主入口文档已统一说明：`main` 是当前集成主线，`feature/ignai-motion-system` 是历史迁移分支，`release-1.0.0` + tag `v1.0.0` 是旧架构存档。
- 历史迁移文档已改成“历史实施分支”语境，避免继续被误读为当前开发基线。

### 剩下什么
- 远端旧分支 `feature/ignai-motion-system` 仍可保留一段时间作历史存档，是否删除可后续单独决策。
- `codex/issue-3914-apple-music-embed` worktree 里仍有未提交改动，后续应单独处理，不应混入社区官网主线。
- 产品主线仍需继续推进 featured members、角色分组、组织表达和 Event / Member 关系。

### 哪些可以上游
- 本次收束主要是本地仓库治理和协作文档校准，本身不属于 NotionNext 功能上游 diff。
- 真正值得上游的仍是 `Member` 的通用数据层、路由约定、作者映射与测试整理。

### 下一步建议
- 继续从 `main` 推进 Member MVP 的剩余体验项，而不是再回到历史分支上开发。
- 单独处理 `codex/issue-3914-apple-music-embed` worktree，决定是继续提交、合并还是归档。
- 开始整理第一版 upstreamable diff，把共享层和 IGNAI 本地 UI 层再切清一层。
