"use server";

import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";

import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/auth";
import { runAction, type ActionResult } from "@/lib/action-result";
import { bookSchema, type BookInput } from "@/lib/validation";

function revalidatePublicPaths() {
  revalidatePath("/");
}

/** At most one book is featured at a time -- picking a new one un-features the rest. */
async function clearOtherFeatured(excludeId?: string) {
  await prisma.book.updateMany({
    where: excludeId ? { id: { not: excludeId } } : {},
    data: { featured: false },
  });
}

export async function createBook(input: BookInput): Promise<ActionResult> {
  let newId: string | null = null;

  const result = await runAction(async () => {
    await requireAdmin();

    const parsed = bookSchema.safeParse(input);
    if (!parsed.success) {
      return { ok: false as const, error: "Check the highlighted fields." };
    }

    if (parsed.data.featured) await clearOtherFeatured();

    const book = await prisma.book.create({
      data: {
        title: parsed.data.title,
        heading: parsed.data.heading || null,
        description: parsed.data.description || null,
        coverImageUrl: parsed.data.coverImageUrl || null,
        coverImageAlt: parsed.data.coverImageAlt || null,
        buyUrl: parsed.data.buyUrl,
        availableLabel: parsed.data.availableLabel || null,
        featured: parsed.data.featured,
        status: parsed.data.status,
        publishedAt: parsed.data.status === "PUBLISHED" ? new Date() : null,
      },
      select: { id: true },
    });

    newId = book.id;
    return { ok: true as const };
  });

  if (!result.ok) return result;

  revalidatePublicPaths();
  redirect(`/bjsm-write/books/${newId}`);
}

export async function updateBook(id: string, input: BookInput): Promise<ActionResult> {
  const result = await runAction(async () => {
    await requireAdmin();

    const parsed = bookSchema.safeParse(input);
    if (!parsed.success) {
      return { ok: false as const, error: "Check the highlighted fields." };
    }

    const existing = await prisma.book.findUnique({ where: { id }, select: { status: true } });
    if (!existing) return { ok: false as const, error: "This book no longer exists." };

    if (parsed.data.featured) await clearOtherFeatured(id);

    const willBePublished = parsed.data.status === "PUBLISHED";
    const wasPublished = existing.status === "PUBLISHED";

    await prisma.book.update({
      where: { id },
      data: {
        title: parsed.data.title,
        heading: parsed.data.heading || null,
        description: parsed.data.description || null,
        coverImageUrl: parsed.data.coverImageUrl || null,
        coverImageAlt: parsed.data.coverImageAlt || null,
        buyUrl: parsed.data.buyUrl,
        availableLabel: parsed.data.availableLabel || null,
        featured: parsed.data.featured,
        status: parsed.data.status,
        publishedAt: willBePublished ? (wasPublished ? undefined : new Date()) : null,
      },
    });

    return { ok: true as const, message: "Saved." };
  });

  if (result.ok) revalidatePublicPaths();
  return result;
}

export async function deleteBook(id: string): Promise<ActionResult> {
  const result = await runAction(async () => {
    await requireAdmin();
    await prisma.book.delete({ where: { id } });
    return { ok: true as const };
  });

  if (!result.ok) return result;

  revalidatePublicPaths();
  redirect("/bjsm-write/books");
}
