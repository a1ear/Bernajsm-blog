import { PostForm } from "@/components/admin/PostForm";

export default function NewPostPage() {
  return (
    <div className="flex flex-col gap-6">
      <h1 className="font-display text-2xl font-bold text-ink">New Post</h1>
      <div className="rounded-2xl border border-ink/8 bg-warm-white p-6">
        <PostForm
          mode="create"
          initial={{
            type: "BLOG",
            title: "",
            slug: "",
            excerpt: "",
            bodyJson: { type: "doc", content: [{ type: "paragraph" }] },
            coverImageUrl: "",
            coverImageAlt: "",
            status: "DRAFT",
          }}
        />
      </div>
    </div>
  );
}
