import type { Metadata } from "next";

import { LoginForm } from "./login-form";

export const metadata: Metadata = {
  title: "Sign in — Berna JSM Admin",
  robots: { index: false, follow: false },
};

export default async function AdminLoginPage({
  searchParams,
}: {
  searchParams: Promise<{ next?: string }>;
}) {
  const { next } = await searchParams;

  return (
    <div className="flex min-h-screen items-center justify-center bg-cream px-6">
      <div className="w-full max-w-sm rounded-2xl border border-ink/8 bg-warm-white p-8 shadow-[0_8px_24px_rgba(42,42,38,0.06)]">
        <div className="mb-6 text-center">
          <p className="font-display text-lg font-bold text-ink">Berna JSM</p>
          <p className="mt-1 text-sm text-ink-soft">Sign in to write and publish.</p>
        </div>
        <LoginForm next={next} />
      </div>
    </div>
  );
}
