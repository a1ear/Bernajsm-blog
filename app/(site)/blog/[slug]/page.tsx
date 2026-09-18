import type { Metadata } from "next";

import { PostDetailPage } from "@/components/content/PostDetailPage";
import { getPublishedPostBySlug } from "@/lib/queries";
import { deriveExcerpt } from "@/lib/tiptap-text";
import { site } from "@/lib/content";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const post = await getPublishedPostBySlug("BLOG", slug);
  if (!post) return {};

  const description = post.excerpt || deriveExcerpt(post.bodyJson);
  return {
    title: `${post.title} — ${site.authorHandle}`,
    description,
    openGraph: {
      title: post.title,
      description,
      type: "article",
      images: post.coverImageUrl ? [{ url: post.coverImageUrl }] : undefined,
    },
  };
}

export default async function BlogPostPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  return <PostDetailPage type="BLOG" basePath="/blog" slug={slug} />;
}
