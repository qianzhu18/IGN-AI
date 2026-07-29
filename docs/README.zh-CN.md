# IGNAI 文档地图

更新日期：2026-07-30

这份文件是当前文档入口。它不删除历史材料，也不覆盖旧结论；它只回答“现在应该读什么、哪些只是历史参考”。

## 当前有效文档

| 类别 | 先读文件 | 用途 |
| --- | --- | --- |
| 总控 | [`../doc/roadmap/overall.md`](../doc/roadmap/overall.md) | 长期方向、当前分支、唯一事实源规则 |
| 待办 | [`../doc/roadmap/master-todo.md`](../doc/roadmap/master-todo.md) | 当前最高优先级与阶段完成状态 |
| 排期 | [`../doc/roadmap/schedule.md`](../doc/roadmap/schedule.md) | M0-M4 的滚动执行顺序 |
| 架构 | [`architecture/payload-unified-migration-plan.zh-CN.md`](architecture/payload-unified-migration-plan.zh-CN.md) | Payload 目标架构、迁移阶段门 |
| 架构理由 | [`architecture/why-payload-migration.zh-CN.md`](architecture/why-payload-migration.zh-CN.md) | 为什么不继续扩大 NotionNext/Notion 映射层 |
| 代码治理 | [`architecture/branch-and-legacy-code-policy.zh-CN.md`](architecture/branch-and-legacy-code-policy.zh-CN.md) | 新旧代码、分支、归档和回滚边界 |
| 部署 | [`architecture/domestic-deployment-and-openship-evaluation.zh-CN.md`](architecture/domestic-deployment-and-openship-evaluation.zh-CN.md) | 腾讯云、对象存储、CI/CD 与 OpenShip 评估 |
| CMS 选型 | [`architecture/cms-options-research-2026-07-29.zh-CN.md`](architecture/cms-options-research-2026-07-29.zh-CN.md) | Payload / Directus / Strapi / WordPress / Sanity 调研 |
| 设计参考 | [`design/hubtown-interaction-reference.zh-CN.md`](design/hubtown-interaction-reference.zh-CN.md) | 迁移后的交互升级参考，不占 M0-M2 关键路径 |

## 按任务阅读

### 继续迁移

按顺序读：总控 -> 待办 -> Payload 迁移计划 -> 架构理由 -> 分支政策。

### 处理内容和社区运营

读 `content/`、`member-*`、`community-mvp.md`、`execution-playbook.md`。这些文件描述内容资产、成员、活动、记录和运营流程。

### 做视觉或交互

读 `design/` 与 `doc/design/`。其中 Hubtown 文档是未来设计参考；不要为了做动效回到 NotionNext 数据层。

### 做部署或运维

读部署评估、迁移计划的 M4、环境变量说明和服务器 runbook。任何生产变更先以当前分支和 staging 结果为准。

### 做 NotionNext 上游贡献

读 `upstream-*`、`organizers/`、`community-upstream-sync.md`。这条线保留为开源贡献档案，不再决定 IGNAI 新站的生产架构。

## 历史材料的定位

以下目录是历史/参考材料，不是新站的执行规范：

- `doc/architecture/arch-*.md`：NotionNext 二开和旧版官网阶段的架构推演。
- `doc/design/`：旧站视觉、动效和页面复刻过程；其中可提取品牌与交互灵感。
- `docs/notion-*.md`、旧 Notion session 记录：迁移来源与回滚证据。
- `docs/repo-session-*.md`：逐次工作记录，不替代 roadmap。

历史文件不应被删除或改写成新架构说明。新的结论写入 `docs/architecture/` 和 `doc/roadmap/`，由这份地图统一指向。

## 维护规则

1. 新的架构决策只写入 `docs/architecture/`，并从本文件和 roadmap 链接。
2. 新的执行状态只更新 `doc/roadmap/master-todo.md`、`overall.md`、`schedule.md`。
3. 完成一个有影响的工作切片后，新增或更新对应 `docs/repo-session-*.md`。
4. 旧文档只加“历史参考”标识或从本索引分类，不做大规模移动，直到 M4 完成并经人工确认归档方案。
