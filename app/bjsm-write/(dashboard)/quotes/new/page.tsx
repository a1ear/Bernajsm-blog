import { QuoteForm } from "@/components/admin/QuoteForm";

export default function NewQuotePage() {
  return (
    <div className="flex flex-col gap-6">
      <h1 className="font-display text-2xl font-bold text-ink">New Quote</h1>
      <div className="max-w-2xl rounded-2xl border border-ink/8 bg-warm-white p-6">
        <QuoteForm mode="create" initial={{ text: "", attribution: "", status: "DRAFT" }} />
      </div>
    </div>
  );
}
