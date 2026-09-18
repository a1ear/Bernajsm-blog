import { SocialLinkForm } from "@/components/admin/SocialLinkForm";

export default function NewSocialLinkPage() {
  return (
    <div className="flex flex-col gap-6">
      <h1 className="font-display text-2xl font-bold text-ink">Add Social Link</h1>
      <div className="max-w-lg rounded-2xl border border-ink/8 bg-warm-white p-6">
        <SocialLinkForm
          mode="create"
          initial={{ platform: "instagram", label: "", url: "", sortOrder: 0, visible: true }}
        />
      </div>
    </div>
  );
}
