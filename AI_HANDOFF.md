# AI Handoff

## Current Goal
Continue community-site optimization from `main` while preserving a clean path for upstream contribution.

## Immediate Priority
Stabilize the post-Member-MVP baseline, keep the repo tidy, and keep pushing the next community capabilities.

## Repository Reality
- This repo already contains local customization beyond upstream NotionNext
- The worktree may be dirty
- Do not revert unrelated edits
- Keep new work scoped and explain which parts are reusable vs site-specific
- `main` is the active integration branch
- `feature/ignai-motion-system` is now a historical archive branch from the migration / motion phase
- `release-1.0.0` + tag `v1.0.0` preserve the old self-built baseline
- `codex/issue-3914-apple-music-embed` lives in a separate PR worktree; do not mix product work into it

## What To Do First
1. Read `AGENTS.md`
2. Read `doc/ROADMAP/ROADMAP-overall-plan.md`
3. Read `doc/ROADMAP/ROADMAP-schedule.md`
4. Read `doc/ROADMAP/ROADMAP-master-todo.md`
5. Read `docs/member-execution-roadmap.zh-CN.md`
6. Read `docs/execution-playbook.md`
7. Read the latest session records in `docs/`
8. Inspect `lib/db/SiteDataApi.js`, `lib/db/notion/getPageProperties.js`, `pages/members/*`, and `themes/ignai/*`

## Current Strategy
- Generic data-layer support should be designed for future upstream PRs
- Community-specific presentation can remain local
- Avoid tying `Member` support to one theme
- Use short-lived scoped branches only when needed, then merge/delete them promptly

## End-Of-Session Output
- files changed
- what was implemented
- what remains
- what is upstreamable next
