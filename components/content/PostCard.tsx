import Link from "next/link";
import Image from "next/image";

import { deriveExcerpt, estimateReadingMinutes } from "@/lib/tiptap-text";
import type { Post } from "@/generated/prisma/client";

function formatDate(date: Date) {
  return date.toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" });
}

export function PostCard({ post, basePath }: { post: Post; basePath: "/blog" | "/journal" }) {
  const excerpt = post.excerpt || deriveExcerpt(post.bodyJson);
  const minutes = estimateReadingMinutes(post.bodyJson);

  return (
    <Link
      href={`${basePath}/${post.slug}`}
      className="group flex flex-col overflow-hidden rounded-xl bg-warm-white shadow-[0_2px_8px_rgba(42,42,38,0.04)] transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_8px_20px_rgba(42,42,38,0.08)]"
    >
      {post.coverImageUrl ? (
        <div className="relative aspect-[16/10] w-full overflow-hidden bg-cream-alt">
          <Image
            src={post.coverImageUrl}
            alt={post.coverImageAlt || ""}
            fill
            sizes="(max-width: 768px) 100vw, 380px"
            className="object-cover transition-transform duration-500 group-hover:scale-[1.03]"
          />
        </div>
      ) : null}
      <div className="flex flex-1 flex-col justify-between p-6">
        <div className="space-y-2">
          <p className="text-xs uppercase tracking-widest text-ink-soft">
            {post.publishedAt ? formatDate(post.publishedAt) : ""}
          </p>
          <h3 className="font-display text-xl font-bold leading-snug text-ink transition-colors group-hover:text-forest">
            {post.title}
          </h3>
          <p className="line-clamp-2 text-sm leading-relaxed text-ink-soft">{excerpt}</p>
        </div>
        <div className="mt-5 flex items-center justify-between text-ink-soft">
          <span className="text-xs">{minutes} min read</span>
          <span className="text-forest transition-transform group-hover:translate-x-1" aria-hidden="true">
            →
          </span>
        </div>
      </div>
    </Link>
  );
}
