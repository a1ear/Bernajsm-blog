import Link from "next/link";

/** Real page-by-page navigation — never a scroll-capped list. */
export function Pagination({
  page,
  totalPages,
  basePath,
}: {
  page: number;
  totalPages: number;
  basePath: string;
}) {
  if (totalPages <= 1) return null;

  const hrefFor = (p: number) => (p <= 1 ? basePath : `${basePath}?page=${p}`);

  return (
    <nav aria-label="Pagination" className="mt-12 flex items-center justify-center gap-2">
      <Link
        href={hrefFor(Math.max(1, page - 1))}
        aria-disabled={page <= 1}
        className={`rounded-full border border-ink/15 px-4 py-2 text-sm transition-colors ${
          page <= 1 ? "pointer-events-none opacity-40" : "text-ink hover:border-ink"
        }`}
      >
        ← Previous
      </Link>

      <span className="px-3 text-sm text-ink-soft">
        Page {page} of {totalPages}
      </span>

      <Link
        href={hrefFor(Math.min(totalPages, page + 1))}
        aria-disabled={page >= totalPages}
        className={`rounded-full border border-ink/15 px-4 py-2 text-sm transition-colors ${
          page >= totalPages ? "pointer-events-none opacity-40" : "text-ink hover:border-ink"
        }`}
      >
        Next →
      </Link>
    </nav>
  );
}
