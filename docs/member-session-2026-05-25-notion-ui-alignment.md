# Member Session Record - 2026-05-25

## 1. 本次目标

```text
把真实 Notion Members 数据库的字段和 NotionNext 当前 Member 前后端链路对齐，确保成员目录、成员详情和作者映射联动稳定。
```

## 2. 本次范围

### 共享层文件
- `lib/db/SiteDataApi.js`
- `lib/db/notion/memberDataSource.js`
- `lib/utils/post.js`
- `__tests__/lib/db/notion/memberDataSource.test.js`
- `__tests__/lib/utils/post.test.js`

### 本地产品层文件
- `src/components/members/MemberDirectoryPage.js`
- `themes/ignai/components/sections/CommunityRolesSection.js`

## 3. 为什么现在做这件事

```text
Member 主线已经进入真实数据接入阶段，但官方 API 补链路仍按旧字段假设映射，
导致 social_*、joinedAtText、sortOrder、author_slug 等真实社区字段不能稳定进入前端。
这一步先把真实 Notion 字段契约打稳，后续首页成员表达、作者体系、活动关系才能继续往上叠。
```

## 4. 实现步骤

1. 读取 roadmap、成员执行文档与真实 Notion schema，确认当前主线仍是 Member MVP。
2. 直接访问真实 Notion 数据库，核对字段名、成员条目和当前视图。
3. 抽离 `memberDataSource` 归一化模块，统一官方 API Member 字段读取、slug 规范化、社交字段和排序字段映射。
4. 让目录页和首页成员区块复用统一的成员排序和成员路由 helper。
5. 补测试并验证成员目录页、成员详情页、构建链路。

## 5. 验收标准

- [x] 功能层面达成
- [x] 不影响现有博客主路径
- [x] 可解释哪些部分未来能上游

## 6. 验证动作

- [x] 定点测试
- [x] 必要页面手动检查
- [x] 数据缺失 fallback 检查

验证说明：
- 运行 `yarn test -- '__tests__/lib/db/notion/memberDataSource.test.js' '__tests__/lib/utils/member.test.js' '__tests__/lib/utils/post.test.js' '__tests__/pages/members/[slug].test.js' '__tests__/lib/db/notion/getPageProperties.test.js'`
- 运行 `yarn build`
- 本地 `http://127.0.0.1:3001/members` 验证目录页成员卡片字段
- 本地 `http://127.0.0.1:3001/members/david-xu` 验证详情页字段联动

## 7. 结果记录

### 改动文件
- `lib/db/SiteDataApi.js`
- `lib/db/notion/memberDataSource.js`
- `lib/utils/post.js`
- `src/components/members/MemberDirectoryPage.js`
- `src/components/members/MemberProfilePage.js`
- `themes/ignai/components/sections/CommunityRolesSection.js`
- `__tests__/lib/db/notion/memberDataSource.test.js`
- `__tests__/lib/utils/post.test.js`
- `doc/roadmap/master-todo.md`
- `doc/roadmap/schedule.md`

### 做成了什么
- 真实 Notion Members 数据库字段已与官方 API 补链路对齐。
- `social_github`、`social_x`、`social_linkedin`、`joinedAtText`、`sortOrder`、`author_slug` 等字段已稳定进入 Member 对象。
- 单段 slug 会被统一归一化为 `members/<slug>`，避免路由和前端跳转不一致。
- `/members` 目录页已按统一排序展示真实成员数据。
- `/members/[slug]` 成员详情页已确认能展示真实 role、verified、joined、bio 等字段。
- 作者映射 helper 已支持顶层 `member.author_slug`，为文章作者 -> 成员页联动补强一层真实数据兼容。

### 剩下什么
- 首页成员模块做更强的组织表达，而不只是成员散点头像。
- 收敛 Member 数据里的重复人名与多来源成员条目策略。
- 进一步梳理 Event / Member / Author 的关系模型。
- 整理最小 upstream diff，把共享层和本地 UI 层拆清楚。

### 真实数据清理补充
- 已将明显测试 / 半成品 / 误入公开视图的 Member 条目切回 `Invisible`，避免继续污染 `/members` 与首页成员展示。
- 已补一份 `docs/member-profile-collection-template.zh-CN.md`，后续可直接按字段清单收集团队资料，不需要再从代码反推需要哪些信息。
- 首页成员区块已补“少量真实成员”布局兜底，避免为了撑 UI 继续依赖假成员卡片。
- 已定位并修复构建期 Notion 文件缓存未按 build session 隔离的问题，避免 Notion 后台成员状态更新后，`yarn build` 继续复用旧成员页缓存。

### 哪些可以上游
- `lib/db/notion/memberDataSource.js` 这类官方 API Member 字段归一化逻辑。
- `SiteDataApi` 中对 Member 官方 API 补链路的属性发现和映射机制。
- `post.js` 中对顶层 `author_slug` 的作者映射兼容。
- 统一成员 slug 归一化思路与成员路径 helper 复用。

### 下一步建议
- 继续做 `featured members` 的组织层展示增强。
- 针对重复成员 / 多来源成员补去重规则与测试。
- 开始整理第一版 upstreamable diff 范围和 PR 叙事。
