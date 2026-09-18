import Link from "next/link";
import type { ReactNode } from "react";

type ButtonProps = {
  href: string;
  children: ReactNode;
  variant?: "primary" | "secondary";
  className?: string;
};

const base =
  "inline-flex items-center justify-center gap-2 rounded-full px-7 py-3.5 text-sm font-medium tracking-wide transition-all duration-300 ease-[cubic-bezier(0.16,1,0.3,1)] focus-visible:outline-2 focus-visible:outline-offset-4";

const variants: Record<NonNullable<ButtonProps["variant"]>, string> = {
  primary:
    "bg-forest text-warm-white shadow-[0_1px_2px_rgba(42,42,38,0.15)] hover:-translate-y-0.5 hover:bg-forest-dark hover:shadow-[0_12px_24px_-8px_rgba(59,93,69,0.4)]",
  secondary:
    "border border-ink/20 text-ink hover:-translate-y-0.5 hover:border-ink bg-warm-white",
};

export function Button({
  href,
  children,
  variant = "primary",
  className = "",
}: ButtonProps) {
  const isExternal = href.startsWith("http");

  return (
    <Link
      href={href}
      className={`${base} ${variants[variant]} ${className}`}
      {...(isExternal ? { target: "_blank", rel: "noopener noreferrer" } : {})}
    >
      {children}
    </Link>
  );
}
