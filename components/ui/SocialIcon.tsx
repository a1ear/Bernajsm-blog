type IconProps = { className?: string };

function InstagramIcon({ className }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" fill="none" className={className}>
      <rect x="3" y="3" width="18" height="18" rx="5" stroke="currentColor" strokeWidth="1.5" />
      <circle cx="12" cy="12" r="4" stroke="currentColor" strokeWidth="1.5" />
      <circle cx="17.5" cy="6.5" r="1" fill="currentColor" />
    </svg>
  );
}

function PinterestIcon({ className }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" fill="none" className={className}>
      <circle cx="12" cy="12" r="9" stroke="currentColor" strokeWidth="1.5" />
      <path
        d="M9.5 17c1-2.5 1.5-4.2 2-6.2M12 3.5c3.5 0 5.5 2.2 5.5 5 0 3-1.7 5.3-4.2 5.3-1.2 0-2-.6-2.3-1.4"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
      />
    </svg>
  );
}

function TiktokIcon({ className }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" fill="none" className={className}>
      <path
        d="M14 3v10.5a3 3 0 1 1-2.5-2.96M14 3c.4 2.2 2 3.8 4.2 4.1"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function FacebookIcon({ className }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" fill="none" className={className}>
      <path
        d="M14 21v-7h2.3l.4-3H14V9c0-.9.2-1.5 1.6-1.5H17V4.8C16.6 4.7 15.6 4.6 14.5 4.6 12 4.6 10.5 6.1 10.5 8.7V11H8v3h2.5v7"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function XIcon({ className }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" fill="none" className={className}>
      <path
        d="M5 5l14 14M19 5L5 19"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
      />
    </svg>
  );
}

function YoutubeIcon({ className }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" fill="none" className={className}>
      <rect x="3" y="6" width="18" height="12" rx="3" stroke="currentColor" strokeWidth="1.5" />
      <path d="M10.5 9.5l4.5 2.5-4.5 2.5v-5z" fill="currentColor" />
    </svg>
  );
}

function LinkIcon({ className }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" fill="none" className={className}>
      <path
        d="M9 15l6-6M10 8l1-1a3 3 0 1 1 4 4l-1 1M14 16l-1 1a3 3 0 1 1-4-4l1-1"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
      />
    </svg>
  );
}

const ICONS: Record<string, (props: IconProps) => React.JSX.Element> = {
  instagram: InstagramIcon,
  pinterest: PinterestIcon,
  tiktok: TiktokIcon,
  facebook: FacebookIcon,
  x: XIcon,
  youtube: YoutubeIcon,
  custom: LinkIcon,
};

export const SOCIAL_PLATFORM_LABELS: Record<string, string> = {
  instagram: "Instagram",
  pinterest: "Pinterest",
  tiktok: "TikTok",
  facebook: "Facebook",
  x: "X",
  youtube: "YouTube",
  custom: "Link",
};

export function SocialIcon({
  platform,
  className = "h-4 w-4",
}: {
  platform: string;
  className?: string;
}) {
  const Icon = ICONS[platform] ?? LinkIcon;
  return <Icon className={className} />;
}
