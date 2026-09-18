"use client";

export default function AdminError({
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <div className="rounded-2xl border border-red-900/15 bg-red-900/5 p-8 text-center">
      <h1 className="font-display text-xl font-bold text-ink">Something went wrong loading this page.</h1>
      <p className="mt-2 text-sm text-ink-soft">
        This is usually a database connection issue — check your environment variables if it persists.
      </p>
      <button
        onClick={reset}
        className="mt-5 rounded-full bg-forest px-5 py-2.5 text-sm font-medium text-warm-white transition-all hover:-translate-y-0.5 hover:bg-forest-dark"
      >
        Try again
      </button>
    </div>
  );
}
