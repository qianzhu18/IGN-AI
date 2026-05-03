# Supabase 接入与 Join 业务设计

最后更新：2026-05-04

## 1. 先回答一个关键误区

你提到“印象里 Supabase 数据一段时间不新增会删除”，这个要区分两层：

1. 业务数据是否应该被我们主动归档或删除
2. Supabase 项目本身在免费层长期不活跃时的暂停 / 删除策略

结论先说：

- 业务数据不应该因为“最近没新增”就直接自动硬删除
- 我们应该自己定义归档和保留策略
- Supabase 层面的暂停 / 删除风险，应该靠项目活跃度、备份和导出策略来兜住，不要把业务规则建立在“平台会不会帮你删”上

## 2. 当前推荐目标

Join 这条链路要解决的不是“先把数据塞进一个表”这么简单，而是：

1. 用户可以稳定提交
2. 运营知道谁需要跟进
3. 数据不会因为长期没人处理就混成一坨
4. 后续加字段不会引发大面积重构

所以这里建议把 `join_applications` 设计成：

- 一张稳定的申请主表
- 少量高频字段强类型列
- 低频或未定型字段放到 `metadata jsonb`
- 状态流转靠 `status`
- 保留策略靠 `archived_at / delete_after`

## 3. 推荐业务状态机

建议状态：

- `submitted`
  - 用户刚提交，还没人处理
- `reviewing`
  - 已进入人工查看 / 初筛
- `contacted`
  - 已联系到对方，等待进一步反馈
- `accepted`
  - 确认进入社区 / 后续流程
- `waitlisted`
  - 暂缓，后续再跟进
- `withdrawn`
  - 用户主动撤回
- `spam`
  - 明确无效 / 垃圾申请
- `archived`
  - 已完成业务闭环，转归档

这套状态的好处是：

- 早期够用
- 后续能接成员管理
- 不会把“归档”和“删除”混在一起

## 4. 推荐保留策略

这里最重要的是不要一上来就硬删除。

建议分三层：

### 4.1 活跃申请

状态：

- `submitted`
- `reviewing`
- `contacted`
- `waitlisted`

策略：

- 默认保留
- 如果 `60-90` 天无更新，可自动转 `archived`
- 不直接删除

### 4.2 已完成申请

状态：

- `accepted`
- `withdrawn`
- `archived`

策略：

- 长期保留业务主记录
- 如果后续已转成员系统，可考虑只保留必要最小字段

### 4.3 无效 / 垃圾申请

状态：

- `spam`

策略：

- 可以在 `30-180` 天后硬删除
- 但建议先留一个缓冲期

## 5. 为什么不要按“多久没新增就删”

因为“没新增”不是判断数据价值的正确信号。

举例：

- 一个高质量申请，即使 45 天没有新动作，也可能仍有跟进价值
- 一个已 accepted 的申请，即使半年没动，也可能需要保留历史记录
- 一个 spam，哪怕昨天刚进来，也不值得长期存

所以判断标准应该是：

- `status`
- `last_activity_at`
- `archived_at`
- `delete_after`

而不是“最近有没有新插入数据”。

## 6. 字段设计原则

推荐把字段分成三层。

### 6.1 核心稳定字段

这些字段高频使用，直接做成强类型列：

- `id`
- `name`
- `contact`
- `role`
- `interests`
- `message`
- `source`
- `status`
- `created_at`
- `updated_at`
- `last_activity_at`

### 6.2 运营流程字段

这些字段用来支撑后续跟进和归档：

- `reviewed_at`
- `contacted_at`
- `resolved_at`
- `archived_at`
- `delete_after`

### 6.3 扩展字段

这些不要一开始全拍死，放到 `metadata jsonb`：

- UTM 参数
- 页面入口变体
- 推荐人
- 设备 / 来源上下文
- 后续实验字段
- 暂未稳定的问卷附加项

## 7. 以后加字段麻烦不

如果现在按这个思路建，不麻烦。

### 7.1 不麻烦的部分

Postgres 后续加列本身很轻：

- 新增 nullable 列
- 新增有默认值的列
- 新增索引
- 新增 `jsonb metadata` 中的键

这些都属于比较正常的迭代。

### 7.2 真正麻烦的是这些情况

- 把“状态”设计得太草率，后期要整体重命名
- 把所有未来字段都提前做成刚性列，导致表越长越乱
- 前端、接口、后台、SQL 强耦合，没有兼容层
- 一开始就硬删除，后面丢了历史上下文

### 7.3 降低后续改动成本的办法

建议：

1. 核心字段少而稳
2. 低频字段先进 `metadata`
3. 业务状态先定清楚
4. 删除优先走归档，不急着硬删
5. API 层保留一个统一的 insert adapter

现在这个项目里，这个 adapter 就是：

- `src/lib/supabase.ts`
- `src/lib/join.ts`

## 8. 当前推荐表结构

建议主表：

`join_applications`

核心字段：

- `id uuid primary key`
- `name text not null`
- `contact text not null`
- `role text not null`
- `interests text[] not null default '{}'`
- `message text not null default ''`
- `source text not null default 'website'`
- `status text not null default 'submitted'`
- `metadata jsonb not null default '{}'::jsonb`
- `created_at timestamptz not null default now()`
- `updated_at timestamptz not null default now()`
- `last_activity_at timestamptz not null default now()`
- `reviewed_at timestamptz`
- `contacted_at timestamptz`
- `resolved_at timestamptz`
- `archived_at timestamptz`
- `delete_after timestamptz`

## 9. 当前推荐索引

- `status, created_at desc`
- `last_activity_at desc`
- `delete_after`
- `source`
- `gin(interests)`
- `gin(metadata)` 仅在确认需要时再加

## 10. 当前推荐删除策略

默认建议：

- 非垃圾申请：不硬删，只归档
- `spam`：`30-180` 天后可删
- 测试数据：单独标识，定期清理

这里建议增加一个 metadata 标记：

- `metadata.is_test = true`

这样联调数据和真实申请就能分开清理。

## 11. 业务上怎么接下一步

推荐推进顺序：

1. 在 Supabase 建 `join_applications`
2. 接通站内表单到 Supabase
3. 保留当前 local inbox 作为本地 fallback
4. 后台先只做最小运营动作：
   - 看申请
   - 改状态
   - 记录是否已联系
5. 等状态跑顺后，再接成员系统或自动转成员

## 12. 当前建议结论

如果你问一句最实用的话：

“后续加字段麻烦不？”

答案是：

- 如果现在就把核心字段、状态机、归档逻辑定清楚，不麻烦
- 如果现在先糊一个表，后面才想状态和保留策略，会越来越麻烦

这次最该先定住的是：

1. 状态机
2. 归档而非直接删除
3. `metadata jsonb` 扩展位
4. local inbox 到 Supabase 的统一 adapter
