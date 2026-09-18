import Link from "next/link";

import { prisma } from "@/lib/prisma";
import { SOCIAL_PLATFORM_LABELS } from "@/components/ui/SocialIcon";

export const dynamic = "force-dynamic";

export default async function AdminSocialLinksPage() {
  const links = await prisma.socialLink.findMany({ orderBy: { sortOrder: "asc" } });

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="font-display text-2xl font-bold text-ink">Social Links</h1>
          <p className="mt-1 text-sm text-ink-soft">Shown in the site footer.</p>
        </div>
        <Link
          href="/bjsm-write/social-links/new"
          className="rounded-full bg-forest px-5 py-2.5 text-sm font-medium text-warm-white transition-all hover:-translate-y-0.5 hover:bg-forest-dark"
        >
          Add Link
        </Link>
      </div>

      <div className="overflow-hidden rounded-2xl border border-ink/8 bg-warm-white">
        {links.length === 0 ? (
          <p className="px-6 py-10 text-center text-sm text-ink-soft">No social links yet.</p>
        ) : (
          <ul className="divide-y divide-ink/8">
            {links.map((link) => (
              <li key={link.id}>
                <Link
                  href={`/bjsm-write/social-links/${link.id}`}
                  className="flex items-center justify-between gap-4 px-5 py-4 transition-colors hover:bg-cream-alt"
                >
                  <div className="min-w-0">
                    <p className="font-medium text-ink">
                      {link.label || SOCIAL_PLATFORM_LABELS[link.platform] || link.platform}
                    </p>
                    <p className="mt-0.5 truncate text-xs text-ink-soft">{link.url}</p>
                  </div>
                  {!link.visible ? (
                    <span className="rounded-full bg-ink/8 px-2.5 py-0.5 text-xs font-medium text-ink-soft">Hidden</span>
                  ) : null}
                </Link>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
