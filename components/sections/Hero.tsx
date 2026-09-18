"use client";

import { motion, type Variants } from "framer-motion";
import { Button } from "@/components/ui/Button";
import { BookCover } from "@/components/ui/BookCover";
import { BotanicalMotif } from "@/components/ui/BotanicalMotif";
import { hero, site } from "@/lib/content";

const EASE = [0.16, 1, 0.3, 1] as const;

const fadeUp: Variants = {
  hidden: { opacity: 0, y: 18 },
  show: (delay: number) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.8, ease: EASE, delay },
  }),
};

function Stars({ count }: { count: number }) {
  return (
    <div className="flex gap-0.5 text-forest" aria-hidden="true">
      {Array.from({ length: count }).map((_, i) => (
        <svg key={i} viewBox="0 0 20 20" fill="currentColor" className="h-4 w-4">
          <path d="M10 1.5l2.6 5.6 6.1.6-4.6 4.1 1.3 6-5.4-3.1-5.4 3.1 1.3-6-4.6-4.1 6.1-.6L10 1.5z" />
        </svg>
      ))}
    </div>
  );
}

export function Hero() {
  return (
    <section
      id="top"
      className="relative overflow-hidden bg-gradient-to-b from-tan/30 via-cream to-cream"
    >
      <BotanicalMotif
        animate
        className="pointer-events-none absolute -left-10 top-24 h-64 w-64 text-ink/5 sm:h-80 sm:w-80"
      />

      <div className="relative mx-auto grid max-w-6xl gap-16 px-6 py-24 sm:px-10 sm:py-32 lg:grid-cols-[1.1fr_0.9fr] lg:items-center lg:py-40">
        <div>
          <motion.p
            custom={0}
            initial="hidden"
            animate="show"
            variants={fadeUp}
            className="mb-6 text-xs font-medium uppercase tracking-[0.25em] text-ink-soft"
          >
            {hero.eyebrow}
          </motion.p>

          <motion.h1
            custom={0.12}
            initial="hidden"
            animate="show"
            variants={fadeUp}
            className="balance font-display text-5xl font-bold leading-[1.05] text-ink sm:text-6xl lg:text-7xl"
          >
            {site.bookTitleLine1}
            <br />
            <span className="italic text-forest">{site.bookTitleLine2}</span>
          </motion.h1>

          <motion.p
            custom={0.28}
            initial="hidden"
            animate="show"
            variants={fadeUp}
            className="pretty mt-6 max-w-lg text-base leading-relaxed text-ink-soft"
          >
            {hero.intro}
          </motion.p>

          <motion.div
            custom={0.4}
            initial="hidden"
            animate="show"
            variants={fadeUp}
            className="mt-10 flex flex-wrap items-center gap-4"
          >
            <Button href={site.amazonUrl} variant="primary">
              <svg viewBox="0 0 24 24" fill="none" className="h-4 w-4">
                <path
                  d="M6 3h9l5 5v13a1 1 0 0 1-1 1H6a1 1 0 0 1-1-1V4a1 1 0 0 1 1-1z"
                  stroke="currentColor"
                  strokeWidth="1.5"
                />
              </svg>
              Order on Amazon
            </Button>
            <Button href="#story" variant="secondary">
              Read Excerpt
            </Button>
          </motion.div>

          <motion.div
            custom={0.5}
            initial="hidden"
            animate="show"
            variants={fadeUp}
            className="mt-8 flex items-center gap-3"
          >
            <Stars count={hero.rating} />
            <p className="text-sm text-ink-soft">
              &ldquo;{hero.reviewQuote}&rdquo; — {hero.reviewSource}
            </p>
          </motion.div>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 24, scale: 0.98 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ duration: 0.9, ease: EASE, delay: 0.3 }}
          className="mx-auto flex w-full max-w-sm flex-col items-center gap-5"
        >
          <div className="w-full rounded-2xl bg-warm-white p-5 shadow-[0_30px_60px_-25px_rgba(42,42,38,0.35)]">
            <BookCover />
          </div>
          <span className="rounded-full border border-ink/15 bg-warm-white px-5 py-2 text-xs uppercase tracking-[0.2em] text-ink-soft">
            {hero.availableTag}
          </span>
        </motion.div>
      </div>
    </section>
  );
}
