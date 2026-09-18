import { AuthorizationError, getCurrentUser } from "@/lib/auth";

/**
 * Server Actions return this instead of throwing, so forms can show a real
 * message. Redirects still throw (Next.js uses a control-flow exception for
 * them) and must not be swallowed — see `isRedirectError`.
 */
export type ActionResult =
  | { ok: true; message?: string }
  | { ok: false; error: string; fieldErrors?: Record<string, string[]> };

function isRedirectError(error: unknown): boolean {
  return (
    typeof error === "object" &&
    error !== null &&
    "digest" in error &&
    typeof (error as { digest?: unknown }).digest === "string" &&
    (error as { digest: string }).digest.startsWith("NEXT_REDIRECT")
  );
}

/** Known Postgres/Prisma failures worth translating for the user. */
function friendlyPrismaMessage(error: unknown): string | null {
  if (
    typeof error === "object" &&
    error !== null &&
    "code" in error &&
    (error as { code?: unknown }).code === "P2002"
  ) {
    return "That value is already in use — pick another.";
  }
  return null;
}

/**
 * Logs a failed action WITHOUT serialising the error object — only the
 * message, the error code and the acting user's id go out.
 */
async function logActionFailure(error: unknown): Promise<void> {
  const name = error instanceof Error ? error.name : typeof error;
  const message =
    error instanceof Error ? error.message : "Non-Error value thrown.";

  const rawCode =
    typeof error === "object" && error !== null && "code" in error
      ? (error as { code?: unknown }).code
      : undefined;
  const code = typeof rawCode === "string" ? rawCode : undefined;

  let userId: string | undefined;
  try {
    userId = (await getCurrentUser())?.id;
  } catch {
    userId = undefined;
  }

  console.error("[action] failed", {
    name,
    message,
    ...(code ? { code } : {}),
    ...(userId ? { userId } : {}),
  });
}

/** Wraps a Server Action body, turning thrown errors into an ActionResult. */
export async function runAction(
  fn: () => Promise<ActionResult>,
): Promise<ActionResult> {
  try {
    return await fn();
  } catch (error) {
    if (isRedirectError(error)) throw error;

    if (error instanceof AuthorizationError) {
      return { ok: false, error: error.message };
    }

    const friendly = friendlyPrismaMessage(error);
    if (friendly) return { ok: false, error: friendly };

    await logActionFailure(error);
    return {
      ok: false,
      error: "Something went wrong. Please try again.",
    };
  }
}
