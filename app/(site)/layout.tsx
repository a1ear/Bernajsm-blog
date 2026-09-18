import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";

/**
 * Every page under this layout reads from Postgres (the Footer alone queries
 * social links on every render). Forcing dynamic rendering here, once,
 * means content published in the admin is live immediately -- no build-time
 * prerender to go stale, and no per-page cache invalidation to keep in sync
 * with it. Traffic for a personal blog doesn't need static generation's
 * savings badly enough to be worth that complexity.
 */
export const dynamic = "force-dynamic";

export default function SiteLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <Navbar />
      <main className="flex-1">{children}</main>
      <Footer />
    </>
  );
}
