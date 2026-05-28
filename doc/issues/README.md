# IGNAI Issues

最后更新：2026-05-06

## 1. 使用说明

这份文档只负责维护 issue 台账：

- `Issue ID`
- 标题
- 优先级
- 状态
- 复现方式
- 影响范围
- 相关文件

测试执行记录请看：

- [doc/TO DO/TODO.md](/Users/mac/qianzhu%20Vault/project/IGN%20AI%20官网/doc/TO%20DO/TODO.md)

## 2. 当前总览

| Issue ID | 标题 | 优先级 | 状态 | 说明 |
| --- | --- | --- | --- | --- |
| IGNAI-001 | Join 成功提交后误报失败 | P0 | Resolved | 已修复表单成功态，浏览器实测成功提示与接口结果一致 |
| IGNAI-002 | Join 成功后表单未重置 | P0 | Resolved | 已修复表单 reset，浏览器实测提交后字段清空 |
| IGNAI-003 | Join Ops 与 submissions API 无鉴权 | P0 | Resolved | 已增加基于 `OPS_ACCESS_PASSWORD` 的最小访问保护 |
| IGNAI-004 | Blog / Stories 内容详情链路未闭环 | P1 | Resolved | 已补 blog/stories 详情页，列表可进入详情 |
| IGNAI-005 | canonical 与 site URL 配置不完整 | P1 | In Progress | 已补 canonical 与默认域名，仍需同步线上环境变量 |
| IGNAI-006 | 首页 CTA 与导航命名重复 | P2 | Resolved | 已补首页首屏、Join 区域、顶部导航、页脚导航的区分命名 |
| IGNAI-007 | 缺少统一 smoke/e2e 自动化测试脚本 | P2 | Resolved | 已补 `test:smoke`，可覆盖首页、内容详情、Join、Ops 链路 |
| IGNAI-008 | 多实例 dev 容易污染 `.next` 缓存 | P2 | Open | 并行开发服务时曾出现 chunk/cache 异常 |
| IGNAI-009 | 后台编辑框架设计失误，权限与编辑体验均未达标 | P0 | Open | 当前内容后台未实现管理员密钥门、成员仅预览边界，活动与社区记录发布体验也过重，定性为 P0 事故 |

## 3. 详细问题

### IGNAI-001 - Join 成功提交后误报失败

- 优先级：`P0`
- 状态：`Resolved`

复现：

1. 打开 `/join`
2. 填写完整表单并提交
3. 观察网络请求与页面提示

现象：

- `POST /api/join` 返回 `200`
- 响应体为 `{"message":"已收到申请，我们会尽快联系你。"}`
- Supabase 中可看到新记录
- 页面最终提示：`网络异常，请稍后再试或通过 Email 联系。`

影响：

- 真实用户会误以为提交失败
- 容易重复提交或直接流失

相关文件：

- [src/components/forms/JoinApplicationForm.tsx](/Users/mac/qianzhu%20Vault/project/IGN%20AI%20官网/src/components/forms/JoinApplicationForm.tsx:134)

修复结果：

- 提交成功后前端显示成功提示
- 不再落入错误提示分支
- 浏览器回归已通过

### IGNAI-002 - Join 成功后表单未重置

- 优先级：`P0`
- 状态：`Resolved`

复现：

1. 打开 `/join`
2. 提交成功请求
3. 观察输入框值

现象：

- 表单字段仍保留原值
- interest 状态也未回到预期初始值

影响：

- 用户体验不完整
- 与“已提交成功”的交互预期冲突

相关文件：

- [src/components/forms/JoinApplicationForm.tsx](/Users/mac/qianzhu%20Vault/project/IGN%20AI%20官网/src/components/forms/JoinApplicationForm.tsx:161)

修复结果：

- 成功提交后输入框与 textarea 已清空
- `interests` 已回到默认值
- 浏览器回归已通过

### IGNAI-003 - Join Ops 与 submissions API 无鉴权

- 优先级：`P0`
- 状态：`Resolved`

复现：

1. 未登录状态打开 `/ops/join`
2. 直接请求 `GET /api/join/submissions`
3. 直接请求 `PATCH /api/join/submissions/:id`

现象：

- 可匿名读取申请列表
- 可匿名修改申请状态

影响：

- 暴露姓名、联系方式、状态等敏感数据
- 存在未授权写操作风险

相关文件：

- [src/app/ops/join/page.tsx](/Users/mac/qianzhu%20Vault/project/IGN%20AI%20官网/src/app/ops/join/page.tsx:1)
- [src/app/api/join/submissions/route.ts](/Users/mac/qianzhu%20Vault/project/IGN%20AI%20官网/src/app/api/join/submissions/route.ts:1)
- [src/app/api/join/submissions/[id]/route.ts](/Users/mac/qianzhu%20Vault/project/IGN%20AI%20官网/src/app/api/join/submissions/%5Bid%5D/route.ts:1)

修复结果：

- 新增 `OPS_ACCESS_PASSWORD` 访问保护
- `/ops/join` 未授权时显示登录门
- 匿名访问 `GET/PATCH /api/join/submissions*` 返回 `401`

### IGNAI-004 - Blog / Stories 内容详情链路未闭环

- 优先级：`P1`
- 状态：`Resolved`

现象：

- `/blog`、`/stories` 页面可访问
- 内容卡片仍指向列表页自身
- 不存在真实文章 / 成员故事详情链路

影响：

- 内容链路无法完成“列表 -> 详情 -> 分享”
- 还不能算完整社区内容系统

相关文件：

- [src/lib/sanity.ts](/Users/mac/qianzhu%20Vault/project/IGN%20AI%20官网/src/lib/sanity.ts:24)
- [src/components/ui/ContentCard.tsx](/Users/mac/qianzhu%20Vault/project/IGN%20AI%20官网/src/components/ui/ContentCard.tsx:48)

修复结果：

- 已新增 `/blog/[slug]`
- 已新增 `/stories/[slug]`
- fallback 内容现在可从列表进入详情
- 构建与浏览器链路回归已通过

### IGNAI-005 - canonical 与 site URL 配置不完整

- 优先级：`P1`
- 状态：`In Progress`

现象：

- `canonical` 当前缺失
- Open Graph URL 和图片 URL 依赖 `NEXT_PUBLIC_SITE_URL`
- 本地/预览环境若配置不一致，输出会偏掉

影响：

- SEO 与分享信号不稳定

相关文件：

- [src/app/layout.tsx](/Users/mac/qianzhu%20Vault/project/IGN%20AI%20官网/src/app/layout.tsx:20)
- [src/content/links.ts](/Users/mac/qianzhu%20Vault/project/IGN%20AI%20官网/src/content/links.ts:1)

当前进展：

- 已补 `canonical`
- 已把默认 `siteUrl` 回到 `https://ignai.community`
- 仍需在线上平台同步 `NEXT_PUBLIC_SITE_URL`

### IGNAI-006 - 首页 CTA 与导航命名重复

- 优先级：`P2`
- 状态：`Resolved`

现象：

- 首页存在多个“加入社区”入口
- 顶部导航与页脚也有多组同名 link

影响：

- 自动化 strict mode 容易冲突
- 键盘与辅助技术定位不稳定

相关文件：

- [src/components/layout/SiteHeader.tsx](/Users/mac/qianzhu%20Vault/project/IGN%20AI%20官网/src/components/layout/SiteHeader.tsx:1)
- [src/components/sections/HeroSection.tsx](/Users/mac/qianzhu%20Vault/project/IGN%20AI%20官网/src/components/sections/HeroSection.tsx:1)
- [src/components/sections/JoinSection.tsx](/Users/mac/qianzhu%20Vault/project/IGN%20AI%20官网/src/components/sections/JoinSection.tsx:1)
- [src/components/sections/Footer.tsx](/Users/mac/qianzhu%20Vault/project/IGN%20AI%20官网/src/components/sections/Footer.tsx:1)

修复结果：

- 首页首屏导航已补 `aria-label`
- 首页两处 Join CTA 已补唯一命名与 `testid`
- 顶部导航与页脚导航已补区分命名
- 自动化定位歧义显著降低

### IGNAI-007 - 缺少统一 smoke/e2e 自动化测试脚本

- 优先级：`P2`
- 状态：`Resolved`

现象：

- 目前回归主要依赖手工命令与临时脚本
- 仓库里还没有统一 `test:smoke` / `test:e2e`

影响：

- 回归成本高
- 容易漏测

相关文件：

- [scripts/smoke-test.mjs](/Users/mac/qianzhu%20Vault/project/IGN%20AI%20官网/scripts/smoke-test.mjs:1)
- [package.json](/Users/mac/qianzhu%20Vault/project/IGN%20AI%20官网/package.json:1)

修复结果：

- 已新增 `npm run test:smoke`
- 已覆盖首页、blog 详情、stories 详情、join 提交、ops gate、ops login
- 2026-05-05 在 `http://localhost:4033` 干净 dev 环境下实测通过

### IGNAI-009 - 后台编辑框架设计失误，权限与编辑体验均未达标

- 优先级：`P0`
- 状态：`Open`
- 定性：`P0 事故`

复现：

1. 打开 `/manage`
2. 继续进入 `/studio` 或独立 `Sanity Studio`
3. 观察后台入口权限边界与实际编辑流程
4. 尝试新增活动或发布一条社区记录

现象：

- 内容后台当前没有完成“只有管理员持密钥才可进入”的正式约束
- 普通成员与管理员之间没有形成清晰的“预览 / 编辑”权限边界
- 发布活动与发布社区记录的流程偏重，字段组织和入口组织都不够顺手
- 上传封面、上传分享记录、补社区内容的操作成本偏高
- `/manage` 目前更像说明页，不是可直接承担高频运营动作的后台工作台

影响：

- 后台权限边界不足，存在误开、误入、误操作风险
- 社区日常发布效率低，活动与内容更新成本偏高
- “成员只预览、管理员才编辑”的治理规则没有被产品化
- 说明当前后台框架设计在 P0 层面判断失误，不能按“已具备可用后台”口径继续描述

目标修正：

- 后台编辑必须走管理员入口，并带明确密钥 / 权限校验
- 普通成员默认只看预览页，不应直接拥有编辑入口
- 活动发布、社区记录发布、图片上传、分享沉淀都要收敛到低摩擦流程
- 后台面板需要从“说明页”升级为“可执行工作台”

相关文件：

- [src/app/manage/page.tsx](/Users/mac/qianzhu%20Vault/project/IGN%20AI%20官网/src/app/manage/page.tsx:1)
- [src/app/studio/[[...tool]]/page.tsx](/Users/mac/qianzhu%20Vault/project/IGN%20AI%20官网/src/app/studio/%5B%5B...tool%5D%5D/page.tsx:1)
- [src/components/content/ContentAdminPanel.tsx](/Users/mac/qianzhu%20Vault/project/IGN%20AI%20官网/src/components/content/ContentAdminPanel.tsx:1)
- [doc/内容编辑上线流程.md](/Users/mac/qianzhu%20Vault/project/IGN%20AI%20官网/doc/%E5%86%85%E5%AE%B9%E7%BC%96%E8%BE%91%E4%B8%8A%E7%BA%BF%E6%B5%81%E7%A8%8B.md:1)

处理要求：

- 立即停止把当前方案描述为“后台已完成”
- 先补后台权限模型与入口治理
- 再重做活动 / 社区记录的发布工作流

### IGNAI-008 - 多实例 dev 容易污染 `.next` 缓存

- 优先级：`P2`
- 状态：`Open`

现象：

- 同时启动多份 `next dev` / `next start` 验证不同模式时
- 曾出现 chunk 丢失、静态资源 `400`、webpack cache rename 异常

影响：

- 测试结果容易混入环境噪声
- 不适合直接拿脏环境做验收结论

## 4. 修复顺序建议

1. `IGNAI-001`
2. `IGNAI-002`
3. `IGNAI-003`
4. `IGNAI-004`
5. `IGNAI-005`
6. `IGNAI-006`
7. `IGNAI-007`
8. `IGNAI-008`

## 5. 更新规则

每次开始修一个问题前：

1. 把对应 issue 状态改为 `In Progress`
2. 在 `doc/TO DO/TODO.md` 标记要重跑的测试集

每次修完后：

1. 回填测试结果
2. 更新 issue 状态为 `Resolved` 或保留 `Open`
3. 再做 git 存档
