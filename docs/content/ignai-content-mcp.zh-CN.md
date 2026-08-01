# IGNAI 官网内容写作 MCP

记录日期：2026-07-05
状态：协议层首版已落地，已支持 Notion 后台读写工具；真实 Notion 写入需补齐环境变量后验证

## 1. 定位

这个 MCP 是 IGNAI 官网内容写作和 Notion 后台操作的协议层。

它不替代现有 NotionNext 数据层，也不重写官网后台。它负责让 AI 在授权范围内读取 Notion 后台数据、写入草稿、更新页面、追加正文和触发缓存刷新，再交给当前网站继续通过 NotionNext 读取、规范化、渲染和 ISR 刷新。

适合承载：

- 官网文章 / 页面草稿
- 活动 Event 草稿
- 成员 Member 草稿或资料补全
- 未来 Record / Field Notes 草稿
- 官网内容资产层到 Notion 的上架转换

默认安全边界：

- AI 只能操作环境变量中登记过的 data source
- 不会把 Notion token 输出给模型或日志
- 默认写入 `Invisible` 草稿，不直接公开
- 所有写入入口都禁止 `ext`；即使传空对象也会直接报错
- 结构化信息只写独立属性，正文只写页面 blocks，封面只写原生 Page Cover
- 如需临时操作未登记 data source，才设置 `IGNAI_MCP_ALLOW_UNLISTED_DATA_SOURCE=true`

### NotionNext 原生写作契约（硬规则）

这个 MCP 不再把 `ext` 当成兼容层或兜底字段。工具 schema、运行时校验、内置 prompt 和更新接口都会共同阻止任何 `ext` 写入。

| 内容 | 正确位置 |
| --- | --- |
| 标题、类型、状态、slug、摘要、分类、标签、日期 | 对应的 Notion 独立属性 |
| Event 状态、形式、时间、地点、组织者、报名入口 | Event 独立属性 |
| Record 地点、关联活动 | Record 独立属性 |
| 正文、章节、成果列表、图片说明 | Notion 页面正文 blocks（`bodyMarkdown` / `append_notion_blocks`） |
| 海报、主视觉 | Notion 原生 Page Cover（`cover`），保留 Change / Reposition 编辑体验 |

旧数据迁移规则：`recordType -> category`、`dateText -> date`、`location -> record.location`、`relatedEventSlug -> record.related_event_slug`；`outcomes` 必须改成正文标题与列表，不能再序列化进富文本属性。

## 2. 快速配置（推荐）

最简单的方式是运行交互式 setup 脚本：

```bash
yarn mcp:ignai:setup
```

脚本会引导你输入 4 个 Notion 变量（从 Vercel dashboard 复制），自动写入 `.env.notion.local`，并验证连通性。

**手动配置方式**（如果脚本不可用）：

1. 打开 https://vercel.com/qianzhu18s-projects/ign-ai/settings/environment-variables
2. 对以下变量点击眼睛图标 reveal，复制明文：
   - `NOTION_PAGE_ID`
   - `NOTION_API_TOKEN`
   - `NOTION_API_VERSION`
   - `NOTION_MEMBERS_DATA_SOURCE_ID`
3. 在项目根目录创建 `.env.notion.local`（已被 .gitignore 覆盖）：

```env
NOTION_PAGE_ID=<粘贴>
NOTION_API_TOKEN=<粘贴>
NOTION_API_VERSION=2026-03-11
NOTION_MEMBERS_DATA_SOURCE_ID=<粘贴>
```

4. 验证：

```bash
yarn mcp:ignai:smoke                                        # 离线协议层
node scripts/notion-member-api-smoke.js schema              # 真实 Notion schema 查询
```

建议完整配置：

```env
NOTION_API_TOKEN=
NOTION_CONTENT_DATA_SOURCE_ID=
NOTION_POSTS_DATA_SOURCE_ID=
NOTION_PAGES_DATA_SOURCE_ID=
NOTION_RECORDS_DATA_SOURCE_ID=
NOTION_MEMBERS_DATA_SOURCE_ID=
NOTION_EVENTS_DATA_SOURCE_ID=
OPS_ACCESS_PASSWORD=
MCP_SITE_BASE_URL=http://localhost:3000
IGNAI_MCP_ALLOW_UNLISTED_DATA_SOURCE=false
```

如果不想覆盖当前 `.env.local`，可以把 Vercel 生产变量拉到专用本地文件：

```bash
vercel env pull .env.vercel.production.local --environment=production
yarn mcp:ignai -- --env-file .env.vercel.production.local
```

MCP server 会自动尝试读取：

- `.env.local`
- `.env`
- `.env.mcp.local`
- `.env.notion.local`
- `.env.vercel.local`
- `.env.vercel.production.local`
- `.env.vercel.preview.local`

也可以通过 `IGNAI_MCP_ENV_FILE=/absolute/path/to/env` 指定额外文件。

## 3. 本地启动

```bash
yarn mcp:ignai
```

离线烟测：

```bash
yarn mcp:ignai:smoke
```

MCP host 配置示例：

```json
{
  "mcpServers": {
    "ignai-content": {
      "command": "node",
      "args": [
        "/Users/mac/qianzhu Vault/project/IGN AI 官网/tools/ignai-content-mcp/server.js"
      ]
    }
  }
}
```

## 4. 暴露的工具

### `ignai_status`

检查 Notion 写入、data source、运营刷新密码是否配置。只返回布尔状态和脱敏 id，不输出 token。

### `build_notion_draft`

把内容转换成 Notion 创建页面的预览结构，不写入 Notion。

默认行为：

- `status` 默认为 `Invisible`
- Markdown 正文会转换成 Notion blocks
- Record / Event / Member 支持专属独立字段
- `cover` 写入原生 Notion Page Cover
- 传入 `ext` 会在任何网络请求前被拒绝
- 未配置 data source 时给出缺口提示

### `create_notion_draft`

调用 Notion 官方 API 创建草稿页面。

默认行为：

- 默认创建 `Invisible` 草稿，避免未经审核直接公开
- 写入前会读取 data source schema，按真实属性类型构造 payload
- 成功后返回 Notion page id 和 URL

### `inspect_notion_data_source`

读取已授权 data source 的 schema，返回属性名、属性类型和脱敏后的目标信息。

### `query_notion_pages`

查询已授权 data source 里的页面，支持按内容类型、状态和关键词做轻量过滤。

### `get_notion_page`

读取单个 Notion 页面，必要时可以带回第一页 blocks。

### `update_notion_page`

更新页面属性、cover 或 icon。适合改 `status`、`summary`、`slug`、`tags`、Member profile 字段和 Event 字段。

### `append_notion_blocks`

把 Markdown 转成 Notion blocks 并追加到页面正文末尾。

### `archive_notion_page`

归档或恢复已授权 data source 下的页面。

### `refresh_site_cache`

调用现有 `/api/admin/content-revalidate`，刷新首页、成员、活动和记录缓存。

需要：

```env
OPS_ACCESS_PASSWORD=
MCP_SITE_BASE_URL=
```

## 5. 内容类型映射

| 内容类型 | data source 优先级 |
| --- | --- |
| `Post` | `NOTION_POSTS_DATA_SOURCE_ID` -> `NOTION_CONTENT_DATA_SOURCE_ID` |
| `Page` | `NOTION_PAGES_DATA_SOURCE_ID` -> `NOTION_CONTENT_DATA_SOURCE_ID` |
| `Record` | `NOTION_RECORDS_DATA_SOURCE_ID` -> `NOTION_CONTENT_DATA_SOURCE_ID` |
| `Event` | `NOTION_EVENTS_DATA_SOURCE_ID` -> `NOTION_MEMBERS_DATA_SOURCE_ID` |
| `Member` | `NOTION_MEMBERS_DATA_SOURCE_ID` |

## 6. 推荐发布流程

1. 让 AI 先基于官网内容资产层生成公开表达
2. 把元数据放入独立属性，把完整内容放入正文 blocks，把海报放入 Page Cover；不要创建或更新 `ext`
3. 调用 `build_notion_draft` 检查字段、slug、summary、cover 和正文 blocks
4. 调用 `create_notion_draft` 写入 `Invisible` 草稿
5. 调用 `query_notion_pages` / `get_notion_page` 检查现有内容是否重复
6. 必要时调用 `update_notion_page` 或 `append_notion_blocks` 迭代草稿
7. 人在 Notion 中审核、补图、确认授权和隐私
8. 将 Notion `status` 改成 `Published`
9. 调用 `refresh_site_cache`
10. 前台 smoke：检查目标页面、RSS、sitemap 和移动端展示

## 7. 仍需补齐

- 生产环境 Notion data source id 核对
- Post / Page / Record 是否共用主库 data source 的最终决策
- Record 旧数据中残留 `ext` 的批量迁移与人工复核
- 内容审核规则：哪些内容允许直接变成 `Published`
- MCP 真实 Notion 写入 smoke
- MCP 真实 Notion 读取、更新、追加 blocks smoke

## 8. 参考

- [Model Context Protocol TypeScript SDK](https://github.com/modelcontextprotocol/typescript-sdk)
- [Notion API - Create a page](https://developers.notion.com/reference/post-page)
