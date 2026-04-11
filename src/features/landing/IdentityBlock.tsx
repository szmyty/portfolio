"use client";

import { motion } from "framer-motion";
import { LottieAnimation } from "@portfolio/components/animation/LottieAnimation";
import placeholderAnimation from "@portfolio/animations/placeholder.json";

const fadeUp = {
  initial: { opacity: 0, y: 18 },
  animate: { opacity: 1, y: 0 },
};

export function IdentityBlock() {
  return (
    <div className="flex flex-col items-center gap-4 sm:gap-6 text-center">
      <motion.div
        {...fadeUp}
        transition={{ duration: 0.5, ease: "easeOut" }}
      >
        <LottieAnimation
          animationData={placeholderAnimation}
          className="w-28 h-28 sm:w-36 sm:h-36 md:w-44 md:h-44"
        />
      </motion.div>
      <motion.h1
        className="text-4xl sm:text-5xl md:text-6xl font-bold tracking-tight text-text-primary"
        {...fadeUp}
        transition={{ duration: 0.5, ease: "easeOut", delay: 0.15 }}
      >
        Alan Szmyt
      </motion.h1>
      <motion.p
        className="text-base sm:text-lg text-text-secondary max-w-sm sm:max-w-md"
        {...fadeUp}
        transition={{ duration: 0.5, ease: "easeOut", delay: 0.28 }}
      >
        Software engineer focused on building thoughtful, reliable systems.
      </motion.p>
    </div>
  );
}
