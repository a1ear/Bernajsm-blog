import type { Metadata } from "next";
import Link from "next/link";

import { Button } from "@/components/ui/Button";
import { BookCover } from "@/components/ui/BookCover";
import { BotanicalMotif } from "@/components/ui/BotanicalMotif";
import { Reveal, RevealGroup, RevealItem } from "@/components/ui/Reveal";
import { PostCard } from "@/components/content/PostCard";
import { QuoteCard } from "@/components/content/QuoteCard";
import { getLatestPosts, getFeaturedQuote } from "@/lib/queries";
import { site, hero, story } from "@/lib/content";

export const metadata: Metadata = {
  title: `${site.authorHandle} — Essays, Journal & the Book`,
  description: site.tagline,
  openGraph: {
    title: `${site.authorHandle} — Essays, Journal & the Book`,
    description: site.tagline,
    type: "website",
  },
};

export default async function HomePage() {
  const [latestBlog, latestJournal, featuredQuote] = await Promise.all([
    getLatestPosts("BLOG", 3),
    getLatestPosts("JOURNAL", 3),
    getFeaturedQuote(),
  ]);

  return (
    <>
      {/* Hero */}
      <section id="top" className="relative overflow-hidden bg-gradient-to-b from-tan/30 via-cream to-cream">
        <BotanicalMotif
          animate
          className="pointer-events-none absolute -left-10 top-24 h-64 w-64 text-ink/5 sm:h-80 sm:w-80"
        />
        <div className="relative mx-auto grid max-w-6xl gap-16 px-6 py-24 sm:px-10 sm:py-32 lg:grid-cols-[1.1fr_0.9fr] lg:items-center lg:py-36">
          {/*
            Plain divs, not <Reveal> -- this is above-the-fold content, and
            Reveal's whileInView + "-80px" viewport margin can fail to ever
            intersect a hero that's exactly as tall as (or taller than) a
            short mobile viewport, leaving it invisible until a scroll that
            never needs to happen. Reveal is for content the visitor scrolls
            to reach, not the first thing they see.
          */}
          <div>
            <p className="mb-6 text-xs font-medium uppercase tracking-[0.25em] text-ink-soft">
              Essays, Journal &amp; Quotes
            </p>
            <h1 className="balance font-display text-5xl font-bold leading-[1.05] text-ink sm:text-6xl">
              {site.tagline}
            </h1>
            <p className="pretty mt-6 max-w-lg text-base leading-relaxed text-ink-soft">
              {hero.intro}
            </p>
            <div className="mt-10 flex flex-wrap items-center gap-4">
              <Button href={site.amazonUrl} variant="primary">
                Order the Book
              </Button>
              <Button href="/blog" variant="secondary">
                Read the Blog
              </Button>
            </div>
          </div>

          <div className="mx-auto flex w-full max-w-sm flex-col items-center gap-5">
            <div className="w-full rounded-2xl bg-warm-white p-5 shadow-[0_30px_60px_-25px_rgba(42,42,38,0.35)]">
              <BookCover />
            </div>
            <span className="rounded-full border border-ink/15 bg-warm-white px-5 py-2 text-xs uppercase tracking-[0.2em] text-ink-soft">
              {hero.availableTag}
            </span>
          </div>
        </div>
      </section>

      <div className="flex justify-center overflow-hidden py-2 opacity-30">
        <BotanicalMotif className="h-8 w-32 -rotate-90 text-ink" />
      </div>

      {/* Book teaser strip */}
      <section className="bg-cream-alt py-24 sm:py-28">
        <div className="mx-auto grid max-w-6xl items-center gap-12 px-6 sm:px-10 lg:grid-cols-12">
          <Reveal className="lg:col-span-5 flex justify-center lg:justify-start">
            <div className="w-full max-w-sm rounded-xl bg-warm-white p-4 shadow-xl">
              <BookCover />
            </div>
          </Reveal>
          <Reveal delay={0.1} className="lg:col-span-7">
            <p className="text-xs font-medium uppercase tracking-[0.25em] text-forest">The Memoir</p>
            <h2 className="balance mt-2 font-display text-3xl font-bold leading-tight text-ink sm:text-4xl">
              {story.heading}
            </h2>
            <p className="pretty mt-5 max-w-xl leading-relaxed text-ink-soft">{story.body[0]}</p>
            <Button href={site.amazonUrl} variant="primary" className="mt-8">
              Order the Book →
            </Button>
          </Reveal>
        </div>
      </section>

      {/* Featured quote */}
      {featuredQuote ? (
        <section className="bg-cream px-6 py-20 sm:px-10">
          <Reveal className="mx-auto max-w-4xl">
            <QuoteCard quote={featuredQuote} />
          </Reveal>
        </section>
      ) : null}

      {/* Latest from the Blog */}
      <section className="bg-cream px-6 pb-20 sm:px-10">
        <div className="mx-auto max-w-6xl">
          <div className="mb-10 flex flex-wrap items-end justify-between gap-4">
            <div>
              <p className="text-xs font-medium uppercase tracking-[0.25em] text-forest">Dispatches</p>
              <h2 className="mt-2 font-display text-3xl font-bold text-ink sm:text-4xl">Latest from the Blog</h2>
            </div>
            <Link href="/blog" className="text-sm font-medium text-forest hover:text-forest-dark">
              Read all essays →
            </Link>
          </div>

          {latestBlog.length === 0 ? (
            <p className="rounded-2xl border border-dashed border-ink/15 bg-warm-white/60 px-6 py-12 text-center text-ink-soft">
              New essays are on their way — check back soon.
            </p>
          ) : (
            <RevealGroup className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {latestBlog.map((post) => (
                <RevealItem key={post.id}>
                  <PostCard post={post} basePath="/blog" />
                </RevealItem>
              ))}
            </RevealGroup>
          )}
        </div>
      </section>

      {/* From the Journal */}
      <section className="bg-cream-alt px-6 py-20 sm:px-10">
        <div className="mx-auto max-w-6xl">
          <div className="mb-10 flex flex-wrap items-end justify-between gap-4">
            <div>
              <p className="text-xs font-medium uppercase tracking-[0.25em] text-forest">Quiet Notes</p>
              <h2 className="mt-2 font-display text-3xl font-bold text-ink sm:text-4xl">From the Journal</h2>
            </div>
            <Link href="/journal" className="text-sm font-medium text-forest hover:text-forest-dark">
              Read all entries →
            </Link>
          </div>

          {latestJournal.length === 0 ? (
            <p className="rounded-2xl border border-dashed border-ink/15 bg-warm-white/60 px-6 py-12 text-center text-ink-soft">
              New journal entries are on their way — check back soon.
            </p>
          ) : (
            <RevealGroup className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {latestJournal.map((post) => (
                <RevealItem key={post.id}>
                  <PostCard post={post} basePath="/journal" />
                </RevealItem>
              ))}
            </RevealGroup>
          )}
        </div>
      </section>

      {/* Newsletter teaser */}
      <section className="bg-cream px-6 py-24 text-center sm:px-10">
        <Reveal className="mx-auto flex max-w-2xl flex-col items-center">
          <p className="text-xs font-medium uppercase tracking-[0.25em] text-forest">Direct Post</p>
          <h2 className="mt-2 font-display text-3xl font-bold text-ink sm:text-4xl">The Newsletter</h2>
          <p className="pretty mt-4 max-w-md leading-relaxed text-ink-soft">
            Occasional letters and reading recommendations, collected as downloadable issues — free to read any time.
          </p>
          <Button href="/newsletter" variant="primary" className="mt-8">
            Browse Issues
          </Button>
        </Reveal>
      </section>
    </>
  );
}
