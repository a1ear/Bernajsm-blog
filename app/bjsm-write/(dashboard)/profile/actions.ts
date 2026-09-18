"use server";

import { revalidatePath } from "next/cache";

import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/auth";
import { runAction, type ActionResult } from "@/lib/action-result";
import { authorProfileSchema, type AuthorProfileInput } from "@/lib/validation";

export async function saveAuthorProfile(input: AuthorProfileInput): Promise<ActionResult> {
  const result = await runAction(async () => {
    const user = await requireAdmin();
    const parsed = authorProfileSchema.safeParse(input);
    if (!parsed.success) return { ok: false as const, error: "Check the highlighted fields." };

    await prisma.author.upsert({
      where: { id: user.id },
      create: {
        id: user.id,
        email: user.email,
        name: parsed.data.name,
        handle: parsed.data.handle || null,
        bio: parsed.data.bio || null,
        photoUrl: parsed.data.photoUrl || null,
      },
      update: {
        name: parsed.data.name,
        handle: parsed.data.handle || null,
        bio: parsed.data.bio || null,
        photoUrl: parsed.data.photoUrl || null,
      },
    });

    return { ok: true as const, message: "Profile saved." };
  });

  if (result.ok) {
    revalidatePath("/about");
    revalidatePath("/");
  }
  return result;
}
