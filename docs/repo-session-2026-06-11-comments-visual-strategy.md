# 2026-06-11 评论与高级视觉策略记录

## 背景

本轮来自线上产品检查后的继续讨论：

- 需要把上线前 QA 问题列入 TODO。
- 有评论插件相关 PR / 配置线索，NotionNext 文档中已有评论插件说明。
- 官网不应只是内容站，核心理由是证明真实开源经历和真实社区经历。
- 现有 IGNAI 网站已经不错，但可以更有趣、更有门面，进一步参考 3D / WebGL / 视频 / 高级动效网站。

## 本轮完成

1. 更新 `doc/roadmap/master-todo.md`
   - 收录线上 QA 阻断项：正式域名、模板文章污染、运行时配置、OPS 密码、活动破图、hydration、安全头等。
   - 新增评论 / 讨论入口策略。
   - 新增“官号内容 vs 官网内容”分工。
   - 新增高级视觉门面、社区证明链路、活动素材沉淀任务。

2. 更新 `doc/roadmap/schedule.md`
   - 加入近 2 周高级视觉调研、评论入口决策、官网定位校准。
   - 加入近 4 周视觉门面原型和社区证明链路任务。

3. 新增 `doc/design/ignai-visual-reference-research-2026-06-11.md`
   - 调研 Sahara AI、Spline、Runway、AI Engineer、Wispr Flow、Noomo Storytelling。
   - 形成 4 个可执行视觉方向：
     - Community Constellation
     - Ignition Core
     - Proof Timeline
     - Event Media Wall

4. 生成参考截图与扫描数据
   - `doc/design/research-assets/ignai-visual-refs-2026-06-11/`

## 评论插件判断

代码已有评论能力入口：

- `conf/comment.config.js` 支持 Giscus / Waline / Twikoo / Cusdis / Utterances 等。
- `themes/ignai/index.js` 文章详情已经接入 `<Comment frontMatter={post} />`。

短期建议：

- 如果要贴合开源经历证明，优先 Giscus。
- 如果要降低非开发者评论门槛，再考虑 Waline。
- 不建议一开始全站开放评论。优先文章详情、社区记录详情、活动详情 / 活动复盘。

## 产品判断

官网的核心价值不是替代公众号发内容，而是把分散的开源、社区、活动、成员、作品、官号文章变成可公开验证的证据链。

下一步视觉升级也应服务这个目标：更有门面、更有现场感，但不要变成只有特效的普通炫酷网页。

## 剩余工作

- 配置 Giscus 或 Waline 所需生产环境变量。
- 决定评论开放页面范围。
- 清理上线阻断项后，做一个轻量 3D / 视频 Hero 原型。
- 为活动和记录页设计照片、作品、视频、评论精选的 Notion 字段与前台展示。
