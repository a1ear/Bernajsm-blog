# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may
all differ from your training data. Read the relevant guide in
`node_modules/next/dist/docs/` before writing any code. Heed deprecation
notices.

# Bernajsm-blog project rules

## A `"use server"` file may export ONLY async functions

Every export of a `"use server"` module is compiled into a server action
reference — a stub that performs a network round trip — not the value you
wrote. Export a constant, a Zod schema, an object or a class from one and
importers silently receive that stub instead.

The failure is silent in exactly the ways that matter: `tsc` is happy,
ESLint is happy, `next build` is green, and the app breaks at runtime on the
first interaction. This is a real, documented Next.js footgun — the sibling
`truckledger` project in this workspace shipped it once (`loginSchema`
exported from an actions file reached `zodResolver` in the browser as an
async proxy with no `safeParseAsync`, and made it impossible for anyone to
sign in) — so the rule here is preventative, not theoretical.

So:

- Schemas, types and constants shared with Client Components go in a plain
  module — `lib/validation.ts` for Zod schemas, `lib/slug-client.ts` for the
  pure slug helper `components/admin/PostForm.tsx` needs client-side.
- A non-exported helper inside a `"use server"` file is fine; only exports
  are converted.
- Exported `type`s are erased at compile time and are technically safe, but
  keep them out anyway so the rule stays a rule you can check by eye.

When touching any `actions.ts` under `app/bjsm-write/`, check that every `export`
is an `async function`.

## There is exactly one admin, and the database doesn't enforce that

Unlike a multi-staff app, this site has one possible logged-in user — the
author. `lib/auth.ts`'s `requireAdmin()` just checks for a valid Supabase
session; there is no role/profile table, because a role table guarding
against a user who cannot exist would be dead weight. If this ever becomes a
multi-author blog, that's the file to revisit first.

## Row Level Security

RLS is enabled on all tables with zero policies, and that is deliberate.
Read the comment at the top of `prisma/migrations/*_enable_rls/migration.sql`
before changing anything about it — Prisma connects as the table owner and
bypasses RLS regardless, so a policy here would be dead code. The actual
"public sees published only, admin sees everything" rule lives in
`lib/queries.ts` and `lib/auth.ts`.

## Post bodies are ProseMirror JSON, never raw HTML

`Post.bodyJson` stores Tiptap's structured JSON output, not an HTML string.
`components/editor/RichTextRenderer.tsx` re-serializes it through the exact
same extension list used to edit it (`components/editor/extensions.ts`).
Do not add a path that accepts raw HTML and renders it — that reintroduces
the injection risk this design avoids.

## Public pages are `force-dynamic` on purpose

`app/(site)/layout.tsx` sets `export const dynamic = "force-dynamic"` for
the whole public site, because every page reads from Postgres (the Footer
alone queries social links). This means a published post is live
immediately, with no cache to invalidate. Don't remove it to chase static-
generation performance without first re-adding the `revalidatePath` calls
already sitting (currently inert) in every admin action file.

<!-- BEGIN:nextjs-agent-rules -->

# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->
