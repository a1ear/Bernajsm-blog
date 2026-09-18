import "server-only";

import { prisma } from "@/lib/prisma";

export { slugifyTitle } from "@/lib/slug-client";

/**
 * Appends `-2`, `-3`, ... until the slug is free. `excludeId` lets an edit
 * keep its own slug without colliding with itself.
 */
export async function uniquePostSlug(
  base: string,
  excludeId?: string,
): Promise<string> {
  const root = base || "post";
  let candidate = root;
  let suffix = 2;

  while (
    await prisma.post.findFirst({
      where: { slug: candidate, ...(excludeId ? { id: { not: excludeId } } : {}) },
      select: { id: true },
    })
  ) {
    candidate = `${root}-${suffix}`;
    suffix += 1;
  }

  return candidate;
}
