import { notFound } from "next/navigation";

import { prisma } from "@/lib/prisma";
import { SocialLinkForm } from "@/components/admin/SocialLinkForm";

export default async function EditSocialLinkPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const link = await prisma.socialLink.findUnique({ where: { id } });
  if (!link) notFound();

  return (
    <div className="flex flex-col gap-6">
      <h1 className="font-display text-2xl font-bold text-ink">Edit Social Link</h1>
      <div className="max-w-lg rounded-2xl border border-ink/8 bg-warm-white p-6">
        <SocialLinkForm
          mode="edit"
          linkId={link.id}
          initial={{
            platform: link.platform as never,
            label: link.label ?? "",
            url: link.url,
            sortOrder: link.sortOrder,
            visible: link.visible,
          }}
        />
      </div>
    </div>
  );
}
