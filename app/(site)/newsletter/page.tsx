import type { Metadata } from "next";

import { getPublishedNewsletters } from "@/lib/queries";
import { Pagination } from "@/components/content/Pagination";
import { EmptyState } from "@/components/content/EmptyState";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { site } from "@/lib/content";

export const metadata: Metadata = {
  title: `Newsletter — ${site.authorHandle}`,
  description: "Downloadable newsletter issues from Bernadette Magbanua.",
};

function formatDate(date: Date) {
  return date.toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" });
}

export default async function NewsletterPage({
  searchParams,
}: {
  searchParams: Promise<{ page?: string }>;
}) {
  const { page } = await searchParams;
  const pageNumber = Math.max(1, Number(page) || 1);
  const { issues, totalPages } = await getPublishedNewsletters(pageNumber);

  return (
    <section className="bg-cream px-6 py-20 sm:px-10 sm:py-28">
      <div className="mx-auto max-w-3xl">
        <SectionHeading
          eyebrow="The Newsletter"
          heading="Past Issues"
          description="Every issue, free to read or download — no sign-up required."
          align="center"
        />

        <div className="mt-14 flex flex-col gap-4">
          {issues.length === 0 ? (
            <EmptyState message="No issues published yet — check back soon." />
          ) : (
            issues.map((issue) => (
              <div
                key={issue.id}
                className="flex flex-col items-start justify-between gap-4 rounded-2xl bg-warm-white p-6 shadow-[0_2px_8px_rgba(42,42,38,0.04)] sm:flex-row sm:items-center"
              >
                <div>
                  <p className="text-xs uppercase tracking-widest text-ink-soft">
                    {formatDate(issue.issueDate)}
                  </p>
                  <h3 className="mt-1 font-display text-lg font-bold text-ink">{issue.title}</h3>
                  {issue.description ? (
                    <p className="mt-1 max-w-lg text-sm text-ink-soft">{issue.description}</p>
                  ) : null}
                </div>
                <a
                  href={issue.fileUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="shrink-0 rounded-full border border-ink/20 px-5 py-2.5 text-sm text-ink transition-all hover:-translate-y-0.5 hover:border-ink"
                >
                  Download
                </a>
              </div>
            ))
          )}
        </div>

        <Pagination page={pageNumber} totalPages={totalPages} basePath="/newsletter" />
      </div>
    </section>
  );
}
