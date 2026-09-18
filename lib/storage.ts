import "server-only";

import { createClient as createSupabaseClient } from "@supabase/supabase-js";

import { clientEnv } from "@/lib/env.client";
import { serverEnv } from "@/lib/env.server";

export const MEDIA_BUCKET = "media";
export const NEWSLETTERS_BUCKET = "newsletters";

/**
 * Service-role Supabase client, used ONLY from Server Actions that have
 * already called `requireAdmin()`. This key bypasses RLS entirely and must
 * never reach the browser — that is why uploads happen through a server
 * action instead of handing the client a signed upload URL. See SETUP.md for
 * how the two public buckets this uses (`media`, `newsletters`) are created.
 */
function serviceRoleClient() {
  const { NEXT_PUBLIC_SUPABASE_URL } = clientEnv();
  const { SUPABASE_SERVICE_ROLE_KEY } = serverEnv();
  return createSupabaseClient(NEXT_PUBLIC_SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY, {
    auth: { persistSession: false },
  });
}

export type UploadResult = { url: string; fileName: string };

/** Uploads a file to a public bucket and returns its public URL. */
export async function uploadToBucket(
  bucket: typeof MEDIA_BUCKET | typeof NEWSLETTERS_BUCKET,
  file: File,
): Promise<UploadResult> {
  const supabase = serviceRoleClient();

  const safeName = file.name.replace(/[^a-zA-Z0-9._-]/g, "_");
  const path = `${crypto.randomUUID()}-${safeName}`;

  const { error } = await supabase.storage.from(bucket).upload(path, file, {
    contentType: file.type || "application/octet-stream",
    upsert: false,
  });
  if (error) throw new Error(`Upload failed: ${error.message}`);

  const { data } = supabase.storage.from(bucket).getPublicUrl(path);
  return { url: data.publicUrl, fileName: file.name };
}
