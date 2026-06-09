# IGNAI 可观测与产品分析方案

## 主方案

IGNAI 官网的生产观测主方案采用：

- 自托管 PostHog：产品行为分析、事件埋点、Session Replay、Feature Flag、A/B Testing。
- Uptime Kuma：外部可用性监控、SSL 证书监控、公开状态页、Webhook 告警。
- GlitchTip：错误追踪、性能监控、异常聚合、Sentry-compatible SDK 接入。

Clarity 只作为可选辅助工具，用于短期查看热力图和录屏，不作为主数据源。

## 为什么这样分工

### PostHog

PostHog 负责回答产品运营问题：

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

如果使用自托管 PostHog，Vercel 环境变量建议配置为：

```bash
NEXT_PUBLIC_POSTHOG_KEY=phc_xxx
NEXT_PUBLIC_POSTHOG_HOST=https://posthog.example.com
NEXT_PUBLIC_POSTHOG_UI_HOST=https://posthog.example.com
NEXT_PUBLIC_POSTHOG_CAPTURE_PAGEVIEW=true
NEXT_PUBLIC_POSTHOG_AUTOCAPTURE=true
NEXT_PUBLIC_POSTHOG_SESSION_RECORDING=false
```

Session Replay 建议默认关闭，只在需要诊断转化问题时开启，避免过早引入隐私和性能负担。

### Uptime Kuma

Uptime Kuma 负责回答服务可用性问题：

- 网站是否能访问。
- API 是否存活。
- SSL 证书是否快过期。
- Vercel、Cloudflare 或域名解析是否异常。
- 是否需要一个公开状态页给社区成员查看。

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

这个接口返回轻量 JSON，并设置 `Cache-Control: no-store`，适合作为 Kuma 的应用健康检查。

### GlitchTip

GlitchTip 负责回答工程质量问题：

- 哪些页面出现前端异常。
- 哪些 API 出现服务器异常。
- 哪些错误影响了真实用户。
- 部署后是否出现新的错误趋势。
- 哪些请求或页面性能异常。

GlitchTip 兼容 Sentry SDK。上线前建议先创建 GlitchTip 项目，拿到 DSN，然后配置：

```bash
NEXT_PUBLIC_GLITCHTIP_DSN=https://xxx@glitchtip.example.com/1
```

本轮暂未强行接入 SDK。原因是 GlitchTip 需要先确定部署域名、项目 DSN、是否接收 source map、是否上报服务端错误，再决定使用轻量浏览器 SDK 还是完整 Next.js Sentry SDK。

## 当前已埋点事件

### 页面访问

PostHog 初始化后自动捕获：

- `$pageview`
- `$pageleave`

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

1. 先部署 Uptime Kuma，监控首页和 `/api/health`。
2. 部署 PostHog，配置 Vercel 环境变量，验证事件进入 PostHog。
3. 梳理隐私说明，明确站点会采集匿名行为数据。
4. 部署 GlitchTip，接入前端错误，再扩展到 API 错误。
5. 基于 PostHog 做第一轮 A/B 测试。

## 保留事项

- 自托管 PostHog 运维成本明显高于 Clarity / Plausible，需要确保服务器资源和备份策略。
- Uptime Kuma 必须部署在不同于 Vercel 的环境中，否则 Vercel 故障时监控也可能不可用。
- GlitchTip 与 Uptime Kuma 都有 uptime 能力，但 Kuma 更适合外部状态页；GlitchTip 的 uptime 可作为错误平台内的补充。
