import { notFound } from "next/navigation";

import { prisma } from "@/lib/prisma";
import { PostForm } from "@/components/admin/PostForm";

export default async function EditPostPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const post = await prisma.post.findUnique({ where: { id } });
  if (!post) notFound();

  return (
    <div className="flex flex-col gap-6">
      <h1 className="font-display text-2xl font-bold text-ink">Edit Post</h1>
      <div className="rounded-2xl border border-ink/8 bg-warm-white p-6">
        <PostForm
          mode="edit"
          postId={post.id}
          initial={{
            type: post.type,
            title: post.title,
            slug: post.slug,
            excerpt: post.excerpt ?? "",
            bodyJson: post.bodyJson,
            coverImageUrl: post.coverImageUrl ?? "",
            coverImageAlt: post.coverImageAlt ?? "",
            status: post.status,
          }}
        />
      </div>
    </div>
  );
}
