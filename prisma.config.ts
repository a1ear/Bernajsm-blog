import path from "node:path";
import { config as loadEnv } from "dotenv";
import { defineConfig, env } from "@prisma/config";

// Prisma 7 does not read .env automatically once a prisma.config.ts exists.
// Load .env.local first so it wins over .env (dotenv never overwrites an
// already-set variable), matching Next.js's own precedence.
loadEnv({ path: ".env.local", quiet: true });
loadEnv({ path: ".env", quiet: true });

/**
 * `datasource.url` is only used by the CLI for migrations / introspection, so
 * it points at the DIRECT (non-pooled) Supabase connection — migrations can't
 * run over the pooled connection. Application queries go through the pooled
 * `DATABASE_URL` via the `@prisma/adapter-pg` driver adapter in
 * `lib/prisma.ts`.
 */
export default defineConfig({
  schema: path.join("prisma", "schema.prisma"),
  migrations: {
    path: path.join("prisma", "migrations"),
  },
  datasource: {
    url: env("DIRECT_URL"),
  },
});
