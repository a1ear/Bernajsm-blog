import Link from "next/link";

import { prisma } from "@/lib/prisma";
import { StatusBadge } from "@/components/admin/StatusBadge";

export const dynamic = "force-dynamic";

export default async function AdminNewslettersPage() {
  const issues = await prisma.newsletter.findMany({ orderBy: { issueDate: "desc" } });

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <h1 className="font-display text-2xl font-bold text-ink">Newsletters</h1>
        <Link
          href="/bjsm-write/newsletters/new"
          className="rounded-full bg-forest px-5 py-2.5 text-sm font-medium text-warm-white transition-all hover:-translate-y-0.5 hover:bg-forest-dark"
        >
          New Issue
        </Link>
      </div>

      <div className="overflow-hidden rounded-2xl border border-ink/8 bg-warm-white">
        {issues.length === 0 ? (
          <p className="px-6 py-10 text-center text-sm text-ink-soft">No issues yet.</p>
        ) : (
          <ul className="divide-y divide-ink/8">
            {issues.map((issue) => (
              <li key={issue.id}>
                <Link
                  href={`/bjsm-write/newsletters/${issue.id}`}
                  className="flex items-center justify-between gap-4 px-5 py-4 transition-colors hover:bg-cream-alt"
                >
                  <div className="min-w-0">
                    <p className="truncate font-medium text-ink">{issue.title}</p>
                    <p className="mt-0.5 text-xs text-ink-soft">
                      {issue.issueDate.toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" })}
                    </p>
                  </div>
                  <StatusBadge status={issue.status} />
                </Link>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
