# IGNAI 轻量观测与产品分析方案

## 当前结论

现阶段不建议自托管 PostHog。对 IGNAI 官网这类社区站，优先采用轻量云服务：

- PostHog Cloud Free：产品行为分析、漏斗、Feature Flag、A/B Testing。
- Microsoft Clarity：热力图、滚动、点击分布、短期用户录屏。
- Umami Cloud / Self-host：轻量 Web Analytics、来源、页面、国家 / 设备维度和简洁访问看板。
- UptimeRobot Free：外部可用性监控、核心路径监控、基础状态页。
- Sentry Developer 或 PostHog Error Tracking：前端异常和 API 异常追踪。

这样可以先把“用户怎么来、点了什么、有没有加入社区、哪个入口更有效”跑起来，避免为了观测系统先承担服务器、数据库、备份和升级成本。

## 为什么不先自托管

自托管 PostHog 的问题不是能不能装，而是长期运维成本：

- 需要更高规格服务器和稳定磁盘。
- 事件数据会持续增长，备份、归档、清理都要有人负责。
- PostHog 依赖服务较多，升级和排障成本高于普通 Next.js 站点。
- 当前社区站最需要的是验证内容、活动和加入路径，不是拥有一整套数据基础设施。

因此当前阶段的原则是：先用免费云服务把数据闭环做起来，等真实流量、隐私要求或成本压力出现，再评估自托管。

## 推荐阶段

### Phase 1：立即上线，零运维

使用：

- PostHog Cloud Free
- Microsoft Clarity
- Umami Cloud
- UptimeRobot Free
- Sentry Developer 或 PostHog Error Tracking

Vercel 环境变量：

```bash
NEXT_PUBLIC_CLARITY_ID=
NEXT_PUBLIC_POSTHOG_KEY=phc_xxx
NEXT_PUBLIC_POSTHOG_HOST=https://us.i.posthog.com
NEXT_PUBLIC_POSTHOG_UI_HOST=https://us.posthog.com
NEXT_PUBLIC_POSTHOG_CAPTURE_PAGEVIEW=true
NEXT_PUBLIC_POSTHOG_AUTOCAPTURE=true
NEXT_PUBLIC_POSTHOG_SESSION_RECORDING=false
NEXT_PUBLIC_UMAMI_HOST=https://cloud.umami.is/script.js
NEXT_PUBLIC_UMAMI_ID=
NEXT_PUBLIC_GLITCHTIP_DSN=
```

如果 PostHog 项目选择 EU 区域，再把 host 改成 PostHog 控制台给出的 EU endpoint。

### Phase 2：轻量付费，不自托管

当免费额度不够时，先升级云服务，而不是马上自托管：

- PostHog 继续 Cloud，用 billing limit 控制预算。
- UptimeRobot 从 Free 升到 Solo，用 60 秒监控和更多 SSL / API 监控。
- Sentry 从 Developer 升到 Team，支持多人协作和更多错误额度。

这个阶段仍然没有服务器运维负担。

### Phase 3：满足迁移阈值后再自托管

只有满足这些条件之一时，再考虑自托管：

- 必须满足强数据主权或私有化要求。
- 月事件量已经明显超出 Cloud 免费 / 轻量付费的合理成本。
- 有稳定运维人力处理备份、升级、告警和事故恢复。
- 需要把观测系统作为组织长期基础设施，而不只是当前官网使用。

## 工具分工

### PostHog Cloud

负责回答产品运营问题：

- 用户从哪里进入站点。
- 用户是否点击加入社区。
- 用户是否查看活动、记录、文章和成员。
- 加入社区表单是否提交成功。
- 某个首页模块或 CTA 是否提升转化。
- A/B 测试中哪个版本更有效。

当前站点代码已经支持：

- `NEXT_PUBLIC_POSTHOG_KEY`
- `NEXT_PUBLIC_POSTHOG_HOST`
- `NEXT_PUBLIC_POSTHOG_UI_HOST`
- `NEXT_PUBLIC_POSTHOG_CAPTURE_PAGEVIEW`
- `NEXT_PUBLIC_POSTHOG_AUTOCAPTURE`
- `NEXT_PUBLIC_POSTHOG_SESSION_RECORDING`

Session Replay 建议默认关闭。录屏先用 Clarity，需要在 PostHog 内联分析时再开启。

### Microsoft Clarity

负责补充“用户怎么动”的定性观察：

- 首页滚动热力图。
- 加入社区入口点击分布。
- Dead click / Rage click。
- 用户录屏回看。

Clarity 不作为主数据源。它适合发现 UI 问题和路径问题，不适合替代 PostHog 做漏斗和实验分析。

### Umami

负责回答轻量网站流量问题：

- 今天有多少访问。
- 哪些页面被访问最多。
- 用户来自哪些 referrer。
- 国家、设备、浏览器分布如何。
- 哪些公开入口带来了访问。

当前站点代码已经支持：

- `NEXT_PUBLIC_UMAMI_HOST`
- `NEXT_PUBLIC_UMAMI_ID`

Umami 的价值是轻、快、清爽。它不替代 PostHog 的漏斗、A/B 和 Feature Flag，也不替代 Clarity 的热力图和录屏。它适合作为“每天看一眼网站情况”的低负担仪表盘。

### UptimeRobot

负责回答服务可用性问题：

- 网站是否能访问。
- API 是否存活。
- Vercel、Cloudflare 或域名解析是否异常。
- 核心路径是否可以正常打开。

建议监控：

- `GET https://www.yanglaishe.cn/`
- `GET https://www.yanglaishe.cn/api/health`
- `GET https://www.yanglaishe.cn/events`
- `GET https://www.yanglaishe.cn/records`
- `GET https://www.yanglaishe.cn/join`
- `GET https://www.yanglaishe.cn/rss.xml`

当前代码已提供：

```text
/api/health
```

这个接口返回轻量 JSON，并设置 `Cache-Control: no-store`，适合作为外部健康检查。

### Sentry 或 PostHog Error Tracking

负责回答工程质量问题：

- 哪些页面出现前端异常。
- 哪些 API 出现服务器异常。
- 哪些错误影响了真实用户。
- 部署后是否出现新的错误趋势。

当前建议先二选一：

- 想少接一个工具：先用 PostHog Error Tracking。
- 想要更成熟的错误平台：用 Sentry Developer。

GlitchTip 可以保留为以后自托管错误追踪选项，但不作为当前轻量方案的第一选择。

## 当前已埋点事件

### 页面访问

PostHog 和 Umami 初始化后自动捕获：

- `$pageview`
- `$pageleave`

Umami 页面访问由官方 tracker 自动处理；PostHog 页面访问由本站的 `ProductAnalytics` 手动处理，避免 Next.js 客户端路由漏记。

### 首页和导航

- `click_join_community`
- `click_view_events`
- `click_view_articles`
- `click_view_records`

### 内容卡片

- `click_event_card`
- `click_article_card`
- `click_record_card`

### 加入社区

- `click_join_submit`
- `submit_join_application`
- `join_application_result`
- `click_wechat_qr`

加入表单事件不采集姓名、微信、邮箱等敏感信息，只记录模式、兴趣数量、是否带头像、成功 / 失败状态。

这些业务事件会同时发送到 PostHog、Umami 和 Clarity API events。PostHog 用于漏斗和实验，Umami 用于轻量事件概览，Clarity 用于按事件过滤录屏。

## A/B 测试建议

第一批不要做复杂实验，先做 3 个对业务有意义的实验：

1. 首页主 CTA 文案
   - A：加入社区
   - B：联系千逐
   - 指标：`click_join_community`

2. 首页活动区位置
   - A：活动在文章前
   - B：文章在活动前
   - 指标：`click_event_card`、`click_article_card`

3. 加入社区方式
   - A：表单优先
   - B：微信二维码优先
   - 指标：`click_join_submit`、`join_application_result`、`click_wechat_qr`

建议所有实验都用 PostHog Feature Flag / Experiments 控制，不把实验逻辑写死在页面里。

## 上线顺序

1. 创建 PostHog Cloud 项目，复制 project API key 到 Vercel。
2. 创建 Clarity 项目，复制 project id 到 Vercel。
3. 创建 Umami 网站，复制 tracking script 中的 `data-website-id` 到 Vercel。
4. 创建 UptimeRobot 监控，先监控首页和 `/api/health`。
5. 创建 Sentry 项目，或先启用 PostHog Error Tracking。
6. 重新部署 Vercel，确认 PostHog / Umami 能收到访问和业务事件，Clarity 能看到录屏。
7. 一周后复盘首页转化、活动点击、文章点击和加入申请数据。

## 保留事项

- 需要补充隐私说明，明确站点采集匿名行为数据、热力图和错误数据。
- PostHog 需要设置 billing limit，防止异常埋点造成费用失控。
- Clarity 录屏需要关注隐私遮罩，表单输入字段不得暴露个人联系方式。
- UptimeRobot 与 Vercel / Cloudflare 不在同一故障域，适合作为外部监控。
