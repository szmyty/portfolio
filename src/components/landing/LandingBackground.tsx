import { LottieAnimation } from "@/components/animation/LottieAnimation";
import placeholderAnimation from "@/animations/placeholder.json";

export function LandingBackground() {
  return (
    <div
      aria-hidden="true"
      className="pointer-events-none absolute inset-0 flex items-center justify-center overflow-hidden"
    >
      <LottieAnimation
        animationData={placeholderAnimation}
        className="w-[600px] h-[600px] sm:w-[800px] sm:h-[800px] opacity-[0.06]"
      />
    </div>
  );
}
