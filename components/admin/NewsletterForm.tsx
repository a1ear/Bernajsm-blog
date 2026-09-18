"use client";

import { useState, useTransition } from "react";

import { Field, TextArea, TextInput, Select, SubmitButton } from "@/components/admin/FormControls";
import {
  createNewsletter,
  updateNewsletter,
  deleteNewsletter,
  uploadNewsletterFile,
} from "@/app/bjsm-write/(dashboard)/newsletters/actions";
import type { NewsletterInput } from "@/lib/validation";

type NewsletterFormProps = {
  mode: "create" | "edit";
  newsletterId?: string;
  initial: {
    title: string;
    description: string;
    issueDate: string;
    fileUrl: string;
    fileName: string;
    status: "DRAFT" | "PUBLISHED";
  };
};

export function NewsletterForm({ mode, newsletterId, initial }: NewsletterFormProps) {
  const [title, setTitle] = useState(initial.title);
  const [description, setDescription] = useState(initial.description);
  const [issueDate, setIssueDate] = useState(initial.issueDate);
  const [fileUrl, setFileUrl] = useState(initial.fileUrl);
  const [fileName, setFileName] = useState(initial.fileName);
  const [status, setStatus] = useState(initial.status);
  const [error, setError] = useState<string | null>(null);
  const [uploading, startUpload] = useTransition();
  const [pending, startSaving] = useTransition();

  function handleFilePick(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    e.target.value = "";
    if (!file) return;

    startUpload(async () => {
      const formData = new FormData();
      formData.set("file", file);
      const result = await uploadNewsletterFile(formData);
      if (!result.ok) {
        setError(result.error);
        return;
      }
      setFileUrl(result.url);
      setFileName(result.fileName);
    });
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    const input: NewsletterInput = { title, description, issueDate, fileUrl, fileName, status };
    startSaving(async () => {
      const result =
        mode === "create" ? await createNewsletter(input) : await updateNewsletter(newsletterId!, input);
      if (result && !result.ok) setError(result.error);
    });
  }

  function handleDelete() {
    if (!newsletterId) return;
    if (!window.confirm("Delete this newsletter issue?")) return;
    startSaving(async () => {
      const result = await deleteNewsletter(newsletterId);
      if (result && !result.ok) setError(result.error);
    });
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-6">
      <Field label="Title" htmlFor="title">
        <TextInput id="title" required value={title} onChange={(e) => setTitle(e.target.value)} />
      </Field>

      <Field label="Issue date" htmlFor="issueDate">
        <TextInput
          id="issueDate"
          type="date"
          required
          value={issueDate}
          onChange={(e) => setIssueDate(e.target.value)}
        />
      </Field>

      <Field label="Description (optional)" htmlFor="description">
        <TextArea id="description" rows={3} value={description} onChange={(e) => setDescription(e.target.value)} />
      </Field>

      <Field label="File (PDF or similar)" htmlFor="file">
        <div className="flex items-center gap-4">
          {fileName ? (
            <a href={fileUrl} target="_blank" rel="noopener noreferrer" className="text-sm text-forest underline underline-offset-4">
              {fileName}
            </a>
          ) : (
            <span className="text-sm text-ink-soft">No file uploaded yet</span>
          )}
          <label className="cursor-pointer rounded-full border border-ink/20 px-4 py-2 text-sm text-ink transition-colors hover:border-ink">
            {uploading ? "Uploading…" : fileName ? "Replace" : "Upload"}
            <input type="file" className="hidden" disabled={uploading} onChange={handleFilePick} />
          </label>
        </div>
      </Field>

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
            Delete issue
          </button>
        ) : null}
      </div>
    </form>
  );
}
