import Link from "next/link";
import { Section } from "@portfolio/components/ui/Section";
import { LottieAnimation } from "@portfolio/components/animation/LottieAnimation";
import placeholderAnimation from "@portfolio/animations/placeholder.json";

const publishingVisual = (
  <LottieAnimation
    animationData={placeholderAnimation}
    className="w-full h-full"
    style={{ maxWidth: 280, maxHeight: 280 }}
  />
);

export function PublishingSection() {
  return (
    <Section
      id="publishing"
      aria-label="Publishing"
      title="Publishing"
      background="background"
      visual={publishingVisual}
    >
      <p className="text-base sm:text-lg text-text-secondary leading-relaxed">
        Writing, essays, and published works exploring ideas across technology,
        philosophy, and creative practice.
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
    </Section>
  );
}
