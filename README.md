# Bernajsm-blog

A personal blog and lightweight CMS for author Berna JSM — daily/weekly blog
essays, shorter journal entries, quotes, and downloadable newsletter issues,
all publishable from a private admin area. Built with Next.js (App Router),
TypeScript, Tailwind CSS v4, Framer Motion, Supabase (Postgres + Auth +
Storage), Prisma 7, and Tiptap.

**Read `HANDOFF.md` before changing anything** — it records what's verified
and what isn't, and the decisions that look wrong until you read why.

## Getting started

```bash
npm install
cp .env.example .env.local   # fill in your Supabase project's values
npm run db:deploy            # apply migrations
npm run dev
```

Open <http://localhost:3000> for the public site, or
<http://localhost:3000/bjsm-write/login> to sign in and publish.

## What's here

- **Public site** — home, `/blog`, `/journal`, `/quotes`, `/newsletter`,
  `/about`, `/privacy-policy`. Every listing page uses real pagination, not
  an infinite scroll cap. The book (*Lessons That Matter*) is promoted from
  the homepage and the About page directly out to its Amazon listing —
  there's no separate book-launch page.
- **Admin (`/bjsm-write`, behind Supabase Auth)** — a dashboard, a shared
  editor for blog posts and journal entries (Tiptap, with image upload),
  and CRUD screens for quotes, newsletter issues (file upload), social
  links, and the author's own profile/bio.

## Structure

- `app/(site)/` — the public site, sharing `app/(site)/layout.tsx` (Navbar +
  Footer)
- `app/bjsm-write/login/` — sign-in, outside the admin shell
- `app/bjsm-write/(dashboard)/` — the admin shell and every CRUD screen, gated by
  `proxy.ts` + `lib/auth.ts`
- `components/content/` — public-facing post/quote cards, pagination, empty
  states
- `components/editor/` — the Tiptap editor and its matching server-side
  renderer (same extension list on both sides — see `AGENTS.md`)
- `components/admin/` — admin forms and form controls
- `lib/content.ts` — book/site copy that isn't in the database
- `lib/queries.ts` — every public-facing "published only" database read
- `prisma/schema.prisma` — `Post` (blog + journal), `Quote`, `Newsletter`,
  `SocialLink`, `Author`

## Notes

- Verified against both a local Supabase stack and the real production
  project — login, publish, draft/published visibility, image and file
  uploads, and RLS have all actually been run, not just read as code. See
  `HANDOFF.md` for the full list.
- Social links (Instagram, Pinterest, or anything else) are rows in the
  `SocialLink` table, editable from `/bjsm-write/social-links` — the footer
  picks them up immediately, no redeploy needed.
