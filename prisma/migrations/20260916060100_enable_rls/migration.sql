-- =========================================================================
-- Enable Row Level Security on every table. WITH ZERO POLICIES. ON PURPOSE.
-- =========================================================================
--
-- WHY THIS EXISTS
--
-- Supabase's bootstrap SQL grants the `anon` and `authenticated` roles
-- default privileges on tables in `public`, and PostgREST publishes that
-- schema at https://<project-ref>.supabase.co/rest/v1/ authorized by
-- NEXT_PUBLIC_SUPABASE_ANON_KEY -- a key that, by design, ships inside the
-- JavaScript bundle every visitor downloads.
--
-- With RLS off, that key is a full read/write handle on this content. Anyone
-- who opens devtools can GET every draft post, journal entry, and unpublished
-- newsletter, and can PATCH/DELETE any row directly through PostgREST. The
-- authorization code in lib/auth.ts never runs, because none of those
-- requests go through the Next.js app at all.
--
-- Enabling RLS with no policies makes the default deny final: every
-- PostgREST request under `anon` / `authenticated` matches nothing and
-- returns nothing.
--
-- WHY THERE ARE NO POLICIES -- DO NOT ADD ANY
--
-- Prisma connects as `postgres`, the owner of these tables, and a table owner
-- BYPASSES row level security entirely unless FORCE ROW LEVEL SECURITY is
-- also set (it deliberately is not, below). So a policy written here would
-- never be evaluated for any query the application makes.
--
-- A per-row policy mirroring "public reads only published rows, only the
-- admin can write" would therefore be a second, silently dead copy of
-- lib/auth.ts and the `status: PUBLISHED` filters in the public page
-- queries: it could drift from the real rules for months without a single
-- test failing, and would read to the next person as though the database
-- were enforcing the published/draft split when it is not.
--
-- The app's authorization and publish-status filtering live in lib/auth.ts
-- and the Next.js server queries, and nowhere else. This migration exists
-- solely to shut the PostgREST door. If you are here to "finish" the RLS
-- work by adding policies: the work is finished.
--
-- Enforcing rules in the database instead would mean giving up the owner
-- connection -- a per-user Postgres role or a JWT-forwarding connection, so
-- every query pays RLS evaluation cost and the app's Prisma queries would
-- need to carry auth context they don't have today. Not worth it for a
-- single-admin blog; revisit only if that changes.
-- =========================================================================

ALTER TABLE "authors" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "posts" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "quotes" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "newsletters" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "social_links" ENABLE ROW LEVEL SECURITY;
