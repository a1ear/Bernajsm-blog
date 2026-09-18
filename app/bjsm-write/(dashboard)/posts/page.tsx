import Link from "next/link";

import { prisma } from "@/lib/prisma";
import { StatusBadge } from "@/components/admin/StatusBadge";

export const dynamic = "force-dynamic";

export default async function AdminPostsPage({
  searchParams,
}: {
  searchParams: Promise<{ type?: string }>;
}) {
  const { type } = await searchParams;
  const filterType = type === "JOURNAL" ? "JOURNAL" : type === "BLOG" ? "BLOG" : undefined;

  const posts = await prisma.post.findMany({
    where: filterType ? { type: filterType } : undefined,
    orderBy: { createdAt: "desc" },
  });

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="font-display text-2xl font-bold text-ink">Posts &amp; Journal</h1>
          <p className="mt-1 text-sm text-ink-soft">Blog essays and journal entries share one editor.</p>
        </div>
        <Link
          href="/bjsm-write/posts/new"
          className="rounded-full bg-forest px-5 py-2.5 text-sm font-medium text-warm-white transition-all hover:-translate-y-0.5 hover:bg-forest-dark"
        >
          New Post
        </Link>
      </div>

      <div className="flex gap-2 text-sm">
        {[
          { label: "All", href: "/bjsm-write/posts" },
          { label: "Blog", href: "/bjsm-write/posts?type=BLOG" },
          { label: "Journal", href: "/bjsm-write/posts?type=JOURNAL" },
        ].map((f) => (
          <Link
            key={f.label}
            href={f.href}
            className={`rounded-full px-4 py-1.5 transition-colors ${
              (f.label === "All" && !filterType) || f.label.toUpperCase() === filterType
                ? "bg-forest text-warm-white"
                : "bg-warm-white text-ink-soft hover:text-ink"
            }`}
          >
            {f.label}
          </Link>
        ))}
      </div>

      <div className="overflow-hidden rounded-2xl border border-ink/8 bg-warm-white">
        {posts.length === 0 ? (
          <p className="px-6 py-10 text-center text-sm text-ink-soft">
            Nothing here yet — click &ldquo;New Post&rdquo; to write the first one.
          </p>
        ) : (
          <ul className="divide-y divide-ink/8">
            {posts.map((post) => (
              <li key={post.id}>
                <Link
                  href={`/bjsm-write/posts/${post.id}`}
                  className="flex items-center justify-between gap-4 px-5 py-4 transition-colors hover:bg-cream-alt"
                >
                  <div className="min-w-0">
                    <p className="truncate font-medium text-ink">{post.title}</p>
                    <p className="mt-0.5 text-xs text-ink-soft">
                      {post.type === "BLOG" ? "Blog" : "Journal"} · /{post.slug}
                    </p>
                  </div>
                  <StatusBadge status={post.status} />
                </Link>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
