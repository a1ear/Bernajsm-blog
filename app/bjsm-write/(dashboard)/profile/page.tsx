import { prisma } from "@/lib/prisma";
import { getCurrentUser } from "@/lib/auth";
import { ProfileForm } from "@/components/admin/ProfileForm";
import { site } from "@/lib/content";

export default async function AdminProfilePage() {
  const user = await getCurrentUser();
  const author = user ? await prisma.author.findUnique({ where: { id: user.id } }) : null;

  return (
    <div className="flex flex-col gap-6">
      <h1 className="font-display text-2xl font-bold text-ink">Profile</h1>
      <div className="max-w-xl rounded-2xl border border-ink/8 bg-warm-white p-6">
        <ProfileForm
          initial={{
            name: author?.name ?? site.authorName,
            handle: author?.handle ?? site.authorHandle,
            bio: author?.bio ?? "",
            photoUrl: author?.photoUrl ?? "",
          }}
        />
      </div>
    </div>
  );
}
