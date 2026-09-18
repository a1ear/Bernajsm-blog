import Link from "next/link";

export default function RootNotFound() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-cream px-6 text-center">
      <p className="text-xs font-medium uppercase tracking-[0.25em] text-ink-soft">404</p>
      <h1 className="mt-4 font-display text-4xl font-bold text-ink">Page not found</h1>
      <Link href="/" className="mt-6 text-sm text-forest underline underline-offset-4">
        Back to Home
      </Link>
    </div>
  );
}
