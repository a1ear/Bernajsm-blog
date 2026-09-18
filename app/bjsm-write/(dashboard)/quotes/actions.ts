"use server";

import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";

import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/auth";
import { runAction, type ActionResult } from "@/lib/action-result";
import { quoteSchema, type QuoteInput } from "@/lib/validation";

function revalidatePublicPaths() {
  revalidatePath("/");
  revalidatePath("/quotes");
}

export async function createQuote(input: QuoteInput): Promise<ActionResult> {
  const result = await runAction(async () => {
    await requireAdmin();
    const parsed = quoteSchema.safeParse(input);
    if (!parsed.success) return { ok: false as const, error: "Check the highlighted fields." };

    await prisma.quote.create({
      data: {
        text: parsed.data.text,
        attribution: parsed.data.attribution || null,
        status: parsed.data.status,
        publishedAt: parsed.data.status === "PUBLISHED" ? new Date() : null,
      },
    });
    return { ok: true as const };
  });

  if (!result.ok) return result;
  revalidatePublicPaths();
  redirect("/bjsm-write/quotes");
}

export async function updateQuote(id: string, input: QuoteInput): Promise<ActionResult> {
  const result = await runAction(async () => {
    await requireAdmin();
    const parsed = quoteSchema.safeParse(input);
    if (!parsed.success) return { ok: false as const, error: "Check the highlighted fields." };

    const existing = await prisma.quote.findUnique({ where: { id }, select: { status: true } });
    if (!existing) return { ok: false as const, error: "This quote no longer exists." };

    const willBePublished = parsed.data.status === "PUBLISHED";
    const wasPublished = existing.status === "PUBLISHED";

    await prisma.quote.update({
      where: { id },
      data: {
        text: parsed.data.text,
        attribution: parsed.data.attribution || null,
        status: parsed.data.status,
        publishedAt: willBePublished ? (wasPublished ? undefined : new Date()) : null,
      },
    });
    return { ok: true as const, message: "Saved." };
  });

  if (result.ok) revalidatePublicPaths();
  return result;
}

export async function deleteQuote(id: string): Promise<ActionResult> {
  const result = await runAction(async () => {
    await requireAdmin();
    await prisma.quote.delete({ where: { id } });
    return { ok: true as const };
  });

  if (!result.ok) return result;
  revalidatePublicPaths();
  redirect("/bjsm-write/quotes");
}
