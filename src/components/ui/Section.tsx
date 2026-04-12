import type { ReactNode } from "react";
import { CosmicBackground } from "@portfolio/components/ui/CosmicBackground";

type SectionBackground = "background" | "surface";

interface SectionProps {
  /** Anchor id for scroll-to navigation */
  id?: string;
  /** Accessible label for the landmark region */
  "aria-label"?: string;
  /** Section heading rendered as an h2 */
  title?: ReactNode;
  /** Primary content rendered below the title */
  children?: ReactNode;
  /**
   * Optional supplemental visual (Lottie animation, 3D canvas, image, etc.).
   * When provided, the layout switches to a two-column design on md+ screens:
   * content on the left, visual on the right.
   */
  visual?: ReactNode;
  /** Background color variant — maps to the bg-background / bg-surface token */
  background?: SectionBackground;
  /**
   * Whether to render the cosmic starfield background.
   * Defaults to true so every section maintains the cosmic atmosphere.
   */
  cosmicBackground?: boolean;
  /** Additional CSS classes applied to the outer &lt;section&gt; element */
  className?: string;
}

/**
 * Section — reusable page-section layout primitive.
 *
 * Provides consistent spacing, responsive layout, and the shared cosmic
 * background across all landing-page sections. Supports an optional right-side
 * visual slot for Lottie animations, 3D canvases, or any supplemental element.
 *
 * Usage (text-only):
 * ```tsx
 * <Section id="music" aria-label="Music" title="Music" background="surface">
 *   <p>Description…</p>
 * </Section>
 * ```
 *
 * Usage (with visual):
 * ```tsx
 * <Section id="dev" aria-label="Development" title="Development" visual={<MyLottie />}>
 *   <p>Description…</p>
 * </Section>
 * ```
 */
export function Section({
  id,
  "aria-label": ariaLabel,
  title,
  children,
  visual,
  background = "background",
  cosmicBackground = true,
  className,
}: SectionProps) {
  const bgClass = background === "surface" ? "bg-surface" : "bg-background";
  const outerClasses = [
    "relative px-4 sm:px-8 py-24 sm:py-32 scroll-mt-16 pointer-events-auto",
    bgClass,
    className,
  ]
    .filter(Boolean)
    .join(" ");

  return (
    <section id={id} aria-label={ariaLabel} className={outerClasses}>
      {cosmicBackground && <CosmicBackground mode="content" />}

      {/* Content wrapper — single or two-column depending on whether a visual is provided */}
      <div
        className={[
          "relative z-10 mx-auto",
          visual
            ? "max-w-5xl flex flex-col md:flex-row md:items-center gap-10 md:gap-16"
            : "max-w-3xl flex flex-col gap-6",
        ].join(" ")}
      >
        {/* Text column */}
        <div className={visual ? "flex-1 flex flex-col gap-6" : "flex flex-col gap-6"}>
          {title && (
            <h2 className="text-3xl sm:text-4xl font-bold tracking-tight text-text-primary">
              {title}
            </h2>
          )}
          {children}
        </div>

        {/* Optional visual column */}
        {visual && (
          <div className="flex-shrink-0 flex items-center justify-center md:w-72 lg:w-96">
            {visual}
          </div>
        )}
      </div>
    </section>
  );
}
