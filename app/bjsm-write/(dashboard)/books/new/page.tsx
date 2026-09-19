import { BookForm } from "@/components/admin/BookForm";

export default function NewBookPage() {
  return (
    <div className="flex flex-col gap-6">
      <h1 className="font-display text-2xl font-bold text-ink">New Book</h1>
      <div className="max-w-2xl rounded-2xl border border-ink/8 bg-warm-white p-6">
        <BookForm
          mode="create"
          initial={{
            title: "",
            heading: "",
            description: "",
            coverImageUrl: "",
            coverImageAlt: "",
            buyUrl: "",
            availableLabel: "",
            featured: false,
            status: "DRAFT",
          }}
        />
      </div>
    </div>
  );
}
