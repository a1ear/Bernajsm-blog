import { notFound } from "next/navigation";
import Image from "next/image";
import Link from "next/link";

import { getPublishedPostBySlug } from "@/lib/queries";
import { RichTextRenderer } from "@/components/editor/RichTextRenderer";
import { BotanicalMotif } from "@/components/ui/BotanicalMotif";
import { estimateReadingMinutes } from "@/lib/tiptap-text";
import type { PostType } from "@/generated/prisma/enums";

function formatDate(date: Date) {
  return date.toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" });
}

export async function PostDetailPage({
  type,
  basePath,
  slug,
}: {
  type: PostType;
  basePath: "/blog" | "/journal";
  slug: string;
}) {
  const post = await getPublishedPostBySlug(type, slug);
  if (!post) notFound();

  const minutes = estimateReadingMinutes(post.bodyJson);

  return (
    <article className="bg-cream px-6 py-20 sm:px-10 sm:py-28">
      <div className="mx-auto max-w-2xl">
        <p className="text-xs uppercase tracking-widest text-ink-soft">
          {post.publishedAt ? formatDate(post.publishedAt) : ""} · {minutes} min read
        </p>
        <h1 className="balance mt-3 font-display text-4xl font-bold leading-tight text-ink sm:text-5xl">
          {post.title}
        </h1>

        {post.coverImageUrl ? (
          <div className="relative mt-10 aspect-[16/9] w-full overflow-hidden rounded-2xl bg-cream-alt">
            <Image
              src={post.coverImageUrl}
              alt={post.coverImageAlt || ""}
              fill
              sizes="(max-width: 768px) 100vw, 672px"
              className="object-cover"
              priority
            />
          </div>
        ) : null}

        <div className="mt-10">
          <RichTextRenderer bodyJson={post.bodyJson} />
        </div>

        <div className="mt-16 flex justify-center opacity-40">
          <BotanicalMotif className="h-16 w-16 text-ink" />
        </div>

        <Link
          href={basePath}
          className="mt-10 inline-block text-sm text-forest underline decoration-forest/40 decoration-2 underline-offset-4"
        >
          ← Back to {basePath === "/blog" ? "the blog" : "the journal"}
        </Link>
      </div>
    </article>
  );
}
