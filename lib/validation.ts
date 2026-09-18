import { z } from "zod";

/**
 * Schemas shared with Client Components live here, never inside a
 * `"use server"` file — every export of a `"use server"` module compiles to
 * a server-action network stub, not the value written. See AGENTS.md.
 */

function safeRedirectTarget(next: unknown): string | undefined {
  return typeof next === "string" && /^\/[^/\\]/.test(next) ? next : undefined;
}

export const loginSchema = z.object({
  email: z.email("Enter a valid email address."),
  password: z.string().min(1, "Enter your password."),
  next: z.string().optional().transform(safeRedirectTarget),
});
export type LoginInput = z.infer<typeof loginSchema>;

export const postTypeSchema = z.enum(["BLOG", "JOURNAL"]);
export const contentStatusSchema = z.enum(["DRAFT", "PUBLISHED"]);

export const postSchema = z.object({
  type: postTypeSchema,
  title: z.string().trim().min(1, "Title is required.").max(200),
  slug: z
    .string()
    .trim()
    .min(1, "Slug is required.")
    .max(200)
    .regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, "Use lowercase letters, numbers and hyphens only."),
  excerpt: z.string().trim().max(400).optional().or(z.literal("")),
  bodyJson: z.unknown(),
  coverImageUrl: z.string().trim().max(2000).optional().or(z.literal("")),
  coverImageAlt: z.string().trim().max(300).optional().or(z.literal("")),
  status: contentStatusSchema,
});
export type PostInput = z.infer<typeof postSchema>;

export const quoteSchema = z.object({
  text: z.string().trim().min(1, "Quote text is required.").max(1000),
  attribution: z.string().trim().max(200).optional().or(z.literal("")),
  status: contentStatusSchema,
});
export type QuoteInput = z.infer<typeof quoteSchema>;

export const newsletterSchema = z.object({
  title: z.string().trim().min(1, "Title is required.").max(200),
  description: z.string().trim().max(600).optional().or(z.literal("")),
  issueDate: z.string().trim().min(1, "Issue date is required."),
  fileUrl: z.string().trim().min(1, "Upload a file first."),
  fileName: z.string().trim().min(1),
  status: contentStatusSchema,
});
export type NewsletterInput = z.infer<typeof newsletterSchema>;

export const socialPlatformSchema = z.enum([
  "instagram",
  "pinterest",
  "tiktok",
  "facebook",
  "x",
  "youtube",
  "custom",
]);

export const socialLinkSchema = z.object({
  platform: socialPlatformSchema,
  label: z.string().trim().max(60).optional().or(z.literal("")),
  url: z.url("Enter a full URL, including https://"),
  sortOrder: z.coerce.number().int().default(0),
  visible: z.coerce.boolean().default(true),
});
export type SocialLinkInput = z.infer<typeof socialLinkSchema>;

export const authorProfileSchema = z.object({
  name: z.string().trim().min(1, "Name is required.").max(200),
  handle: z.string().trim().max(100).optional().or(z.literal("")),
  bio: z.string().trim().max(2000).optional().or(z.literal("")),
  photoUrl: z.string().trim().max(2000).optional().or(z.literal("")),
});
export type AuthorProfileInput = z.infer<typeof authorProfileSchema>;
