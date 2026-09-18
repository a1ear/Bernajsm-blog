export function StatusBadge({ status }: { status: "DRAFT" | "PUBLISHED" }) {
  const isPublished = status === "PUBLISHED";
  return (
    <span
      className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${
        isPublished ? "bg-forest/10 text-forest" : "bg-ink/8 text-ink-soft"
      }`}
    >
      {isPublished ? "Published" : "Draft"}
    </span>
  );
}
