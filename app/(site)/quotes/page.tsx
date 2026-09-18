import type { Metadata } from "next";

import { getPublishedQuotes } from "@/lib/queries";
import { QuoteCard } from "@/components/content/QuoteCard";
import { Pagination } from "@/components/content/Pagination";
import { EmptyState } from "@/components/content/EmptyState";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { site } from "@/lib/content";

export const metadata: Metadata = {
  title: `Quotes — ${site.authorHandle}`,
  description: "Short reflections and lines worth sitting with.",
};

export default async function QuotesPage({
  searchParams,
}: {
  searchParams: Promise<{ page?: string }>;
}) {
  const { page } = await searchParams;
  const pageNumber = Math.max(1, Number(page) || 1);
  const { quotes, totalPages } = await getPublishedQuotes(pageNumber);

  return (
    <section className="bg-cream px-6 py-20 sm:px-10 sm:py-28">
      <div className="mx-auto max-w-3xl">
        <SectionHeading
          eyebrow="Quotes"
          heading="Lines Worth Sitting With"
          description="Short reflections, pulled from the book, the blog, and the quiet in between."
          align="center"
        />

        <div className="mt-14 flex flex-col gap-6">
          {quotes.length === 0 ? (
            <EmptyState message="No quotes published yet — check back soon." />
          ) : (
            quotes.map((quote) => <QuoteCard key={quote.id} quote={quote} />)
          )}
        </div>

        <Pagination page={pageNumber} totalPages={totalPages} basePath="/quotes" />
      </div>
    </section>
  );
}
