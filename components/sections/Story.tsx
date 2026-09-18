import { Reveal } from "@/components/ui/Reveal";
import { BotanicalMotif } from "@/components/ui/BotanicalMotif";
import { story } from "@/lib/content";

export function Story() {
  return (
    <section id="story" className="bg-cream-alt py-24 sm:py-32">
      <div className="mx-auto grid max-w-6xl gap-16 px-6 sm:px-10 lg:grid-cols-[0.7fr_1.3fr] lg:items-center lg:gap-20">
        <Reveal className="mx-auto aspect-square w-full max-w-[280px]">
          <div className="flex h-full w-full items-center justify-center rounded-full bg-gradient-to-br from-tan via-cream to-forest/30 shadow-[0_25px_50px_-20px_rgba(42,42,38,0.3)]">
            <BotanicalMotif className="h-24 w-24 text-ink/25" />
          </div>
        </Reveal>

        <Reveal delay={0.1}>
          <p className="mb-4 text-xs font-medium uppercase tracking-[0.2em] text-ink-soft">
            {story.eyebrow}
          </p>
          <h2 className="balance font-display text-4xl font-bold leading-[1.1] text-ink sm:text-5xl">
            {story.heading}
          </h2>
          <div className="pretty mt-6 space-y-5 text-base leading-relaxed text-ink-soft">
            {story.body.map((p) => (
              <p key={p.slice(0, 12)}>{p}</p>
            ))}
          </div>
        </Reveal>
      </div>
    </section>
  );
}
