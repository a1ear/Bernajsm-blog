import type { MetadataRoute } from "next";

import { prisma } from "@/lib/prisma";
import { getSiteUrl } from "@/lib/site-url";

// Same reasoning as app/(site)/layout.tsx: this reads published posts from
// Postgres, so it must render per-request rather than once at build time.
export const dynamic = "force-dynamic";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const base = getSiteUrl();

  const staticRoutes: MetadataRoute.Sitemap = [
    "",
    "/book",
    "/blog",
    "/journal",
    "/quotes",
    "/newsletter",
    "/about",
    "/privacy-policy",
  ].map((path) => ({ url: `${base}${path}`, changeFrequency: "weekly", priority: path === "" ? 1 : 0.7 }));

  const publishedPosts = await prisma.post.findMany({
    where: { status: "PUBLISHED", publishedAt: { lte: new Date() } },
    select: { slug: true, type: true, updatedAt: true },
  });

  const postRoutes: MetadataRoute.Sitemap = publishedPosts.map((post) => ({
    url: `${base}/${post.type === "BLOG" ? "blog" : "journal"}/${post.slug}`,
    lastModified: post.updatedAt,
    changeFrequency: "monthly",
    priority: 0.6,
  }));

  return [...staticRoutes, ...postRoutes];
}
