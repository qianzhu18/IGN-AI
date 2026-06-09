# IGNAI 产品分析上线配置

## 工具分工

- PostHog Cloud Free：页面访问、业务事件、转化漏斗、Feature Flag 和后续 A/B 测试。
- Microsoft Clarity：热力图、滚动深度、点击分布和短期用户录屏。
- UptimeRobot Free：站点可用性、核心路径监控和基础状态页。
- Sentry Developer 或 PostHog Error Tracking：错误追踪和异常告警。

完整生产观测栈分工见 `docs/observability-stack.zh-CN.md`。现阶段不推荐自托管 PostHog，避免过早承担服务器、数据库、备份和升级成本。

## Vercel 环境变量

在 Vercel Project Settings -> Environment Variables 中配置：

```bash
NEXT_PUBLIC_CLARITY_ID=
NEXT_PUBLIC_POSTHOG_KEY=
NEXT_PUBLIC_POSTHOG_HOST=https://us.i.posthog.com
NEXT_PUBLIC_POSTHOG_UI_HOST=https://us.posthog.com
NEXT_PUBLIC_POSTHOG_CAPTURE_PAGEVIEW=true
NEXT_PUBLIC_POSTHOG_AUTOCAPTURE=true
NEXT_PUBLIC_POSTHOG_SESSION_RECORDING=false
NEXT_PUBLIC_GLITCHTIP_DSN=
```

说明：

- `NEXT_PUBLIC_CLARITY_ID` 只填 Clarity tracking code 里的 project id。
- `NEXT_PUBLIC_POSTHOG_KEY` 填 PostHog project API key。
- `NEXT_PUBLIC_POSTHOG_HOST` 和 `NEXT_PUBLIC_POSTHOG_UI_HOST` 默认使用 PostHog Cloud US；如果项目选择 EU 区域，改成控制台给出的 EU endpoint。
- PostHog session recording 默认关闭；录屏先交给 Clarity，如果未来希望在 PostHog Insight 中直接看 replay，再改为 `true`。
- `NEXT_PUBLIC_GLITCHTIP_DSN` 当前仅预留。轻量方案下优先用 Sentry Developer 或 PostHog Error Tracking；GlitchTip 作为以后自托管错误追踪选项。

## 已接入事件

- `$pageview`：页面访问，支持 Next.js 客户端路由跳转。
- `click_join_community`：点击加入社区入口。
- `click_join_submit`：点击加入表单提交按钮。
- `submit_join_application`：加入申请开始提交。
- `join_application_result`：加入申请提交结果。
- `click_wechat_qr`：点击或尝试操作微信二维码。
- `click_view_events`：查看活动集合。
- `click_event_card`：点击活动卡片。
- `click_view_articles`：查看文章集合。
- `click_article_card`：点击文章卡片。
- `click_view_records`：查看记录集合。
- `click_record_card`：点击记录卡片。

加入表单事件不采集姓名、微信、邮箱等敏感信息，只记录模式、兴趣数量、是否带头像、成功 / 失败状态。

## 首批看板

建议在 PostHog 中先建 4 个 Insight：

- 首页转化：`$pageview /` -> `click_join_community` -> `submit_join_application` -> `join_application_result success`
- 活动兴趣：`click_view_events` -> `click_event_card`
- 内容兴趣：`click_view_articles` -> `click_article_card`
- 记录兴趣：`click_view_records` -> `click_record_card`

Clarity 中先看：

- 首页滚动热力图：用户是否看到活动、文章、加入社区区块。
- 点击热力图：加入社区、二维码、活动卡片是否被点击。
- 录屏筛选：rage click、dead click、快速退出。

## A/B 测试入口

第一组实验建议用 PostHog Experiments：

1. 在 PostHog Feature Flags 创建实验 flag，例如 `home_join_cta_copy`。
2. 设置 control / variant。
3. 前端读取 feature flag，展示不同按钮文案或不同加入入口。
4. 主指标用 `click_join_community` 或 `join_application_result success`。

实验前先写清楚假设：例如「首页主按钮从『加入社区』改为『加微信认识我们』是否提高真实申请成功率」。
