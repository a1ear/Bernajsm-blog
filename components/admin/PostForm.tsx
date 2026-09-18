"use client";

import { useState, useTransition } from "react";
import Image from "next/image";

import { Field, TextInput, TextArea, Select, SubmitButton } from "@/components/admin/FormControls";
import { RichTextEditor } from "@/components/editor/RichTextEditor";
import { createPost, updatePost, deletePost, uploadMediaImage } from "@/app/bjsm-write/(dashboard)/posts/actions";
import { slugifyTitle } from "@/lib/slug-client";
import type { PostInput } from "@/lib/validation";

type PostFormProps = {
  mode: "create" | "edit";
  postId?: string;
  initial: {
    type: "BLOG" | "JOURNAL";
    title: string;
    slug: string;
    excerpt: string;
    bodyJson: unknown;
    coverImageUrl: string;
    coverImageAlt: string;
    status: "DRAFT" | "PUBLISHED";
  };
};

export function PostForm({ mode, postId, initial }: PostFormProps) {
  const [type, setType] = useState(initial.type);
  const [title, setTitle] = useState(initial.title);
  const [slug, setSlug] = useState(initial.slug);
  const [slugTouched, setSlugTouched] = useState(mode === "edit");
  const [excerpt, setExcerpt] = useState(initial.excerpt);
  const [bodyJson, setBodyJson] = useState<unknown>(initial.bodyJson);
  const [coverImageUrl, setCoverImageUrl] = useState(initial.coverImageUrl);
  const [coverImageAlt, setCoverImageAlt] = useState(initial.coverImageAlt);
  const [status, setStatus] = useState(initial.status);

  const [error, setError] = useState<string | null>(null);
  const [coverUploading, startCoverUpload] = useTransition();
  const [pending, startSaving] = useTransition();

  function handleTitleChange(value: string) {
    setTitle(value);
    if (!slugTouched) setSlug(slugifyTitle(value));
  }

  function handleCoverPick(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    e.target.value = "";
    if (!file) return;

    startCoverUpload(async () => {
      const formData = new FormData();
      formData.set("file", file);
      const result = await uploadMediaImage(formData);
      if (!result.ok) {
        setError(result.error);
        return;
      }
      setCoverImageUrl(result.url);
    });
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);

    const input: PostInput = {
      type,
      title,
      slug: slug || slugifyTitle(title),
      excerpt,
      bodyJson,
      coverImageUrl,
      coverImageAlt,
      status,
    };

    startSaving(async () => {
      const result =
        mode === "create" ? await createPost(input) : await updatePost(postId!, input);
      if (result && !result.ok) setError(result.error);
    });
  }

  function handleDelete() {
    if (!postId) return;
    if (!window.confirm("Delete this post? This cannot be undone.")) return;
    startSaving(async () => {
      const result = await deletePost(postId);
      if (result && !result.ok) setError(result.error);
    });
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-6">
      <div className="grid gap-6 sm:grid-cols-2">
        <Field label="Type" htmlFor="type">
          <Select
            id="type"
            value={type}
            onChange={(e) => setType(e.target.value as "BLOG" | "JOURNAL")}
          >
            <option value="BLOG">Blog post</option>
            <option value="JOURNAL">Journal entry</option>
          </Select>
        </Field>

        <Field label="Status" htmlFor="status">
          <Select id="status" value={status} onChange={(e) => setStatus(e.target.value as "DRAFT" | "PUBLISHED")}>
            <option value="DRAFT">Draft</option>
            <option value="PUBLISHED">Published</option>
          </Select>
        </Field>
      </div>

      <Field label="Title" htmlFor="title">
        <TextInput
          id="title"
          required
          value={title}
          onChange={(e) => handleTitleChange(e.target.value)}
        />
      </Field>

      <Field label="Slug" htmlFor="slug">
        <TextInput
          id="slug"
          required
          value={slug}
          onChange={(e) => {
            setSlugTouched(true);
            setSlug(e.target.value);
          }}
        />
      </Field>

      <Field label="Excerpt (optional — shown on cards; auto-derived from the body if left blank)" htmlFor="excerpt">
        <TextArea id="excerpt" rows={2} value={excerpt} onChange={(e) => setExcerpt(e.target.value)} />
      </Field>

      <Field label="Cover image" htmlFor="cover">
        <div className="flex items-center gap-4">
          {coverImageUrl ? (
            <div className="relative h-20 w-32 overflow-hidden rounded-lg border border-ink/10">
              <Image src={coverImageUrl} alt="" fill className="object-cover" />
            </div>
          ) : (
            <div className="flex h-20 w-32 items-center justify-center rounded-lg border border-dashed border-ink/20 text-xs text-ink-soft">
              No image yet
            </div>
          )}
          <label className="cursor-pointer rounded-full border border-ink/20 px-4 py-2 text-sm text-ink transition-colors hover:border-ink">
            {coverUploading ? "Uploading…" : coverImageUrl ? "Replace" : "Upload"}
            <input type="file" accept="image/*" className="hidden" disabled={coverUploading} onChange={handleCoverPick} />
          </label>
        </div>
      </Field>

      {coverImageUrl ? (
        <Field label="Cover image alt text" htmlFor="coverAlt">
          <TextInput
            id="coverAlt"
            value={coverImageAlt}
            onChange={(e) => setCoverImageAlt(e.target.value)}
            placeholder="Describe the image for screen readers"
          />
        </Field>
      ) : null}

      <Field label="Body" htmlFor="body">
        <RichTextEditor initialContent={bodyJson} onChange={setBodyJson} />
      </Field>

      {error ? (
        <p role="alert" className="rounded-lg border border-red-900/15 bg-red-900/5 px-3 py-2 text-sm text-red-900">
          {error}
        </p>
      ) : null}

      <div className="flex items-center justify-between border-t border-ink/10 pt-5">
        <SubmitButton pending={pending}>
          {status === "PUBLISHED" ? "Save & Publish" : "Save Draft"}
        </SubmitButton>
        {mode === "edit" ? (
          <button
            type="button"
            onClick={handleDelete}
            disabled={pending}
            className="text-sm text-red-900/70 transition-colors hover:text-red-900"
          >
            Delete post
          </button>
        ) : null}
      </div>
    </form>
  );
}
