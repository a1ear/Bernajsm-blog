"use client";

import { createBrowserClient } from "@supabase/ssr";

import { clientEnv } from "@/lib/env.client";

/**
 * Browser-side Supabase client. Only ever sees the public anon key — the
 * service-role key and the Postgres connection strings stay on the server.
 */
export function createClient() {
  const { NEXT_PUBLIC_SUPABASE_URL, NEXT_PUBLIC_SUPABASE_ANON_KEY } =
    clientEnv();

  return createBrowserClient(
    NEXT_PUBLIC_SUPABASE_URL,
    NEXT_PUBLIC_SUPABASE_ANON_KEY,
  );
}
