# 2026-08-03 SEO 优化会话记录

## 范围

参考 [joeseesun/qiaomu-seo](https://github.com/joeseesun/qiaomu-seo) 的 evidence-based SEO 工作流，把“可发现、可抓取、可索引、规范 URL、结构化数据、搜索展示资格”拆开验证。本次聚焦社区站代码层，不对排名或搜索展示作保证。

## 文件变更

- 新增 `lib/seo/metadata.js`：canonical、索引策略、OG 图片、JSON-LD graph 与安全序列化。
- 新增 `lib/seo/sitemap.js`：成员、活动、记录动态 URL，真实日期字段与 XML 转义。
- 新增 `lib/sitemap.xml.js`：兼容现有 sitemap 工具测试与调用路径。
- 更新 `components/SEO.js`：统一 robots、canonical、hreflang、OG/Twitter、社区实体结构化数据。
- 更新 `pages/sitemap.xml.js` 与 `pages/robots.txt.js`：补全社区内容并收口内部操作路径。
- 更新 `lib/utils/event.js`：保留活动开始 / 结束日期供 sitemap 和 Event JSON-LD 使用。
- 更新活动 / 记录卡片与详情页图片 alt。
- 新增 `public/brand/ignai/og-default.jpg`：1200x630 正式 OG fallback。
- 新增 SEO 定向测试：`__tests__/lib/seo/metadata.test.js`、`__tests__/lib/seo/sitemap.test.js`。

## 社区价值

- 成员、活动、记录目录和详情页具备可验证的 canonical、索引策略和 schema.org 实体表达。
- sitemap 不再把搜索页、RSS 或外部活动链接当作站内可索引 URL，也不使用虚假的当天 `lastmod`。
- 搜索 / 管理 / 认证路径明确 noindex，降低内部页面进入搜索结果的风险。
- 社交分享拥有固定尺寸的品牌 OG fallback，内容图片 alt 更具语义。

## 可上游化与本地化

可上游化：纯函数 SEO metadata helper、JSON-LD 安全序列化、通用 sitemap 字段生成、按路由区分索引策略。

本地化：IGNAI 品牌 OG 图片、社区路由集合、Notion 官方 data source 合并，以及成员 / 活动 / 记录字段映射。

## 验证结果

- 定向 Jest：5 个 suite、21 个测试通过。
- TypeScript 类型检查通过。
- 改动文件级 ESLint 通过；全量 lint 仍受既有 `pages/about.tsx` 三处 unsafe 类型错误影响。
- `git diff --check` 通过。
- 全量 Jest 仍有既有工作区失败项，集中在 LazyImage、RSS、成员组件旧断言、validation 和 `notion-utils` ESM 解析；本次定向 SEO 测试未失败。
- 线上 `https://www.yanglaishe.cn` 及核心 SEO URL 当前返回 Vercel `DEPLOYMENT_NOT_FOUND`，无法完成生产环境抓取验证。

## 剩余工作

- 恢复正式部署和域名绑定后，执行首页、成员、活动、记录、robots、sitemap、RSS、OG、JSON-LD 的线上 smoke。
- 在 Google Search Console / Bing Webmaster Tools 中提交 sitemap，并记录抓取、索引和增强结果证据。
- 对真实生产内容的标题、摘要、作者、日期、图片和内部链接做内容质量审计。
- 完成路线图中的生产环境变量、观测栈和上线检查清单。
