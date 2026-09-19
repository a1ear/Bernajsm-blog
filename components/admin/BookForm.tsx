"use client";

import { useState, useTransition } from "react";
import Image from "next/image";

import { Field, TextInput, TextArea, Select, SubmitButton } from "@/components/admin/FormControls";
import { createBook, updateBook, deleteBook } from "@/app/bjsm-write/(dashboard)/books/actions";
import { uploadMediaImage } from "@/app/bjsm-write/(dashboard)/posts/actions";
import type { BookInput } from "@/lib/validation";

type BookFormProps = {
  mode: "create" | "edit";
  bookId?: string;
  initial: {
    title: string;
    heading: string;
    description: string;
    coverImageUrl: string;
    coverImageAlt: string;
    buyUrl: string;
    availableLabel: string;
    featured: boolean;
    status: "DRAFT" | "PUBLISHED";
  };
};

export function BookForm({ mode, bookId, initial }: BookFormProps) {
  const [title, setTitle] = useState(initial.title);
  const [heading, setHeading] = useState(initial.heading);
  const [description, setDescription] = useState(initial.description);
  const [coverImageUrl, setCoverImageUrl] = useState(initial.coverImageUrl);
  const [coverImageAlt, setCoverImageAlt] = useState(initial.coverImageAlt);
  const [buyUrl, setBuyUrl] = useState(initial.buyUrl);
  const [availableLabel, setAvailableLabel] = useState(initial.availableLabel);
  const [featured, setFeatured] = useState(initial.featured);
  const [status, setStatus] = useState(initial.status);

  const [error, setError] = useState<string | null>(null);
  const [coverUploading, startCoverUpload] = useTransition();
  const [pending, startSaving] = useTransition();

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

    const input: BookInput = {
      title,
      heading,
      description,
      coverImageUrl,
      coverImageAlt,
      buyUrl,
      availableLabel,
      featured,
      status,
    };

    startSaving(async () => {
      const result = mode === "create" ? await createBook(input) : await updateBook(bookId!, input);
      if (result && !result.ok) setError(result.error);
    });
  }

  function handleDelete() {
    if (!bookId) return;
    if (!window.confirm("Delete this book? This cannot be undone.")) return;
    startSaving(async () => {
      const result = await deleteBook(bookId);
      if (result && !result.ok) setError(result.error);
    });
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-6">
      <Field label="Title" htmlFor="title">
        <TextInput id="title" required value={title} onChange={(e) => setTitle(e.target.value)} />
      </Field>

      <Field label="Cover image" htmlFor="cover">
        <div className="flex items-center gap-4">
          {coverImageUrl ? (
            <div className="relative h-32 w-24 overflow-hidden rounded-lg border border-ink/10">
              <Image src={coverImageUrl} alt="" fill className="object-cover" />
            </div>
          ) : (
            <div className="flex h-32 w-24 items-center justify-center rounded-lg border border-dashed border-ink/20 text-center text-xs text-ink-soft">
              No cover yet
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
            placeholder="Describe the cover for screen readers"
          />
        </Field>
      ) : null}

      <Field label="Buy link" htmlFor="buyUrl">
        <TextInput
          id="buyUrl"
          type="url"
          required
          value={buyUrl}
          onChange={(e) => setBuyUrl(e.target.value)}
          placeholder="https://amazon.com/..."
        />
      </Field>

      <Field label="Availability tag (optional — defaults to “Available Now”)" htmlFor="availableLabel">
        <TextInput
          id="availableLabel"
          value={availableLabel}
          onChange={(e) => setAvailableLabel(e.target.value)}
          placeholder="Available Now"
        />
      </Field>

      <Field label="Teaser heading (optional — a question or hook shown on the homepage)" htmlFor="heading">
        <TextInput
          id="heading"
          value={heading}
          onChange={(e) => setHeading(e.target.value)}
          placeholder="What do we owe the people we love most?"
        />
      </Field>

      <Field label="Teaser description (optional — the paragraph shown under that heading)" htmlFor="description">
        <TextArea id="description" rows={4} value={description} onChange={(e) => setDescription(e.target.value)} />
      </Field>

      <label className="flex items-center gap-2 text-sm text-ink">
        <input type="checkbox" checked={featured} onChange={(e) => setFeatured(e.target.checked)} className="h-4 w-4 accent-forest" />
        Show this book on the homepage (unchecks any other featured book)
      </label>

      <Field label="Status" htmlFor="status">
        <Select id="status" value={status} onChange={(e) => setStatus(e.target.value as "DRAFT" | "PUBLISHED")}>
          <option value="DRAFT">Draft</option>
          <option value="PUBLISHED">Published</option>
        </Select>
      </Field>

      {error ? (
        <p role="alert" className="rounded-lg border border-red-900/15 bg-red-900/5 px-3 py-2 text-sm text-red-900">
          {error}
        </p>
      ) : null}

      <div className="flex items-center justify-between border-t border-ink/10 pt-5">
        <SubmitButton pending={pending}>{status === "PUBLISHED" ? "Save & Publish" : "Save Draft"}</SubmitButton>
        {mode === "edit" ? (
          <button type="button" onClick={handleDelete} disabled={pending} className="text-sm text-red-900/70 hover:text-red-900">
            Delete book
          </button>
        ) : null}
      </div>
    </form>
  );
}
