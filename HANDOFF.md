# Handoff

Read this before changing anything. It says what's verified, what isn't, and
which decisions look wrong until you know why.

## Status: built AND verified against a real, running stack

`npm run typecheck`, `npm run lint`, and `npm run build` all pass clean.
Beyond that — unlike the point this file originally shipped at — this has
now actually been run: a local Supabase stack (`npx supabase start`, Docker),
both migrations applied to a real Postgres, and a full browser walkthrough
against it. Specifically confirmed working, live, not just by reading code:

- Both migrations apply cleanly to a fresh Postgres (`npm run db:deploy`).
- **RLS actually blocks anonymous access** — `curl .../rest/v1/posts` with a
  real `anon` key returns `[]`, exactly as designed.
- Admin login works end to end (Supabase Auth, real session cookie).
- **The draft/published split is real**, not just code that looks right: a
  post saved as Draft does not appear on `/blog`; publishing it makes it
  appear; the reverse was also checked.
- The Tiptap editor's full round trip works: typed content → ProseMirror
  JSON → `Post.bodyJson` → `RichTextRenderer`'s `generateHTML` → correct
  rendered article on the public page.
- Cover image upload is a real Supabase Storage round trip: uploaded through
  the admin form → lands in the `media` bucket via the service-role
  client → the resulting public URL genuinely serves the file → renders on
  both the admin preview and the public `/blog` card via `next/image`.
- A quote published with no attribution correctly falls back to the
  author's name, and shows as the homepage's featured quote.
- A social link added in `/bjsm-write/social-links` immediately appears in the
  public footer (no cache to invalidate — see the `force-dynamic` decision
  below).
- Empty states render correctly (`/journal` and the homepage's journal
  section, before any journal entries existed).
- **Found and fixed a real mobile bug during this pass**: the homepage hero
  and the `/about` page were wrapping their above-the-fold content in
  `<Reveal>` (scroll-triggered, `whileInView`), which never fires for
  content that's already the first thing in a short viewport — it rendered
  as invisible on mobile until a scroll that had no reason to happen. Fixed
  by rendering that content in plain, unanimated `div`s instead; see the
  comment left in `app/(site)/page.tsx`. Reveal is now only used for content
  a visitor actually scrolls to.

That first pass was done against a **local** Supabase stack (`supabase
start`), which is ephemeral and has since been discarded along with its
test post/quote/social-link.

**The real cloud project is now live and wired up**: `.env.local` points at
it, both migrations are applied (confirmed via `prisma migrate deploy`
against a database confirmed empty beforehand — see below), RLS is
confirmed blocking anonymous access there too (same `curl` check, real
project), and both Storage buckets (`media`, `newsletters`) exist and are
public. This was the *second* Supabase project given to me in this
conversation — the first one, when inspected before touching anything,
turned out to already contain a different, unrelated app's real data (a
laundry-service system: customers, orders, payments). Nothing was ever
written to that one. Always inspect an unfamiliar database before running
migrations against it; don't assume "empty" from a connection string alone.

**Not yet done on the real project:** no admin login exists yet — that's
the one setup step intentionally left to the user rather than done via API
(see below), and no real content has been published yet.

## Open items, in priority order

1. **Create your admin login** — Supabase dashboard for project
   `eazxnvrdgejuhyikwpcr` → Authentication → Users → Add user → your email +
   a password of your choosing, tick **Auto Confirm User**. This is the one
   step deliberately not automated (see AGENTS.md's stance on not creating
   accounts or handling passwords on the user's behalf) — the account is
   what lets `npm run dev` / the deployed site's `/bjsm-write/login` work for
   you. Do this before deploying so you're not locked out of production.
2. **Real author photo and a real portrait for `/about`.** The user said to
   leave AI-generated imagery out and supply real photos later — `/about`
   currently falls back to an initials placeholder (same pattern the
   original site used for the author photo before this revamp), confirmed
   rendering correctly in the local walkthrough.
3. **First real content.** The local walkthrough's test post/quote/social
   link don't carry over to the real project — write and publish the actual
   first post, journal entry, quote and newsletter issue once the cloud
   project exists.
4. **Decide on backups** (SETUP.md's Backups section) before this holds
   content the user would be upset to lose.
5. **Set `NEXT_PUBLIC_SITE_URL`** before deploying — it currently falls
   back to `localhost:3000` in the sitemap/robots/OG tags on purpose (see
   `lib/site-url.ts`), rather than guessing a real domain.

## Decisions that look wrong until you read why

- **No RLS policies, only `ENABLE ROW LEVEL SECURITY`.** Looks unfinished.
  It isn't — Prisma connects as the table owner and bypasses RLS regardless,
  so a policy here would be dead code. Full reasoning in the migration
  file's header and in `AGENTS.md`.
- **No role/profile table for admin auth.** `lib/auth.ts`'s `requireAdmin()`
  only checks for a valid Supabase session. This looks like a shortcut
  compared to `truckledger`'s `Profile`/`Role` system, but there is exactly
  one possible logged-in user on this site (the Supabase project has one
  admin account, created by hand in SETUP.md §8) — a role table would guard
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
- **The book-launch content (Hero/Acclaim/Story/AboutAuthor/CTASection)
  moved from `/` to `/book` rather than being deleted.** It's real,
  previously-verified copy (real Amazon link, real testimonials) — the
  revamp added a blog on top of it, it didn't replace it.
- **A Google Stitch concept design was used for layout/visual reference
  only, not copied verbatim.** The generated mockups included fabricated
  specifics — a real journalist's name attached to an invented review, an
  ISBN, a page count, named booksellers and prices, a Manila mailing
  address, an audiobook sample player, an email-newsletter signup flow.
  None of that shipped. Only the mockups' actual color/type/spacing system
  (which already matched this project's real palette, since the Stitch
  prompt was built from `app/globals.css`) and structural layout ideas were
  reused. All copy on the site is either the site's pre-existing real
  content or plain, non-fabricated UI labels.
- **Newsletter is downloadable issues, not an email list.** Explicitly
  chosen over a subscriber/email-sending system — no subscriber PII is
  collected anywhere on this site.
- **`SUPABASE_SERVICE_ROLE_KEY` is required here**, unlike `truckledger`
  where it's deliberately left unset. `lib/storage.ts` uses it, server-side
  only, from actions that already called `requireAdmin()` — that's what
  lets the `media`/`newsletters` Storage buckets stay writable with zero
  Storage RLS policies.

## What to verify once the cloud Supabase project exists

Everything in this list was already confirmed once, locally (see Status
above) — this is about repeating the check against the real project, not
discovering new behavior: log in, create a draft post, confirm it does
**not** appear on `/blog`; publish it, confirm it does; confirm the `anon`
key genuinely can't read draft rows (SETUP.md §7); upload a cover image and
a newsletter PDF and confirm both render/download correctly; check `/`,
`/blog`, `/journal`, `/quotes`, `/newsletter`, `/about`, `/book` at
mobile/tablet/desktop widths.
