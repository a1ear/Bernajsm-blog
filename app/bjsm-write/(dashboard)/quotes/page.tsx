import Link from "next/link";

import { prisma } from "@/lib/prisma";
import { StatusBadge } from "@/components/admin/StatusBadge";

export const dynamic = "force-dynamic";

export default async function AdminQuotesPage() {
  const quotes = await prisma.quote.findMany({ orderBy: { createdAt: "desc" } });

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <h1 className="font-display text-2xl font-bold text-ink">Quotes</h1>
        <Link
          href="/bjsm-write/quotes/new"
          className="rounded-full bg-forest px-5 py-2.5 text-sm font-medium text-warm-white transition-all hover:-translate-y-0.5 hover:bg-forest-dark"
        >
          New Quote
        </Link>
      </div>

      <div className="overflow-hidden rounded-2xl border border-ink/8 bg-warm-white">
        {quotes.length === 0 ? (
          <p className="px-6 py-10 text-center text-sm text-ink-soft">No quotes yet.</p>
        ) : (
          <ul className="divide-y divide-ink/8">
            {quotes.map((quote) => (
              <li key={quote.id}>
                <Link
                  href={`/bjsm-write/quotes/${quote.id}`}
                  className="flex items-center justify-between gap-4 px-5 py-4 transition-colors hover:bg-cream-alt"
                >
                  <p className="line-clamp-1 max-w-xl italic text-ink">&ldquo;{quote.text}&rdquo;</p>
                  <StatusBadge status={quote.status} />
                </Link>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
