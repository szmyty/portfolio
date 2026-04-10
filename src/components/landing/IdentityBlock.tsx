import { LottieAnimation } from "@/components/animation/LottieAnimation";
import placeholderAnimation from "@/animations/placeholder.json";

export function IdentityBlock() {
  return (
    <div className="flex flex-col items-center gap-4 sm:gap-6 text-center">
      <LottieAnimation
        animationData={placeholderAnimation}
        className="w-28 h-28 sm:w-36 sm:h-36 md:w-44 md:h-44"
      />
      <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold tracking-tight text-text-primary">
        Alan Szmyt
      </h1>
      <p className="text-base sm:text-lg text-text-secondary max-w-sm sm:max-w-md">
        Software engineer focused on building thoughtful, reliable systems.
      </p>
    </div>
  );
}
