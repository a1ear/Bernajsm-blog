import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";

import { getAuthorProfile } from "@/lib/queries";
import { author, site } from "@/lib/content";

export const metadata: Metadata = {
  title: `About — ${site.authorHandle}`,
  description: author.bio,
};

function CheckIcon() {
  return (
    <svg viewBox="0 0 20 20" fill="none" className="h-4 w-4 flex-shrink-0 text-forest">
      <circle cx="10" cy="10" r="9" stroke="currentColor" strokeWidth="1.5" />
      <path d="M6.5 10.2l2.2 2.2 4.8-4.8" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

export default async function AboutPage() {
  const profile = await getAuthorProfile();
  const name = profile?.name || site.authorName;
  const bio = profile?.bio || author.bio;
  const photoUrl = profile?.photoUrl;

  const initials = name
    .split(" ")
    .map((w) => w[0])
    .join("");

  return (
    <section className="bg-cream py-24 sm:py-32">
      <div className="mx-auto grid max-w-6xl gap-16 px-6 sm:px-10 lg:grid-cols-2 lg:items-start lg:gap-24">
        {/* Plain divs, not <Reveal> -- this is the page's primary above-the-fold content; see the comment on the homepage hero for why scroll-triggered reveal is wrong here. */}
        <div className="mx-auto aspect-[4/5] w-full max-w-sm">
          {photoUrl ? (
            <div className="relative h-full w-full overflow-hidden rounded-2xl shadow-[0_25px_50px_-25px_rgba(42,42,38,0.3)]">
              <Image src={photoUrl} alt={name} fill sizes="384px" className="object-cover" priority />
            </div>
          ) : (
            <div className="flex h-full w-full items-center justify-center rounded-2xl bg-gradient-to-br from-tan via-cream-alt to-forest/20 shadow-[0_25px_50px_-25px_rgba(42,42,38,0.3)]">
              <span className="font-display text-7xl font-bold text-ink/20">{initials}</span>
            </div>
          )}
        </div>

        <div>
          <p className="mb-4 text-xs font-medium uppercase tracking-[0.2em] text-ink-soft">About</p>
          <h1 className="balance font-display text-4xl font-bold leading-[1.1] text-ink sm:text-5xl">
            {name}
          </h1>
          <p className="mt-2 font-accent text-xl italic text-forest">{author.subheading}</p>

          <p className="pretty mt-6 whitespace-pre-line text-base leading-relaxed text-ink-soft">{bio}</p>

          <div className="mt-8 rounded-2xl bg-warm-white p-6">
            <p className="mb-4 text-xs font-medium uppercase tracking-[0.15em] text-ink-soft">
              {author.methodologyHeading}
            </p>
            <ul className="space-y-3">
              {author.methodology.map((item) => (
                <li key={item} className="flex items-start gap-3 text-sm text-ink">
                  <CheckIcon />
                  <span className="pretty">{item}</span>
                </li>
              ))}
            </ul>
          </div>

          <Link
            href="/book"
            className="mt-8 inline-block text-sm text-forest underline decoration-forest/40 decoration-2 underline-offset-4"
          >
            Read about the book →
          </Link>
        </div>
      </div>
    </section>
  );
}
