"use client";

import { useState, useTransition } from "react";

import { Field, TextInput, Select, SubmitButton } from "@/components/admin/FormControls";
import { createSocialLink, updateSocialLink, deleteSocialLink } from "@/app/bjsm-write/(dashboard)/social-links/actions";
import type { SocialLinkInput } from "@/lib/validation";

const PLATFORMS = ["instagram", "pinterest", "tiktok", "facebook", "x", "youtube", "custom"] as const;

type SocialLinkFormProps = {
  mode: "create" | "edit";
  linkId?: string;
  initial: {
    platform: (typeof PLATFORMS)[number];
    label: string;
    url: string;
    sortOrder: number;
    visible: boolean;
  };
};

export function SocialLinkForm({ mode, linkId, initial }: SocialLinkFormProps) {
  const [platform, setPlatform] = useState(initial.platform);
  const [label, setLabel] = useState(initial.label);
  const [url, setUrl] = useState(initial.url);
  const [sortOrder, setSortOrder] = useState(initial.sortOrder);
  const [visible, setVisible] = useState(initial.visible);
  const [error, setError] = useState<string | null>(null);
  const [pending, startTransition] = useTransition();

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    const input: SocialLinkInput = { platform, label, url, sortOrder, visible };
    startTransition(async () => {
      const result = mode === "create" ? await createSocialLink(input) : await updateSocialLink(linkId!, input);
      if (result && !result.ok) setError(result.error);
    });
  }

  function handleDelete() {
    if (!linkId) return;
    if (!window.confirm("Remove this social link?")) return;
    startTransition(async () => {
      const result = await deleteSocialLink(linkId);
      if (result && !result.ok) setError(result.error);
    });
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-6">
      <Field label="Platform" htmlFor="platform">
        <Select id="platform" value={platform} onChange={(e) => setPlatform(e.target.value as typeof platform)}>
          {PLATFORMS.map((p) => (
            <option key={p} value={p}>
              {p === "x" ? "X (Twitter)" : p[0].toUpperCase() + p.slice(1)}
            </option>
          ))}
        </Select>
      </Field>

      {platform === "custom" ? (
        <Field label="Label" htmlFor="label">
          <TextInput id="label" value={label} onChange={(e) => setLabel(e.target.value)} placeholder="e.g. Goodreads" />
        </Field>
      ) : null}

      <Field label="URL" htmlFor="url">
        <TextInput id="url" type="url" required value={url} onChange={(e) => setUrl(e.target.value)} placeholder="https://" />
      </Field>

      <Field label="Sort order (lower shows first)" htmlFor="sortOrder">
        <TextInput
          id="sortOrder"
          type="number"
          value={sortOrder}
          onChange={(e) => setSortOrder(Number(e.target.value))}
        />
      </Field>

      <label className="flex items-center gap-2 text-sm text-ink">
        <input type="checkbox" checked={visible} onChange={(e) => setVisible(e.target.checked)} className="h-4 w-4 accent-forest" />
        Show in footer
      </label>

      {error ? (
        <p role="alert" className="rounded-lg border border-red-900/15 bg-red-900/5 px-3 py-2 text-sm text-red-900">
          {error}
        </p>
      ) : null}

      <div className="flex items-center justify-between border-t border-ink/10 pt-5">
        <SubmitButton pending={pending}>Save</SubmitButton>
        {mode === "edit" ? (
          <button type="button" onClick={handleDelete} disabled={pending} className="text-sm text-red-900/70 hover:text-red-900">
            Remove
          </button>
        ) : null}
      </div>
    </form>
  );
}
