import Link from "next/link";

export default function SiteNotFound() {
  return (
    <section className="flex min-h-[60vh] flex-col items-center justify-center bg-cream px-6 py-24 text-center">
      <p className="text-xs font-medium uppercase tracking-[0.25em] text-ink-soft">404</p>
      <h1 className="balance mt-4 font-display text-4xl font-bold text-ink sm:text-5xl">
        This page wandered off.
      </h1>
      <p className="mt-4 max-w-md text-ink-soft">
        The page you&rsquo;re looking for doesn&rsquo;t exist, or has since moved.
      </p>
      <Link
        href="/"
        className="mt-8 rounded-full bg-forest px-7 py-3 text-sm font-medium text-warm-white transition-all hover:-translate-y-0.5 hover:bg-forest-dark"
      >
        Back to Home
      </Link>
    </section>
  );
}
