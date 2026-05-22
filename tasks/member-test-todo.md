# Member 测试 ToDo

## 当前目标
- [x] 补齐 `member` 字段 fallback 单测
- [x] 补齐 `featured / verified / sortOrder` 排序单测
- [x] 补齐 `author slug / author name / ext author` 映射单测
- [x] 补齐 `slug` 不规范场景的路径 fallback 单测

### 本轮已完成（2026-05-14）
- [x] `member` fallback：补齐 `verified / approved / verification_status / member_status / joinedAtText / join_year / quote / headline / sortOrder / ext.sortOrder` 断言
- [x] 排序规则：补齐 `featured -> verified -> sortOrder -> publishDate -> title` 优先级断言
- [x] 作者映射：补齐 `author_slug / author_slugs / author / authors / ext.author / ext.authors` 解析与去重断言
- [x] slug fallback：为成员详情路由提炼 `extractMemberPathSlug` helper，并补齐 `members/qianzhu`、裸 `slug`、前导 `/`、空值回退 `id` 断言

### 本轮已完成（2026-05-15）
- [x] `MemberDirectoryPage` 页面容错：补齐缺头像、缺 bio、缺 quote、空成员列表渲染断言
- [x] `MemberProfilePage` 页面容错：补齐缺头像、缺 bio、缺社交字段、`authoredPosts` 为空渲染断言
- [x] `MemberProfilePage` 基础信息：补齐成员标题、角色、相关文章、作者链接基础渲染断言

### 本轮已完成（2026-05-15 route）
- [x] `pages/members/[slug]`：覆盖 `getStaticPaths` 从 `allMembers` 生成规范化路径
- [x] `pages/members/[slug]`：覆盖 `getStaticProps` 通过 `resolvePostProps` 命中 `type=Member`
- [x] `pages/members/[slug]`：覆盖 `resolvePostProps` 未命中时 fallback 到 `fetchGlobalAllData().allMembers`
- [x] `pages/members/[slug]`：覆盖找不到 member 时返回 `notFound`
- [x] `pages/members/[slug]`：覆盖 `authoredPosts` 通过 `resolveAuthorsForPost` 与 `getMemberAuthoredPosts` 生成、排序并限制数量

## 下一批建议
- [x] 为 `pages/members/[slug]` 的 `extractMemberPathSlug` 提取可测试 helper
- [x] 为 Notion mock fixtures 增加 `Member` 页面样本
- [x] 增加 `Member` 缺头像 / 缺 bio / 缺社交字段的页面级渲染测试
- [x] 增加 `type = Member` 与自定义字段名映射测试
- [x] 增加 `author_slugs`、`author`、`ext.author` 混合输入去重测试
- [ ] 增加真实 Notion 联调 checklist 执行记录

## 批量测试顺序
1. 先跑 utils 单测
2. 再跑 member route 相关测试
3. 再补 Notion mock fixtures
4. 最后做真实 Notion 联调
