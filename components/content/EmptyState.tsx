export function EmptyState({ message }: { message: string }) {
  return (
    <div className="rounded-2xl border border-dashed border-ink/15 bg-warm-white/60 px-6 py-16 text-center">
      <p className="text-ink-soft">{message}</p>
    </div>
  );
}
