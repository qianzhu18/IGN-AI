# Community / Upstream Sync Plan

> 最新总控文档：`docs/upstream-community-pr-stack.zh-CN.md`
>
> 这份文件保留为轻量索引；具体 PR Stack、四周日程、面试表达和简历描述以后以总控文档为准。

## Goal
Use this repository as both:

1. a real community product codebase
2. a staging ground for reusable NotionNext contributions

## Split Rule

### Good upstream candidates
- data-layer support for new page types
- route-generation helpers
- schema documentation
- backward-compatible filters and selectors

### Keep local for now
- IGN AI-specific branding
- custom narrative sections
- local growth loops
- community-specific operations flows

## Recommended PR Order
1. Event 官方 data source API fallback（已开 #4169）
2. Community Content Type Registry
3. Typed Collection Helpers
4. Member Data Contract
5. Member Directory / Detail Routes
6. Author to Member Relationship
7. Event Data Contract / Minimal Event Routes
8. Record / Field Notes Content Type
9. Page Props Slimming
10. Community Site Architecture Docs

## Story To Tell Publicly
This is not random customization. It is a concrete example of extending a creator-blog framework into a community operating system, then feeding the reusable parts back upstream.
