# NotionNext 上游 Issue Triage

记录日期：2026-06-19
数据来源：GitHub API，`notionnext-org/NotionNext` open issues / selected PRs
用途：判断下一轮上游维护与本地可抽取修复方向。

## 1. 当前快照

- 上游开放 issue：170 个。
- 最近有更新的新 issue：[#4198 Notice 同步区块部分无法显示](https://github.com/notionnext-org/NotionNext/issues/4198)。
- 本地 roadmap 中待跟进的 #4187 / #4188 / #4189 已全部合并：
  - [#4187 fix: normalize Heo infocard greetings](https://github.com/notionnext-org/NotionNext/pull/4187)，2026-06-11 合并。
  - [#4188 refactor: add typed collection helpers](https://github.com/notionnext-org/NotionNext/pull/4188)，2026-06-11 合并。
  - [#4189 docs: add community site database template](https://github.com/notionnext-org/NotionNext/pull/4189)，2026-06-11 合并。
- 早先 playbook 中的高胜率候选已变化：
  - #4039 / #3940 数据库筛选问题已关闭。
  - #3914 Apple Music 单曲嵌入已关闭。
  - #3983 / #3931 RSS 问题已关闭，但仍存在新的 RSS 路径问题 #3654。
  - #3836 公式区块问题已关闭。
  - #3890 Notion API 429 仍开放，且仍与本地生产构建风险高度相关。

## 2. 粗分结果

本次对 170 个开放 issue 做关键词粗分，仅用于挑选维护方向，不等于最终标签：

| 类别 | 数量 | 判断 |
|---|---:|---|
| 构建 / 部署 / 输出稳定性 | 102 | 最大问题池，和 IGNAI 当前上线风险高度重叠 |
| Notion 数据兼容 | 27 | 适合数据层、block 兼容、官方 API fallback 方向 |
| 社区能力 / 主题增强 | 16 | 部分可作为长期方向，不适合马上大 PR |
| 内容渲染 / 外部资源 | 5 | 小修复机会较多，但需复现 |
| 安全 / 隐私 | 2 | 数量少，但优先级不低 |
| 其他 / 待确认 | 18 | 先观察，不主动投入 |

## 3. 推荐优先级

### P0：先评估是否能直接拆小修

1. [#4198 Notice 同步区块部分部署后仍无法显示](https://github.com/notionnext-org/NotionNext/issues/4198)
   - 原因：最新 bug，和 Notion block / synced block 兼容有关。
   - 维护价值：如果能复现，适合做成单点 block 渲染修复。
   - 本地影响：IGNAI 未来活动记录、页面说明、内容资产页都可能使用同步块。

2. [#3890 Notion API 429 / Vercel 构建超频](https://github.com/notionnext-org/NotionNext/issues/3890) + [#3901 构建阶段严重超时](https://github.com/notionnext-org/NotionNext/issues/3901)
   - 原因：和本地 G/H 生产上线 TODO 高度重叠。
   - 维护价值：这是“抬地位”的稳定性问题，适合从小切口开始，例如构建期并发、预渲染范围、失败降级、pageProps 瘦身。
   - 本地依据：本仓库已经做过成员详情页预渲染收敛、pageProps 瘦身、Notion 429 风险降低。

3. [#3654 RSS feed.xml 404 / 强制跳转](https://github.com/notionnext-org/NotionNext/issues/3654) + [#3724 sitemap XML 未转义导致解析错误](https://github.com/notionnext-org/NotionNext/issues/3724)
   - 原因：SEO 输出稳定性问题，容易验收。
   - 维护价值：本地已有 RSS / sitemap / robots 修复经验，可继续抽 upstream-friendly 小 PR。
   - 注意：不要把 IGNAI 的 canonical 或站点配置私货带入上游。

4. [#3703 加密文章仍暴露 summary / TOC](https://github.com/notionnext-org/NotionNext/issues/3703)
   - 原因：安全 / 隐私意味强，范围相对明确。
   - 维护价值：如果能定位到列表 props、详情页 toc 生成或主题侧展示，可以做成高价值修复。
   - 本地影响：IGNAI 当前生产线也要求公开输出不泄漏不该展示的内容。

### P1：适合穿插做的小修

- [#3719 YouTube 视频嵌入空白](https://github.com/notionnext-org/NotionNext/issues/3719)：外部 embed fallback 问题，像 #3914 Apple Music 修复的同类后续。
- [#3671 busuanzi 源站 502](https://github.com/notionnext-org/NotionNext/issues/3671)：外部服务替换或降级策略，适合小 PR。
- [#3687 Notion 数据库封面无法显示](https://github.com/notionnext-org/NotionNext/issues/3687)：可能和封面映射、默认图 fallback、Notion 图片 URL 时效有关，需先复现。
- [#3642 分页 / tag 跳转异常](https://github.com/notionnext-org/NotionNext/issues/3642)：路由与生成路径稳定性，若能复现，价值较高。

### P2：暂不主动做

- 新主题 / 社交按钮 / 功能增强类：如 #3920 Fuwari 主题、#3619 中文平台按钮。
- 平台部署泛问题：如 Cloudflare、EdgeOne、反向代理教程，除非和本地上线直接重叠。
- 大型主题迁移或视觉方向：先服务 IGNAI 本地产品，不急着上游。

## 4. 对本地仓库的维护建议

1. 路线图状态需要更新：#4187 / #4188 / #4189 已合并，旧的“跟进 CI/review”待办应关闭。
2. 下一轮上游修复不要从“社区能力大 PR”继续推进，先回到可复现 bugfix：
   - 首选 #4198 或 #3703，范围小且用户价值明确。
   - 若想和本地生产上线同频，选 #3890/#3901 或 #3654/#3724。
3. 本地已经验证过的 pageProps 瘦身、RSS/sitemap 修复、构建期 Notion 降压，可以作为后续上游小 PR 素材。
4. #4169 / #4170 不建议原样重开。它们应拆成更小的、单一问题导向的 PR。

## 5. 本次 Session 结果

### files changed

- `doc/roadmap/master-todo.md`
- `doc/roadmap/schedule.md`
- `docs/upstream-community-pr-stack.zh-CN.md`
- `docs/organizers/notionnext-org-issue-triage-2026-06-19.zh-CN.md`

### community-facing value delivered

- 清掉过期上游待办，避免后续继续追已经合并的 PR。
- 把下一批上游维护方向从泛泛“继续贡献”收束到具体 issue 池。
- 将本地上线风险和上游公开问题重新对齐。

### upstreamable pieces identified

- Notion 429 / 构建超时方向：从本地预渲染收敛、pageProps 瘦身、失败降级中拆小。
- SEO 输出方向：RSS 路径、sitemap XML 转义、robots/canonical fallback。
- 安全隐私方向：加密文章 summary / TOC 泄漏收口。
- Notion block 兼容方向：同步块 / Notice block 渲染。

### remaining work

- 选择一个 P0 issue 做真实复现。
- 从本地已验证修复中拆一个最小 upstream branch。
- 更新开源贡献时间线，把 #4187 / #4188 / #4189 合并记录纳入统计。
