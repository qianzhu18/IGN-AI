# AI Handoff

> 最后更新：2026-05-30

## 当前状态

IGNAI 社区官网 v2.0.0，基于 NotionNext 二开。基础功能已完成，进入 UI 打磨与上线阶段。

## 活跃分支

- **当前工作分支**：`feat/member-avatar-showcase`
- **主集成分支**：`main`
- 其他分支为历史归档，不要在此基础上开发

## 读取顺序（新 AI 工具接入）

1. 读 `agent.md` — 项目全貌、目录结构、场景化文件指引
2. 读 `AGENTS.md` — 仓库工作约束
3. 读 `doc/todo/TODO.md` — 当前开发路线图（主任务追踪）
4. 读 `doc/issues/ui-issues.md` — 前端 UI 问题清单（当前重点）
5. 读 `CLAUDE.md` — Claude Code 专属指引（命令、架构）

## 当前重点

**前端 UI 打磨** — 见 `doc/issues/ui-issues.md`，包含：
- 首页 Hero/信号卡片/成员散点/活动区块问题
- 成员目录页搜索筛选待实现
- 导航栏移动端动画卡顿
- 暗色模式对比度
- /about 和 /events 页面问题

**修改文件集中在**：`themes/ignai/` 目录

## 关键文件

| 文件 | 用途 |
|------|------|
| `themes/ignai/style.js` | 所有 CSS 样式 |
| `themes/ignai/index.js` | 主题入口 + Section 组件 |
| `themes/ignai/config.js` | 品牌、导航、Hero 配置 |
| `themes/ignai/components/` | 主题组件 |
| `lib/db/SiteDataApi.js` | Notion 数据获取层 |
| `pages/index.js` | 首页 getStaticProps |
| `components/SEO.js` | SEO Head |

## 启动

```bash
yarn dev    # 端口 3000
yarn build  # 构建验证
```

## Git 约束

- commit 格式：`feat(scope): 描述` / `fix(scope): 描述` / `docs(scope): 描述`
- scope 用任务 ID（如 `P3-09`）或模块名（如 `members`、`UI`）
- 每次有意义的改动后 commit + push
- 不要 force push，不要修改 main 历史
