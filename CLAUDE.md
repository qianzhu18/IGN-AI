# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

IGNAI community website — based on **NotionNext** (v4.9.5+), a Notion-powered Next.js site for the IGNAI AI community in Changsha. Dark-themed, Chinese-primary, using Notion as the sole backend for content and data management.

**Architecture: v2 (NotionNext 二开)** — migrated from v1.0.0 (Sanity + Supabase self-built). See `doc/architecture/` for the full decision process.

## Commands

```bash
yarn dev              # Start dev server (port 3000)
yarn build            # Production build (cross-env BUILD_MODE=true next build)
yarn start            # Start production server
yarn lint             # ESLint check
yarn lint:fix         # ESLint auto-fix
yarn type-check       # TypeScript type check (tsc --noEmit)
yarn format           # Prettier format all files
yarn format:check     # Prettier check without writing
yarn pre-commit       # Combined: lint:fix + format + type-check
yarn quality          # Run quality check script
yarn test             # Run Jest tests
yarn test:watch       # Jest in watch mode
yarn test:coverage    # Jest with coverage report
yarn test:ci          # Jest CI mode (no watch, with coverage)

# Notion API smoke test
yarn notion:members:smoke

# Single test file
yarn test -- path/to/file.test.js
```

Note: NotionNext uses **yarn** as the package manager (not npm). Node >= 20 required.

## Environment Variables

Set in `.env.local`:
```
NOTION_PAGE_ID=主库ID,members:成员库ID,events:活动库ID
NOTION_API_TOKEN=ntn_xxx
NOTION_MEMBERS_DATA_SOURCE_ID=xxx
```

Only `NOTION_PAGE_ID` is strictly required. The other two are needed only for the Member data pipeline (official API).

## Architecture

### Core Stack

- **NotionNext** (Pages Router, Next.js) — the base framework
- **Notion** — sole backend: content CMS + data storage
- **Theme: ignai** — IGNAI custom theme (based on heo, replicating v1.0.0 UI design)
- **Deployment**: Vercel (primary) or Docker (VPS alternative)
- **Language**: Mixed JS/TS — NotionNext core is JS, v1.0.0 ported components in `src/` are TSX

### Key Configuration

- `blog.config.js` — main site configuration (theme, author, appearance, etc.)
- `conf/` — split configuration files (comment, analytics, fonts, notion field mapping, etc.)
- `.env.local` — environment variables
- `themes/ignai/` — the active theme (IGNAI custom, based on heo skeleton)
- `src/` — v1.0.0 UI reference (components, content, styles from original architecture)

### Notion Multi-Database

The `NOTION_PAGE_ID` supports multiple Notion databases with path prefixes:
```
NOTION_PAGE_ID='主库ID,members:成员库ID,events:活动库ID'
```
This enables separate sections (events, members, stories) from different Notion databases.

### Data Flow: Site Service Layer

`lib/site/` contains the normalized site data layer:
- `site.types.ts` — shared types (`BasePage`, `PageType`, `ResolvedAuthor`, etc.)
- `site.service.ts` / `site.api.ts` — site-level data orchestration
- `adapters/notion/` — Notion-specific normalizers
- `processors/` — post-processing pipeline (empty content filtering, page enrichment)

`lib/db/` is the lower-level Notion API layer:
- `SiteDataApi.js` — main data fetcher, merges unofficial + official API results
- `notion/` — granular Notion API helpers (getPageProperties, getPostBlocks, etc.)

### Member Data Pipeline

NotionNext's unofficial API reads database views, which may exclude certain entry types (e.g. Member). To ensure Member entries appear on the site, `lib/db/SiteDataApi.js` has a supplemental pipeline:

1. **Unofficial API** (notion-client): reads the database view → produces `allPages` (typically only Post entries)
2. **Official API** (`fetchMembersFromOfficialAPI`): queries `/v1/data_sources/{id}/query` with `Notion-Version: 2026-03-11` → filters for `Type=Member, Status=Published` → merges into `allPages`

Key implementation details:
- Uses `NOTION_API_TOKEN` and `NOTION_MEMBERS_DATA_SOURCE_ID` env vars
- Property names in the data_source API use internal keys (lowercase), not display names — `findPropertyKey()` handles case-insensitive matching
- `readPropertyValue()` normalizes different Notion property types (title, rich_text, url, select, status, checkbox, date)
- Test with `yarn notion:members:smoke`

### Project Structure

```
├── blog.config.js      # Main config (IGNAI brand settings)
├── conf/               # Split config files (comment, analytics, fonts, notion, etc.)
├── components/         # Shared cross-theme components
├── themes/
│   ├── ignai/            # ★ Active theme (IGNAI custom, based on heo)
│   │   ├── config.js     #   IGNAI theme config (brand, hero, nav, footer)
│   │   ├── style.js      #   IGNAI CSS (v1 design tokens, animations, brand colors)
│   │   ├── index.js      #   Theme entry (LayoutBase, LayoutIndex, etc.)
│   │   └── components/   #   Theme components (Header, Hero, Footer, BackgroundFX, etc.)
│   └── heo/              # Base theme (reference, not active)
├── lib/
│   ├── db/               #   Notion API layer (SiteDataApi, notion/ helpers)
│   ├── site/             #   Site service layer (adapters, processors, types)
│   ├── cache/            #   ISR cache
│   ├── plugins/          #   Plugin system
│   └── utils/            #   Utility functions
├── pages/              # Next.js Pages Router (NOT App Router)
├── src/                # v1.0.0 UI reference (not part of NotionNext build)
│   ├── components/     #   Original TSX components (sections, ui, layout, motion, admin, cards, forms)
│   ├── content/        #   Original content data (site, community, events)
│   └── styles/         #   Original CSS (tokens.css, globals.css)
├── public/
│   ├── brand/          # IGNAI brand assets (logo, etc.)
│   └── contact/        # Contact assets (QR codes)
├── doc/                # Architecture docs & design specs (not built)
└── scripts/            # Utility scripts (smoke tests, dev tools, health checks)
```

### Customization Strategy

The `ignai` theme is a custom theme that replicates the v1.0.0 IGNAI website UI:
1. **Theme skeleton**: Based on heo theme's component structure (for NotionNext compatibility)
2. **Visual identity**: v1.0.0 design tokens, brand colors (Heat #FF7A18, Signal #5DA9FF), animations
3. **Key components**: Header (BrandLockup + IGNAI nav), Hero (ignite field + signals), Footer (IGNAI branding)
4. **Reference**: `src/` contains original v1.0.0 components for reference during porting
5. **Feature additions**: Custom pages (members, events) reading Notion databases

### IGNAI Brand Tokens

| Token | Value | Usage |
|-------|-------|-------|
| Heat | `#FF7A18` | Primary accent |
| Signal | `#5DA9FF` | Secondary accent |
| Dark BG | `#07080C` | Page background |
| Dark Card | `#0D0E14` | Card surfaces |
| Font | Noto Sans SC | Body text |

## Workflow Conventions

- **Branch**: `main` is the active integration branch and should reflect the latest stable project state
- **Historical branch**: `feature/ignai-motion-system` is an archived migration-era branch, not the current product base
- **v1.0.0 tag**: archived self-built architecture (Sanity + Supabase), do not modify
- **Archive baseline**: `release-1.0.0` preserves the pre-NotionNext milestone together with tag `v1.0.0`
- **AI hygiene**: remove temporary AI branches/worktrees after merge or review so the repo stays navigable
- **Commit messages**: include scope, e.g. `feat(P1-01):`, `fix(P3-02):`, `docs:` (reference task IDs from `doc/todo/TODO.md`)
- **Always verify**: run `yarn build` before committing major changes
- **Issue tracking**: `doc/todo/TODO.md` (main roadmap), `doc/issues/` (detailed issues)

## Key Constraints

1. **Pages Router only** — do not use `app/` directory routing
2. **Theme changes go in `themes/ignai/`** — don't modify `components/` shared code or other themes
3. **`src/` is reference only** — not part of the NotionNext build; used for porting v1.0.0 UI
4. **Config priority**: env vars > `blog.config.js` > `conf/` split configs
5. **patch-package** runs on `postinstall` — patches in `patches/` are applied automatically

## Scenario-Based File Reading

For detailed file reading order by development scenario (theme changes, config, new pages, debugging, content), see **`agent.md`** — it covers all common scenarios with specific file lists and step-by-step workflows.
