import { notFound } from "next/navigation";

import { prisma } from "@/lib/prisma";
import { BookForm } from "@/components/admin/BookForm";

export default async function EditBookPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const book = await prisma.book.findUnique({ where: { id } });
  if (!book) notFound();

  return (
    <div className="flex flex-col gap-6">
      <h1 className="font-display text-2xl font-bold text-ink">Edit Book</h1>
      <div className="max-w-2xl rounded-2xl border border-ink/8 bg-warm-white p-6">
        <BookForm
          mode="edit"
          bookId={book.id}
          initial={{
            title: book.title,
            heading: book.heading ?? "",
            description: book.description ?? "",
            coverImageUrl: book.coverImageUrl ?? "",
            coverImageAlt: book.coverImageAlt ?? "",
            buyUrl: book.buyUrl,
            availableLabel: book.availableLabel ?? "",
            featured: book.featured,
            status: book.status,
          }}
        />
      </div>
    </div>
  );
}
