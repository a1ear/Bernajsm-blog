import Link from "next/link";
import { footer, site } from "@/lib/content";
import { getVisibleSocialLinks } from "@/lib/queries";
import { SocialIcon, SOCIAL_PLATFORM_LABELS } from "@/components/ui/SocialIcon";

export async function Footer() {
  const year = new Date().getFullYear();
  const socialLinks = await getVisibleSocialLinks();

  return (
    <footer className="border-t border-ink/10 bg-cream">
      <div className="mx-auto flex max-w-6xl flex-col items-center gap-6 px-6 py-10 sm:flex-row sm:justify-between sm:px-10">
        <p className="font-display text-lg font-bold text-ink">
          {site.authorHandle}
        </p>

        <nav
          aria-label="Footer"
          className="flex flex-wrap justify-center gap-x-6 gap-y-2 text-sm text-ink-soft"
        >
          {footer.links.map((link) =>
            link.href.startsWith("/") ? (
              <Link key={link.label} href={link.href} className="hover:text-ink">
                {link.label}
              </Link>
            ) : (
              <a key={link.label} href={link.href} className="hover:text-ink">
                {link.label}
              </a>
            )
          )}
        </nav>

        {socialLinks.length > 0 ? (
          <div className="flex items-center gap-4">
            {socialLinks.map((link) => (
              <a
                key={link.id}
                href={link.url}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={link.label || SOCIAL_PLATFORM_LABELS[link.platform] || link.platform}
                className="flex h-9 w-9 items-center justify-center rounded-full border border-ink/15 text-ink-soft transition-colors hover:border-ink hover:text-ink"
              >
                <SocialIcon platform={link.platform} />
              </a>
            ))}
          </div>
        ) : null}
      </div>

      <div className="border-t border-ink/10 py-5 text-center text-xs text-ink-soft">
        © {year} {site.authorName}. All rights reserved.
      </div>
    </footer>
  );
}
