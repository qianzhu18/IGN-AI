# Codex for Open Source 申请文案

> 正确链接：https://openai.com/form/codex-for-oss/
> 状态：待提交

---

## 为什么这个仓库符合要求？

NotionNext（11K+ Stars、4K+ Forks）是排名第一的开源 Notion 建站框架。项目于 2021 年发布——比 ChatGPT 早两年——至今驱动数千个生产站点运行。提供 5+ 社区主题、完整多语言支持、ISR/SSG、RSS 订阅、站点地图、一键部署 Vercel 等能力。在中文开发者生态中已成为 Notion 建站的事实标准。作为项目 Admin 和核心贡献者，我负责代码审查、Issue 分类、版本发布工作流，已合并 10+ 个 PR，覆盖暗黑模式、RSS 可靠性、API 端点和性能优化等关键模块。

---

## 你的项目为何需要 Codex Security？

NotionNext 处理 Notion API Token 和用户数据库内容，所有 API 路由在 Vercel Serverless 环境中运行，Token 泄露将导致用户整个 Notion 工作空间被暴露。项目依赖 500+ 间接依赖包，包括非官方 Notion API 库（notion-client），这类非官方库更新频繁且缺乏正式安全审计。5+ 社区主题由不同作者贡献，每个主题都包含自定义 JavaScript 和 CSS，存在 XSS 和代码注入风险。下游有数千个站点直接继承 NotionNext 的代码部署上线，一个安全漏洞会影响整个生态链。持续的安全扫描是保护所有下游用户的必要手段。

---

## 如何使用 API 额度？

1. 自动化 PR 审查与 Issue 分类——使用 Codex 在人工审查前自动筛查回归问题、安全漏洞和代码风格问题，降低高流量仓库的维护瓶颈
2. 安全审计——扫描 500+ 间接依赖（包括非官方 Notion API 库）的 CVE 漏洞，审计来自 5+ 社区作者的主题代码中的 XSS、SSRF 和注入风险
3. 发布自动化——自动生成 Release Notes、跨主题运行回归测试、在打版本标签前验证 Breaking Change，目前全部手工完成
4. 下游保护——数千个站点继承 NotionNext 代码，一个漏洞会影响整个生态，持续安全扫描保护所有下游用户

---

## 其他需要说明的事项

我的开发工作流高度依赖 AI 辅助——使用 Claude Code 进行代码审查、Bug 诊断和 PR 创建。一个月内向 NotionNext 合并了 10+ 个 PR，覆盖 CSS 暗黑模式、RSS API 降级、按需增量再生成（On-Demand Revalidation）和性能优化。目前在基于 NotionNext 构建 IGNAI AI 社区官网的同时维护上游项目。Codex 将加速我对社区贡献的审查能力和跨主题的发布质量保障。

---

## 表单字段

| 字段 | 值 |
|------|-----|
| First name | （拼音名） |
| Last name | （拼音姓） |
| Email | （ChatGPT 邮箱） |
| GitHub username | qianzhu18 |
| GitHub repository URL | https://github.com/notionnext-org/NotionNext |
| Role | Core maintainer |
| 感兴趣的 | Codex Security + API credits |
| OpenAI Org ID | org-xOUYVgg4zvY4DhmCMI2Jg5SI |
