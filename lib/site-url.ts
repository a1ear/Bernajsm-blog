/**
 * Not part of env.client.ts's validated schema because it's optional with a
 * safe fallback — sitemap/robots/OG tags still work on localhost or an
 * unconfigured preview deploy, just with a placeholder origin.
 */
export function getSiteUrl(): string {
  // Falls back to localhost, deliberately -- this must never guess a real
  // domain. Set NEXT_PUBLIC_SITE_URL before deploying (see SETUP.md); until
  // then sitemap/robots/OG tags point at localhost instead of silently
  // advertising a domain nobody registered.
  return process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";
}
