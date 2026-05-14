# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

IGNAI community website — based on **NotionNext** (v4.9.5+), a Notion-powered Next.js site for the IGNAI AI community in Changsha. Dark-themed, Chinese-primary, using Notion as the sole backend for content and data management.

**Architecture: v2 (NotionNext 二开)** — migrated from v1.0.0 (Sanity + Supabase self-built). See `doc/architecture/` for the full decision process.

## Commands

```bash
yarn dev              # Start dev server (port 3000)
yarn build            # Production build
yarn start            # Start production server
yarn lint             # ESLint check
yarn test             # Run tests
```

Note: NotionNext uses **yarn** as the package manager (not npm).

## Architecture

### Core Stack

- **NotionNext** (Pages Router, Next.js) — the base framework
- **Notion** — sole backend: content CMS + data storage
- **Theme: ignai** — IGNAI custom theme (based on heo, replicating v1.0.0 UI design)
- **Deployment**: Vercel (primary) or Docker (VPS alternative)

### Key Configuration

- `blog.config.js` — main site configuration (theme, author, appearance, etc.)
- `conf/` — split configuration files (comment, analytics, fonts, etc.)
- `.env.local` — environment variables (only `NOTION_PAGE_ID` is required)
- `themes/ignai/` — the active theme (IGNAI custom, based on heo skeleton)
- `src/` — v1.0.0 UI reference (components, content, styles from original architecture)

### Notion Multi-Database

The `NOTION_PAGE_ID` supports multiple Notion databases with path prefixes:
```
NOTION_PAGE_ID='主库ID,members:成员库ID,events:活动库ID'
```
This enables separate sections (events, members, stories) from different Notion databases.

### Project Structure

```
├── blog.config.js      # Main config (IGNAI brand settings)
├── conf/               # Split config files
├── components/         # Shared components
├── themes/
│   ├── ignai/            # ★ Active theme (IGNAI custom, based on heo)
│   │   ├── config.js     #   IGNAI theme config (brand, hero, nav, footer)
│   │   ├── style.js      #   IGNAI CSS (v1 design tokens, animations, brand colors)
│   │   ├── index.js      #   Theme entry (LayoutBase, LayoutIndex, etc.)
│   │   └── components/   #   Theme components (Header, Hero, Footer, etc.)
│   └── heo/              # Base theme (reference, not active)
├── lib/                # Core logic (Notion API, data fetching)
├── pages/              # Next.js Pages Router
├── public/
│   ├── brand/          # IGNAI brand assets (logo, etc.)
│   └── contact/        # Contact assets (QR codes)
├── doc/                # Architecture docs & design specs
│   ├── architecture/   # Technical decisions
│   ├── design/         # Visual design specs
│   ├── dev/            # Dev guides
│   └── requirements/   # Feature requirements
└── CLAUDE.md           # This file
```

### Customization Strategy

The `ignai` theme is a custom theme that replicates the v1.0.0 IGNAI website UI:
1. **Theme skeleton**: Based on heo theme's component structure (for NotionNext compatibility)
2. **Visual identity**: v1.0.0 design tokens, brand colors (Heat #FF7A18, Signal #5DA9FF), animations
3. **Key components**: Header (BrandLockup + IGNAI nav), Hero (ignite field + signals), Footer (IGNAI branding)
4. **Reference**: `src/` contains original v1.0.0 components for reference during porting
5. **Feature additions**: Custom pages (members, events) reading Notion databases

## Workflow Conventions

- **Branch**: `notionnext-v2` is the active development branch
- **v1.0.0 tag**: archived self-built architecture (Sanity + Supabase), do not modify
- **Commit messages**: include scope, e.g. `feat(P1-01):`, `fix(P3-02):`, `docs:` (reference task IDs from TODO.md)
- **Always verify**: run `yarn build` before committing major changes
- **Issue tracking**: `doc/TO DO/TODO.md` (main roadmap), `doc/ISSUES/` (detailed issues)

## AI Development Guide

For comprehensive guidance on what files to read for different development scenarios, see `agent.md`. It covers:
- Scenario-based file reading order (theme customization, config changes, new pages, debugging)
- Directory structure with annotations
- IGNAI brand specifications
- Development workflow
