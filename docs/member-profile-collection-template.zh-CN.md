# 成员资料收集模板

记录日期：2026-05-25
适用范围：IGNAI 官网 `Member` 页面、成员目录、作者映射、首页成员展示。

## 1. 先收哪些字段

下面这些字段已经和当前站点前后端打通，优先收这批就够看效果：

| 字段 | 是否必填 | 示例 | 用途 |
| --- | --- | --- | --- |
| `title` | 必填 | `Qianzhu` | 成员姓名 / 展示名 |
| `type` | 必填 | `Member` | 标识成员类型 |
| `status` | 必填 | `Published` / `Invisible` | 控制是否公开显示 |
| `slug` | 必填 | `members/qianzhu` | 成员详情页路由 |
| `role` | 建议必填 | `Builder & Connector` | 目录页和详情页身份说明 |
| `bio` | 建议必填 | `IGNAI 创始人...` | 目录页摘要和详情页正文 |
| `summary` | 可选 | `IGNAI 社区 Builder` | bio 较短或需要额外摘要时使用 |
| `avatar` | 建议必填 | `https://...` | 头像 |
| `quote` | 可选 | `先点燃，再等待。` | 首页 hover / 详情页引用语 |
| `joinedAtText` | 可选 | `2025` / `2026 / 05` | 加入时间文案 |
| `featured` | 可选 | `true` | 首页和目录排序加权 |
| `verified` | 可选 | `true` | 显示已确认标记 |
| `sortOrder` | 可选 | `1` | 手动排序，数字越小越靠前 |
| `author_slug` | 强烈建议 | `qianzhu` | 博客作者映射到成员页 |
| `social_github` | 可选 | `https://github.com/qianzhu` | 详情页外链 |
| `social_x` | 可选 | `https://x.com/qianzhu_` | 详情页外链 |
| `social_linkedin` | 可选 | `https://www.linkedin.com/in/qianzhu` | 详情页外链 |
| `website` | 可选 | `https://qianzhu.me` | 详情页外链 |

## 2. 录入规范

1. `slug` 统一用 `members/<person-slug>`。
2. `author_slug` 统一写 slug 末段，例如 `members/qianzhu` 对应 `qianzhu`。
3. 资料还没确认完的成员，先把 `status` 设成 `Invisible`。
4. 不要再用演示头像、示例引语、虚构角色文案撑页面。

## 3. 你后续给我资料时，直接按这个格式就行

```yaml
title: 
slug: members/
role: 
bio: 
summary: 
avatar: 
quote: 
joinedAtText: 
featured: false
verified: true
sortOrder: 
author_slug: 
social_github: 
social_x: 
social_linkedin: 
website: 
```

## 4. 当前最值得优先补的资料

1. 真实头像 URL
2. 真实 role / bio
3. `author_slug`
4. 至少一个真实外链：GitHub、X、LinkedIn、个人站任选其一

## 5. 当前站点已经会吃这些字段的地方

1. `/members`
2. `/members/[slug]`
3. 首页 `Community Members` 区块
4. 文章作者到成员页的跳转映射
