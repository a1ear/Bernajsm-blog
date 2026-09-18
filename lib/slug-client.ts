import slugify from "slugify";

/** Pure, client-safe slug generation — no server-only imports, no DB lookups. */
export function slugifyTitle(title: string): string {
  return slugify(title, { lower: true, strict: true, trim: true });
}
