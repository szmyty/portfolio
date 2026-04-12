"use client";

import type { CSSProperties } from "react";
import { useRef, useEffect } from "react";
import Lottie from "lottie-react";
import type { LottieRefCurrentProps } from "lottie-react";
import { useReducedMotion } from "framer-motion";

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
  const shouldReduceMotion = useReducedMotion();
  const lottieRef = useRef<LottieRefCurrentProps>(null);

  useEffect(() => {
    if (shouldReduceMotion) {
      lottieRef.current?.pause();
    } else {
      lottieRef.current?.play();
    }
  }, [shouldReduceMotion]);

  return (
    <Lottie
      lottieRef={lottieRef}
      animationData={animationData}
      loop={loop}
      autoplay={!shouldReduceMotion}
      className={className}
      style={style}
      rendererSettings={{ preserveAspectRatio: "xMidYMid meet" }}
    />
  );
}
