export default function SiteLoading() {
  return (
    <div className="mx-auto max-w-6xl px-6 py-24 sm:px-10">
      <div className="mx-auto h-4 w-40 animate-pulse rounded-full bg-ink/10" />
      <div className="mx-auto mt-4 h-10 w-80 max-w-full animate-pulse rounded-full bg-ink/10" />
      <div className="mt-16 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {Array.from({ length: 3 }).map((_, i) => (
          <div key={i} className="h-64 animate-pulse rounded-xl bg-warm-white" />
        ))}
      </div>
    </div>
  );
}
