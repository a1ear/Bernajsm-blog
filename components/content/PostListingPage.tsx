import { getPublishedPosts } from "@/lib/queries";
import { PostCard } from "@/components/content/PostCard";
import { Pagination } from "@/components/content/Pagination";
import { EmptyState } from "@/components/content/EmptyState";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { BotanicalMotif } from "@/components/ui/BotanicalMotif";
import type { PostType } from "@/generated/prisma/enums";

export async function PostListingPage({
  type,
  basePath,
  eyebrow,
  heading,
  description,
  page,
  emptyMessage,
}: {
  type: PostType;
  basePath: "/blog" | "/journal";
  eyebrow: string;
  heading: string;
  description: string;
  page: number;
  emptyMessage: string;
}) {
  const { posts, totalPages } = await getPublishedPosts(type, page);

  return (
    <section className="relative overflow-hidden bg-cream px-6 py-20 sm:px-10 sm:py-28">
      <BotanicalMotif
        className="pointer-events-none absolute -right-8 top-16 h-56 w-56 text-ink/5 sm:h-72 sm:w-72"
        flip
      />
      <div className="relative mx-auto max-w-6xl">
        <SectionHeading eyebrow={eyebrow} heading={heading} description={description} />

        <div className="mt-14">
          {posts.length === 0 ? (
            <EmptyState message={emptyMessage} />
          ) : (
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {posts.map((post) => (
                <PostCard key={post.id} post={post} basePath={basePath} />
              ))}
            </div>
          )}
        </div>

        <Pagination page={page} totalPages={totalPages} basePath={basePath} />
      </div>
    </section>
  );
}
