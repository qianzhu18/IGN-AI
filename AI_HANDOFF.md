# AI Handoff

## Current Goal
Continue secondary development of this community website while preserving a clean path for upstream contribution.

## Immediate Priority
Implement and stabilize the Member MVP.

## Repository Reality
- This repo already contains local customization beyond upstream NotionNext
- The worktree may be dirty
- Do not revert unrelated edits
- Keep new work scoped and explain which parts are reusable vs site-specific

## What To Do First
1. Read `AGENTS.md`
2. Read `docs/community-mvp.md`
3. Read `docs/member-execution-roadmap.zh-CN.md`
4. Read `docs/member-schema.md`
5. Read `docs/execution-playbook.md`
6. Read `tasks/member-mvp-checklist.md`
7. Inspect `lib/db/SiteDataApi.js`, `lib/db/notion/getPageProperties.js`, `pages/members/*`, and `themes/ignai/*`

## Current Strategy
- Generic data-layer support should be designed for future upstream PRs
- Community-specific presentation can remain local
- Avoid tying `Member` support to one theme

## End-Of-Session Output
- files changed
- what was implemented
- what remains
- what is upstreamable next
