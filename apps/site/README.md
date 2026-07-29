# IGNAI Site — Payload migration slice

This is a standalone Next.js + Payload application. The existing NotionNext app at the repository root remains the production fallback until this slice passes its gates.

The architecture decision, migration order, acceptance gates, and legacy exit conditions are documented in [`../../docs/architecture/payload-unified-migration-plan.zh-CN.md`](../../docs/architecture/payload-unified-migration-plan.zh-CN.md).

The CMS alternative evaluation and re-selection triggers are documented in [`../../docs/architecture/cms-options-research-2026-07-29.zh-CN.md`](../../docs/architecture/cms-options-research-2026-07-29.zh-CN.md).

## Local start

```bash
cp .env.example .env
docker compose up -d postgres
pnpm install
pnpm db:migrate
pnpm generate:types
pnpm generate:importmap
pnpm dev
```

Open `http://localhost:3000/admin` and create the first administrator. The public event surface is available at `/events` and `/events/:slug`.

The Admin panel defaults to Simplified Chinese and includes an IGNAI operations overview with live totals for Members, Events, Records, and Posts. Both light and dark themes are supported.

If port 3000 is occupied, start on another port and keep the public server URL aligned:

```bash
NEXT_PUBLIC_SERVER_URL=http://localhost:3001 pnpm exec next dev -p 3001
```

## Verification

```bash
pnpm typecheck
pnpm lint
pnpm test
PAYLOAD_DB_PUSH=false pnpm db:migrate:status
pnpm build
```

The health endpoint is `/api/health`. It returns HTTP 200 only after Payload can connect to PostgreSQL.

The verified M0/M1 content loop is:

1. Create or sign in as an administrator at `/admin`.
2. Create an Event as a draft.
3. Use Live Preview or Preview without making the draft public.
4. Publish the Event.
5. Confirm it appears at `/events/:slug`.

Members, Events, Records, Posts, and Pages now share one generated Payload type contract and one authenticated preview workspace at `/cms-preview/:collection/:slug`. Their Admin editors expose both Preview and Live Preview. Root Pages cannot claim system routes such as `events`, `members`, or `cms-preview`, and referenced Members, Events, Records, or Media must be detached before deletion.

## Safety boundaries

- Production database schema push is disabled.
- Public queries explicitly enforce Payload access control.
- MCP is read-only for Members, Events, Records, Posts, Pages, and Site Settings.
- R2 is optional locally and enabled only when every required credential is present.
- This app does not write back to Notion and does not replace the current production deployment.
