import { notFound } from "next/navigation";

import { prisma } from "@/lib/prisma";
import { NewsletterForm } from "@/components/admin/NewsletterForm";

export default async function EditNewsletterPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const issue = await prisma.newsletter.findUnique({ where: { id } });
  if (!issue) notFound();

  return (
    <div className="flex flex-col gap-6">
      <h1 className="font-display text-2xl font-bold text-ink">Edit Newsletter Issue</h1>
      <div className="max-w-2xl rounded-2xl border border-ink/8 bg-warm-white p-6">
        <NewsletterForm
          mode="edit"
          newsletterId={issue.id}
          initial={{
            title: issue.title,
            description: issue.description ?? "",
            issueDate: issue.issueDate.toISOString().slice(0, 10),
            fileUrl: issue.fileUrl,
            fileName: issue.fileName,
            status: issue.status,
          }}
        />
      </div>
    </div>
  );
}
