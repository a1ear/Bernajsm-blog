"use client";

import { useState, useTransition } from "react";
import Image from "next/image";

import { Field, TextArea, TextInput, SubmitButton } from "@/components/admin/FormControls";
import { saveAuthorProfile } from "@/app/bjsm-write/(dashboard)/profile/actions";
import { uploadMediaImage } from "@/app/bjsm-write/(dashboard)/posts/actions";
import type { AuthorProfileInput } from "@/lib/validation";

export function ProfileForm({
  initial,
}: {
  initial: { name: string; handle: string; bio: string; photoUrl: string };
}) {
  const [name, setName] = useState(initial.name);
  const [handle, setHandle] = useState(initial.handle);
  const [bio, setBio] = useState(initial.bio);
  const [photoUrl, setPhotoUrl] = useState(initial.photoUrl);
  const [error, setError] = useState<string | null>(null);
  const [message, setMessage] = useState<string | null>(null);
  const [uploading, startUpload] = useTransition();
  const [pending, startSaving] = useTransition();

  function handlePhotoPick(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    e.target.value = "";
    if (!file) return;

    startUpload(async () => {
      const formData = new FormData();
      formData.set("file", file);
      const result = await uploadMediaImage(formData);
      if (!result.ok) {
        setError(result.error);
        return;
      }
      setPhotoUrl(result.url);
    });
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setMessage(null);
    const input: AuthorProfileInput = { name, handle, bio, photoUrl };
    startSaving(async () => {
      const result = await saveAuthorProfile(input);
      if (!result.ok) setError(result.error);
      else setMessage(result.message ?? "Saved.");
    });
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-6">
      <Field label="Photo" htmlFor="photo">
        <div className="flex items-center gap-4">
          {photoUrl ? (
            <div className="relative h-20 w-20 overflow-hidden rounded-full border border-ink/10">
              <Image src={photoUrl} alt="" fill className="object-cover" />
            </div>
          ) : (
            <div className="flex h-20 w-20 items-center justify-center rounded-full border border-dashed border-ink/20 text-xs text-ink-soft">
              None
            </div>
          )}
          <label className="cursor-pointer rounded-full border border-ink/20 px-4 py-2 text-sm text-ink transition-colors hover:border-ink">
            {uploading ? "Uploading…" : photoUrl ? "Replace" : "Upload"}
            <input type="file" accept="image/*" className="hidden" disabled={uploading} onChange={handlePhotoPick} />
          </label>
        </div>
      </Field>

      <Field label="Name" htmlFor="name">
        <TextInput id="name" required value={name} onChange={(e) => setName(e.target.value)} />
      </Field>

      <Field label="Handle (shown in the nav and footer)" htmlFor="handle">
        <TextInput id="handle" value={handle} onChange={(e) => setHandle(e.target.value)} placeholder="Berna JSM" />
      </Field>

      <Field label="Bio (shown on the About page)" htmlFor="bio">
        <TextArea id="bio" rows={5} value={bio} onChange={(e) => setBio(e.target.value)} />
      </Field>

      {error ? (
        <p role="alert" className="rounded-lg border border-red-900/15 bg-red-900/5 px-3 py-2 text-sm text-red-900">
          {error}
        </p>
      ) : null}
      {message ? <p className="text-sm text-forest">{message}</p> : null}

      <div>
        <SubmitButton pending={pending}>Save Profile</SubmitButton>
      </div>
    </form>
  );
}
