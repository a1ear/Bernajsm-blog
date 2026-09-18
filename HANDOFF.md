# Handoff

Read this before changing anything. It says what's verified, what isn't, and
which decisions look wrong until you know why.

## Status: built, deployed, and logged into for real

`npm run typecheck`, `npm run lint`, and `npm run build` all pass clean. Well
beyond that, though — this has actually been run, twice over: once against a
local Supabase stack during development, and now for real:

- **Live at <https://bernajsm-blog.vercel.app>**, deployed from
  [github.com/a1ear/Bernajsm-blog](https://github.com/a1ear/Bernajsm-blog),
  Supabase project `eazxnvrdgejuhyikwpcr`.
- Both migrations applied to that real Postgres via `prisma migrate deploy`,
  confirmed empty beforehand (see the wrong-project note below — worth
  reading).
- **RLS confirmed blocking anonymous access on the live project** —
  `curl .../rest/v1/posts` with the real `anon`/publishable key returns `[]`.
- Both Storage buckets (`media`, `newsletters`) exist on the live project
  and are public.
- **The admin account exists and login works** at
  `/bjsm-write/login` on the live site — created by hand via SQL
  (`auth.users` + `auth.identities` insert, see the git history of this file
  for the exact statements if you ever need to create a second one, though
  this site is deliberately single-admin — see below).
- Locally, before deployment, a full walkthrough also confirmed: draft posts
  correctly hidden from `/blog` until published; the Tiptap editor's full
  round trip (typed content → ProseMirror JSON → `RichTextRenderer` →
  correct rendered article); cover image upload as a real Supabase Storage
  round trip (uploaded → public URL → actually serves the file → renders via
  `next/image`); a quote with no attribution falling back to the author's
  name; a social link added in admin appearing in the public footer with no
  redeploy needed; empty states rendering correctly before any content
  existed.
- **Found and fixed two real bugs during this process, not just theoretical
  ones:**
  1. The homepage hero and the (now-removed) `/about` intro were wrapping
     above-the-fold content in `<Reveal>` (scroll-triggered `whileInView`),
     which never fires for content that's already the first thing in a
     short viewport — invisible on mobile until a scroll that had no reason
     to happen. Fixed by using plain, unanimated `div`s for that content;
     `Reveal` is now only used for content a visitor actually scrolls to.
  2. `prisma.config.ts` used `@prisma/config`'s `env()` helper for
     `datasource.url`, which throws the instant the config file loads if
     `DIRECT_URL` is missing — and this file loads for every Prisma CLI
     call, including `generate` (run from `postinstall` on every
     `npm install`, before env vars are necessarily present). Broke the
     Vercel build at the install step. Fixed by reading
     `process.env.DIRECT_URL` directly instead, verified by running
     `prisma generate` with `.env.local` removed entirely.

## The wrong-Supabase-project incident — read this before touching env vars

Mid-setup, the user pasted real Supabase credentials twice. The first set
turned out to belong to a **different, already-populated app** — a
laundry-service system with real customer/order/payment data — discovered by
inspecting the database's actual tables *before* running any migration
against it. Nothing was ever written there. The second set
(`eazxnvrdgejuhyikwpcr`) checked out genuinely empty and is what's live now.

**Lesson embedded in the process, not just this paragraph**: never assume a
connection string points at an empty/intended database. Query
`information_schema.tables` (or equivalent) and actually look before running
`migrate deploy` or anything else mutating.

A second, smaller version of the same class of mistake happened again later
during admin-account creation via SQL: the user ran the account-creation
query in what turned out to be the *wrong* Supabase project's SQL Editor
(confirmed by a `public.profiles` table appearing in a screenshot — a table
that doesn't exist anywhere in this project's schema). Always confirm the
project ref in the URL (`supabase.com/dashboard/project/<ref>`) matches
`eazxnvrdgejuhyikwpcr` before running SQL against "this" project.

## Open items, in priority order

1. **Real author photo.** The user said to leave AI-generated imagery out
   and supply real photos later — `/about` currently falls back to an
   initials placeholder, confirmed rendering correctly.
2. **First real content.** Nothing has been published on the live site yet
   — write and publish the actual first post, journal entry, quote, and
   newsletter issue.
3. **Decide on backups** (SETUP.md's Backups section) before this holds
   content the user would be upset to lose.
4. **Set `NEXT_PUBLIC_SITE_URL`** in Vercel to the real production domain —
   it currently falls back to `localhost:3000` in the sitemap/robots/OG tags
   on purpose (see `lib/site-url.ts`) rather than guessing.
5. **Custom domain**, if wanted — currently just the `*.vercel.app` one.

## Decisions that look wrong until you read why

- **No RLS policies, only `ENABLE ROW LEVEL SECURITY`.** Looks unfinished.
  It isn't — Prisma connects as the table owner and bypasses RLS regardless,
  so a policy here would be dead code. Full reasoning in the migration
  file's header and in `AGENTS.md`.
- **No role/profile table for admin auth.** `lib/auth.ts`'s `requireAdmin()`
  only checks for a valid Supabase session. This looks like a shortcut
  compared to `truckledger`'s `Profile`/`Role` system, but there is exactly
  one possible logged-in user on this site — a role table would guard
  against a user who structurally cannot exist.
- **`Post` is one table for both blog posts and journal entries**, split by
  a `type` enum instead of two separate tables/editors. They're identical in
  shape; splitting them would have meant maintaining two copies of the same
  CRUD screen and editor for no behavioral difference.
- **Public site is `force-dynamic`, not statically generated.** Every public
  page reads from Postgres (even the footer, for social links), so build-
  time prerendering would either fail (no DB reachable at build time in most
  CI setups) or serve stale content. `revalidatePath` calls remain in every
  admin action as documentation of intent, but they're currently inert since
  nothing is cached.
- **Post bodies are stored as Tiptap/ProseMirror JSON, not HTML.**
  `RichTextRenderer` re-serializes that JSON through the same extension list
  used to edit it. This is what makes `dangerouslySetInnerHTML` in that one
  component safe: the HTML string it renders was generated from a
  schema-constrained document, not accepted as raw input.
- **There is no dedicated `/book` page.** It existed early on (Hero, a
  testimonials/Acclaim grid, Story, AboutAuthor, a CTA section — all real,
  previously-verified copy), then was removed entirely at the user's
  request as redundant with the homepage's own book teaser and the About
  page, both of which now link straight to the real Amazon listing. The
  book's real, non-fabricated copy that's still relevant (the memoir's
  story, the author's bio) lives on in `lib/content.ts` for those two pages.
- **The admin route is `/bjsm-write`, not `/admin`.** Renamed at the user's
  request to cut down on bot/scanner traffic hitting a well-known path — the
  actual security boundary is still the login itself (Supabase Auth +
  server-side `requireAdmin()` checks on every mutation), not the URL.
  `robots.ts` deliberately has no `disallow` entry naming it, since a public
  robots.txt is the wrong place to announce where the sensitive area lives;
  the admin layout's `noindex` metadata does that job instead.
- **A Google Stitch concept design was used for layout/visual reference
  only, not copied verbatim.** The generated mockups included fabricated
  specifics — a real journalist's name attached to an invented review, an
  ISBN, a page count, named booksellers and prices, a Manila mailing
  address, an audiobook sample player, an email-newsletter signup flow.
  None of that shipped. Only the mockups' actual color/type/spacing system
  and structural layout ideas were reused. All copy on the site is either
  the site's pre-existing real content or plain, non-fabricated UI labels.
- **Newsletter is downloadable issues, not an email list.** Explicitly
  chosen over a subscriber/email-sending system — no subscriber PII is
  collected anywhere on this site.
- **`SUPABASE_SERVICE_ROLE_KEY` is required here**, unlike `truckledger`
  where it's deliberately left unset. `lib/storage.ts` uses it, server-side
  only, from actions that already called `requireAdmin()` — that's what
  lets the `media`/`newsletters` Storage buckets stay writable with zero
  Storage RLS policies.
- **The author's display name is "Berna JSM" everywhere**, not "Bernadette
  Magbanua" — changed at the user's request. `site.authorName` is the single
  source; nothing else hardcodes the old name.
