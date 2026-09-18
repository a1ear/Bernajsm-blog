import type { Metadata } from "next";
import Link from "next/link";

import { getCurrentUser } from "@/lib/auth";
import { logout } from "@/app/bjsm-write/login/actions";

export const metadata: Metadata = {
  title: "Admin — Berna JSM",
  robots: { index: false, follow: false },
};

const NAV_ITEMS = [
  { label: "Dashboard", href: "/bjsm-write" },
  { label: "Posts & Journal", href: "/bjsm-write/posts" },
  { label: "Quotes", href: "/bjsm-write/quotes" },
  { label: "Newsletters", href: "/bjsm-write/newsletters" },
  { label: "Social Links", href: "/bjsm-write/social-links" },
  { label: "Profile", href: "/bjsm-write/profile" },
];

export default async function AdminDashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const user = await getCurrentUser();

  return (
    <div className="min-h-screen bg-cream-alt">
      <div className="mx-auto flex max-w-7xl flex-col gap-6 px-4 py-6 sm:px-6 lg:flex-row lg:gap-8 lg:py-10">
        <aside className="flex-shrink-0 lg:w-56">
          <div className="sticky top-6 rounded-2xl border border-ink/8 bg-warm-white p-4 shadow-[0_2px_8px_rgba(42,42,38,0.04)]">
            <Link href="/bjsm-write" className="block px-2 pb-3 font-display text-lg font-bold text-ink">
              Berna JSM Admin
            </Link>
            <nav className="flex flex-col gap-1">
              {NAV_ITEMS.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className="rounded-lg px-3 py-2 text-sm text-ink-soft transition-colors hover:bg-cream-alt hover:text-ink"
                >
                  {item.label}
                </Link>
              ))}
            </nav>
            <div className="mt-4 border-t border-ink/10 pt-3">
              {user ? (
                <p className="truncate px-3 text-xs text-ink-soft" title={user.email}>
                  {user.email}
                </p>
              ) : null}
              <form action={logout}>
                <button
                  type="submit"
                  className="mt-1 w-full rounded-lg px-3 py-2 text-left text-sm text-ink-soft transition-colors hover:bg-cream-alt hover:text-ink"
                >
                  Sign out
                </button>
              </form>
              <Link
                href="/"
                className="mt-1 block rounded-lg px-3 py-2 text-sm text-forest transition-colors hover:bg-cream-alt"
              >
                View site →
              </Link>
            </div>
          </div>
        </aside>

        <main className="min-w-0 flex-1">{children}</main>
      </div>
    </div>
  );
}
