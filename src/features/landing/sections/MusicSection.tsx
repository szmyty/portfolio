import Link from "next/link";
import { CosmicBackground } from "@portfolio/components/ui/CosmicBackground";

export function MusicSection() {
  return (
    <section
      id="music"
      aria-label="Music"
      className="relative px-4 sm:px-8 py-24 sm:py-32 bg-surface scroll-mt-16"
    >
      <CosmicBackground mode="content" />
      <div className="relative z-10 max-w-3xl mx-auto flex flex-col gap-6">
        <h2 className="text-3xl sm:text-4xl font-bold tracking-tight text-text-primary">
          Music
        </h2>
        <p className="text-base sm:text-lg text-text-secondary leading-relaxed">
          Original compositions, music production, and sound design. From
          ambient soundscapes to structured arrangements, exploring the full
          spectrum of sonic creativity.
        </p>
        <p className="text-sm text-text-muted">
          Placeholder — full content coming soon.
        </p>
        <div className="mt-2">
          <Link
            href="/music"
            className="inline-flex items-center gap-2 text-accent hover:text-accent-hover transition-colors duration-200 font-medium"
          >
            Explore Music →
          </Link>
        </div>
      </div>
    </section>
  );
}
