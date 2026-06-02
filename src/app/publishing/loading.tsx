import { PageShell } from "@portfolio/components/ui/PageShell";

/**
 * Loading skeleton for the Publishing page.
 * Shown automatically by Next.js while the page data is being fetched.
 */
export default function PublishingLoading() {
  return (
    <PageShell>
      <section className="mx-auto flex w-full max-w-6xl flex-col gap-12 px-4 sm:px-8">
        {/* Page title skeleton */}
        <div className="h-9 w-56 rounded-lg bg-surface animate-pulse" />

        {/* Articles section skeleton */}
        <div className="flex flex-col gap-6">
          {/* Section heading */}
          <div className="h-7 w-40 rounded-lg bg-surface animate-pulse" />

          {/* Article card grid */}
          <div className="grid gap-6 md:grid-cols-2">
            {Array.from({ length: 4 }).map((_, i) => (
              <div
                key={i}
                className="overflow-hidden rounded-2xl border border-border bg-surface animate-pulse"
              >
                {/* Thumbnail */}
                <div className="h-48 w-full bg-surface-raised" />

                {/* Card body */}
                <div className="flex flex-col gap-3 p-4">
                  {/* Title */}
                  <div className="h-5 w-3/4 rounded bg-surface-raised" />

                  {/* Description lines */}
                  <div className="flex flex-col gap-1.5">
                    <div className="h-3 w-full rounded bg-surface-raised" />
                    <div className="h-3 w-5/6 rounded bg-surface-raised" />
                    <div className="h-3 w-4/6 rounded bg-surface-raised" />
                  </div>

                  {/* Meta row */}
                  <div className="flex justify-between">
                    <div className="h-3 w-16 rounded bg-surface-raised" />
                    <div className="h-3 w-20 rounded bg-surface-raised" />
                  </div>

                  {/* Tags */}
                  <div className="flex gap-2 pt-1">
                    <div className="h-5 w-14 rounded-md bg-surface-raised" />
                    <div className="h-5 w-16 rounded-md bg-surface-raised" />
                    <div className="h-5 w-12 rounded-md bg-surface-raised" />
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
