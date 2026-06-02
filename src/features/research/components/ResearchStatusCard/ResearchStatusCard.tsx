type ResearchStatusCardProps = {
  publicationCount: number;
  lastSynchronizedAt: string;
  statusMessage: string;
};

export function ResearchStatusCard({
  publicationCount,
  lastSynchronizedAt,
  statusMessage,
}: ResearchStatusCardProps) {
  return (
    <section className="space-y-3 rounded-2xl border border-border/60 bg-surface-overlay p-5">
      <p className="text-sm text-text-secondary">{statusMessage}</p>

      <div className="grid gap-3 sm:grid-cols-2">
        <div className="rounded-xl border border-border/70 bg-surface px-4 py-3">
          <p className="text-xs uppercase tracking-wide text-text-muted">Publications</p>
          <p className="mt-1 text-2xl font-semibold text-text-primary">{publicationCount}</p>
        </div>

        <div className="rounded-xl border border-border/70 bg-surface px-4 py-3">
          <p className="text-xs uppercase tracking-wide text-text-muted">Last synchronized</p>
          <p className="mt-1 text-sm text-text-primary">
            {formatLastSynchronizedAt(lastSynchronizedAt)}
          </p>
        </div>
      </div>
    </section>
  );
}

function formatLastSynchronizedAt(timestamp: string): string {
  if (!timestamp) {
    return "Awaiting synchronization";
  }

  const date = new Date(timestamp);
  if (Number.isNaN(date.getTime()) || date.getTime() > Date.now()) {
    return "Awaiting synchronization";
  }

  return date.toLocaleString();
}
