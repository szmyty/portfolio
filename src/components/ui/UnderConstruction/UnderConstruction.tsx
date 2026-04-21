import { LottieAnimation } from "@portfolio/components/animation";
import placeholderAnimation from "@portfolio/animations/placeholder.json";
import type { UnderConstructionProps } from "./UnderConstruction.types";

/**
 * UnderConstruction — placeholder state for unfinished pages.
 *
 * Pure UI component. Content is passed via props (i18n-ready).
 */
export function UnderConstruction({
  title,
  description,
}: UnderConstructionProps) {
  return (
    <div className="flex flex-col items-center gap-6 text-center w-full max-w-sm sm:max-w-md px-4">
      <LottieAnimation
        animationData={placeholderAnimation}
        className="w-32 h-32 sm:w-40 sm:h-40 md:w-48 md:h-48"
      />

      {title && (
        <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-text-primary">
          {title}
        </h2>
      )}

      {description && (
        <p className="text-base sm:text-lg text-text-secondary">
          {description}
        </p>
      )}
    </div>
  );
}
