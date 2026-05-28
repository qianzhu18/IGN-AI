# Execution Playbook

## This Repository's Actual Working Model

This repo is not a clean upstream sandbox.

It is:

1. the real product repo for the IGN AI community site
2. the place where reusable NotionNext extensions are first proven in practice

That means each feature should be split mentally into two layers:

- local product layer
- upstreamable shared layer

## The Recommended Execution Order

### Step 1: Build in this repo first
Implement the feature where the real product pressure exists.

For Member MVP, that means:

1. make the data available
2. make the route usable
3. make the feature visible in the live site flow
4. document the schema and assumptions

### Step 2: Mark the reusable subset
Before doing any upstream PR, identify which files are generic.

For Member MVP, the likely reusable subset is:

- `lib/db/SiteDataApi.js`
- `lib/db/notion/getPageProperties.js`
- schema docs
- route conventions

The likely local-only subset is:

- `themes/ignai/*`
- community wording
- local presentation choices

### Step 3: Cut an upstream branch later
Do not PR the whole product diff upstream.

Instead:

1. create a fresh branch from your upstream-aligned base
2. cherry-pick or manually copy only the generic subset
3. keep the PR narrow and explain the community-site use case clearly

## How To Work With AI In This Repo

When continuing work here, use this prompt:

```text
Please read /AGENTS.md, /doc/roadmap/overall.md, /doc/roadmap/schedule.md, /doc/roadmap/master-todo.md, /AI_HANDOFF.md, /docs/member-execution-roadmap.zh-CN.md, /docs/member-schema.md, and /docs/execution-playbook.md first. Then continue the current IGNAI community-site optimization from /main. Keep reusable logic separate from IGNAI-specific presentation, and tell me what can be split into an upstream PR next.
```

## Current Recommended Next Tasks

### Product-facing next
1. enhance featured members and organization expression
2. improve member directory / profile presentation and mobile fit
3. lay groundwork for event-member relationships

### Upstream-facing next
1. prepare a minimal PR containing generic `Member` support
2. separate the shared data-layer diff from IGNAI-specific UI
3. document the PR narrative and the schema contract clearly

## Suggested Git Rhythm

```bash
git checkout main
git status
```

For local product work:

```bash
git checkout -b codex/<scoped-task>
git add <scoped files>
git commit -m "feat: add member directory foundation"
```

For upstream extraction later:

```bash
git checkout -b codex/upstream-member-foundation
```

Then only carry the shared files forward, merge back into `main`, and remove temporary worktrees/branches after review.
