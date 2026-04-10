import { LottieAnimation } from "@/components/animation/LottieAnimation";
import placeholderAnimation from "@/animations/placeholder.json";

export function LandingBackground() {
  return (
    <div
      aria-hidden="true"
      className="pointer-events-none absolute inset-0 z-0 flex items-center justify-center overflow-hidden"
    >
      <LottieAnimation
        animationData={placeholderAnimation}
        className="w-[min(160vw,_1000px)] h-[min(160vw,_1000px)] opacity-[0.07]"
      />
    </div>
  );
}
