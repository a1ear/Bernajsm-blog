import { Reveal, RevealGroup, RevealItem } from "@/components/ui/Reveal";
import { Button } from "@/components/ui/Button";
import { cta, site } from "@/lib/content";

function BookmarkIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" className="h-7 w-7 text-forest">
      <path
        d="M6 3h12a1 1 0 0 1 1 1v17l-7-4-7 4V4a1 1 0 0 1 1-1z"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export function CTASection() {
  return (
    <section id="cta" className="bg-cream-alt py-24 sm:py-32">
      <div className="mx-auto max-w-3xl px-6 text-center sm:px-10">
        <Reveal className="flex flex-col items-center">
          <BookmarkIcon />
          <h2 className="balance mt-6 font-display text-4xl font-bold leading-[1.1] text-ink sm:text-5xl">
            {cta.heading}
          </h2>
          <p className="mt-4 text-ink-soft">{cta.subheading}</p>
          <Button href={site.amazonUrl} variant="primary" className="mt-8">
            {cta.buttonLabel}
          </Button>
        </Reveal>

        <RevealGroup className="mt-16 grid gap-6 sm:grid-cols-2">
          {cta.links.map((link) => (
            <RevealItem key={link.label}>
              <div className="rounded-2xl border border-ink/10 bg-warm-white p-6 text-left">
                <p className="font-display text-lg font-bold text-ink">
                  {link.label}
                </p>
                <p className="pretty mt-2 text-sm leading-relaxed text-ink-soft">
                  {link.body}
                </p>
                <a
                  href={`mailto:${link.email}`}
                  className="mt-4 inline-block text-sm text-forest underline decoration-forest/40 decoration-2 underline-offset-4"
                >
                  {link.email} →
                </a>
              </div>
            </RevealItem>
          ))}
        </RevealGroup>
      </div>
    </section>
  );
}
