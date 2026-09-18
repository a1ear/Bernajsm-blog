"use server";

import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";

import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/auth";
import { runAction, type ActionResult } from "@/lib/action-result";
import { postSchema, type PostInput } from "@/lib/validation";
import { slugifyTitle, uniquePostSlug } from "@/lib/slug";
import { uploadToBucket, MEDIA_BUCKET } from "@/lib/storage";

function revalidatePublicPaths() {
  revalidatePath("/");
  revalidatePath("/blog");
  revalidatePath("/journal");
}

export async function createPost(input: PostInput): Promise<ActionResult> {
  let newId: string | null = null;

  const result = await runAction(async () => {
    await requireAdmin();

    const parsed = postSchema.safeParse(input);
    if (!parsed.success) {
      return { ok: false as const, error: "Check the highlighted fields." };
    }

    const base = slugifyTitle(parsed.data.slug || parsed.data.title);
    const slug = await uniquePostSlug(base);

    const post = await prisma.post.create({
      data: {
        type: parsed.data.type,
        title: parsed.data.title,
        slug,
        excerpt: parsed.data.excerpt || null,
        bodyJson: parsed.data.bodyJson ?? { type: "doc", content: [{ type: "paragraph" }] },
        coverImageUrl: parsed.data.coverImageUrl || null,
        coverImageAlt: parsed.data.coverImageAlt || null,
        status: parsed.data.status,
        publishedAt: parsed.data.status === "PUBLISHED" ? new Date() : null,
      },
      select: { id: true },
    });

    newId = post.id;
    return { ok: true as const };
  });

  if (!result.ok) return result;

  revalidatePublicPaths();
  redirect(`/bjsm-write/posts/${newId}`);
}

export async function updatePost(id: string, input: PostInput): Promise<ActionResult> {
  const result = await runAction(async () => {
    await requireAdmin();

    const parsed = postSchema.safeParse(input);
    if (!parsed.success) {
      return { ok: false as const, error: "Check the highlighted fields." };
    }

    const existing = await prisma.post.findUnique({ where: { id }, select: { slug: true, status: true } });
    if (!existing) return { ok: false as const, error: "This post no longer exists." };

    const desiredSlug = slugifyTitle(parsed.data.slug || parsed.data.title);
    const slug =
      desiredSlug === existing.slug ? existing.slug : await uniquePostSlug(desiredSlug, id);

    const willBePublished = parsed.data.status === "PUBLISHED";
    const wasPublished = existing.status === "PUBLISHED";

    await prisma.post.update({
      where: { id },
      data: {
        type: parsed.data.type,
        title: parsed.data.title,
        slug,
        excerpt: parsed.data.excerpt || null,
        bodyJson: parsed.data.bodyJson ?? { type: "doc", content: [{ type: "paragraph" }] },
        coverImageUrl: parsed.data.coverImageUrl || null,
        coverImageAlt: parsed.data.coverImageAlt || null,
        status: parsed.data.status,
        // Only stamp publishedAt the moment a post first goes live, so an
        // edit to an already-published post doesn't bump its date.
        publishedAt: willBePublished ? (wasPublished ? undefined : new Date()) : null,
      },
    });

    return { ok: true as const, message: "Saved." };
  });

  if (result.ok) revalidatePublicPaths();
  return result;
}

export async function deletePost(id: string): Promise<ActionResult> {
  const result = await runAction(async () => {
    await requireAdmin();
    await prisma.post.delete({ where: { id } });
    return { ok: true as const };
  });

  if (!result.ok) return result;

  revalidatePublicPaths();
  redirect("/bjsm-write/posts");
}

export async function uploadMediaImage(
  formData: FormData,
): Promise<{ ok: true; url: string } | { ok: false; error: string }> {
  try {
    await requireAdmin();
  } catch {
    return { ok: false, error: "You must be signed in to upload images." };
  }

  const file = formData.get("file");
  if (!(file instanceof File) || file.size === 0) {
    return { ok: false, error: "Choose an image file first." };
  }
  if (!file.type.startsWith("image/")) {
    return { ok: false, error: "Only image files are supported." };
  }
  if (file.size > 8 * 1024 * 1024) {
    return { ok: false, error: "Images must be 8MB or smaller." };
  }

  try {
    const { url } = await uploadToBucket(MEDIA_BUCKET, file);
    return { ok: true, url };
  } catch (error) {
    console.error("[uploadMediaImage] failed", error);
    return { ok: false, error: "Upload failed. Please try again." };
  }
}
