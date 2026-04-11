import { LottieAnimation } from "@portfolio/components/animation/LottieAnimation";
import placeholderAnimation from "@portfolio/animations/placeholder.json";

export function LandingBackground() {
  return (
    <div
      aria-hidden="true"
      className="pointer-events-none absolute inset-0 z-0 overflow-hidden"
    >
      {/* Subtle radial gradient for depth — faint accent glow at center */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_70%_60%_at_50%_45%,rgba(91,156,246,0.06)_0%,transparent_75%)]" />
      {/* Centered animation layer */}
      <div className="absolute inset-0 flex items-center justify-center">
        <LottieAnimation
          animationData={placeholderAnimation}
          className="w-[min(160vw,_1000px)] h-[min(160vw,_1000px)] opacity-[0.09]"
        />
      </div>
    </div>
  );
}
