import { PageShell } from "@portfolio/components/ui/PageShell";

/**
 * Loading skeleton for the Music page.
 * Shown automatically by Next.js while the page data is being fetched.
 */
export default function MusicLoading() {
  return (
    <PageShell>
      <section className="flex w-full max-w-6xl flex-col gap-12 mx-auto px-4 sm:px-8">
        {/* Page title skeleton */}
        <div className="h-9 w-48 rounded-lg bg-surface animate-pulse" />

        <div className="flex w-full min-w-0 flex-col gap-10">
          {/* Active player card skeleton */}
          <div className="w-full max-w-md mx-auto rounded-2xl border border-border bg-surface overflow-hidden shadow-sm animate-pulse">
            {/* Artwork */}
            <div className="aspect-square w-full bg-surface-raised" />

            {/* Player info */}
            <div className="p-4 flex flex-col gap-4">
              {/* Profile row */}
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 rounded-full bg-surface-raised" />
                <div className="h-4 w-24 rounded bg-surface-raised" />
              </div>

              {/* Track title */}
              <div className="h-5 w-3/4 rounded bg-surface-raised" />

              {/* Player control */}
              <div className="h-[50px] w-full rounded-lg bg-surface-raised" />
            </div>
          </div>

          {/* Track grid skeleton */}
          <div className="grid w-full grid-cols-[repeat(auto-fill,minmax(200px,1fr))] gap-6">
            {Array.from({ length: 8 }).map((_, i) => (
              <div
                key={i}
                className="overflow-hidden rounded-2xl border border-border bg-surface animate-pulse"
              >
                {/* Artwork */}
                <div className="aspect-square w-full bg-surface-raised" />

                {/* Info */}
                <div className="p-3 flex flex-col gap-2">
                  <div className="h-4 w-3/4 rounded bg-surface-raised" />
                  <div className="h-3 w-full rounded bg-surface-raised" />
                  <div className="flex justify-between pt-1">
                    <div className="h-3 w-10 rounded bg-surface-raised" />
                    <div className="h-3 w-16 rounded bg-surface-raised" />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </PageShell>
  );
}
