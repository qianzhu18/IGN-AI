# Member 生产化 QA Checklist

记录日期：2026-05-17
适用范围：`Member` MVP 收束阶段，只做真实数据联调与浏览器验收，不扩功能。

## 0. 进入 QA 前置条件

- [x] Member 测试批次通过
- [ ] Member 相关文件已从脏工作区中单独圈定
- [ ] Member 相关改动已形成独立 commit
- [ ] 准备用于联调的真实 Notion 样本库

当前已知测试批次：

```bash
yarn test --runTestsByPath \
  '__tests__/lib/db/notion/getPageProperties.test.js' \
  '__tests__/lib/utils/member.test.js' \
  '__tests__/lib/utils/post.test.js' \
  '__tests__/pages/members/[slug].test.js' \
  '__tests__/src/components/members/MemberDirectoryPage.test.js' \
  '__tests__/src/components/members/MemberProfilePage.test.js'
```

## 1. 真实 Notion 样本准备

至少准备以下内容：

- [ ] 3-5 个 `type = Member` 页面
- [ ] 2-3 篇 `type = Post` 页面
- [ ] 至少 1 个 `featured = true` 样本
- [ ] 至少 1 个 `verified = true` 或 `verification_status = verified` 样本
- [ ] 至少 1 个带 `sortOrder` 的样本
- [ ] 至少 1 个缺头像样本
- [ ] 至少 1 个缺 bio 样本
- [ ] 至少 1 个缺 social 字段样本
- [ ] 至少 1 个带完整 social 字段样本
- [ ] 至少 1 篇文章使用 `author`
- [ ] 至少 1 篇文章使用 `author_slugs`
- [ ] 至少 1 篇文章使用 `ext.author` 或 `ext.author_slugs`

## 2. 字段契约检查

逐项确认真实数据是否与代码约定一致：

- [ ] `type = Member`
- [ ] `status = Published`
- [ ] `title`
- [ ] `slug`
- [ ] `bio`
- [ ] `role`
- [ ] `avatar`
- [ ] `featured`
- [ ] `verified` / `verification_status`
- [ ] `joinedAtText` / `join_year`
- [ ] `quote` / `headline`
- [ ] `sortOrder`
- [ ] `social_github`
- [ ] `social_x`
- [ ] `social_linkedin`
- [ ] `website`

## 3. 路由联调

至少验证这 3 条真实页面链路：

- [ ] `/members`
- [ ] `/members/<member-slug>`
- [ ] 一篇带作者链接的文章页

每条链路至少确认：

- [ ] 页面可访问
- [ ] 无 404 / 500
- [ ] 标题与描述正常
- [ ] 空字段不导致白屏或布局塌陷
- [ ] 链接跳转目标正确

## 4. 浏览器验收

桌面端与移动端都要看一遍。

### `/members`

- [ ] featured 成员排序正确
- [ ] verified 标记显示正常
- [ ] `sortOrder` 生效
- [ ] 缺头像时回退到默认头像或页面图标
- [ ] 缺 bio 时显示 fallback 文案
- [ ] 缺 quote 时不出现空占位
- [ ] 成员卡片链接都能进入详情页

### `/members/<member-slug>`

- [ ] 标题、角色、简介显示正常
- [ ] featured / verified 标记显示正常
- [ ] `GitHub` 正常渲染并指向正确地址
- [ ] `X` 正常渲染并指向正确地址
- [ ] `LinkedIn` 正常渲染并指向正确地址
- [ ] `Website` 正常渲染并指向正确地址
- [ ] 缺 social 时不渲染空链接
- [ ] Related posts 正常显示
- [ ] Related posts 中作者链接可跳回成员页

### 文章页作者区域

- [ ] 作者名可点击
- [ ] 点击后进入正确成员页
- [ ] 多作者顺序符合输入顺序
- [ ] 混合 `author` / `author_slugs` 输入时无重复作者

## 5. 风险记录

本轮即使通过，也需要明确记录这些风险是否接受：

- [ ] 仅 mock 通过、真实 Notion 尚未验证
- [ ] 页面级正向 social links 渲染尚未自动化测试覆盖
- [ ] `/members` 索引页暂未见独立 route 级测试
- [ ] 当前工作区存在大量 unrelated 脏改动，可能干扰回归判断

## 6. 通过标准

满足以下条件后，才建议进入小流量上线：

- [ ] 真实 Notion 样本链路跑通
- [ ] 浏览器验收无阻断问题
- [ ] Member 相关改动已独立提交
- [ ] 剩余问题都有明确风险接受说明

## 7. 执行记录

### 第一次执行

- 日期：
- Notion 样本库：
- 验收人：
- 已验证路由：
- 发现问题：
- 是否允许进入小流量上线：
