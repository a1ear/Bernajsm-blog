import type { Metadata } from "next";

import { PostListingPage } from "@/components/content/PostListingPage";
import { site } from "@/lib/content";

export const metadata: Metadata = {
  title: `Journal — ${site.authorHandle}`,
  description: "Quiet, unhurried journal entries from Bernadette Magbanua.",
};

export default async function JournalPage({
  searchParams,
}: {
  searchParams: Promise<{ page?: string }>;
}) {
  const { page } = await searchParams;
  const pageNumber = Math.max(1, Number(page) || 1);

  return (
    <PostListingPage
      type="JOURNAL"
      basePath="/journal"
      eyebrow="The Journal"
      heading="Quiet Entries"
      description="Shorter, more personal notes — written closer to the day they happened."
      page={pageNumber}
      emptyMessage="No journal entries published yet — check back soon."
    />
  );
}
