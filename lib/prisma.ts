import "server-only";

import { PrismaPg } from "@prisma/adapter-pg";

import { PrismaClient } from "@/generated/prisma/client";
import { serverEnv } from "@/lib/env.server";

/**
 * Server-only Prisma client — enforced by `import "server-only"` above, not
 * just by convention.
 *
 * `DATABASE_URL` is the pooled Supabase connection string and must NEVER be
 * exposed to the browser.
 *
 * Prisma 7 requires a driver adapter instead of a `url` in schema.prisma.
 */
function createPrismaClient() {
  const { DATABASE_URL: connectionString } = serverEnv();

  /**
   * `max: 1` because each serverless invocation handles one request at a
   * time; `idleTimeoutMillis` so a frozen instance's socket is released
   * rather than held until the pooler drops it. Same reasoning as
   * truckledger/src/lib/prisma.ts — this project sits behind the same
   * Supabase pooler shape.
   */
  const adapter = new PrismaPg(
    { connectionString, max: 1, idleTimeoutMillis: 10_000 },
    {
      onPoolError: (error) => console.error("[pg pool]", error.message),
    },
  );

  return new PrismaClient({
    adapter,
    log:
      process.env.NODE_ENV === "development" ? ["warn", "error"] : ["error"],
  });
}

type PrismaClientInstance = ReturnType<typeof createPrismaClient>;

const globalForPrisma = globalThis as unknown as {
  prisma?: PrismaClientInstance;
};

/**
 * Lazily constructed so that importing this module (which Next.js does while
 * collecting page data at build time) does not require a live database or a
 * populated `DATABASE_URL`.
 */
function getClient(): PrismaClientInstance {
  if (!globalForPrisma.prisma) {
    globalForPrisma.prisma = createPrismaClient();
  }
  return globalForPrisma.prisma;
}

export const prisma: PrismaClientInstance = new Proxy(
  {} as PrismaClientInstance,
  {
    // `receiver` is deliberately the real client, not the proxy: Prisma
    // exposes its model delegates through prototype getters, and handing
    // those `this === proxy` would re-enter this trap.
    get(_target, prop) {
      const client = getClient();
      return Reflect.get(client, prop, client);
    },
    has(_target, prop) {
      return Reflect.has(getClient(), prop);
    },
  },
);
