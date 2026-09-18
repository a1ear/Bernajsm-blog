import type { Metadata } from "next";

import { Hero } from "@/components/sections/Hero";
import { Acclaim } from "@/components/sections/Acclaim";
import { Story } from "@/components/sections/Story";
import { AboutAuthor } from "@/components/sections/AboutAuthor";
import { CTASection } from "@/components/sections/CTASection";
import { site } from "@/lib/content";

export const metadata: Metadata = {
  title: `${site.bookTitle} — ${site.authorName}`,
  description: site.tagline,
};

export default function BookPage() {
  return (
    <>
      <Hero />
      <Acclaim />
      <Story />
      <AboutAuthor />
      <CTASection />
    </>
  );
}
