# IGNAI Notion Community Schema Template

记录日期：2026-05-20
适用范围：IGNAI 社区官网当前主库 `IGNAI 洋来官网`

## 1. 目标

这份文档定义一套可以直接在 Notion 主数据库里配置的社区站字段模板。

目标不是重做内容模型，而是在现有 NotionNext 博客库上增量补齐：

1. `Member` 成员资料
2. `Post -> Member` 作者映射
3. `Event` 事件预埋字段
4. 让前台页面和后续 API 脚本都能稳定读取

## 2. 当前状态

> **已迁移完成 (2026-05-20)**
> 通过 `migrate-schema` 命令一次性创建 18 个社区字段，全部 24 个字段已验证到位。
> 数据库总计 28 个字段（含原有 10 个博客字段）。

当前主库已具备全部字段：

**基础博客字段（原有）：**
- `title`, `type`, `status`, `summary`, `slug`, `date`, `category`, `tags`, `password`, `icon`

**社区字段（2026-05-20 已创建）：**
- Member: `bio`, `role`, `avatar`, `featured`, `verified`, `joinedAtText`, `quote`, `sortOrder`, `social_github`, `social_x`, `social_linkedin`, `website`
- 作者映射: `author`, `author_slug`
- Event: `event_start`, `event_end`, `location`, `organizer_slugs`

## 3. 全局约定

### 3.1 字段命名

新增字段统一使用英文小写或 camelCase，不混用中文字段名。

推荐：

- 保持现有基础字段不动
- 新增社区字段时优先用：
  - `bio`
  - `role`
  - `featured`
  - `joinedAtText`
  - `sortOrder`
  - `author_slug`

### 3.2 路由约定

- `Post.slug`: 继续沿用现有文章 slug
- `Member.slug`: 统一使用 `members/<person-slug>`
- `Event.slug`: 建议使用 `events/<event-slug>`

### 3.3 页面类型约定

`type` 推荐保留并扩展以下值：

- `Post`
- `Page`
- `Notice`
- `Menu`
- `SubMenu`
- `Member`
- `Event`（预埋，不要求前台立刻完整支持）

## 4. Member 模板

### 4.1 必需字段

| 字段名 | Notion 类型 | 示例 | 前台用途 |
| --- | --- | --- | --- |
| `type` | Select | `Member` | 识别为成员页 |
| `status` | Select | `Published` | 控制是否对外展示 |
| `title` | Title | `Qianzhu` | 成员姓名 / 昵称 |
| `slug` | Text | `members/qianzhu` | 成员详情页路由 |

### 4.2 推荐字段

| 字段名 | Notion 类型 | 示例 | 前台 / API 用途 |
| --- | --- | --- | --- |
| `bio` | Text | `AI builder...` | 成员简介 |
| `role` | Text | `Founder` | 成员身份标签 |
| `avatar` | URL | `https://...` | 成员头像 |
| `featured` | Checkbox | `true` | 首页与目录优先展示 |
| `verified` | Checkbox | `true` | 已审核成员标识 |
| `joinedAtText` | Text | `2026 / 05` | 展示加入时间 |
| `quote` | Text | `Build useful things.` | 卡片 / 详情页短句 |
| `sortOrder` | Number | `10` | 手工排序 |
| `social_github` | URL | `https://github.com/...` | 社交外链 |
| `social_x` | URL | `https://x.com/...` | 社交外链 |
| `social_linkedin` | URL | `https://linkedin.com/in/...` | 社交外链 |
| `website` | URL | `https://...` | 个人主页 |

### 4.3 可选组织字段

| 字段名 | Notion 类型 | 示例 | 用途 |
| --- | --- | --- | --- |
| `team` | Text | `Core` | 组织分组 |
| `city` | Text | `Shanghai` | 地域信息 |
| `focus` | Multi-select | `AI Agents` | 研究方向 |
| `member_status` | Select | `core` | 成员状态分层 |
| `join_year` | Text | `2026` | 更轻量的加入时间 |

## 5. Post 作者映射模板

如果文章要稳定跳转到成员页，推荐至少补下面两个字段。

| 字段名 | Notion 类型 | 示例 | 用途 |
| --- | --- | --- | --- |
| `author` | Text | `Qianzhu` | 前台显示作者名 |
| `author_slug` | Text | `qianzhu` | 显式映射到 `members/qianzhu` |

扩展版可继续预留：

| 字段名 | Notion 类型 | 示例 | 用途 |
| --- | --- | --- | --- |
| `authors` | Text | `Qianzhu,Alice` | 多作者展示 |
| `author_slugs` | Text | `qianzhu,alice-chen` | 多作者映射 |

## 6. Event 预埋模板

当前前台不必一次做完，但建议先把字段准备好。

| 字段名 | Notion 类型 | 示例 | 用途 |
| --- | --- | --- | --- |
| `type` | Select | `Event` | 识别事件页 |
| `event_start` | Date | `2026-06-01 19:00` | 活动开始时间 |
| `event_end` | Date | `2026-06-01 21:00` | 活动结束时间 |
| `location` | Text | `Shanghai / Online` | 活动地点 |
| `organizer_slugs` | Text | `qianzhu,alice-chen` | 组织者成员映射 |
| `registration_url` | URL | `https://...` | 报名链接 |

## 7. 对外映射规则

这一节最关键。字段不是只要“有”，而是要确保代码层能稳定读取。

### 7.1 Member 对外映射

| Notion 字段 | 页面对象字段 | 当前使用位置 |
| --- | --- | --- |
| `title` | `member.title` | 成员目录 / 成员详情 |
| `slug` | `member.slug` | `/members/[slug]` |
| `bio` | `member.bio` | 卡片简介 / 详情简介 |
| `role` | `member.role` | 成员身份 |
| `avatar` | `member.avatar` | 成员头像 |
| `featured` | `member.featured` | 排序 / 首页优先展示 |
| `verified` | `member.verified` | 认证徽标 |
| `joinedAtText` | `member.joinedAtText` | 成员加入时间 |
| `quote` | `member.quote` | 成员短句 |
| `sortOrder` | `member.sortOrder` | 目录排序 |
| `social_github` | `member.social_github` | 社交链接 |
| `social_x` | `member.social_x` | 社交链接 |
| `social_linkedin` | `member.social_linkedin` | 社交链接 |
| `website` | `member.website` | 外部主页 |

### 7.2 Post 作者映射

| Notion 字段 | 页面对象字段 | 当前使用位置 |
| --- | --- | --- |
| `author` | `post.author` | 作者显示 |
| `author_slug` | `post.author_slug` | 成员页跳转 |
| `authors` | `post.authors` | 多作者兼容 |
| `author_slugs` | `post.author_slugs` | 多作者兼容 |

### 7.3 兼容策略

当前代码中已经对少数字段做了 fallback，例如：

- `quote` 兼容 `headline`
- `joinedAtText` 兼容 `join_year`
- `verified` 兼容 `verification_status`

但建议最终以本模板中的主字段为准，逐步减少 fallback 依赖。

## 8. 推荐录入方式

### 8.1 新增成员

1. 新建一条页面
2. `type = Member`
3. `status = Published` 或 `Invisible`
4. 设置：
   - `title`
   - `slug`
   - `bio`
   - `role`
   - `avatar`
5. 补 `featured` / `verified` / 社交链接

### 8.2 新增文章并关联成员

1. 正常写文章
2. 设置 `author`
3. 设置 `author_slug`
4. 保证 `author_slug` 与成员的 `slug` 末段一致

例如：

- 成员 slug: `members/qianzhu`
- 文章 `author_slug`: `qianzhu`

## 9. 实操命令

当前仓库已经可以直接用 API 校验和操作主库：

```bash
yarn notion:members:smoke me              # 验证 token
yarn notion:members:smoke schema          # 列出现有字段
yarn notion:members:smoke schema-check    # 检查缺哪些字段
yarn notion:members:smoke migrate-schema  # 自动创建缺失字段
yarn notion:members:smoke query           # 验证能否读到真实数据
yarn notion:members:smoke create-draft --title "名字" --role "Builder"  # 创建成员草稿
```

## 10. 迁移记录

- **2026-05-20**: 通过 `migrate-schema` 命令一次性创建 18 个社区字段
  - Member 字段 12 个: bio, role, avatar, featured, verified, joinedAtText, quote, sortOrder, social_github, social_x, social_linkedin, website
  - Post 作者映射 2 个: author, author_slug
  - Event 预埋 4 个: event_start, event_end, location, organizer_slugs
- **验证**: `schema-check` 确认全部 24 个字段到位，0 缺失
- **测试成员**: Qianzhu (members/qianzhu) 创建成功，query 读回正常
