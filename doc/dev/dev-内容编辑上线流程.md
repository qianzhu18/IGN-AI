# IGNAI 内容编辑与上线流程

当前版本已经接入 Sanity Studio。内容后台入口是：

```text
http://localhost:3333
```

官网内统一后台说明入口：

```text
/manage
```

注意：

```text
当前这套后台编辑方案还不能视为完成态
它没有正式实现“管理员持密钥进入，普通成员仅预览”的产品边界
该问题已定性为 P0 事故
```

线上部署后，对应入口会是：

```text
独立 Studio 建议使用 Sanity 托管 Studio 或单独部署，不再默认走官网内嵌 /studio
```

## 当前架构

```text
Next.js 官网前端
Sanity Studio 内容后台
Sanity Dataset 内容数据
Vercel 部署与预览
本地 TypeScript 内容作为兜底
```

Sanity 负责编辑：

```text
近期活动 event
现场记录 record
```

但在正式要求上，后台应该满足：

```text
只有管理员可进入编辑后台
管理员进入前需要密钥或等价权限校验
普通成员默认只能预览内容，不应直接进入编辑态
```

成员管理已进入 TODO，但暂不在当前版本实现。第一阶段建议仍用 Sanity 管公开成员资料，第二阶段再用 Supabase 管申请、报名、成员身份、权限和私密字段。

Supabase 暂时只作为 V2 业务数据预留。当前代码里只有加入申请的服务端适配，未配置环境变量时不会写入数据库。

## 首次启用后台

本地启动：

```bash
npm run studio
```

打开：

```text
http://localhost:3333
```

如果看到 Sanity 的连接提示页，说明 Studio 已经加载成功。还需要在 Sanity 项目里完成 CORS 设置。

### 1. 添加 CORS Origin

Sanity Manage 后台进入：

```text
API -> CORS origins -> Add origin
```

添加：

```text
Origin: http://localhost:3333
Allow credentials: enabled
```

也可以用 CLI：

```bash
npm run sanity:cors:add-local
```

这个操作会修改 Sanity 云端项目访问设置。执行前要确认这是当前项目的正确本地地址。

如果你仍然想继续调试内嵌版本，再额外添加：

```text
Origin: http://localhost:3003
Allow credentials: enabled
```

对应 CLI：

```bash
npm run sanity:cors:add-embedded-local
```

## 日常编辑流程

当前问题：

```text
活动发布和社区记录发布都偏重
上传封面、补分享记录、整理社区内容的操作仍然不够顺手
/manage 目前更像说明页，不是高频运营可用的工作台
```

```text
1. 先打开 /manage 看后台入口说明
2. 打开独立 Studio
3. 登录 Sanity
4. 进入「近期活动」或「现场记录」
5. 新建内容
6. 填写标题、slug、摘要、封面、正文和排序
7. Publish
8. 回到官网页面检查展示
```

后续重做要求：

```text
活动发布要更少字段、更短路径
社区记录 / 分享发布要支持更轻量上传
后台首页要变成真实可执行工作台，而不是文档入口页
```

内容发布后，前端会通过 Sanity 查询内容。当前页面设置了 60 秒 revalidate，本地或线上可能需要刷新一次页面。

如果 Sanity 里还没有任何已发布内容，官网会自动使用：

```text
src/content/events.ts
src/content/records.ts
```

作为兜底内容，避免页面空白。

## 新增一个活动

在 Studio 里进入：

```text
近期活动 -> Create new document
```

必填字段：

```text
活动标题
URL Slug
活动状态
时间文案
地点
活动形式
一句话简介
```

推荐填写：

```text
封面图
标签
报名 / 加入链接
适合谁参加
活动流程
主理人 / 嘉宾
详情正文
排序
```

上传说明：

```text
封面图：直接上传到「封面图」字段
活动报名外链：填写 registrationUrl
活动扫码报名：上传「报名二维码」字段
```

排序规则：

```text
数字越小越靠前。
首页近期活动会展示前 3 个未结束活动。
```

## 新增一篇现场记录

在 Studio 里进入：

```text
现场记录 -> Create new document
```

必填字段：

```text
记录标题
URL Slug
记录类型
时间文案
摘要
```

推荐填写：

```text
地点
封面图
产出标签
标签
详情正文
相关链接
排序
```

上传说明：

```text
记录封面：直接上传到「封面图」字段
相关资源：填写「相关链接」
```

## Vercel 部署环境变量

必填：

```text
NEXT_PUBLIC_SITE_URL
NEXT_PUBLIC_CONTACT_EMAIL
NEXT_PUBLIC_SANITY_PROJECT_ID
NEXT_PUBLIC_SANITY_DATASET
NEXT_PUBLIC_SANITY_API_VERSION
```

如果 Sanity dataset 是公开读取，前端不需要 token。

如果你后续把 dataset 改成私有读取，再配置：

```text
SANITY_API_READ_TOKEN
```

不要把 token 写进代码或提交到 Git。

## 线上 CORS

上线后，需要在 Sanity CORS origins 里继续添加线上域名，例如：

```text
https://ignai.community
https://你的-vercel-preview-url.vercel.app
```

每个需要打开 `/studio` 的域名，都要开启 credentials。

## 发布前检查

每次发布前跑：

```bash
npm run check
npm run build
```

浏览器检查：

```text
/
/events
/events/[slug]
/records
/records/[slug]
/join
http://localhost:3333
/sitemap.xml
/robots.txt
```

移动端重点看：

```text
首页 Hero 和活动区
活动列表卡片
活动详情 CTA
记录列表卡片
记录详情正文
加入社区入口
```

## 后续升级

建议路线：

```text
V1.1 Sanity：内容编辑、活动、记录、资源页
V1.2 Sanity：公开成员资料、首页成员预览、成员列表页
V1.3 Supabase：加入申请、报名表、成员身份和权限
V1.4 Auth：管理员权限、成员权限、私密内容
V1.5 自动化：Sanity Webhook 触发 Vercel 重建 / 通知
```

## TODO：成员管理

暂不立即开发，先进入需求池。

```text
[ ] 确认成员公开字段
[ ] 确认头像、真实姓名、城市的授权规则
[ ] 设计首页成员预览区
[ ] 设计 /members 列表页
[ ] 设计 /members/[slug] 详情页
[ ] 新增 Sanity member schema
[ ] 评估是否需要 Supabase 成员业务表
```

排期：

```text
P0 2026-05-03 - 2026-05-05：需求确认
P1 2026-05-06 - 2026-05-08：Sanity 成员后台
P2 2026-05-09 - 2026-05-12：成员展示页面
P3 2026-05-13 - 2026-05-17：按需 Supabase 业务化
```

详细评估见：

```text
doc/成员管理需求评估.md
```
