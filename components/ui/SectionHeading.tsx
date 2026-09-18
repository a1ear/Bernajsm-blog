type SectionHeadingProps = {
  eyebrow?: string;
  heading: string;
  description?: string;
  align?: "left" | "center";
  underline?: boolean;
};

export function SectionHeading({
  eyebrow,
  heading,
  description,
  align = "left",
  underline = false,
}: SectionHeadingProps) {
  const alignment = align === "center" ? "text-center mx-auto" : "text-left";
  const underlineAlignment = align === "center" ? "mx-auto" : "";

  return (
    <div className={`max-w-2xl ${alignment}`}>
      {eyebrow && (
        <p className="mb-4 text-xs font-medium uppercase tracking-[0.2em] text-ink-soft">
          {eyebrow}
        </p>
      )}
      <h2 className="balance font-display text-4xl font-bold leading-[1.1] text-ink sm:text-5xl">
        {heading}
      </h2>
      {underline && (
        <div className={`mt-4 h-0.5 w-14 bg-forest ${underlineAlignment}`} />
      )}
      {description && (
        <p className="pretty mt-5 text-lg leading-relaxed text-ink-soft">
          {description}
        </p>
      )}
    </div>
  );
}
