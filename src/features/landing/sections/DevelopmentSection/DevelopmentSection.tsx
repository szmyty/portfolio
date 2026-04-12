import Link from "next/link";
import { Section } from "@portfolio/components/ui/Section";
import { LottieAnimation } from "@portfolio/components/animation/LottieAnimation";
import placeholderAnimation from "@portfolio/animations/placeholder.json";

const developmentVisual = (
  <LottieAnimation
    animationData={placeholderAnimation}
    className="w-full h-full"
    style={{ maxWidth: 280, maxHeight: 280 }}
  />
);

export function DevelopmentSection() {
  return (
    <Section
      id="development"
      aria-label="Development"
      title="Development"
      background="surface"
      visual={developmentVisual}
    >
      <p className="text-base sm:text-lg text-text-secondary leading-relaxed">
        Software projects, open-source contributions, and engineering
        explorations. Building thoughtful, reliable systems at the intersection
        of craft and technology.
      </p>
      <p className="text-sm text-text-muted">
        Placeholder — full content coming soon.
      </p>
      <div className="mt-2">
        <Link
          href="/development"
          className="inline-flex items-center gap-2 text-accent hover:text-accent-hover transition-colors duration-200 font-medium"
        >
          Explore Development →
        </Link>
      </div>
    </Section>
  );
}
