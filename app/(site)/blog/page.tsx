import type { Metadata } from "next";

import { PostListingPage } from "@/components/content/PostListingPage";
import { site } from "@/lib/content";

export const metadata: Metadata = {
  title: `Blog — ${site.authorHandle}`,
  description: "Essays on motherhood, faith, and the lessons that stay with us.",
};

export default async function BlogPage({
  searchParams,
}: {
  searchParams: Promise<{ page?: string }>;
}) {
  const { page } = await searchParams;
  const pageNumber = Math.max(1, Number(page) || 1);

  return (
    <PostListingPage
      type="BLOG"
      basePath="/blog"
      eyebrow="The Blog"
      heading="Essays & Dispatches"
      description="Reflections on motherhood, faith, and the small truths gathered along the way."
      page={pageNumber}
      emptyMessage="No essays published yet — check back soon."
    />
  );
}
