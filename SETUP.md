# Bernajsm-blog — Supabase setup, migration and deployment

Everything needed to take this repo from source code to a live blog you can
publish to. Work through it in order.

Budget about 30 minutes. Steps 1–8 get it running on your own machine.
Steps 9–10 put it online.

---

## Before you start

You need:

- **Node.js 20 or newer** — check with `node -v`.
- A **Supabase account** (free tier is enough to start).
- The project folder at `Documents\My Projects\Bernajsm-blog`.

> **One thing to know up front.** This app has never been run against a real
> database — there wasn't one to run it against while it was being built.
> It typechecks, lints and builds cleanly, but step 6 below is where theory
> meets a real Postgres for the first time. Work through the verification
> steps rather than skipping them.

---

## 1. Create the Supabase project

1. Go to [supabase.com](https://supabase.com) and sign in.
2. **New project**.
3. Fill in:
   - **Name** — `bernajsm-blog` (or anything).
   - **Database password** — generate a strong one and **save it now**. It
     appears in your connection strings and Supabase won't show it again.
   - **Region** — pick whatever's closest to most of your readers.
4. Create it and wait ~2 minutes for provisioning.

---

## 2. Create the two Storage buckets

Dashboard → **Storage** → **New bucket**, twice:

| Bucket name    | Public? | Holds                                      |
| -------------- | ------- | ------------------------------------------- |
| `media`        | Yes     | Post cover images, inline post images, author photo |
| `newsletters`  | Yes     | Newsletter issue files (PDFs, etc.)         |

Both must be **public** — that's what lets a published post's cover image or
a newsletter download link work without a signed URL. Nothing in this app
ever uploads through the browser directly (see `lib/storage.ts`), so there's
no Storage RLS policy to write either.

---

## 3. Collect the five values you need

**Connection strings** — Project Settings → **Database** → Connection string
→ **URI**. You need two, differing only in port:

| Variable       | Port   | Used by                                    |
| -------------- | ------ | ------------------------------------------ |
| `DATABASE_URL` | `6543` | The app at runtime (pooled, via Supavisor) |
| `DIRECT_URL`   | `5432` | The Prisma CLI for migrations              |

Both look like:

```
postgresql://postgres.<project-ref>:<password>@aws-0-<region>.pooler.supabase.com:<port>/postgres
```

Replace the password with the one from step 1. If it contains special
characters (`@`, `#`, `/`, `?`), URL-encode them — `@` becomes `%40`, `#`
becomes `%23`.

**API values** — Project Settings → **API**:

| Variable                        | Where                                        |
| -------------------------------- | --------------------------------------------- |
| `NEXT_PUBLIC_SUPABASE_URL`       | "Project URL"                                |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY`  | "Project API keys" → **anon public**         |
| `SUPABASE_SERVICE_ROLE_KEY`      | "Project API keys" → **service_role secret** |

Unlike a typical "never copy the service-role key" warning, this app
*does* need it — `lib/storage.ts` uses it, server-side only, to upload
files after `requireAdmin()` has already run. `.env.example` explains
exactly where it's allowed to be used.

---

## 4. Create your `.env.local`

```bash
cp .env.example .env.local
```

Fill in all five values. It's git-ignored, so it never gets committed.

---

## 5. Install dependencies

```bash
npm install
```

This also runs `prisma generate` automatically (via `postinstall`), creating
the typed database client in `generated/`. That folder is git-ignored — it's
regenerated, never committed.

---

## 6. Run the migrations

Two migrations ship with the repo, in `prisma/migrations/`:

| Migration        | What it does                                          |
| ----------------- | ------------------------------------------------------ |
| `..._init`        | Creates all 5 tables, 2 enums, indexes                |
| `..._enable_rls`  | Enables Row Level Security and revokes public access  |

```bash
npm run db:deploy
```

> **Use `db:deploy`, not `db:migrate`.** `deploy` applies migrations that
> already exist. `db:migrate` is for *authoring a new one* after you change
> `prisma/schema.prisma`.

### Verify the schema actually matches

The baseline migration was hand-authored (the machine it was written on
couldn't reach a live database). Confirm it matches on your machine, where
the network works:

```bash
npx prisma migrate diff \
  --from-schema-datasource prisma/schema.prisma \
  --to-schema-datamodel prisma/schema.prisma \
  --script
```

**An empty result means the database matches and you're good.** If it
prints SQL, that's the drift — save it as a new migration
(`prisma/migrations/<timestamp>_fix_baseline/migration.sql`), apply it, and
re-run until empty.

---

## 7. Verify Row Level Security — do not skip this

Your `anon` key ships inside the JavaScript every visitor downloads. Without
RLS, that key is a full read/write handle on every table, including
unpublished drafts.

```bash
curl "https://<project-ref>.supabase.co/rest/v1/posts?select=*" \
  -H "apikey: <your-anon-key>"
```

- ✅ **Expected:** an empty array `[]`, or a permission error.
- ❌ **If you see actual rows, stop.** RLS did not apply. Re-run
  `npm run db:deploy`, confirm `_enable_rls` is in the `_prisma_migrations`
  table, and re-test.

> **Why there are no RLS *policies*:** Prisma connects as the table owner,
> which bypasses row-level policies entirely. A policy mirroring the app's
> "published only" rule would never execute — it'd be dead code that looks
> like security. RLS *enabled with zero policies* is the actual fix; the
> real filter lives in `lib/queries.ts` and `lib/auth.ts`. The long version
> is in the migration file's header comment.

---

## 8. Create your admin account and run it

There is no self-serve signup — you are the only possible user.

**a.** Supabase dashboard → **Authentication → Users → Add user**. Enter
your email and a password, and tick **Auto Confirm User** (otherwise the
account sits unconfirmed and can't sign in).

**b.** Start the app:

```bash
npm run dev
```

Open <http://localhost:3000/bjsm-write/login> and sign in.

**c.** Go to **Profile** in the admin sidebar and fill in your name, bio and
photo — this is what the public `/about` page shows. Then add your social
links under **Social Links**, and start writing under **Posts & Journal**.

---

## 9. Put it in version control and push

```bash
cd "C:\Users\ACER\Documents\My Projects\Bernajsm-blog"
git add -A
git commit -m "Initial commit"
```

Then create a repo on GitHub and push:

```bash
git remote add origin https://github.com/<you>/bernajsm-blog.git
git branch -M main
git push -u origin main
```

`.env.local` is git-ignored — verify with `git status` before pushing that
no `.env` file is listed.

---

## 10. Deploy to Vercel

1. [vercel.com](https://vercel.com) → **Add New → Project** → import your
   GitHub repo. It detects Next.js automatically.
2. **Environment Variables** — add all five from your `.env.local`, plus
   `NEXT_PUBLIC_SITE_URL` set to your real domain (used by the sitemap,
   robots.txt and social share previews). Set them for Production, Preview
   and Development.
3. **Deploy.**

**Vercel does not run your migrations.** After any deploy that changes the
schema, run `npm run db:deploy` yourself against production.

### After the first deploy

- Sign in at `/bjsm-write/login` on the real URL.
- Re-run the RLS check from §7 against the deployed app.
- Supabase dashboard → **Authentication → URL Configuration** → set **Site
  URL** to your Vercel domain, so auth redirects resolve correctly.

---

## Backups

Supabase Free has no restorable backups and no point-in-time recovery, and
free projects pause after ~7 days of inactivity. For a personal blog that's a
real but lower-stakes risk than a business ledger — the fix, when you're
ready:

1. A scheduled `pg_dump` (a weekly GitHub Action, same shape as
   `truckledger`'s `backup.yml`, is the cheapest option — ask for it to be
   set up the same way if you want it here).
2. Test a restore once, so an untested backup doesn't turn out to be a hope
   rather than a backup.
3. Supabase Pro (~$25/month) removes the pause and adds daily automated
   backups — worth it once the blog has content you'd be upset to lose.

---

## Troubleshooting

| Symptom | Cause and fix |
| --- | --- |
| `Can't reach database server` | Wrong password or an unencoded special character in the connection string. |
| `prisma migrate` hangs or errors on port 6543 | Migrations need the **direct** connection — check `DIRECT_URL` uses port `5432`. |
| Cover image / newsletter upload fails | `SUPABASE_SERVICE_ROLE_KEY` missing or wrong, or the `media`/`newsletters` bucket isn't public. |
| Login page reloads without signing in | The auth user isn't confirmed — Supabase → Authentication → Users → confirm them. |
| `Something went wrong. Please try again.` on every action | Usually a missing/malformed env var — check server logs, which name the exact variable. |
| RLS check in §7 returns real rows | The `_enable_rls` migration didn't apply. Do not publish anything until this returns empty. |
| Cover images 404 or don't load via `next/image` | Check `next.config.ts`'s `images.remotePatterns` matches your Supabase project's storage host. |

---

## Command reference

| Command | What it does |
| --- | --- |
| `npm run dev` | Dev server on :3000 |
| `npm run build` | Production build |
| `npm run typecheck` | `tsc --noEmit` |
| `npm run lint` | ESLint |
| `npm run db:deploy` | **Apply existing migrations** (setup and production) |
| `npm run db:migrate` | Author a new migration after a schema change |
| `npm run db:studio` | Browse and edit the database in a GUI |
| `npm run db:generate` | Regenerate the Prisma client |
