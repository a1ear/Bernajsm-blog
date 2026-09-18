import { z } from "zod";

/**
 * Browser-safe environment. Only `NEXT_PUBLIC_*` values live here, and this
 * module is deliberately separate from `env.server.ts`: a single combined
 * module would drag the service-role key and `DATABASE_URL` into any client
 * bundle that touched it. Nothing here is secret — `NEXT_PUBLIC_*` values are
 * compiled into the JavaScript every visitor downloads.
 *
 * Each variable is read as a literal `process.env.NEXT_PUBLIC_X` member
 * expression, which is what lets Next.js inline the value at build time.
 * `process.env` is not a real object in the browser bundle, so destructuring
 * it or indexing it dynamically would silently yield `undefined`.
 */
const clientEnvSchema = z.object({
  NEXT_PUBLIC_SUPABASE_URL: z
    .url("NEXT_PUBLIC_SUPABASE_URL must be a full URL, e.g. https://abc.supabase.co"),
  NEXT_PUBLIC_SUPABASE_ANON_KEY: z
    .string()
    .min(1, "NEXT_PUBLIC_SUPABASE_ANON_KEY is required."),
});

export type ClientEnv = z.infer<typeof clientEnvSchema>;

const rawClientEnv = {
  NEXT_PUBLIC_SUPABASE_URL: process.env.NEXT_PUBLIC_SUPABASE_URL,
  NEXT_PUBLIC_SUPABASE_ANON_KEY: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
};

/**
 * Turns a Zod failure into one actionable line naming every missing or
 * malformed variable, instead of a stack trace or "Something went wrong."
 */
export function formatEnvError(error: z.ZodError, scope: string): Error {
  const details = error.issues
    .map((issue) => `  - ${issue.path.join(".") || "(root)"}: ${issue.message}`)
    .join("\n");

  return new Error(
    `Invalid ${scope} environment configuration:\n${details}\n\n` +
      "Copy .env.example to .env.local and fill in the values from your " +
      "Supabase project settings.",
  );
}

let cached: ClientEnv | null = null;

/**
 * Validated public environment.
 *
 * Validation happens on first use rather than at module import, so that
 * `next build` — which imports every module while collecting page data, with
 * no `.env` present in CI — does not fail on configuration that only matters
 * at runtime. The first request on a misconfigured deploy still gets a clear,
 * named error instead of a vague failure deep inside the Supabase client.
 */
export function clientEnv(): ClientEnv {
  if (cached) return cached;

  const parsed = clientEnvSchema.safeParse(rawClientEnv);
  if (!parsed.success) throw formatEnvError(parsed.error, "public");

  cached = parsed.data;
  return cached;
}
