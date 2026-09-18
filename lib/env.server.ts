import "server-only";

import { z } from "zod";

import { formatEnvError } from "@/lib/env.client";

/**
 * Server-only environment. `import "server-only"` makes importing this from a
 * Client Component a build error, so the Postgres connection strings and the
 * Supabase service-role key cannot leak into the browser bundle. Public
 * values live in `env.client.ts`.
 */
const serverEnvSchema = z.object({
  DATABASE_URL: z
    .string()
    .min(1, "DATABASE_URL is required (pooled Supabase connection, port 6543)."),
  /**
   * Not used by the running app — the Prisma CLI reads it via
   * `prisma.config.ts` for migrations. Validated here anyway because a
   * deploy that can build but cannot migrate is a half-configured deploy.
   */
  DIRECT_URL: z
    .string()
    .min(1, "DIRECT_URL is required (direct Supabase connection, port 5432)."),
  /**
   * Used only by server actions to upload to Supabase Storage after
   * `requireAdmin()` has already run — never sent to the browser. This is
   * what lets the `media`/`newsletters` buckets stay writable without any
   * Storage RLS policy: the browser never holds a credential that can write.
   */
  SUPABASE_SERVICE_ROLE_KEY: z
    .string()
    .min(1, "SUPABASE_SERVICE_ROLE_KEY is required (Supabase project settings -> API)."),
});

export type ServerEnv = z.infer<typeof serverEnvSchema>;

let cached: ServerEnv | null = null;

/**
 * Validated server environment.
 *
 * Lazy for the same reason as `clientEnv()`: `next build` imports this module
 * while collecting page data and must not require a populated `.env`.
 */
export function serverEnv(): ServerEnv {
  if (cached) return cached;

  const parsed = serverEnvSchema.safeParse({
    DATABASE_URL: process.env.DATABASE_URL,
    DIRECT_URL: process.env.DIRECT_URL,
    SUPABASE_SERVICE_ROLE_KEY: process.env.SUPABASE_SERVICE_ROLE_KEY,
  });
  if (!parsed.success) throw formatEnvError(parsed.error, "server");

  cached = parsed.data;
  return cached;
}
