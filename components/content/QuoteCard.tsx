import { site } from "@/lib/content";
import type { Quote } from "@/generated/prisma/client";

export function QuoteCard({ quote }: { quote: Quote }) {
  return (
    <blockquote className="rounded-2xl bg-tan p-8 text-center shadow-[0_2px_8px_rgba(42,42,38,0.04)] sm:p-10">
      <p className="font-display text-xl italic leading-relaxed text-ink sm:text-2xl">
        &ldquo;{quote.text}&rdquo;
      </p>
      <cite className="mt-4 block text-sm not-italic uppercase tracking-widest text-ink-soft">
        — {quote.attribution || site.authorName}
      </cite>
    </blockquote>
  );
}
