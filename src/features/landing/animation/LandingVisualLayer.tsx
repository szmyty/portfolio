import { LottieAnimation } from "@portfolio/components/animation";
import placeholderAnimation from "@portfolio/animations/placeholder.json";

/**
 * Renders the decorative Lottie animation for the landing page background.
 *
 * This component is intentionally isolated from layout and gradient concerns
 * so that the visual/animation layer can evolve independently (e.g. swap to
 * a 3D scene or a different animation format without touching layout code).
 */
export function LandingVisualLayer() {
  return (
    <div className="absolute inset-0 flex items-center justify-center">
      <LottieAnimation
        animationData={placeholderAnimation}
        className="w-[min(160vw,_1000px)] h-[min(160vw,_1000px)] opacity-[0.09]"
      />
    </div>
  );
}
