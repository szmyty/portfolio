"use client";

import type { CSSProperties } from "react";
import Lottie from "lottie-react";

interface LottieAnimationProps {
  animationData: unknown;
  loop?: boolean;
  className?: string;
  style?: CSSProperties;
}

export function LottieAnimation({
  animationData,
  loop = true,
  className,
  style,
}: LottieAnimationProps) {
  return (
    <Lottie
      animationData={animationData}
      loop={loop}
      className={className}
      style={style}
      rendererSettings={{ preserveAspectRatio: "xMidYMid meet" }}
    />
  );
}
