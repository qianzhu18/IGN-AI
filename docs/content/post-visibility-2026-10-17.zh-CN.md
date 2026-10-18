# 官网文章可见性修复（2026-10-17）

## 本次改动

- `lib/db/notion/postDataSource.js`：通过 Notion 官方 data source API 读取 Published Post 与页面 blocks，避免旧 `loadPageChunk` 403 导致文章列表为空。
- `pages/archive/index.js`：文章归档以官方 Post 数据为主；按请求生成并短时缓存，避免构建时一次数据源故障把空列表发布到线上。
- `pages/article/[slug].js`：为官方 Post 增加详情路由，展示正文、摘要、标签与公众号原文链接。
- `themes/ignai/config.js`：主导航与页脚加入文章入口。
- `doc/roadmap/master-todo.md`：记录内容系统进展。

## 社区价值

此前三篇 Post 虽在 Notion 为 Published，线上 `/archive` 仍为空，直接访问文章 slug 返回 404。修复后，读者可从导航的“文章”进入列表，并打开各篇官网记录及公众号原文。

## 上游可复用部分

官方 API 读取 Published Post、区分不可用与空数据、按 slug 生成详情页的模式可独立整理为 NotionNext 上游能力。IGNAI 导航文案与文章页面样式保留为本地定制。

## 后续工作

- 继续处理旧 `loadPageChunk` 403 对其他内容集合和构建日志的影响。
- 将文章、活动、成员之间的关系模型继续收束到 Notion 字段。
- 根据授权素材补充这三篇官网记录的完整图文内容；当前保留摘要、社区参与口径和公众号原文入口。
