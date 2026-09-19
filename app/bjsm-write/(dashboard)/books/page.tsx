import Link from "next/link";

import { prisma } from "@/lib/prisma";
import { StatusBadge } from "@/components/admin/StatusBadge";

export const dynamic = "force-dynamic";

export default async function AdminBooksPage() {
  const books = await prisma.book.findMany({ orderBy: { createdAt: "desc" } });

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="font-display text-2xl font-bold text-ink">Books</h1>
          <p className="mt-1 text-sm text-ink-soft">The featured one shows on the homepage.</p>
        </div>
        <Link
          href="/bjsm-write/books/new"
          className="rounded-full bg-forest px-5 py-2.5 text-sm font-medium text-warm-white transition-all hover:-translate-y-0.5 hover:bg-forest-dark"
        >
          New Book
        </Link>
      </div>

      <div className="overflow-hidden rounded-2xl border border-ink/8 bg-warm-white">
        {books.length === 0 ? (
          <p className="px-6 py-10 text-center text-sm text-ink-soft">
            No books yet — click &ldquo;New Book&rdquo; to add one.
          </p>
        ) : (
          <ul className="divide-y divide-ink/8">
            {books.map((book) => (
              <li key={book.id}>
                <Link
                  href={`/bjsm-write/books/${book.id}`}
                  className="flex items-center justify-between gap-4 px-5 py-4 transition-colors hover:bg-cream-alt"
                >
                  <div className="min-w-0">
                    <p className="truncate font-medium text-ink">{book.title}</p>
                    {book.featured ? (
                      <p className="mt-0.5 text-xs text-forest">Featured on homepage</p>
                    ) : null}
                  </div>
                  <StatusBadge status={book.status} />
                </Link>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
