import "server-only";

import { cookies } from "next/headers";
import { createServerClient } from "@supabase/ssr";

import { clientEnv } from "@/lib/env.client";

/**
 * Supabase client for Server Components, Server Actions and route handlers.
 *
 * `cookies()` is async in Next.js 16, so this helper is async too.
 */
export async function createClient() {
  const cookieStore = await cookies();
  const { NEXT_PUBLIC_SUPABASE_URL, NEXT_PUBLIC_SUPABASE_ANON_KEY } =
    clientEnv();

  return createServerClient(
    NEXT_PUBLIC_SUPABASE_URL,
    NEXT_PUBLIC_SUPABASE_ANON_KEY,
    {
      cookies: {
        getAll() {
          return cookieStore.getAll();
        },
        setAll(cookiesToSet) {
          try {
            for (const { name, value, options } of cookiesToSet) {
              cookieStore.set(name, value, options);
            }
          } catch {
            // `setAll` is called from a Server Component, where cookies are
            // read-only. Session refresh is handled in `lib/supabase/proxy.ts`,
            // so this is safe to ignore.
          }
        },
      },
    },
  );
}
