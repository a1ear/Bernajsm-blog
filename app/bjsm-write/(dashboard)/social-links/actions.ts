"use server";

import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";

import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/auth";
import { runAction, type ActionResult } from "@/lib/action-result";
import { socialLinkSchema, type SocialLinkInput } from "@/lib/validation";

function revalidatePublicPaths() {
  revalidatePath("/", "layout");
}

export async function createSocialLink(input: SocialLinkInput): Promise<ActionResult> {
  const result = await runAction(async () => {
    await requireAdmin();
    const parsed = socialLinkSchema.safeParse(input);
    if (!parsed.success) return { ok: false as const, error: "Check the highlighted fields." };

    await prisma.socialLink.create({
      data: {
        platform: parsed.data.platform,
        label: parsed.data.platform === "custom" ? parsed.data.label || null : null,
        url: parsed.data.url,
        sortOrder: parsed.data.sortOrder,
        visible: parsed.data.visible,
      },
    });
    return { ok: true as const };
  });

  if (!result.ok) return result;
  revalidatePublicPaths();
  redirect("/bjsm-write/social-links");
}

export async function updateSocialLink(id: string, input: SocialLinkInput): Promise<ActionResult> {
  const result = await runAction(async () => {
    await requireAdmin();
    const parsed = socialLinkSchema.safeParse(input);
    if (!parsed.success) return { ok: false as const, error: "Check the highlighted fields." };

    await prisma.socialLink.update({
      where: { id },
      data: {
        platform: parsed.data.platform,
        label: parsed.data.platform === "custom" ? parsed.data.label || null : null,
        url: parsed.data.url,
        sortOrder: parsed.data.sortOrder,
        visible: parsed.data.visible,
      },
    });
    return { ok: true as const, message: "Saved." };
  });

  if (result.ok) revalidatePublicPaths();
  return result;
}

export async function deleteSocialLink(id: string): Promise<ActionResult> {
  const result = await runAction(async () => {
    await requireAdmin();
    await prisma.socialLink.delete({ where: { id } });
    return { ok: true as const };
  });

  if (!result.ok) return result;
  revalidatePublicPaths();
  redirect("/bjsm-write/social-links");
}
