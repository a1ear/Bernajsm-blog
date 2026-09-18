type BotanicalMotifProps = {
  className?: string;
  flip?: boolean;
  animate?: boolean;
};

/**
 * A single continuous-line sprig, drawn once and reused (rotated/mirrored)
 * throughout the site instead of a generic blurred blob. Uses currentColor
 * so opacity/tint is controlled by the parent's text color classes.
 */
export function BotanicalMotif({
  className = "",
  flip = false,
  animate = false,
}: BotanicalMotifProps) {
  return (
    <svg
      viewBox="0 0 160 240"
      fill="none"
      aria-hidden="true"
      className={`${className} ${flip ? "-scale-x-100" : ""} ${
        animate ? "motion-safe:animate-drift" : ""
      }`}
    >
      <path
        d="M80 230C78 180 82 130 80 60C79 40 74 22 62 10"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
      />
      <path
        d="M80 190C68 178 50 172 34 174"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
      />
      <path
        d="M80 150C94 138 112 134 128 138"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
      />
      <path
        d="M80 105C68 95 54 92 40 96"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
      />
      <path
        d="M62 10C54 16 48 26 48 38C48 46 52 52 60 52C68 52 72 44 70 34C69 27 65 21 62 10Z"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinejoin="round"
      />
    </svg>
  );
}
