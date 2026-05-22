# Upstream PR 拆分检查清单

这份清单用于你准备把本仓库中的通用能力整理成上游 PR 时做最后检查。

## 1. 先问 3 个问题

### 这个改动是否已经在本地真实产品中被使用？
- [ ] 是
- [ ] 否

### 这个改动是否脱离 IGNAI 品牌也成立？
- [ ] 是
- [ ] 否

### 这个改动是否不依赖社区特定文案和结构？
- [ ] 是
- [ ] 否

如果上面 3 项没有大部分为“是”，先不要急着提上游 PR。

## 2. 文件筛查

### 优先保留在 PR 里的文件
- [ ] `lib/db/SiteDataApi.js`
- [ ] `lib/db/notion/getPageProperties.js`
- [ ] `lib/site/site.types.ts`
- [ ] `lib/site/processors/*`
- [ ] `pages/members/*` 中真正通用的部分
- [ ] 通用文档文件

### 优先排除出 PR 的文件
- [ ] `themes/ignai/*`
- [ ] 社区品牌文案
- [ ] 首页叙事区块
- [ ] 仅服务本地社区视觉的组件

## 3. Scope 检查

- [ ] 这个 PR 是否只做一件主事
- [ ] 标题是否能一句话解释清楚
- [ ] 维护者是否能在 30 秒内看懂价值
- [ ] 有没有把本地产品定制混进来

## 4. 技术检查

- [ ] 不破坏原有 Post / Page 路径
- [ ] 不强依赖某个主题
- [ ] 不引入大范围重构
- [ ] 对旧数据保持兼容
- [ ] 文档描述和代码行为一致

## 5. 叙事检查

PR 说明里最好能说清：

1. 真实使用场景是什么
2. 为什么这是通用能力而不是私有定制
3. 这次 PR 故意没有包含什么

## 6. 推荐 PR 描述结构

```text
Problem
- NotionNext currently serves blog/page flows well, but community-style sites also need first-class member entities.

What this PR adds
- basic Member page type support
- member collection access
- routing/documentation foundations

What this PR does not include
- theme-specific presentation
- community branding
- local product UX
```

## 7. 合并前最后确认

- [ ] 我能明确指出这个 PR 对上游用户的价值
- [ ] 我能明确指出哪些内容被刻意留在本地仓库
- [ ] 我能把这个 PR 和 IGNAI 社区官网实践联系起来，但不会让它看起来像私货
