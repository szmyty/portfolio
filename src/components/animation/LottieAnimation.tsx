"use client";

import Lottie from "lottie-react";

interface LottieAnimationProps {
  animationData: unknown;
  loop?: boolean;
  className?: string;
}

export function LottieAnimation({
  animationData,
  loop = true,
  className,
}: LottieAnimationProps) {
  return (
    <Lottie animationData={animationData} loop={loop} className={className} />
  );
}
