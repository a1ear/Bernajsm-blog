"use client";

import { useState, useTransition } from "react";

import { Field, TextArea, TextInput, Select, SubmitButton } from "@/components/admin/FormControls";
import { createQuote, updateQuote, deleteQuote } from "@/app/bjsm-write/(dashboard)/quotes/actions";
import type { QuoteInput } from "@/lib/validation";

type QuoteFormProps = {
  mode: "create" | "edit";
  quoteId?: string;
  initial: { text: string; attribution: string; status: "DRAFT" | "PUBLISHED" };
};

export function QuoteForm({ mode, quoteId, initial }: QuoteFormProps) {
  const [text, setText] = useState(initial.text);
  const [attribution, setAttribution] = useState(initial.attribution);
  const [status, setStatus] = useState(initial.status);
  const [error, setError] = useState<string | null>(null);
  const [pending, startTransition] = useTransition();

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    const input: QuoteInput = { text, attribution, status };
    startTransition(async () => {
      const result = mode === "create" ? await createQuote(input) : await updateQuote(quoteId!, input);
      if (result && !result.ok) setError(result.error);
    });
  }

  function handleDelete() {
    if (!quoteId) return;
    if (!window.confirm("Delete this quote?")) return;
    startTransition(async () => {
      const result = await deleteQuote(quoteId);
      if (result && !result.ok) setError(result.error);
    });
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-6">
      <Field label="Quote" htmlFor="text">
        <TextArea id="text" rows={3} required value={text} onChange={(e) => setText(e.target.value)} />
      </Field>

      <Field label="Attribution (optional — defaults to Bernadette Magbanua)" htmlFor="attribution">
        <TextInput id="attribution" value={attribution} onChange={(e) => setAttribution(e.target.value)} />
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
            Delete quote
          </button>
        ) : null}
      </div>
    </form>
  );
}
