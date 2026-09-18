import type { MetadataRoute } from "next";

import { getSiteUrl } from "@/lib/site-url";

export default function robots(): MetadataRoute.Robots {
  // Deliberately no `disallow` entry for the admin path -- robots.txt is a
  // public file, so listing it here would advertise exactly the path a
  // rename is meant to obscure. The admin layout's `noindex` metadata (see
  // app/bjsm-write/(dashboard)/layout.tsx) is what actually keeps it out of
  // search results, without publishing its existence anywhere.
  return {
    rules: [{ userAgent: "*", allow: "/" }],
    sitemap: `${getSiteUrl()}/sitemap.xml`,
  };
}
