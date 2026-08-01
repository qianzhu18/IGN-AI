# Session：NotionNext 原生写作契约

日期：2026-08-02

## 本次变更

- `tools/ignai-content-mcp/server.js`
  - 从草稿工具 schema 与字段序列化链路移除 `ext`
  - 创建、预览、更新入口递归拒绝任意层级的 `ext` / 配置别名
  - Record 增加 `location`、`related_event_slug` 一等字段
  - Event 写入字段对齐官网当前契约：`event_status`、`event_format`、`public_listing`、`website`、`registration_qr`、`cover_position`
  - 内置 schema、workflow、prompt 与初始化说明统一为 NotionNext 原生写作规则
- `tools/ignai-content-mcp/smoke-test.js`
  - 覆盖工具 schema、顶层与嵌套 `ext` 拒绝、更新前拒绝、Record 一等字段与正文 blocks
- `docs/content/ignai-content-mcp.zh-CN.md`
  - 补充硬规则、旧字段迁移表和标准发布流程

## 社区侧价值

- AI 不能再把 Event / Record 正文或结构化信息塞进不可编辑的 JSON 富文本。
- 编辑者继续使用 NotionNext 熟悉的页面正文、原生封面 Change / Reposition 和独立属性。
- 官网读取的字段与 Notion 后台保持一一对应，减少静态兜底和隐藏兼容层。

## 已迁移内容

- Record `ignai-community-origin-story`
  - `recordType=story` 迁移为 `category=社区故事`
  - 日期和地点保留在 `date` / `location`
  - 三条 outcomes 迁移为页面正文标题与列表 blocks
  - `ext` 已清空，页面仍保持 `Invisible` 等待人工审核

## 可上游部分

- “结构化属性 / 页面正文 / 原生封面”三层写入契约可以整理为 NotionNext AI 写入指南。
- MCP 工具层的禁止兼容字段校验与回归测试可以抽成通用写入策略。

## 剩余工作

- 扫描其余 Invisible Event / Record，按同一规则做人工复核式迁移。
- 完成生产 MCP 的真实创建、更新、追加 blocks 全链路 smoke。
- 继续保持前台读取顶层字段，不新增 `ext` 回退。
