# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

IGNAI community website — a Next.js 15 + React 19 landing site for an AI community based in Changsha. The site is a bilingual (Chinese-primary, English secondary) dark-themed community platform with content management, join applications, and event management.

## Commands

```bash
npm run dev              # Start Next.js dev server
npm run build            # Production build
npm run typecheck        # Run next typegen + tsc --noEmit (uses tsconfig.typecheck.json)
npm run check            # typecheck + build (full validation)
npm run test:smoke       # Playwright smoke tests (needs running dev server)
npm run studio           # Standalone Sanity Studio on :3333
npm run studio:embedded  # Embedded Sanity Studio via Next.js on :3003
```

Smoke tests require Playwright and a running dev server:
```bash
npx playwright install chromium  # one-time setup
SMOKE_BASE_URL=http://localhost:3000 npm run test:smoke
```

## Architecture

### Dual Backend Strategy

The site uses two separate backends, each with a specific role:

- **Sanity** (`src/sanity/`, `src/lib/sanity.ts`): Content CMS for events, records, stories, and articles. Accessed via GROQ queries through `sanityFetch()`. Falls back to hardcoded content in `src/content/` when Sanity is unavailable or returns empty results. Configured via `NEXT_PUBLIC_SANITY_PROJECT_ID`, `NEXT_PUBLIC_SANITY_DATASET`, `SANITY_API_READ_TOKEN`.

- **Supabase** (`src/lib/supabase.ts`): Business data backend for join applications. Uses direct REST calls to Supabase PostgREST (no client SDK). Configured via `SUPABASE_URL`, `SUPABASE_SECRET_KEY` / `SUPABASE_SERVICE_ROLE_KEY` / `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY`. Falls back to local JSON file storage (`.data/join-applications.json`) when Supabase is not configured.

### Join Application Flow

`src/lib/join.ts` orchestrates the three-tier join storage:
1. **Supabase mode**: Production path — writes to `join_applications` table
2. **Local mode**: Dev/fallback — writes to `.data/join-applications.json`
3. **Unconfigured**: Returns 503

The join form at `/join` posts to `/api/join`. An external form URL can override the built-in form via `NEXT_PUBLIC_JOIN_FORM_URL`.

### Ops/Admin Auth

Admin pages (`/studio`, `/ops/join`, `/manage`) are protected by a simple password-gate system:
- `src/lib/opsAuth.ts`: SHA-256 hashed password comparison with timing-safe equality
- `src/components/admin/OpsAccessGate.tsx`: Login UI
- `src/components/admin/AdminShell.tsx`: Shared admin page shell with navigation
- Session stored as an `httpOnly` cookie (`ignai_ops_session`), 12-hour expiry
- Controlled by `OPS_ACCESS_PASSWORD` env var

### Content Fallback Pattern

All content-fetching functions follow the same pattern: try Sanity first, fall back to static data from `src/content/`:
- Events: `src/lib/events.ts` → `src/content/events.ts`
- Community content: `src/lib/sanity.ts` → `src/content/platform.ts`
- Site copy: `src/content/site.ts`, `src/content/links.ts`

This means the site renders correctly even without Sanity connectivity.

### Path Aliases

`@/*` maps to `./src/*` (configured in `tsconfig.json`).

### Styling

- Tailwind CSS 3 with custom fonts: `font-sans` (Noto Sans SC), `font-display` (Cormorant Garamond)
- Dark theme by default (`colorScheme: "dark"`, themeColor `#07070A`)
- Framer Motion for animations (`src/components/motion/`, `src/lib/motion.ts`)
- Custom shadow: `shadow-glow`

### Sanity Studio

Sanity Studio is embedded at `/studio` route (`src/app/studio/[[...tool]]/page.tsx`) using `next-sanity`. It's also available standalone on port 3333 via `npm run studio`. Schema types are in `src/sanity/schemaTypes/` — currently: `event`, `record`, `sectionBlock`, `link`.

### Supabase Schema

SQL migrations live in `supabase/sql/`. The `join_applications` table stores join submissions with status workflow: `submitted → reviewing → contacted → accepted/waitlisted/withdrawn/spam/archived`.

### Key Page Routes

- `/` — Homepage: composed of section components from `src/components/sections/`
- `/join` — Community join page (QR code contact card or application form)
- `/events` and `/events/[slug]` — Event listing and detail
- `/records` — Field notes / community records
- `/blog/[slug]` — Blog articles
- `/stories/[slug]` — Member stories
- `/ops/join` — Ops dashboard for managing join applications
- `/manage` — Admin hub
- `/studio` — Embedded Sanity Studio

## Workflow Conventions

See `agent.md` for the full issue-driven development workflow. Key points:

- **Commit messages** must include the Issue ID: `feat(IGNAI-001):`, `fix(IGNAI-002):`, `docs(IGNAI-003):`
- **One issue per commit** — never mix unrelated changes
- **Always validate after changes**: run `npm run check` before committing
- **Issue tracking** lives in `doc/TODO.md` with states: Open → In Progress → Blocked → Resolved → Closed
