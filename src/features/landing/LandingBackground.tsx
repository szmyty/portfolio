import { LottieAnimation } from "@portfolio/components/animation/LottieAnimation";
import placeholderAnimation from "@portfolio/animations/placeholder.json";
import { tokens } from "@portfolio/lib/tokens";

export function LandingBackground() {
  return (
    <div
      aria-hidden="true"
      className="pointer-events-none absolute inset-0 z-0 overflow-hidden"
    >
      {/* Subtle radial gradient for depth — faint accent glow at center */}
      <div
        className="absolute inset-0"
        style={{
          background: `radial-gradient(ellipse 70% 60% at 50% 45%, color-mix(in srgb, ${tokens.color.accent} 6%, transparent) 0%, transparent 75%)`,
        }}
      />
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
