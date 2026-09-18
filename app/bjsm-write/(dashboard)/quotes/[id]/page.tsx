import { notFound } from "next/navigation";

import { prisma } from "@/lib/prisma";
import { QuoteForm } from "@/components/admin/QuoteForm";

export default async function EditQuotePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const quote = await prisma.quote.findUnique({ where: { id } });
  if (!quote) notFound();

  return (
    <div className="flex flex-col gap-6">
      <h1 className="font-display text-2xl font-bold text-ink">Edit Quote</h1>
      <div className="max-w-2xl rounded-2xl border border-ink/8 bg-warm-white p-6">
        <QuoteForm
          mode="edit"
          quoteId={quote.id}
          initial={{ text: quote.text, attribution: quote.attribution ?? "", status: quote.status }}
        />
      </div>
    </div>
  );
}
