# IGNAI 官网测试与 Issues TODO

最后更新：2026-05-04

## 1. 目标

这份文档用于沉淀三类内容：

1. 官网测试集与执行顺序
2. 当前已发现的问题与证据
3. 后续修复的跟踪规则

默认原则：

- 先跑基线测试，再改代码
- 先登记 Issue，再开始修
- 每修完一个 Issue，必须有 git 存档

## 2. 当前测试结论摘要

基于 2026-05-04 本地环境的最新检查，当前状态如下：

- `npm run build`：通过
- `npm run check`：通过
- 主要页面访问：
  - `/` -> `200`
  - `/join` -> `200`
  - `/events` -> `200`
  - `/records` -> `200`
  - `/blog` -> `200`
  - `/stories` -> `200`
  - `/robots.txt` -> `200`
  - `/sitemap.xml` -> `200`
  - `/not-found-demo` -> `404`
- `POST /api/join` 必填校验：`400`
- `POST /api/join` 完整提交：`200`
- `/join` 当前表现：已切换为 Supabase 社区后台模式
- `/api/join/submissions`：可读取最新申请记录
- `/ops/join`：已上线最小运营后台，可查看申请并切换状态
- Supabase 已验证写入记录：
  - `建表后联调用户`
  - `站内API联调用户`

## 3. 测试集总表

### A. 环境与依赖测试

- [ ] A01 Node 版本与 `.nvmrc` 一致
- [ ] A02 `npm install` 无报错
- [ ] A03 `.env.local` 必填变量完整
- [ ] A04 本地 `next dev` 可启动
- [ ] A05 Sanity Studio 可启动

### B. 静态检查与构建测试

- [x] B01 `npm run build` 通过
- [x] B02 `npm run check` 通过
- [x] B03 TypeScript 无额外报错
- [ ] B04 生产构建产物无异常警告

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
- [ ] C10 页面首屏无报错、无明显布局错乱
- [ ] C11 顶部导航与页脚链接全部可点击

### D. Join 入口模式测试

- [x] D01 无 Supabase、无外部表单时存在可用入口
- [x] D02 无 Supabase 时默认进入本地 inbox 模式
- [ ] D03 配置 `NEXT_PUBLIC_JOIN_FORM_URL` 后显示外部表单入口
- [x] D04 配置 Supabase 后显示站内提交表单
- [ ] D05 三种模式切换互不冲突
- [ ] D06 Join 页文案与实际行为一致

### E. Join API 接口测试

- [x] E01 缺失 `name/contact/role` 时返回 `400`
- [x] E02 本地 inbox 模式下完整提交返回 `200`
- [x] E03 完整配置 Supabase 后返回 `200`
- [ ] E04 成功提交后页面出现成功提示
- [ ] E05 成功提交后表单自动重置
- [x] E06 `interests` 非法值会被过滤
- [ ] E07 接口异常时前端提示稳定
- [ ] E08 多次重复提交时按钮状态正确

### F. Sanity 内容链路测试

- [ ] F01 已配置 Sanity 时活动列表来自 Sanity
- [ ] F02 已配置 Sanity 时记录列表来自 Sanity
- [ ] F03 已配置 Sanity 时内容页 slug 正常打开
- [ ] F04 Sanity 无数据时自动回退到本地 fallback 内容
- [ ] F05 Sanity 读 token 缺失时不白屏

### G. 数据回退与容错测试

- [ ] G01 Supabase 缺失配置时系统能优雅降级
- [ ] G02 Sanity 异常时页面仍可渲染 fallback 内容
- [ ] G03 图片资源缺失时页面不崩溃
- [ ] G04 空内容列表时页面状态可接受
- [ ] G05 接口请求失败时用户能得到明确提示

### H. UI 与交互测试

- [ ] H01 首页主 CTA 行为正确
- [ ] H02 Join 页按钮行为与配置一致
- [ ] H03 活动卡片可跳详情页
- [ ] H04 记录卡片可跳详情页
- [ ] H05 hover / focus 状态可见
- [ ] H06 表单按钮 disabled 态正确
- [ ] H07 长文案不溢出
- [ ] H08 中文与英文混排无明显断裂

### I. 响应式测试

- [ ] I01 390px 手机宽度正常
- [ ] I02 768px 平板宽度正常
- [ ] I03 1440px 桌面宽度正常
- [ ] I04 超宽屏下首屏与 section 间距正常
- [ ] I05 Join 页表单或兜底卡片在移动端不溢出

### J. 可访问性与语义测试

- [ ] J01 页面标题与 metadata 正确
- [ ] J02 表单项有清晰 label
- [ ] J03 键盘可访问主流程
- [ ] J04 CTA 的可访问名称唯一且稳定
- [ ] J05 对比度满足基本可读性

### K. SEO 与基础运维测试

- [x] K01 `robots.txt` 可访问
- [x] K02 `sitemap.xml` 可访问
- [ ] K03 Open Graph 资源可用
- [ ] K04 canonical / site URL 配置正确
- [ ] K05 Vercel 环境变量与本地一致

### L. 回归测试

- [ ] L01 修复 Join 链路后重跑 D/E/G
- [ ] L02 修复 TypeScript 检查后重跑 B
- [ ] L03 修复可访问性问题后重跑 J
- [ ] L04 每次上线前至少重跑 B/C/D/E/F/G

## 4. 当前问题点

### P1 - 业务主链路已接到 Supabase，但运营侧流程仍未补齐

现象：

- `/join` 已展示站内申请表单
- 站内 `POST /api/join` 已写入 Supabase
- `GET /api/join/submissions` 已可读取申请列表
- 但状态流转、查看后台、归档流程还没补齐

原因定位：

- 目前只完成了最小读写打通
- 还没有运营后台视图
- 还没有状态更新接口
- 还没有归档 / 清理流程

影响：

- 申请已经能真实入库
- 但还不能顺手管理、筛选、跟进和归档

相关文件：

- `src/app/join/page.tsx`
- `src/lib/join.ts`
- `src/lib/supabase.ts`
- `src/content/links.ts`
- `.env.local`

### P2 - 运营后台与状态流转仍待接通

现象：

- 已能写入正式业务库
- 已有最小运营面板
- 已有 `status` 更新链路
- 但还没有认证保护、备注字段、批量操作和归档策略自动化

影响：

- 现在可以真实收集申请
- 但后续跟进还不够顺滑

下一步：

- 增加内部访问保护
- 增加运营备注 / 跟进记录
- 增加筛选与归档动作
- 再考虑成员系统联动

### P3 - 首页 CTA 可访问名称重复

现象：

- 首页存在不止一个“加入社区”链接
- 自动化测试使用纯文本定位时出现歧义

影响：

- 浏览器自动化测试稳定性下降
- 可访问性与可测试性都受影响

建议方向：

- 检查是否需要区分按钮文案
- 或为主要 CTA 增加更稳定的 `data-testid`

相关区域：

- 首页 Hero CTA
- 其他 section 内的加入入口

### P3 - 全量测试还没有形成自动化脚本

现象：

- 当前测试主要依赖手工 smoke test
- 还没有统一的 `test:smoke` / `test:e2e` 脚本

影响：

- 回归成本高
- 每次修复都要重新手工确认

### P0 - `npm run check` 当前已恢复

现象：

- `npm run check` 报 `.next/types/cache-life.d.ts` not found

原因定位：

- `tsconfig.json` 直接 include 了 `.next/types/**/*.ts`
- 当前 Next 产物与检查脚本对这批类型文件的依赖关系不稳定

影响：

- 代码库当前不满足“完整静态检查通过”的交付门槛
- 后续 CI 接入时会卡住

相关文件：

- `tsconfig.json`
- `package.json`

## 5. 当前 Issues 列表

建议从现在开始按下面格式维护：

| Issue ID | 标题 | 优先级 | 状态 | 说明 |
| --- | --- | --- | --- | --- |
| IGNAI-001 | Join 链路体验断裂 | P0 | Resolved | 站内申请已接入 Supabase，主链路完成读写打通 |
| IGNAI-002 | `npm run check` 失败 | P1 | Resolved | 已拆出 `tsconfig.typecheck.json`，`npm run check` 恢复通过 |
| IGNAI-003 | 首页“加入社区”CTA 可访问名称重复 | P2 | Open | 自动化定位歧义 |
| IGNAI-004 | 缺少统一 smoke/e2e 自动化测试脚本 | P2 | Open | 当前回归依赖手工测试 |
| IGNAI-005 | Join 运营后台与状态流转未完成 | P1 | In Progress | 已有最小运营后台，下一步补访问保护和运营细节 |

## 6. 修复顺序建议

1. 先继续处理 `IGNAI-005`，补访问保护、备注、归档细节
2. 然后处理 `IGNAI-003`，提升可测试性与可访问性
3. 最后处理 `IGNAI-004`，补自动化测试与回归脚本

## 7. 每轮测试执行建议

每次开始一轮修复前：

1. 先更新本文件中的 Issue 状态
2. 跑一轮最小基线：
   - `npm run build`
   - `npm run check`
   - 主要页面访问
   - `POST /api/join` 两组接口用例
3. 开始修一个明确的 Issue

每次修完一个 Issue 后：

1. 重跑与该 Issue 相关的测试集
2. 把结果写回本文件
3. 完成一次 git 存档
4. 在提交信息里带上 Issue ID

## 8. git 存档规则

最低要求：

- 一个 Issue 至少对应一个 git commit
- commit message 必须带 Issue ID

推荐格式：

- `fix(IGNAI-001): connect join flow to supabase`
- `fix(IGNAI-002): stabilize npm run check`
- `test(IGNAI-004): add smoke test script`
- `docs(IGNAI-003): record CTA accessibility collision`

如果一个 Issue 较大，可以拆多个 commit，但都要带同一个 Issue ID。

## 9. 后续补充项

- [ ] 增加 `test:smoke` 脚本
- [ ] 增加 `test:e2e` 脚本
- [ ] 增加 Join API 自动化测试
- [ ] 增加 `/join` 页面三模式测试
- [ ] 增加 Sanity fallback 自动化测试
- [ ] 增加移动端截图回归测试
