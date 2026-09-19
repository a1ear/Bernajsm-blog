import Link from "next/link";

import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

export default async function AdminDashboardPage() {
  const [bookCount, blogCount, journalCount, quoteCount, newsletterCount, draftCount] = await Promise.all([
    prisma.book.count(),
    prisma.post.count({ where: { type: "BLOG" } }),
    prisma.post.count({ where: { type: "JOURNAL" } }),
    prisma.quote.count(),
    prisma.newsletter.count(),
    prisma.post.count({ where: { status: "DRAFT" } }),
  ]);

  const cards = [
    { label: "Books", count: bookCount, href: "/bjsm-write/books" },
    { label: "Blog posts", count: blogCount, href: "/bjsm-write/posts?type=BLOG" },
    { label: "Journal entries", count: journalCount, href: "/bjsm-write/posts?type=JOURNAL" },
    { label: "Quotes", count: quoteCount, href: "/bjsm-write/quotes" },
    { label: "Newsletter issues", count: newsletterCount, href: "/bjsm-write/newsletters" },
  ];

  const shortcuts = [
    { label: "New Book", href: "/bjsm-write/books/new" },
    { label: "New Post", href: "/bjsm-write/posts/new" },
    { label: "New Quote", href: "/bjsm-write/quotes/new" },
    { label: "New Newsletter Issue", href: "/bjsm-write/newsletters/new" },
  ];

  return (
    <div className="flex flex-col gap-8">
      <div>
        <h1 className="font-display text-2xl font-bold text-ink">Dashboard</h1>
        <p className="mt-1 text-sm text-ink-soft">
          {draftCount > 0
            ? `${draftCount} post${draftCount === 1 ? "" : "s"} still in draft.`
            : "Everything written is published."}
        </p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {cards.map((card) => (
          <Link
            key={card.label}
            href={card.href}
            className="rounded-2xl border border-ink/8 bg-warm-white p-5 transition-shadow hover:shadow-[0_4px_14px_rgba(42,42,38,0.06)]"
          >
            <p className="font-display text-3xl font-bold text-ink">{card.count}</p>
            <p className="mt-1 text-sm text-ink-soft">{card.label}</p>
          </Link>
        ))}
      </div>

      <div>
        <h2 className="mb-3 text-sm font-medium uppercase tracking-wide text-ink-soft">Quick actions</h2>
        <div className="flex flex-wrap gap-3">
          {shortcuts.map((s) => (
            <Link
              key={s.label}
              href={s.href}
              className="rounded-full border border-ink/15 bg-warm-white px-5 py-2.5 text-sm text-ink transition-colors hover:border-ink"
            >
              {s.label}
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
