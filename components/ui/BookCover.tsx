import Image from "next/image";
import { site } from "@/lib/content";

export function BookCover({ className = "" }: { className?: string }) {
  return (
    <div
      className={`relative aspect-[2/3] w-full overflow-hidden rounded-[4px] shadow-[0_20px_40px_-15px_rgba(42,42,38,0.35)] ${className}`}
    >
      <Image
        src="/assets/lessons-that-matter-cover.png"
        alt={`${site.bookTitle} book cover`}
        fill
        sizes="(max-width: 640px) 90vw, 320px"
        className="object-cover"
        priority
      />
    </div>
  );
}
