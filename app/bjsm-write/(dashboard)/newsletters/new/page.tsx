import { NewsletterForm } from "@/components/admin/NewsletterForm";

export default function NewNewsletterPage() {
  const today = new Date().toISOString().slice(0, 10);

  return (
    <div className="flex flex-col gap-6">
      <h1 className="font-display text-2xl font-bold text-ink">New Newsletter Issue</h1>
      <div className="max-w-2xl rounded-2xl border border-ink/8 bg-warm-white p-6">
        <NewsletterForm
          mode="create"
          initial={{ title: "", description: "", issueDate: today, fileUrl: "", fileName: "", status: "DRAFT" }}
        />
      </div>
    </div>
  );
}
