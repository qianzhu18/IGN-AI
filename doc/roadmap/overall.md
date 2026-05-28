# IGNAI 社区官网整体规划

记录日期：2026-05-11
最近校准：2026-05-26
负责人：IGNAI / Codex 协作线
当前主分支方向：`main`

仓库协作基线：

- `main` = 当前产品集成主线
- `feature/ignai-motion-system` = 历史迁移 / 动效阶段分支，保留作存档参考
- `release-1.0.0` + tag `v1.0.0` = 自建架构历史基线

## 1. 这份文档是干什么的

这份文档是 `doc/` 目录下的总控文档。

作用：

1. 统一现在仓库里分散的架构、设计、需求、TODO 文档
2. 明确当前长期主线
3. 给后续每一次优化、每一个分支、每一次提交一个共同坐标
4. 让本地产品建设和上游开源贡献同步推进

## 2. 当前长期主线

当前项目不再只是“把官网做出来”，而是三条线并行：

### A. 本地产品线
把 IGNAI 做成一个真实可用的社区官网。

### B. 社区能力线
围绕成员、活动、内容分流、组织表达，逐步增强社区站能力。

### C. 开源贡献线
把在真实项目里验证过的通用能力，拆成可以回馈 NotionNext 社区的 issue / PR。

## 3. 当前总目标

总目标可以概括成一句话：

```text
把 IGNAI 从一个品牌首页，逐步做成一个有成员、有活动、有内容系统、有组织感，并且能持续向 NotionNext 反哺能力的社区官网。
```

## 4. 当前阶段定义

### Phase A：基础站点完成
已完成大部分。

- NotionNext 二开架构已建立
- `ignai` 主题已成型
- 首页品牌叙事和视觉已搭起来

### Phase B：Member 体系落地
当前主阶段。

- Member 数据层已初步接入
- `/members` 路由已建立
- 首页成员区块已接通真实数据
- 作者 -> Member、Member -> authored posts 链路已打通
- 下一步重点转向组织表达和关系扩展

### Phase C：社区内容系统增强
下一主阶段。

- 作者与成员关系
- 活动与成员关系
- 组织层表达

### Phase D：上游抽象与 PR
持续穿插进行。

- 将通用能力切成小 PR
- 沉淀 issue / PR / 简历素材

## 5. 现阶段最优先任务

按优先级：

1. 收束 Member MVP 的剩余体验项
2. 增强 featured members / 角色分组 / 组织表达
3. 预埋 Event / Member / Author 关系模型
4. 准备第一版 upstreamable diff / PR 叙事
5. 持续保持 `main` 为清晰可继续协作的主线

## 6. 执行原则

### 原则 1：真实使用优先
先在本地产品里用起来，再考虑抽象。

### 原则 2：共享层和本地层分离
数据层、基础路由尽量通用；品牌视觉和叙事留在 `ignai`。

### 原则 3：每次只做一个明确目标
避免一个分支塞太多不同性质改动。

### 原则 4：持续优化，不做“一次做完”的幻想
只要总 TO DO 还没完成，项目就处于持续优化状态。

## 7. 文档索引

### 总控层
- `doc/roadmap/overall.md`
- `doc/roadmap/schedule.md`
- `doc/roadmap/master-todo.md`

### Member 执行层
- `docs/member-execution-roadmap.zh-CN.md`
- `docs/member-schema.md`
- `tasks/member-session-template.md`
- `docs/upstream-pr-split-checklist.zh-CN.md`

### 组织者协作层
- `docs/organizers/notionnext-org-issue-bugfix-playbook.zh-CN.md`

### 需求层
- `doc/requirements/req-成员管理.md`
- `doc/requirements/req-NotionNext社区能力提案.md`

### 现有 TODO 层
- `doc/todo/TODO.md`

## 8. 后续怎么用

以后每次继续工作，都按这个顺序：

1. 先看 `ROADMAP-overall-plan`
2. 再看 `ROADMAP-schedule`
3. 再看 `ROADMAP-master-todo`
4. 再进入具体子任务文档

这样可以保证每次优化不是零散 patch，而是挂在长期主线上。
