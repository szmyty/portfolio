import Link from "next/link";
import { Section } from "@portfolio/components/ui/Section";

export function MusicSection() {
  return (
    <Section id="music" aria-label="Music" title="Music" background="surface">
      <p className="text-base sm:text-lg text-text-secondary leading-relaxed">
        Original compositions, music production, and sound design. From ambient
        soundscapes to structured arrangements, exploring the full spectrum of
        sonic creativity.
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
    </Section>
  );
}
