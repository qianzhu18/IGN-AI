# 为什么 IGNAI 要从 NotionNext + Notion 迁移到 Payload

更新日期：2026-07-30
状态：当前技术决策说明

## 结论

这不是因为 NotionNext 或 Notion “不好”，而是因为 IGNAI 已经不是个人博客的复杂度。它需要结构化关系、受控发布、媒体治理、可编程前台、运营表单、预览、AI 辅助和可自托管部署；继续在 Notion 字段、`ext` JSON、前端 fallback 和缓存规则上追加适配，边际成本已经高于迁移。

目标是一个 Next.js + Payload + PostgreSQL + 对象存储的统一应用：后台、前台、预览、权限和 API 共用同一份内容模型。

## 技术理由

### 1. 内容模型已超过 Notion 映射层的承载边界

IGNAI 需要 Member、Event、Record、Post、Page、Join Submission、Media、Redirect 和 Site Settings，并且它们有真实关系：作者、参与者、组织者、活动记录、媒体引用和审核人。

在 NotionNext 中，这些关系需要依靠 `type`、`status`、slug、`ext` JSON 和多个页面各自的 fallback 解释。字段一旦扩展，查询、校验、页面渲染和缓存逻辑会同时变复杂。Payload 将其变成 PostgreSQL relationship、字段校验和 access control。

### 2. 运营写入需要真正的权限和状态机

Notion 适合协作笔记，但官网运营需要区分管理员、编辑者、AI 服务账号、匿名表单提交者，并约束谁能编辑、发布、删除、查看内部备注。

Payload 已有角色、字段级权限、草稿/发布、版本、删除保护和受认证预览。AI 服务账号被强制保存为草稿，不能绕过编辑审核直接发布。

### 3. 前端创作不应受模板和 Notion block 限制

Hubtown 级交互页面需要自定义 React/Three/Canvas/视频/滚动场景。它们应由代码控制视觉、性能、降级和可访问性；后台只提供真实内容、资源、排序和少量场景参数。

Payload 的 Local API 允许 Next Server Components 直接读取同一进程的内容类型。前端不是把 Notion 页面“翻译”成 UI，而是消费稳定的领域数据模型。

### 4. 编辑、预览和发布必须可预测

旧链路包含 Notion 拉取、构建缓存、ISR、前端映射和外部临时媒体 URL，急改时很难判断何时生效。

新应用的 Payload 保存直接落 PostgreSQL；当前首页和活动页采用动态读取，发布后刷新即读取新内容。草稿可通过认证 Preview / Live Preview 查看。未来即使加 CDN/ISR，也以精确 revalidate 替代固定等待时间。

### 5. 媒体和部署必须可迁移

Notion 临时 URL、R2、本地图片和外部图源混用会导致失效、破图和归属不清。Payload Media + S3 兼容对象存储把媒体记录、alt、缩略图、引用关系和 object key 统一起来。

Next.js + Payload 可以作为一个 Docker 服务部署到腾讯云；PostgreSQL、对象存储、邮件与 CDN 是可替换基础设施。这样迁移到国内服务器是部署配置问题，而不是重写前端或后台的问题。

## 不迁移会怎样

- 每增加一种内容或关系，都继续扩张 Notion 字段映射和前端条件分支。
- 页面可能依赖构建时 Notion 拉取和临时媒体 URL，内容改动与前台生效时间不可预测。
- 后台权限、表单审核、AI 草稿、版本和预览只能分散在多套工具里补丁式实现。
- 高级前端交互仍需绕开主题和 Notion block 的约束，最终形成更难维护的双系统。

## 迁移的边界

迁移不意味着否定已有工作：NotionNext 旧站保留为生产回退，历史内容通过 M2 导入，已验证的品牌、活动素材、路由和产品事实进入新应用。新架构只接管未来的生产内容与前台，不做长期双向同步。

详细阶段门见 [`payload-unified-migration-plan.zh-CN.md`](payload-unified-migration-plan.zh-CN.md)。
