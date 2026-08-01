# 2026-08-02 Notion Event / Record 编辑闭环修复

## 本次改动文件

- `scripts/migrate-notion-community-content.js`
- `scripts/seed-notion-events.js`
- `src/components/content/ContentAdminPanel.tsx`
- `package.json`
- `__tests__/scripts/migrate-notion-community-content.test.js`
- `docs/notion-frontend-linkage-status.zh-CN.md`
- `doc/roadmap/master-todo.md`
- 根工作区 `活动记录/README.md`（素材目录规则说明）

## 社区侧价值

- 清除 10 条 Event 的历史 `ext`；7 条真实活动的关系、状态、形式、地点、封面位置与封面迁入 Notion 顶层字段和原生 Page Cover。
- “三人行必有 AI 黑客松长沙站”的 Event 关系从错误的默认“成员组织”恢复为“联合承办”。
- Event 与 Record 不再混为一条数据：Event 表达活动事实，Record 表达活动后的社区现场，通过 `related_event_slug` 关联。
- 日常编辑统一为 NotionNext 熟悉的方式：属性写顶层字段、正文写页面 blocks、封面使用页面顶部封面与 Reposition。

## 可上游部分

- 可复用的安全迁移策略：默认 dry-run、未知 JSON key 阻断清空、apply 后逐条回读验证。
- Page Cover 与结构化字段分离的内容契约可整理为 NotionNext 社区站点迁移文档；IGNAI 的字段枚举与素材映射保持本地。

## 剩余工作

- 继续补齐少数 Published Event / Record 缺失的 Notion 原生封面。
- 把新增内容流程固化为 Invisible 草稿、人工核验、Published 发布与缓存刷新。
- 逐步清理仍为 Invisible 的旧 Record `ext`，但需先核对是否含有尚未迁入正文的历史内容。
