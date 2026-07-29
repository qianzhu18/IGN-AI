# 分支与旧代码管理政策

更新日期：2026-07-30
状态：迁移期间生效

## 当前分支角色

| 分支 / 标签 | 角色 | 允许的工作 |
| --- | --- | --- |
| `main` | 当前 NotionNext 生产回退线 | 线上紧急修复、历史站维护；不再扩张新 CMS 功能 |
| `codex/payload-architecture-migration` | 新站迁移主线 | `apps/site` 的 Payload、数据迁移、路由迁移、部署准备 |
| `release-1.0.0` / `v1.0.0` | 自建架构历史基线 | 只读参考与回滚证据 |
| `feature/ignai-motion-system` 及旧动效分支 | 视觉探索档案 | 仅提取设计资产或可复用实验，不作为生产依赖 |
| `codex/community-*` 等上游分支 | NotionNext 开源贡献档案 | 仅用于上游 PR、复盘和历史追溯 |

## 代码边界

迁移期间仓库根目录的 NotionNext 代码仍保留，因为它是生产回退和内容导入来源。它不会自动“污染”新站运行时：新站唯一实施范围是 `apps/site/`。

为避免认知污染，执行以下规则：

1. 新功能默认只在 `apps/site/` 实现；除非是旧站线上紧急修复，不再向根目录 NotionNext 添加社区功能。
2. 新架构文档只描述 `apps/site`；旧站行为必须明确标记为 legacy/reference。
3. 不在同一个提交混合 NotionNext 改动与 Payload 改动。
4. 旧站数据仅通过 Notion -> Payload 的 M2 导入器进入新站，禁止长期双向同步。
5. M3/M4 期间每个路由先在 Payload 数据下验收，再切换域名；不制造“列表读 Payload、详情读 Notion”的半迁移状态。

## 为什么现在不删除旧代码

Git 分支能保存历史，但不能替代可运行回滚：如果现在从迁移分支删除根目录旧站，排查内容差异、回退生产和执行最终增量导入都会变困难。

因此当前策略是“保留但冻结”，而不是“删除但失去回滚”。根目录旧代码是临时的迁移依赖，不是新站的开发目标。

## M4 后的归档动作

只有满足以下条件，才能把旧站从活动工作树移出：

1. Payload 路由、数据、媒体、预览、SEO 和表单均已在 staging/production 验收。
2. 新站连续稳定运行，并完成数据库和对象存储备份演练。
3. 旧站保留为明确命名的 archive branch/tag，例如 `legacy/notionnext-production-archive`。
4. 已经约定回滚窗口与负责人。

届时再经人工确认，把根目录 NotionNext 代码迁入 `legacy/` archive 或从新生产分支移除。这个动作涉及大范围删除/移动，不能在 M2/M3 提前执行。

## 提交与部署规则

- 一项迁移能力一个 scoped commit；迁移、前台路由、部署配置和视觉实验分开提交。
- 只有通过 test、lint、typecheck、build 的 Payload 分支可以进入 staging。
- 内容编辑在 Payload Admin 保存/发布，不走 Git；代码、schema 和权限变化必须走 Git 分支与 CI/CD。
- 每次有架构影响的提交都更新 roadmap 和 session 记录。
