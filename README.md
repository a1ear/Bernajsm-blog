# Bernajsm-blog

A personal blog and lightweight CMS for author Bernadette Magbanua ("Berna
JSM") — daily/weekly blog essays, shorter journal entries, quotes,
downloadable newsletter issues, and the original *Lessons That Matter*
book-launch page, all publishable from a private admin area. Built with
Next.js (App Router), TypeScript, Tailwind CSS v4, Framer Motion, Supabase
(Postgres + Auth + Storage), Prisma 7, and Tiptap.

**Read `HANDOFF.md` before changing anything** — it records what's verified
and what isn't. **Read `SETUP.md`** to actually run this against a real
Supabase project; it has never been run against one yet.

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

- **Public site** — home, `/book` (the original book-launch page), `/blog`,
  `/journal`, `/quotes`, `/newsletter`, `/about`, `/privacy-policy`. Every
  listing page uses real pagination, not an infinite scroll cap.
- **Admin (`/bjsm-write`, behind Supabase Auth)** — a dashboard, a shared
  editor for blog posts and journal entries (Tiptap, with image upload),
  and CRUD screens for quotes, newsletter issues (file upload), social
  links, and the author's own profile/bio.
- **Book content untouched** — the original `lib/content.ts` copy (real
  Amazon link, real testimonials, real author bio) just moved from `/` to
  `/book` to make room for the blog on the homepage.

## Structure

- `app/(site)/` — the public site, sharing `app/(site)/layout.tsx` (Navbar +
  Footer)
- `app/bjsm-write/login/` — sign-in, outside the admin shell
- `app/bjsm-write/(dashboard)/` — the admin shell and every CRUD screen, gated by
  `proxy.ts` + `lib/auth.ts`
- `components/sections/` — the original book-launch sections, now used only
  on `/book`
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

- Verified with a clean `npm run typecheck`, `npm run lint`, and
  `npm run build`. Not yet verified against a live database — see
  `HANDOFF.md`.
- The Instagram/Pinterest footer links from the original site are now just
  two rows in the `SocialLink` table, editable (and extendable to any
  platform) from `/bjsm-write/social-links`.
