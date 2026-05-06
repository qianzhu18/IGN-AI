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
- **Theme: heo** — dark theme optimized for Chinese developer community sites
- **Deployment**: Vercel (primary) or Docker (VPS alternative)

### Key Configuration

- `blog.config.js` — main site configuration (theme, author, appearance, etc.)
- `conf/` — split configuration files (comment, analytics, fonts, etc.)
- `.env.local` — environment variables (only `NOTION_PAGE_ID` is required)
- `themes/heo/` — the active theme directory

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
│   └── heo/            # Active theme (dark, community-oriented)
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

Like the qianzhu_blog project, customization is done by:
1. **Theme selection**: heo theme as the base (dark, feature-rich)
2. **Visual overhaul**: modify theme components for IGNAI brand identity
3. **Feature additions**: custom pages (members, events) reading Notion databases
4. **Asset replacement**: logos, favicons, brand colors in theme config

## Workflow Conventions

- **Branch**: `notionnext-v2` is the active development branch
- **v1.0.0 tag**: archived self-built architecture (Sanity + Supabase), do not modify
- **Commit messages**: include scope, e.g. `feat(heo):`, `fix(config):`, `docs:`
- **Always verify**: run `yarn build` before committing major changes
- **Issue tracking**: `doc/ISSUES/ISSUES.md` and `doc/TO DO/TODO.md`
