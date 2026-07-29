# 国内部署与 OpenShip 评估

记录日期：2026-07-30

## 结论

IGNAI 的 Next.js + Payload 应用可部署到国内服务器，前台、`/admin`、API、预览接口在同一 Node/Docker 服务中运行。推荐先使用 GitHub Actions + Docker image + 现有反向代理发布；当前不建议把 OpenShip 安装到现有 `cn-tx` 主服务器。

OpenShip 可以作为未来独立 staging/部署控制面板的候选，但不是 Payload 的替代品：Payload 负责内容模型、后台、权限与预览，OpenShip 负责构建、容器、域名、TLS、日志和回滚。

## 当前服务器判断

2026-07-30 只读检查 `cn-tx`：4 vCPU / 4GB，约 1.7GB 可用内存，Swap 已用满，根磁盘 40GB 已使用 74%，80/443 已由现有代理占用，并运行多个 Docker 服务。

OpenShip 的 Compose 模式会额外启动 Postgres、Redis、API、Dashboard、OpenResty edge，并需要 Docker socket；其 edge 使用 80/443。因此它会与现有代理争用端口，也不适合在当前容量上再承担构建和控制面职责。

## 推荐目标拓扑

```text
GitHub Actions
  -> build/test Docker image
  -> staging approval
  -> Tencent ECS: Next.js + Payload container
  -> TencentDB PostgreSQL
  -> public media bucket + CDN/custom media domain

Existing reverse proxy
  -> ignai.community / admin / API / preview
```

- 应用容器：同一个 Next.js + Payload 镜像提供前台、后台和 API。
- 数据库：使用托管 PostgreSQL；不要把生产数据库和 CI 构建都压在当前 4C4G ECS。
- 媒体：使用专用 public-media bucket；不要与未知用途的历史 bucket 混用。
- 反向代理：继续在现有 Nginx/OpenResty/1Panel 体系增加虚拟主机，不先引入第二套 edge。
- OpenShip：如要试用，使用独立 staging VPS；生产验证稳定后再决定是否接管部署入口。

## OpenShip 评估

OpenShip 提供 Git 推送构建、容器部署、域名/TLS、日志与回滚能力，也可自托管。仓库创建于 2026-03，当前仍属快速迭代的年轻项目；README 明确说明 Compose 控制面拥有 Docker socket 权限。

适用：独立 staging 机器、希望使用可视化部署面板、愿意把反向代理和 Docker 控制权交给单一平台。

不适用：现有 `cn-tx`，因为资源、端口和既有服务边界都不满足。

参考：[OpenShip README](https://github.com/oblien/openship)；[Next.js 自托管](https://nextjs.org/docs/app/guides/self-hosting)。

## OSS 集成状态

Payload 的 S3 存储配置已增加 `R2_REGION` 与 `R2_FORCE_PATH_STYLE`，因此可兼容 Cloudflare R2、腾讯 COS 和阿里 OSS；旧 R2 默认行为不变。

阿里云 OSS 杭州 bucket 的签名 List/PUT/DELETE 探针验证通过，但匿名 GET 返回 403。这意味着当前 bucket 是私有的，不能直接设置为官网 `R2_PUBLIC_URL`。探针对象已删除。

下一步必须二选一：

1. 新建仅用于官网的 public-media bucket，并绑定媒体域名。
2. 确认现有 bucket 内容均可公开，再由所有者在 OSS 控制台设置 bucket policy/CORS/自定义域名。

不要把现有共享 bucket 整桶改公开读，也不要把 AccessKey 写入仓库、skill 或 CI 日志。

阿里云 AWS SDK 接入建议使用 `https://s3.oss-cn-hangzhou.aliyuncs.com`、`cn-hangzhou` 和 virtual-host addressing。参考：[阿里云 OSS S3 SDK 接入](https://www.alibabacloud.com/help/en/oss/developer-reference/use-aws-sdks-to-access-oss)。

## CI/CD 阶段门

1. Pull Request：install、generate types/import map、test、lint、typecheck、build、Docker build。
2. Staging：部署新镜像、执行一次 migration、检查 `/api/health`、后台登录、草稿预览、媒体上传。
3. Production：数据库备份、人工批准、迁移、滚动发布、健康检查、回滚演练。

内容编辑在 Payload 后台完成，不需要 Git 发布；只有前端、字段、权限和数据库结构变更才进入 CI/CD。
