import { CosmicBackground } from "@portfolio/components/ui/CosmicBackground";
import type { SectionProps } from "./Section.types";

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
  const bgClass = cosmicBackground
    ? "bg-transparent"
    : background === "surface"
      ? "bg-surface"
      : "bg-background";
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
        <div className={["flex flex-col gap-6", visual && "flex-1"].filter(Boolean).join(" ")}>
          {title && (
            <h2 className="text-3xl sm:text-4xl font-bold tracking-tight text-text-primary">
              {title}
            </h2>
          )}
          {children}
        </div>

        {/* Optional visual column */}
        {visual && (
          <div className="flex-shrink-0 flex items-center justify-center w-full max-w-[280px] sm:max-w-xs md:w-72 lg:w-96">
            {visual}
          </div>
        )}
      </div>
    </section>
  );
}
