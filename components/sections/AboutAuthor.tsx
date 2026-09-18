import { Reveal } from "@/components/ui/Reveal";
import { author, site } from "@/lib/content";

function CheckIcon() {
  return (
    <svg viewBox="0 0 20 20" fill="none" className="h-4 w-4 flex-shrink-0 text-forest">
      <circle cx="10" cy="10" r="9" stroke="currentColor" strokeWidth="1.5" />
      <path
        d="M6.5 10.2l2.2 2.2 4.8-4.8"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export function AboutAuthor() {
  const initials = site.authorName
    .split(" ")
    .map((w) => w[0])
    .join("");

  return (
    <section id="author" className="bg-cream py-24 sm:py-32">
      <div className="mx-auto grid max-w-6xl gap-16 px-6 sm:px-10 lg:grid-cols-2 lg:items-start lg:gap-24">
        <Reveal className="mx-auto aspect-[4/5] w-full max-w-sm">
          <div className="flex h-full w-full items-center justify-center rounded-2xl bg-gradient-to-br from-tan via-cream-alt to-forest/20 shadow-[0_25px_50px_-25px_rgba(42,42,38,0.3)]">
            <span className="font-display text-7xl font-bold text-ink/20">
              {initials}
            </span>
          </div>
        </Reveal>

        <Reveal delay={0.1}>
          <p className="mb-4 text-xs font-medium uppercase tracking-[0.2em] text-ink-soft">
            {author.heading}
          </p>
          <h2 className="balance font-display text-4xl font-bold leading-[1.1] text-ink sm:text-5xl">
            {author.name}
          </h2>
          <p className="mt-2 font-accent text-xl italic text-forest">
            {author.subheading}
          </p>

          <p className="pretty mt-6 text-base leading-relaxed text-ink-soft">
            {author.bio}
          </p>

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

          <blockquote className="mt-8 border-l-2 border-forest pl-6">
            <p className="pretty font-accent text-xl italic leading-snug text-ink/85">
              {author.quote}
            </p>
          </blockquote>
        </Reveal>
      </div>
    </section>
  );
}
