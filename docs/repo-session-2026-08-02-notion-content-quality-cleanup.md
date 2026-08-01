# Session：Notion 内容质量清理

日期：2026-08-02

## 本次变更

- 新增 `scripts/cleanup-notion-content-quality.js`：默认 dry-run，`--apply` 后逐页回读验证；未知 `ext` key 会阻断整批操作。
- 新增 13 项回归测试，覆盖空 `ext`、旧 Record JSON、重复记录、无依据日期、证据不足内容和 NotionNext 模板污染。
- 为清理脚本增加 `notion:community:cleanup` 与 `notion:community:cleanup:apply` 命令。
- 更新活动公开台账、素材映射和长期路线图，纠正此前已经过时的状态描述。

## 已清理的 Notion 内容

- 清空 14 条无意义的 `ext=[]`；迁移或清空 4 条旧 Record JSON，当前活动内容库没有待清理 `ext`。
- AIPO 草稿把地点、分类和确认结果迁入顶层字段与页面正文，删除无来源日期和内部 `/resume` 占位文案。
- 社区起源草稿删除 `2025-01-01` 占位日期，正文改为可直接在 Notion 中编辑的社区叙事。
- Datawhale 与百万博主内容因证据不足改为 `Invisible` 草稿，删除虚构日期和过度扩写，只保留证据边界及待补项。
- LEV0 Event 修正为 2026-06-14、长沙 · 岳麓山实验室；产品经理共学营清除无来源精确日期。
- 归档 4 条重复 Record、过早创建的 FDE 回顾、内部 proof ledger、重复长理 Event、空外部赛事，以及 7 条 tangly1024 模板菜单 / 页面 / 通知。归档使用 Notion 回收站，可恢复。

## 社区侧价值

- 官网公开内容重新回到“有证据才发布”的边界，避免把单张物料扩写成完整活动事实。
- Event / Record 日常编辑只使用顶层字段、页面 blocks 和原生 Page Cover，不再依赖 `ext` 文本。
- 清掉 NotionNext 默认模板导航和重复内容，降低旧博客链接再次进入官网的风险。

## 可上游部分

- 默认 dry-run、未知字段阻断、显式迁移白名单、apply 后回读验证可以整理成 NotionNext 内容迁移范式。
- 具体 IGNAI slug、事实判断和文案属于社区本地内容，不进入上游。

## 验证与剩余工作

- 实际执行后回读验证全部通过；再次 dry-run 显示 59 条有效页面、0 个阻断项、0 个待清理 `ext`。
- 后续只在补齐活动原始链接、职责、时间和结果后，才把证据草稿改为 `Published`。
- 仍需完成生产 MCP 的真实创建、更新、追加 blocks 全链路 smoke。
