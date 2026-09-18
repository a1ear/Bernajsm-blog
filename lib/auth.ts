import "server-only";

import { cache } from "react";

import { createClient } from "@/lib/supabase/server";

/**
 * ADMIN ENFORCEMENT — how this works, and what it deliberately doesn't do.
 *
 * There is exactly one possible logged-in user: the site's author, whose
 * Supabase Auth account is created once, by hand, during setup (see
 * SETUP.md). So "has a valid Supabase session" and "is the author" are the
 * same fact — unlike truckledger's multi-staff Profile/Role table, a role
 * lookup here would be dead weight guarding nothing. Every mutating Server
 * Action calls `requireAdmin()` before it touches the database, so hiding
 * the admin nav is only a UX nicety — this is the real gate.
 *
 * ROW LEVEL SECURITY: RLS is enabled on every table with ZERO policies (see
 * `prisma/migrations/*_enable_rls`). That is not a second copy of the rule
 * above — it exists to slam shut the PostgREST door that Supabase opens on
 * `public` for the browser-visible anon key. Prisma connects as the table
 * owner, which bypasses RLS, so `requireAdmin()` plus the `status:
 * PUBLISHED` filters in the public page queries remain the only
 * authorization logic. Do not add policies; read the comment at the top of
 * that migration first.
 */

export type CurrentUser = {
  id: string;
  email: string;
};

export class AuthorizationError extends Error {
  constructor(message = "You must be signed in to do that.") {
    super(message);
    this.name = "AuthorizationError";
  }
}

/** `cache` dedupes this within a single render pass. */
export const getCurrentUser = cache(async (): Promise<CurrentUser | null> => {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user || !user.email) return null;

  return { id: user.id, email: user.email };
});

/** Throws unless there is an authenticated session. Call first, in every mutating Server Action. */
export async function requireAdmin(): Promise<CurrentUser> {
  const user = await getCurrentUser();
  if (!user) throw new AuthorizationError();
  return user;
}
