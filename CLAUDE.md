@AGENTS.md

# Bernajsm-blog

Personal blog and admin CMS for author Berna JSM —
blog posts, journal entries, quotes, downloadable newsletter issues, and the
existing *Lessons That Matter* book-launch content. Next.js 16 (App Router) ·
Supabase (Postgres + Auth + Storage) · Prisma 7 · Tailwind v4 · Tiptap.

**Read `HANDOFF.md` before making changes.** It records what has and has not
been verified (the app has never run against a real database), the open
items in priority order, and decisions that are already settled. The rules
in `AGENTS.md` above are non-negotiable.

Other docs: `SETUP.md` (Supabase + deploy), `README.md` (what's built).

## Verify with

```bash
npm run typecheck
npm run lint
npm run build
```

There is no live database in this environment — `db:*` scripts need a real
`DATABASE_URL`/`DIRECT_URL` from a Supabase project (see `SETUP.md`) or a
local `supabase start` stack.
