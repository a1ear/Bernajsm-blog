import type { Metadata } from "next";
import Link from "next/link";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { site } from "@/lib/content";

export const metadata: Metadata = {
  title: `Privacy Policy — ${site.authorName}`,
};

export default function PrivacyPolicy() {
  return (
    <>
      <Navbar />
      <main className="flex-1 bg-warm-white py-24 sm:py-32">
        <div className="mx-auto max-w-2xl px-6 sm:px-10">
          <h1 className="font-display text-4xl text-ink">Privacy Policy</h1>
          <p className="mt-4 text-sm text-ink-soft">Last updated: July 2026</p>

          <div className="pretty mt-10 space-y-6 text-base leading-relaxed text-ink-soft">
            <p>
              This is placeholder policy text. Replace it with your actual
              privacy practices before publishing.
            </p>
            <p>
              This site collects only the information you choose to share
              through the contact form (name, email, and message) and, if you
              subscribe, your email address. This information is used solely
              to respond to you and is never sold or shared with third
              parties.
            </p>
            <p>
              If you have questions about how your information is handled,
              reach out any time at{" "}
              <a
                href="mailto:hello@bernajsm.com"
                className="text-ink underline decoration-sage decoration-2 underline-offset-4"
              >
                hello@bernajsm.com
              </a>
              .
            </p>
          </div>

          <Link
            href="/"
            className="mt-12 inline-block text-sm text-ink underline decoration-sage decoration-2 underline-offset-4"
          >
            ← Back home
          </Link>
        </div>
      </main>
      <Footer />
    </>
  );
}
