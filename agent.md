# IGNAI Agent 操作规范

最后更新：2026-05-04

这份规范用于约束后续 agent / 开发协作时的基本操作流程，目标是让测试、修复、记录、git 存档形成闭环。

## 1. 总原则

1. 先确认问题，再动代码
2. 先登记 Issue，再开始修复
3. 一次聚焦一个主 Issue
4. 每修完一个 Issue，必须有 git 存档
5. 修复后必须回跑对应测试集

## 2. 工作入口

开始任何一轮工作前，先阅读：

1. `doc/TODO.md`
2. 当前 `git status`
3. 与目标 Issue 相关的源码文件

如果 `doc/TODO.md` 还没有对应 Issue，先补 Issue，再开始实现。

## 3. 标准执行流程

### Step 1: 选择 Issue

- 从 `doc/TODO.md` 的 Issues 列表中选一个 `Open` 或 `In Progress` 的 Issue
- 明确 Issue ID，例如 `IGNAI-001`
- 只在必要时同时处理多个强相关 Issue

### Step 2: 建立基线

动手前至少执行一轮最小验证：

- `npm run build`
- `npm run check`
- 关键页面访问检查
- 相关接口 smoke test

如果本轮只改文档，可跳过页面联调，但应说明原因。

### Step 3: 更新 Issue 状态

在 `doc/TODO.md` 中同步：

- 状态改为 `In Progress`
- 补充本轮计划修复范围
- 如有新发现，新增子问题或新 Issue

### Step 4: 实施修复

- 只改与当前 Issue 强相关的文件
- 避免顺手改无关代码
- 如果发现新问题，不要混在当前修复里一起吞掉
- 新问题单独记到 `doc/TODO.md`

### Step 5: 回跑测试

修复后必须回跑：

- 当前 Issue 对应测试集
- 受影响页面的 smoke test
- 至少一项回归测试

示例：

- 修 `IGNAI-001`，至少回跑 `D/E/G/L01`
- 修 `IGNAI-002`，至少回跑 `B/L02`
- 修 `IGNAI-003`，至少回跑 `C/H/J/L03`

### Step 6: 写回结果

把下面信息写回 `doc/TODO.md`：

- 修复了什么
- 跑了哪些测试
- 结果如何
- 是否还有残留风险

### Step 7: git 存档

每修完一个 Issue，必须做 git 存档。

最低要求：

- 至少一个 commit
- commit message 带 Issue ID

推荐提交格式：

- `fix(IGNAI-001): connect join flow to supabase`
- `fix(IGNAI-002): stabilize type check inputs`
- `fix(IGNAI-003): disambiguate homepage join cta`
- `test(IGNAI-004): add smoke test runner`
- `docs(IGNAI-001): record validation result`

## 4. Issue 记录规范

每个 Issue 至少包含：

- `Issue ID`
- `标题`
- `优先级`
- `状态`
- `复现方式`
- `影响范围`
- `相关文件`

推荐状态：

- `Open`
- `In Progress`
- `Blocked`
- `Resolved`
- `Closed`

## 5. 测试执行规范

### 5.1 测试分类

- 基线测试：构建、检查、关键页面可达性
- 功能测试：业务链路是否真的打通
- 回归测试：修复后是否影响旧能力
- 容错测试：配置缺失、接口异常、fallback 是否正常

### 5.2 结果记录要求

不要只写“测过了”。

至少要写：

- 测了什么
- 怎么测的
- 成功还是失败
- 失败时的现象和返回值

### 5.3 测试通过标准

只有在下面条件都满足时，才可以把 Issue 标成 `Resolved`：

1. 复现路径不再失败
2. 相关测试集全部通过
3. 没有新增 blocker
4. 已完成 git 存档

## 6. 文档更新规范

以下情况必须更新 `doc/TODO.md`：

- 新发现一个问题
- 开始修复一个 Issue
- 修完一个 Issue
- 需要调整优先级
- 测试范围发生变化

以下情况建议更新本文件：

- 团队希望调整协作规则
- 需要新增统一命名规范
- 需要补充测试与 git 流程

## 7. 不要这样做

- 不登记 Issue 就直接开改
- 一个 commit 混入多个无关问题
- 修完不测
- 测完不记
- 改完不做 git 存档
- 把新发现的问题偷偷塞进旧 Issue，不留下记录

## 8. 当前推荐工作节奏

建议从现在开始按这个顺序推进：

1. 先修 `IGNAI-001`
2. 再修 `IGNAI-002`
3. 再修 `IGNAI-003`
4. 最后补 `IGNAI-004`

每完成一步，都要同步：

- `doc/TODO.md`
- git commit
- 下一轮待办
