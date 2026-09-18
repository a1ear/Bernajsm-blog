import { SectionHeading } from "@/components/ui/SectionHeading";
import { Reveal, RevealGroup, RevealItem } from "@/components/ui/Reveal";
import { acclaim } from "@/lib/content";

function Stars({ count }: { count: number }) {
  return (
    <div className="mb-3 flex gap-0.5" aria-hidden="true">
      {Array.from({ length: count }).map((_, i) => (
        <svg key={i} viewBox="0 0 20 20" fill="currentColor" className="h-4 w-4 text-forest">
          <path d="M10 1.5l2.6 5.6 6.1.6-4.6 4.1 1.3 6-5.4-3.1-5.4 3.1 1.3-6-4.6-4.1 6.1-.6L10 1.5z" />
        </svg>
      ))}
    </div>
  );
}

const cardStyles: Record<string, string> = {
  cream: "bg-cream-alt text-ink",
  tan: "bg-tan text-ink",
  forest: "bg-forest text-warm-white",
  rating: "bg-warm-white text-ink border border-ink/10",
};

const quoteMarkStyles: Record<string, string> = {
  cream: "text-ink/20",
  tan: "text-ink/25",
  forest: "text-warm-white/30",
  rating: "text-forest/30",
};

export function Acclaim() {
  return (
    <section id="acclaim" className="bg-cream py-24 sm:py-32">
      <div className="mx-auto max-w-6xl px-6 sm:px-10">
        <Reveal className="text-center">
          <SectionHeading
            heading={acclaim.heading}
            align="center"
            underline
          />
        </Reveal>

        <RevealGroup className="mt-16 grid gap-6 sm:grid-cols-2">
          {acclaim.testimonials.map((t) => (
            <RevealItem key={t.source}>
              <figure
                className={`flex h-full flex-col rounded-2xl p-8 ${cardStyles[t.style]}`}
              >
                {t.style === "rating" && t.rating ? (
                  <Stars count={t.rating} />
                ) : (
                  <span
                    className={`mb-2 font-display text-5xl leading-none ${quoteMarkStyles[t.style]}`}
                  >
                    &ldquo;
                  </span>
                )}
                <blockquote className="pretty flex-1 text-base leading-relaxed">
                  {t.quote}
                </blockquote>
                <figcaption
                  className={`mt-5 text-xs uppercase tracking-[0.15em] ${
                    t.style === "forest" ? "text-warm-white/70" : "text-ink-soft"
                  }`}
                >
                  {t.style === "rating" ? "Editor's Choice" : `— ${t.source}`}
                </figcaption>
              </figure>
            </RevealItem>
          ))}
        </RevealGroup>
      </div>
    </section>
  );
}
