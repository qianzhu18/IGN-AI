# Member 批量测试协作指令

## 目的

这份文档给“另一个实现界面 / 另一个协作窗口”使用。

你可以把这里的指令直接贴过去，让对方一次性按测试集推进，不需要重新解释背景。

## 标准指令

```text
请先阅读 /AGENTS.md、/docs/member-execution-roadmap.zh-CN.md、/docs/member-schema.md、/tasks/member-test-todo.md，然后只推进 Member 测试集，不做大块 UI 重构。

本轮目标：
1. 补齐 member 字段 fallback 测试
2. 补齐 featured / verified / sortOrder 排序测试
3. 补齐 author slug / author name / ext author 映射测试
4. 补齐 slug 不规范时的 fallback 测试

工作要求：
- 优先补 utils 和 helper 层测试
- 不要顺手改 unrelated 功能
- 如果发现生产代码存在不可测逻辑，先提炼最小 helper 再补测试
- 每完成一组测试，更新 /tasks/member-test-todo.md 状态
- 最后给出：改动文件、已覆盖场景、未覆盖风险、下一步建议
```

## 本轮主要文件

共享层：

- `/Users/mac/qianzhu Vault/project/IGN AI 官网/lib/utils/member.js`
- `/Users/mac/qianzhu Vault/project/IGN AI 官网/lib/utils/post.js`
- `/Users/mac/qianzhu Vault/project/IGN AI 官网/pages/members/[slug].js`

测试层：

- `/Users/mac/qianzhu Vault/project/IGN AI 官网/__tests__/lib/utils/member.test.js`
- `/Users/mac/qianzhu Vault/project/IGN AI 官网/__tests__/lib/utils/post.test.js`
- `/Users/mac/qianzhu Vault/project/IGN AI 官网/tasks/member-test-todo.md`

文档层：

- `/Users/mac/qianzhu Vault/project/IGN AI 官网/docs/member-schema.md`
- `/Users/mac/qianzhu Vault/project/IGN AI 官网/docs/member-execution-roadmap.zh-CN.md`

## 测试列表

### A. member 字段 fallback

- `verified`
- `approved`
- `verification_status`
- `member_status`
- `joinedAtText`
- `join_year`
- `quote`
- `headline`
- `sortOrder`
- `ext.sort_order`

### B. 排序规则

- featured 优先
- verified 优先
- sortOrder 优先
- publishDate 次级排序
- title 最终兜底排序

### C. 作者映射

- `author_slug`
- `author_slugs`
- `ext.author_slug`
- `ext.author_slugs`
- `author`
- `authors`
- `ext.author`
- `ext.authors`
- 去重

### D. slug fallback

- `members/qianzhu`
- `qianzhu`
- `/members/qianzhu`
- `href` fallback
- `id` fallback
- 空值时回退到 `/members`

## 建议命令

```bash
yarn test --runTestsByPath __tests__/lib/utils/member.test.js __tests__/lib/utils/post.test.js
```

如果需要扩大范围，再继续加上 route 或 page-level 测试。
