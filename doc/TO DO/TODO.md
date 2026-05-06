# IGNAI 官网测试 TODO

最后更新：2026-05-06

## 1. 目标

这份文档只负责两类内容：

1. 测试集与执行顺序
2. 每轮测试的实际结果与后续待办

Issue 台账已单独拆到：

- [doc/ISSUES/ISSUES.md](/Users/mac/qianzhu%20Vault/project/IGN%20AI%20官网/doc/ISSUES/ISSUES.md)

## 2. 本轮总评

用户最新测试反馈：

- `/join` 当前“填写一堆表单再提交”的路径太重
- 当前 MVP 更适合改成“直接扫码添加社区管理者”
- 二维码图片要融进当前页面氛围，同时保证可正常扫码
- 表单链路与后台申请池先保留为后续版本能力，不再作为当前主入口
- 活动报名后续会改为“每个活动单独挂飞书多维表格 / 报名二维码”
- 当前用户无法感知活动与记录的编辑入口，需要把内容后台入口显性展示出来
- 后台功能需要统一面板，不能散落在多个页面里靠记忆进入
- 成员管理需要作为后续社区核心功能，至少包含头像、简介、自介、成员资料编辑
- 当前后台编辑框架属于 `P0 事故`：权限边界不成立，编辑体验也不成立
- 后台编辑必须只有管理员持密钥可进入，其他成员默认仅预览
- 发布活动、发布社区记录、上传分享记录的流程当前过重，需要重做

基于 2026-05-05 的完整测试，当前项目状态如下：

- `npm install`：通过
- `npm run build`：通过
- `npm run check`：通过
- `Sanity Studio`：可启动，`http://127.0.0.1:3333/`
- 主要页面访问：通过
- `Join` 后端数据链路：通过
- `Join` 前端用户体验链路：通过
- `Ops` 后台安全链路：通过（已接最小密码保护）
- `Blog / Stories` 内容详情链路：通过
- `Smoke` 自动化链路：通过（干净 dev 环境）

当前结论：

```text
后端数据链路基本打通
Join 主链路已可用
Ops 最小安全链路已可用
内容详情链路已可用
但后台编辑框架不应视为完成
当前不适合将“内容后台可用”作为对外结论
```

## 3. 本轮执行记录

### 3.1 已执行命令与检查

- `cat .nvmrc` -> `22`
- `node -v` -> `v22.16.0`
- `npm install` -> 通过
- `npm run build` -> 通过
- `npm run check` -> 通过
- `npm run studio -- --host 127.0.0.1` -> 通过
- 路由检查：`/ /join /events /records /blog /stories /robots.txt /sitemap.xml /not-found-demo`
- Join API 检查：
  - 必填缺失返回 `400`
  - 完整提交返回 `200`
  - `interests` 非法值被过滤
- Join 模式检查：
  - 数据库模式
  - 本地 inbox 模式
  - 外部表单模式
  - Supabase + 外部表单优先级模式
- 浏览器测试：
  - 桌面端页面访问
  - `/join` 真实提交
  - `/ops/join` 查看与改状态
  - 导航与卡片跳转
  - `390 / 768 / 1440` 响应式抽测
  - metadata / OG / canonical 抽测

### 3.2 关键发现

- `/join` 成功态与 reset 问题已修复
- `/ops/join`、`GET /api/join/submissions`、`PATCH /api/join/submissions/:id` 已补最小密码保护
- `/events/[slug]` 与 `/records/[slug]` 可正常打开
- `/blog/[slug]` 与 `/stories/[slug]` 已补齐详情页链路
- Sanity 请求异常时页面仍可返回 fallback 内容
- `test:smoke` 已补齐并在 `http://localhost:4033` 全量跑通
- 未授权访问 `GET/PATCH /api/join/submissions*` 返回 `401`
- 用户真实体验反馈显示：`Join` 表单入口过重，需要改成更直接的扫码联系路径
- 活动报名更适合按活动维度配置外部表单，而不是统一走 `/join`
- `Studio` 虽已存在，但前台没有明确暴露活动与记录的编辑入口
- 后台入口需要统一说明页，降低“功能在但找不到”的使用成本
- 成员管理还未建设，但应作为社区中后台的核心模块提前排期
- 当前后台编辑的权限模型和发布工作流都未达标，应定性为 `P0 事故`

## 4. 测试集总表

说明：

- `[x]` = 通过
- `[ ]` = 未通过 / 未完成
- `[-]` = 本轮不具备稳定验证条件，暂记待补

### A. 环境与依赖测试

- [x] A01 Node 版本与 `.nvmrc` 一致
- [x] A02 `npm install` 无报错
- [x] A03 `.env.local` 必填变量完整
- [x] A04 本地 `next dev` 可启动
- [x] A05 Sanity Studio 可启动

### B. 静态检查与构建测试

- [x] B01 `npm run build` 通过
- [x] B02 `npm run check` 通过
- [x] B03 TypeScript 无额外报错
- [ ] B04 生产构建产物无异常警告

备注：

- 多实例并行 `next dev` 会污染 `.next`，本轮曾出现 chunk/cache 异常

### C. 路由与页面可达性测试

- [x] C01 首页 `/` 返回 `200`
- [x] C02 `join` 页 `/join` 返回 `200`
- [x] C03 活动页 `/events` 返回 `200`
- [x] C04 记录页 `/records` 返回 `200`
- [x] C05 博客页 `/blog` 返回 `200`
- [x] C06 故事页 `/stories` 返回 `200`
- [x] C07 `robots.txt` 返回 `200`
- [x] C08 `sitemap.xml` 返回 `200`
- [x] C09 未知路由返回 `404`
- [x] C10 页面首屏无明显布局错乱
- [x] C11 顶部导航与页脚链接全部可点击

备注：

- 页脚链接可用
- 顶部导航在自动化与可访问命名上存在重复与歧义，需继续整理

### D. Join 入口模式测试

- [x] D01 无 Supabase、无外部表单时存在可用入口
- [x] D02 无 Supabase 时默认进入本地 inbox 模式
- [x] D03 配置 `NEXT_PUBLIC_JOIN_FORM_URL` 后显示外部表单入口
- [x] D04 配置 Supabase 后显示站内提交表单
- [x] D05 三种模式切换互不冲突
- [x] D06 Join 页文案与实际行为一致
- [x] D07 当前主入口已切为二维码直连社区管理者

备注：

- 当前数据库模式、本地 inbox 模式、外部表单模式底层能力仍在
- 当前前台主入口已切换为“扫码直连”

### E. Join API 接口测试

- [x] E01 缺失 `name/contact/role` 时返回 `400`
- [x] E02 本地 inbox 模式下完整提交返回 `200`
- [x] E03 完整配置 Supabase 后返回 `200`
- [x] E04 成功提交后页面出现成功提示
- [x] E05 成功提交后表单自动重置
- [x] E06 `interests` 非法值会被过滤
- [ ] E07 接口异常时前端提示稳定
- [ ] E08 多次重复提交时按钮状态正确

### F. Sanity 内容链路测试

- [-] F01 已配置 Sanity 时活动列表来自 Sanity
- [-] F02 已配置 Sanity 时记录列表来自 Sanity
- [x] F03 现有详情页 slug 正常打开
- [x] F04 Sanity 无数据或异常时自动回退到本地 fallback 内容
- [x] F05 Sanity 读 token 缺失时不白屏
- [x] F06 `events / records` 页面已显性展示内容后台入口
- [x] F07 已新增统一后台说明页 `/manage`

备注：

- `events` / `records` 详情页可用
- `blog` / `stories` 详情页现已可用

### G. 数据回退与容错测试

- [x] G01 Supabase 缺失配置时系统能优雅降级
- [x] G02 Sanity 异常时页面仍可渲染 fallback 内容
- [ ] G03 图片资源缺失时页面不崩溃
- [x] G04 空内容列表时页面状态可接受
- [x] G05 受保护接口在未授权时返回明确提示

### H. UI 与交互测试

- [x] H01 首页主 CTA 行为正确
- [x] H02 Join 页按钮行为与配置一致
- [x] H03 活动卡片可跳详情页
- [x] H04 记录卡片可跳详情页
- [ ] H05 hover / focus 状态可见
- [ ] H06 表单按钮 disabled 态正确
- [x] H07 长文案不溢出
- [x] H08 中文与英文混排无明显断裂
- [x] H09 Join 页二维码主视觉不破坏整体氛围

### I. 响应式测试

- [x] I01 390px 手机宽度正常
- [x] I02 768px 平板宽度正常
- [x] I03 1440px 桌面宽度正常
- [ ] I04 超宽屏下首屏与 section 间距正常
- [x] I05 Join 页表单或兜底卡片在移动端不溢出

### J. 可访问性与语义测试

- [x] J01 页面标题与 metadata 正确
- [x] J02 表单项有清晰 label
- [ ] J03 键盘可访问主流程
- [x] J04 CTA 的可访问名称唯一且稳定
- [ ] J05 对比度满足基本可读性

### K. SEO 与基础运维测试

- [x] K01 `robots.txt` 可访问
- [x] K02 `sitemap.xml` 可访问
- [x] K03 Open Graph 资源可用
- [x] K04 canonical 已输出，site URL 本地验证正常
- [ ] K05 Vercel 环境变量与本地一致

备注：

- `og:image` 可访问
- `siteUrl` 强依赖环境变量，需统一部署配置

### L. 回归测试

- [x] L01 修复 Join 链路后重跑 D/E/G
- [x] L02 修复 TypeScript 检查后重跑 B
- [ ] L03 修复可访问性问题后重跑 J
- [ ] L04 每次上线前至少重跑 B/C/D/E/F/G

## 5. 当前未通过项

### 5.1 Blockers

1. 线上 `NEXT_PUBLIC_SITE_URL` 仍需同步
2. 后台编辑权限与工作流设计未达标，已定性为 `P0 事故`

### 5.2 次级问题

1. 仍缺少更完整的 `test:e2e`
2. 多实例 `next dev` 仍会污染 `.next`

## 6. 下一步待办

### P0

- [x] 修复 `/join` 成功后误报失败
- [x] 修复 `/join` 成功后表单 reset 失效
- [x] 给 `/ops/join` 与 submissions API 加访问保护
- [ ] 将“后台编辑框架设计失误”列为 `P0 事故`
- [ ] 后台编辑只允许管理员持密钥进入
- [ ] 普通成员只保留预览权限，不直接暴露编辑入口
- [ ] 重做活动发布工作流，降低字段负担与入口复杂度
- [ ] 重做社区记录 / 分享发布工作流，提升上传效率
- [ ] 把 `/manage` 从说明页升级为真实后台工作台

### P1

- [x] 补齐 `blog / stories` 真实详情链路
- [x] 增加 `canonical`
- [ ] 统一 `NEXT_PUBLIC_SITE_URL` / 线上环境变量
- [x] 整理首页 CTA 与导航命名，降低可访问性歧义
- [x] 增加 `test:smoke`
- [x] 将 `/join` 主入口从重表单切换为二维码直连社区管理者
- [x] 为活动补充“外部报名链接 / 报名二维码”配置能力
- [x] 在 `events / records` 页面显性展示 `/studio` 编辑入口
- [x] 新增统一后台面板 `/manage`
- [ ] 设计并实现成员管理模块（成员头像上传 / 简介 / 自介 / 成员资料编辑）

### P2

- [ ] 增加 `test:e2e`
- [ ] 增加 Join API 自动化测试
- [ ] 增加 Join 三模式自动化测试
- [ ] 增加 Sanity fallback 自动化测试

## 7. 文档维护规则

后续同步方式：

- `doc/TO DO/TODO.md`：维护测试集、执行记录、待办
- `doc/ISSUES/ISSUES.md`：维护 issue 列表、优先级、状态、证据

不要再把测试记录和 issue 台账混写在同一份文档里。

## 8. 当前进行中

本轮已完成：

1. `IGNAI-001` Join 成功提交后误报失败
2. `IGNAI-002` Join 成功后表单未重置
3. `IGNAI-003` Join Ops 与 submissions API 无鉴权
4. `IGNAI-004` Blog / Stories 内容详情链路未闭环

对应回归测试：

- `D06`
- `E04`
- `E05`
- `G05`
- `H02`
- `K04`
- `L01`

## 9. 建议实验路径

推荐你手动走一遍下面这条 MVP 实验链路：

1. 首页浏览：
   - 看首页品牌表达
   - 点 `Events / Records / Journal / Join`
2. 内容链路：
   - 进入 `/blog`
   - 点一篇文章进入 `/blog/[slug]`
   - 进入 `/stories`
   - 点一个故事进入 `/stories/[slug]`
3. 活动与记录链路：
   - 进入 `/events`
   - 点一个活动进入详情
   - 进入 `/records`
   - 点一个记录进入详情
4. Join 链路：
   - 打开 `/join`
   - 直接扫码添加社区管理者
   - 验证二维码在桌面端与移动端都可识别
5. Ops 链路：
   - 打开 `/ops/join`
   - 输入运营访问密码
   - 确认能看到刚提交的申请
   - 修改状态验证状态流转

本轮干净联调地址：

```text
http://localhost:4033
```

本轮用于联调的开发密码：

```text
test-ops-pass
```

上线前必须换成你自己的正式密码。

## 10. 数据管理说明

当前这套 MVP 建议按两条线管理数据：

1. 内容数据：
   - 存储位置：`Sanity`
   - 编辑入口：`/studio`
   - 管理对象：`events / records / blog / stories`
   - 代码读取层：`src/lib/sanity.ts`
2. 运营数据：
   - 存储位置：`Supabase` 的 `join_applications`
   - 编辑入口：`/ops/join`
   - 管理对象：报名申请、状态流转、跟进记录的最小版本
   - 代码读取与写入层：
     - [src/lib/supabase.ts](/Users/mac/qianzhu%20Vault/project/IGN%20AI%20官网/src/lib/supabase.ts:1)
     - [src/components/admin/JoinSubmissionsPanel.tsx](/Users/mac/qianzhu%20Vault/project/IGN%20AI%20官网/src/components/admin/JoinSubmissionsPanel.tsx:1)

你现在可以这样理解：

- 想改官网内容，用 `Sanity Studio`
- 想处理历史申请数据，用 `Ops Join`
- 想看前台是否兜底正常，看各内容页的 fallback 展示
- 想验证数据是否真的进库，看 `Supabase join_applications`
- 想让新用户最快加入，现在直接走 `/join` 扫码联系
- 想统一进入后台入口，现在直接走 `/manage`
- 想真正完成后台治理，当前方案还不够，需回到 `P0` 级别重做

## 11. 后续核心模块

### 成员管理

这部分已列为后续社区后台核心能力，目标包含：

- 成员头像上传
- 成员简介 / 自介编辑
- 成员身份标签
- 成员项目与作品链接
- 成员状态管理
- 成员展示页与后台编辑入口

执行建议：

- 第一阶段：先用 `Sanity Studio` 做公开成员资料后台
- 第二阶段：补 `members` 展示页、成员详情页、首页成员预览
- 第三阶段：再接 `Supabase` 做成员身份、权限与私密信息

## 12. P0 事故说明

本轮新增一条必须明确记录的事故判断：

```text
当前后台编辑框架不是“还可以继续打磨的小问题”
而是 P0 级设计失误
```

原因：

- 后台编辑入口没有完成管理员专属的密钥约束
- 普通成员与管理员的权限边界没有产品化
- 发布活动、发布社区记录、上传内容的流程过重
- 当前方案不适合支撑真实社区的高频内容运营

后续对外口径：

- 可以说前台内容链路已基本打通
- 不可以说后台管理已经完成
