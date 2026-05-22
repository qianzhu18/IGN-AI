# Community Site Development Instructions

## Project Context
This repository is already a customized NotionNext derivative for the IGN AI community site.

The work in this repo now has two simultaneous goals:

1. Ship community-specific product features for our own site
2. Extract reusable, upstream-friendly parts that can later become clean PRs to NotionNext

## Working Mode
- Do not treat this repo as pristine upstream
- Do not treat this repo as a greenfield rebuild
- Preserve existing local customizations and dirty worktree changes
- Prefer additive changes over broad refactors
- When a feature has both local and reusable parts, separate them deliberately
- Treat this repository as a long-running optimization project, not a one-off task
- As long as the master TODO still has unchecked items, assume the project is still in active improvement

## Incremental Build Constraint
- This project is a secondary development based on an existing Notion template and an already customized NotionNext codebase
- Do not rewrite the site architecture, homepage, or existing content model unless the user explicitly asks for that
- Prefer extending the current site by adding routes, lists, sections, and lightweight content types such as `Members`, `Events`, and `Records`
- Assume existing Notion-managed content should be preserved and augmented rather than replaced
- New community features should integrate into the current information architecture with minimal disruption

## Long-Running Planning Files
Before continuing substantial work, check:

- `doc/ROADMAP/ROADMAP-overall-plan.md`
- `doc/ROADMAP/ROADMAP-schedule.md`
- `doc/ROADMAP/ROADMAP-master-todo.md`
- `docs/member-execution-roadmap.zh-CN.md`

These files define the active long-term direction. New work should attach to that roadmap instead of acting like an isolated patch.

## Current Product Direction
We are evolving NotionNext from a personal blog system into a community / organization site with:

- member profiles
- multi-author preparation
- events and registrations
- content vs organization-data separation
- admin and operations support

## Current MVP Priority
Member MVP is the active shared track:

1. Expose `Member` as a first-class page type
2. Build a member directory route
3. Build a member detail route
4. Define and document the member schema
5. Keep the implementation easy to split into upstreamable pieces later

## Branching / Contribution Intent
- Use local branches for dual-track work
- Keep docs for "what is local-only" vs "what can go upstream"
- When possible, make data-layer changes generic first, then keep custom UI thin
- For ongoing work, prefer one scoped branch per concrete optimization thread
- Prefer one scoped commit per coherent change when feasible
- After each meaningful optimization, update the roadmap / TODO status if the project state changed

## Upstream Context
Related public discussion already exists:

- Issue: https://github.com/tangly1024/NotionNext/issues/4035
- PR: https://github.com/tangly1024/NotionNext/pull/4036

## Session Output
At the end of each work session, record:

1. files changed
2. community-facing value delivered
3. upstreamable pieces identified
4. remaining work

## Completion Rule
Do not treat the project as "done" just because the current subtask is done.

If the user asks to keep optimizing, or if the roadmap and master TODO still contain unfinished active items, continue from the next highest-priority item in the plan unless the user redirects the priority.
