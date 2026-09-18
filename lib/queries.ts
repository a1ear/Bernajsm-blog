import "server-only";

import { prisma } from "@/lib/prisma";
import type { PostType } from "@/generated/prisma/enums";

/**
 * Public-facing read helpers. Every query here filters to `PUBLISHED`
 * (and, where relevant, `publishedAt <= now`) — this filter, not a database
 * policy, is what keeps drafts off the public site. See lib/auth.ts for why
 * that's the correct place for it.
 */

const PAGE_SIZE = 9;

export async function getPublishedPosts(type: PostType, page = 1) {
  const where = {
    type,
    status: "PUBLISHED" as const,
    publishedAt: { lte: new Date() },
  };

  const [posts, total] = await Promise.all([
    prisma.post.findMany({
      where,
      orderBy: { publishedAt: "desc" },
      skip: (page - 1) * PAGE_SIZE,
      take: PAGE_SIZE,
    }),
    prisma.post.count({ where }),
  ]);

  return { posts, total, pageSize: PAGE_SIZE, totalPages: Math.max(1, Math.ceil(total / PAGE_SIZE)) };
}

export async function getLatestPosts(type: PostType, limit: number) {
  return prisma.post.findMany({
    where: { type, status: "PUBLISHED", publishedAt: { lte: new Date() } },
    orderBy: { publishedAt: "desc" },
    take: limit,
  });
}

export async function getPublishedPostBySlug(type: PostType, slug: string) {
  return prisma.post.findFirst({
    where: { type, slug, status: "PUBLISHED", publishedAt: { lte: new Date() } },
  });
}

export async function getPublishedQuotes(page = 1) {
  const where = { status: "PUBLISHED" as const, publishedAt: { lte: new Date() } };

  const [quotes, total] = await Promise.all([
    prisma.quote.findMany({
      where,
      orderBy: { publishedAt: "desc" },
      skip: (page - 1) * PAGE_SIZE,
      take: PAGE_SIZE,
    }),
    prisma.quote.count({ where }),
  ]);

  return { quotes, total, pageSize: PAGE_SIZE, totalPages: Math.max(1, Math.ceil(total / PAGE_SIZE)) };
}

export async function getFeaturedQuote() {
  return prisma.quote.findFirst({
    where: { status: "PUBLISHED", publishedAt: { lte: new Date() } },
    orderBy: { publishedAt: "desc" },
  });
}

export async function getPublishedNewsletters(page = 1) {
  const where = { status: "PUBLISHED" as const, publishedAt: { lte: new Date() } };

  const [issues, total] = await Promise.all([
    prisma.newsletter.findMany({
      where,
      orderBy: { issueDate: "desc" },
      skip: (page - 1) * PAGE_SIZE,
      take: PAGE_SIZE,
    }),
    prisma.newsletter.count({ where }),
  ]);

  return { issues, total, pageSize: PAGE_SIZE, totalPages: Math.max(1, Math.ceil(total / PAGE_SIZE)) };
}

export async function getVisibleSocialLinks() {
  return prisma.socialLink.findMany({
    where: { visible: true },
    orderBy: { sortOrder: "asc" },
  });
}

export async function getAuthorProfile() {
  return prisma.author.findFirst();
}
