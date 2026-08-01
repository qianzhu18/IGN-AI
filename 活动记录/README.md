# IGNAI 活动记录素材索引

这个文件夹用于保存官网活动与记录页的原始素材和迁移依据。原始图片保存在 `assets/original/`，官网可直接引用的压缩封面保存在 `public/images/activity-records/`。

> 2026-08-02 起，Notion 是 Event / Record 的唯一公开内容主源。这里的 Markdown 不会在运行时覆盖 Notion，也不做双向同步；需要公开的修改应写入对应 Notion 页面。这里继续保留事实底稿、原图和 slug 映射，供迁移、核查与补证使用。

## 使用规则

- 原始素材不改名、不压缩，作为证据保留。
- 官网 Event / Record 的标题、摘要、状态、分类、时间、地点和关联关系使用 Notion 顶层字段；详情正文使用 Notion 页面 blocks。
- 官网封面使用 Notion 页面顶部的 Add cover / Change cover；裁剪优先使用 Notion 原生 Reposition。
- 不再把 Event 编辑数据写入 `ext`。历史 `ext` 已迁移到 `category`、`event_status`、`event_format`、`location`、`cover_position` 和页面 cover。
- 能确认主办、协办、合作社区、受邀参与、成员参与时再写对应身份；不能确认时只写“合作露出 / 证据待补”。
- 没有明确日期、地点、人数、成果的材料，不扩写成确定事实。
- 新内容默认先在 Notion 创建 `Invisible` 草稿，人工确认后再改为 `Published`。
- Event 与现场回顾是两条不同记录：活动使用 `type=Event`，活动后的社区现场使用 `type=Record`；Record 填写 `related_event_slug` 建立关联。

## 当前素材映射

| 原始记录 | 官网条目 | 类型 | 公开状态 | 还缺什么 |
| --- | --- | --- | --- | --- |
| `2050 青年团聚.md` | `2050-community-meetup-2026`、`2050-cross-city-showcase` | Event + Record | 已进入官网 | 可继续补现场合影、展位项目详情、照片授权 |
| `26 年前几次活动的记录.md` | `early-activity-relationship-carrier` | Record | 已进入官网 | 补具体活动名称、时间线、代表成员故事 |
| `极客松——社区正式启动的节点.md` | `geekathon-community-launch-node` | Record | 已进入官网 | 补活动准确日期、现场职责、后续成立节点 |
| `三人行必有 AI 黑客松·长沙站线下协办.md` | `sanrenxing-ai-changsha-2026`、`sanrenxing-ai-community-bridge` | Event + Record | 已进入官网 | 补现场结果、成员项目、获奖或后续跟进 |
| `LEV0 Hackathon LEV0零阶 社区合作.md` | `lev0-minicamp-hackathon-2026`、`lev0-minicamp-award-record` | Event + Record | 已进入官网 | 补参赛项目名、成员分工、技术方案 |
| `合作观猹 AI 产品经理共学营.md` | `guanchai-ai-product-manager-camp-2026`、`guanchai-ai-product-manager-camp` | Event + Record | 已进入官网 | 补开营日期、报名数据、课程产出 |
| `观猹长理分园成立.md` | `guanchai-changli-ai-garden-2026` | Event | 已进入官网 | 补成立时间、社群人数、后续活动 |
| `datawhale 高校宣传活动.md` | `datawhale-campus-promotion-2026` | Event | 已进入官网但按证据露出处理 | 补活动名称、职责、时间、链接 |
| `社区受邀分享 openclaw 相关内容.md` | `openclaw-sharing-record` | Record | 已进入官网但按待补处理 | 补活动名称、时间、地点、项目说明 |
| `花猫社区.md` | `huamao-badge-generator-booth` | Record | 已进入官网 | 补活动名称、日期、现场反馈、项目截图 |
| `观猹百万博主线上联动活动.md` | `guanchai-million-blogger-online-linkage` | Record | 已进入官网但按合作证据处理 | 补活动链接、职责、结果 |
| `观猹 FDE 共学营｜IGNAI 合作伙伴预热（2026）.md` | `guanchai-fde-study-camp-2026` | Event | Notion `Invisible` 草稿已创建 | 核对具体合作权益与报名页有效性 |
| `智极松 MiniCamp 长沙站｜线下黑客松执行复盘（2026）.md` | `zhijisong-minicamp-changsha-2026` | Event + Record 底稿 | 已追加至既有 Notion Event，状态 `recap` | 补经授权的项目、成员与后续结果 |

## 已生成官网封面

- `/images/activity-records/2050-youth-gathering.webp`
- `/images/activity-records/datawhale-campus-promo.webp`
- `/images/activity-records/early-activity-relationship-carrier.webp`
- `/images/activity-records/geekathon-community-launch.webp`
- `/images/activity-records/guanchai-ai-pm-camp.webp`
- `/images/activity-records/guanchai-changli-ai-garden.webp`
- `/images/activity-records/guanchai-million-blogger-online.webp`
- `/images/activity-records/huamao-badge-generator-booth.webp`
- `/images/activity-records/lev0-minicamp-hackathon-award.webp`
- `/images/activity-records/openclaw-sharing.webp`
- `/images/activity-records/sanrenxing-ai-changsha-2026.webp`
- `/images/activity-records/zhijisong-minicamp-execution.webp`
- `/images/activity-records/guanchai-fde-camp-2026.webp`

## 后续投喂格式

每次新增活动，优先补这几项：

- 活动标题
- 时间
- 地点
- IGNAI 身份：主办 / 协办 / 合作社区 / 受邀参与 / 成员参与 / 宣发露出
- 3-5 张可公开图片
- 结果：人数、项目、获奖、合作方、后续沉淀
- 不方便公开的边界
