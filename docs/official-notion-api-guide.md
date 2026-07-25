# 使用官方 Notion API 替代非官方 API

本文档介绍如何使用 Notion 官方 Data Source API 替代非官方的 notion-client，以解决 Vercel 部署不稳定和数据获取失败的问题。

## 背景

NotionNext 当前使用非官方 API（notion-client）来获取 Notion 数据。这种方式存在以下问题：

1. **稳定性差**：非官方 API 不是 Notion 官方支持的接口，经常因为 Notion 内部调整而失效
2. **隐私风险**：需要公开页面才能抓取数据
3. **功能限制**：不支持数据库查询、过滤、排序等高级功能
4. **封面图片问题**：需要额外配置图片代理或图床

相关 issue: [#3566](https://github.com/tangly1024/NotionNext/issues/3566)

## 解决方案

使用 Notion 官方的 Data Source API（也称为 Database API）和 Pages API。

### 优势

1. **官方支持**：稳定的官方 API，有版本控制和文档
2. **更好的隐私**：使用 Integration Token，不需要公开页面
3. **更强大的功能**：支持数据库查询、过滤、排序、分页
4. **直接获取封面**：Pages API 直接返回页面封面，无需代理

### 架构对比

#### 非官方 API（当前）

```
Notion 公开页面
    ↓
notion-client (非官方)
    ↓
getNotionPageData()
    ↓
页面数据（无封面）
    ↓
需要图片代理获取封面
```

#### 官方 API（推荐）

```
Notion Integration
    ↓
Data Source API (查询数据库)
    ↓
Pages API (获取页面详情)
    ↓
完整页面数据（含封面）
    ↓
直接使用，无需代理
```

## 快速开始

### 1. 创建 Notion Integration

1. 访问 [Notion Integrations](https://www.notion.so/my-integrations)
2. 点击 "New integration"
3. 填写名称（如 "NotionNext"）
4. 选择你的 workspace
5. 点击 "Submit"
6. 复制 "Internal Integration Token"

### 2. 配置环境变量

在 Vercel 或 `.env.local` 中添加：

```bash
NOTION_API_TOKEN=secret_xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
NOTION_DATABASE_ID=xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx  # 你的数据库 ID
```

### 3. 共享数据库给 Integration

在 Notion 中：
1. 打开你的数据库页面
2. 点击右上角 "..." → "Add connections"
3. 搜索并选择你创建的 Integration
4. 点击 "Confirm"

### 4. 使用新的 API

```javascript
import { fetchPublishedPosts } from '@/lib/db/notion/dataSourceApi'

// 获取所有已发布的文章
const posts = await fetchPublishedPosts(process.env.NOTION_DATABASE_ID)

// posts 包含完整数据，包括封面
console.log(posts[0])
// {
//   id: '...',
//   cover: 'https://prod-files-secure.s3.us-west-2.amazonaws.com/...',
//   properties: {
//     title: '文章标题',
//     status: 'Published',
//     date: { start: '2024-01-01' },
//     tags: ['标签1', '标签2']
//   }
// }
```

## API 参考

### fetchDatabasePages(databaseId, options)

从数据库获取所有页面，支持分页、过滤、排序。

```javascript
const pages = await fetchDatabasePages(databaseId, {
  filter: {
    property: 'Status',
    select: { equals: 'Published' }
  },
  sorts: [
    { property: 'Date', direction: 'descending' }
  ]
})
```

### fetchPageWithCover(pageId)

获取单个页面的完整信息，包括封面。

```javascript
const page = await fetchPageWithCover(pageId)
console.log(page.cover) // { type: 'external', external: { url: '...' } }
```

### fetchPagesWithCovers(pageIds, concurrency)

批量获取多个页面的封面，支持并发控制。

```javascript
const pages = await fetchPagesWithCovers(pageIds, 10) // 最多 10 个并发
```

### extractImageUrl(image)

从 Notion 图片对象中提取 URL。

```javascript
const url = extractImageUrl(page.cover)
// 'https://prod-files-secure.s3.us-west-2.amazonaws.com/...'
```

### extractPropertyValue(property)

从 Notion 属性对象中提取值。

```javascript
const title = extractPropertyValue(page.properties.Name)
// '文章标题'

const tags = extractPropertyValue(page.properties.Tags)
// ['标签1', '标签2']

const date = extractPropertyValue(page.properties.Date)
// { start: '2024-01-01', end: null }
```

### mapPage(page, options)

将 Notion 页面对象映射为简化对象。

```javascript
const mapped = mapPage(page, {
  includeCover: true,
  propertyMapping: {
    'Name': 'title',
    'Published Date': 'date'
  }
})
```

## 迁移指南

### 从非官方 API 迁移

#### 1. 替换数据获取逻辑

**之前（非官方 API）：**

```javascript
import { getNotionPageData } from '@/lib/notion/getNotionPageData'

const pageData = await getNotionPageData(pageId)
```

**之后（官方 API）：**

```javascript
import { fetchPageWithCover, mapPage } from '@/lib/db/notion/dataSourceApi'

const page = await fetchPageWithCover(pageId)
const pageData = mapPage(page)
```

#### 2. 替换数据库查询

**之前（非官方 API）：**

```javascript
import { getAllPosts } from '@/lib/notion/getAllPosts'

const posts = await getAllPosts()
const publishedPosts = posts.filter(post => post.status === 'Published')
```

**之后（官方 API）：**

```javascript
import { fetchPublishedPosts } from '@/lib/db/notion/dataSourceApi'

const publishedPosts = await fetchPublishedPosts(databaseId)
```

#### 3. 处理封面图片

**之前（需要图片代理）：**

```javascript
// next.config.js
module.exports = {
  images: {
    domains: ['your-proxy-domain.com']
  }
}

// 使用代理 URL
const coverUrl = `https://your-proxy-domain.com/${page.cover}`
```

**之后（直接使用）：**

```javascript
// next.config.js
module.exports = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '**'  // 允许所有 HTTPS 域名
      }
    ]
  }
}

// 直接使用 S3 URL
const coverUrl = page.cover
// 'https://prod-files-secure.s3.us-west-2.amazonaws.com/...'
```

## 注意事项

### 1. S3 签名 URL 有效期

Notion 返回的封面 URL 是 S3 签名 URL，有效期为 **1 小时**。

- 对于 ISR（增量静态再生）页面，60 秒的 revalidate 时间足够
- 对于静态生成的页面，需要在构建时下载图片或使用图床

### 2. API 速率限制

Notion API 有速率限制：
- 每秒最多 3 个请求（平均）
- 每分钟最多 1000 个请求

使用 `fetchPagesWithCovers` 的 `concurrency` 参数控制并发：

```javascript
// 降低并发以避免触发限制
const pages = await fetchPagesWithCovers(pageIds, 5)
```

### 3. 错误处理

始终添加错误处理：

```javascript
try {
  const posts = await fetchPublishedPosts(databaseId)
} catch (error) {
  console.error('Failed to fetch posts:', error)
  // 返回缓存的数据或空数组
  return []
}
```

## 性能优化

### 1. 使用缓存

```javascript
import { cache } from 'react'

export const getPosts = cache(async (databaseId) => {
  return await fetchPublishedPosts(databaseId)
})
```

### 2. 批量获取

```javascript
// 一次性获取所有页面和封面
const pages = await fetchDatabasePages(databaseId)
const pageIds = pages.map(p => p.id)
const pagesWithCovers = await fetchPagesWithCovers(pageIds, 10)
```

### 3. 使用 ISR

```javascript
// pages/index.js
export async function getStaticProps() {
  const posts = await fetchPublishedPosts(databaseId)
  
  return {
    props: { posts },
    revalidate: 60  // 每 60 秒重新验证
  }
}
```

## 常见问题

### Q: 为什么 Data Source API 不返回封面？

A: Data Source API 的 `/databases/{id}/query` 端点只返回数据库属性，不返回页面级别的元数据（如封面、图标）。需要使用 `/pages/{id}` 端点获取完整页面信息。

### Q: S3 URL 会过期吗？

A: 是的，S3 签名 URL 有效期为 1 小时。但对于 ISR 页面（revalidate: 60），这足够使用。对于静态生成的页面，建议在构建时下载图片。

### Q: 如何处理大量页面？

A: 使用 `fetchPagesWithCovers` 的 `concurrency` 参数控制并发，避免触发 API 限制。也可以使用缓存减少 API 调用。

### Q: 可以过滤特定类型的页面吗？

A: 可以，使用 `filter` 参数：

```javascript
const pages = await fetchDatabasePages(databaseId, {
  filter: {
    and: [
      { property: 'Status', select: { equals: 'Published' } },
      { property: 'Type', select: { equals: 'Post' } }
    ]
  }
})
```

## 参考资源

- [Notion API 官方文档](https://developers.notion.com/)
- [Data Source API 指南](https://developers.notion.com/reference/query-a-database)
- [Pages API 指南](https://developers.notion.com/reference/retrieve-a-page)
- [相关 Issue #3566](https://github.com/tangly1024/NotionNext/issues/3566)

## 贡献

如果你在使用官方 API 时遇到问题或有改进建议，欢迎：
1. 在 issue #3566 中留言
2. 提交 PR 改进此文档
3. 分享你的使用经验

## 许可

本文档和代码遵循 NotionNext 项目的 MIT 许可证。
