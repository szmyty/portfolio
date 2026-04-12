import Link from "next/link";

export function PublishingSection() {
  return (
    <section
      id="publishing"
      aria-label="Publishing"
      className="px-4 sm:px-8 py-24 sm:py-32 bg-background scroll-mt-16"
    >
      <div className="max-w-3xl mx-auto flex flex-col gap-6">
        <h2 className="text-3xl sm:text-4xl font-bold tracking-tight text-text-primary">
          Publishing
        </h2>
        <p className="text-base sm:text-lg text-text-secondary leading-relaxed">
          Writing, essays, and published works exploring ideas across
          technology, philosophy, and creative practice.
        </p>
        <p className="text-sm text-text-muted">
          Placeholder — full content coming soon.
        </p>
        <div className="mt-2">
          <Link
            href="/publishing"
            className="inline-flex items-center gap-2 text-accent hover:text-accent-hover transition-colors duration-200 font-medium"
          >
            Explore Publishing →
          </Link>
        </div>
      </div>
    </section>
  );
}
