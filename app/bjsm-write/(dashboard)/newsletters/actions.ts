"use server";

import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";

import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/auth";
import { runAction, type ActionResult } from "@/lib/action-result";
import { newsletterSchema, type NewsletterInput } from "@/lib/validation";
import { uploadToBucket, NEWSLETTERS_BUCKET } from "@/lib/storage";

function revalidatePublicPaths() {
  revalidatePath("/");
  revalidatePath("/newsletter");
}

export async function uploadNewsletterFile(
  formData: FormData,
): Promise<{ ok: true; url: string; fileName: string } | { ok: false; error: string }> {
  try {
    await requireAdmin();
  } catch {
    return { ok: false, error: "You must be signed in to upload files." };
  }

  const file = formData.get("file");
  if (!(file instanceof File) || file.size === 0) {
    return { ok: false, error: "Choose a file first." };
  }
  if (file.size > 25 * 1024 * 1024) {
    return { ok: false, error: "Files must be 25MB or smaller." };
  }

  try {
    const { url, fileName } = await uploadToBucket(NEWSLETTERS_BUCKET, file);
    return { ok: true, url, fileName };
  } catch (error) {
    console.error("[uploadNewsletterFile] failed", error);
    return { ok: false, error: "Upload failed. Please try again." };
  }
}

export async function createNewsletter(input: NewsletterInput): Promise<ActionResult> {
  const result = await runAction(async () => {
    await requireAdmin();
    const parsed = newsletterSchema.safeParse(input);
    if (!parsed.success) return { ok: false as const, error: "Check the highlighted fields." };

    await prisma.newsletter.create({
      data: {
        title: parsed.data.title,
        description: parsed.data.description || null,
        issueDate: new Date(parsed.data.issueDate),
        fileUrl: parsed.data.fileUrl,
        fileName: parsed.data.fileName,
        status: parsed.data.status,
        publishedAt: parsed.data.status === "PUBLISHED" ? new Date() : null,
      },
    });
    return { ok: true as const };
  });

  if (!result.ok) return result;
  revalidatePublicPaths();
  redirect("/bjsm-write/newsletters");
}

export async function updateNewsletter(id: string, input: NewsletterInput): Promise<ActionResult> {
  const result = await runAction(async () => {
    await requireAdmin();
    const parsed = newsletterSchema.safeParse(input);
    if (!parsed.success) return { ok: false as const, error: "Check the highlighted fields." };

    const existing = await prisma.newsletter.findUnique({ where: { id }, select: { status: true } });
    if (!existing) return { ok: false as const, error: "This issue no longer exists." };

    const willBePublished = parsed.data.status === "PUBLISHED";
    const wasPublished = existing.status === "PUBLISHED";

    await prisma.newsletter.update({
      where: { id },
      data: {
        title: parsed.data.title,
        description: parsed.data.description || null,
        issueDate: new Date(parsed.data.issueDate),
        fileUrl: parsed.data.fileUrl,
        fileName: parsed.data.fileName,
        status: parsed.data.status,
        publishedAt: willBePublished ? (wasPublished ? undefined : new Date()) : null,
      },
    });
    return { ok: true as const, message: "Saved." };
  });

  if (result.ok) revalidatePublicPaths();
  return result;
}

export async function deleteNewsletter(id: string): Promise<ActionResult> {
  const result = await runAction(async () => {
    await requireAdmin();
    await prisma.newsletter.delete({ where: { id } });
    return { ok: true as const };
  });

  if (!result.ok) return result;
  revalidatePublicPaths();
  redirect("/bjsm-write/newsletters");
}
