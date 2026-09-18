"use client";

export default function SiteError({
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <section className="flex min-h-[60vh] flex-col items-center justify-center bg-cream px-6 py-24 text-center">
      <p className="text-xs font-medium uppercase tracking-[0.25em] text-ink-soft">Something went wrong</p>
      <h1 className="balance mt-4 font-display text-3xl font-bold text-ink sm:text-4xl">
        This page didn&rsquo;t load.
      </h1>
      <p className="mt-4 max-w-md text-ink-soft">
        Try again in a moment — if it keeps happening, the site owner has been notified.
      </p>
      <button
        onClick={reset}
        className="mt-8 rounded-full bg-forest px-7 py-3 text-sm font-medium text-warm-white transition-all hover:-translate-y-0.5 hover:bg-forest-dark"
      >
        Try again
      </button>
    </section>
  );
}
