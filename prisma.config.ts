import path from "node:path";
import { config as loadEnv } from "dotenv";
import { defineConfig } from "@prisma/config";

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
 *
 * Plain `process.env.DIRECT_URL` on purpose, NOT `@prisma/config`'s `env()`
 * helper -- `env()` throws the moment this file is loaded if the variable is
 * missing, and this file loads for EVERY Prisma CLI invocation, including
 * `prisma generate` (run from `postinstall` on every `npm install`, on any
 * machine, before `.env.local` may even exist). `generate` never reads
 * `datasource.url` at all -- it only needs the schema. Only `migrate`/`db`
 * commands actually dereference this, and Prisma's own error message for a
 * genuinely missing connection string there is clear enough on its own.
 */
export default defineConfig({
  schema: path.join("prisma", "schema.prisma"),
  migrations: {
    path: path.join("prisma", "migrations"),
  },
  datasource: {
    url: process.env.DIRECT_URL,
  },
});
