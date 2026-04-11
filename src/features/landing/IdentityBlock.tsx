"use client";

import { motion } from "framer-motion";
import { useTranslations } from "next-intl";
import { LottieAnimation } from "@portfolio/components/animation";
import placeholderAnimation from "@portfolio/animations/placeholder.json";
import { useFadeUp } from "./animation";

export function IdentityBlock() {
  const t = useTranslations("Author");
  const { variants: fadeUp, shouldReduceMotion } = useFadeUp();

  return (
    <div className="flex flex-col items-center gap-4 sm:gap-6 text-center w-full max-w-sm sm:max-w-md px-4">
      <motion.div {...fadeUp} transition={{ duration: 0.5, ease: "easeOut" }}>
        <LottieAnimation
          animationData={placeholderAnimation}
          className="w-28 h-28 sm:w-36 sm:h-36 md:w-44 md:h-44"
        />
      </motion.div>
      <motion.h1
        className="text-4xl sm:text-5xl md:text-6xl font-bold tracking-tight text-text-primary break-words"
        {...fadeUp}
        transition={{
          duration: 0.5,
          ease: "easeOut",
          delay: shouldReduceMotion ? 0 : 0.15,
        }}
      >
        {t("name")}
      </motion.h1>
      <motion.p
        className="text-base sm:text-lg text-text-secondary"
        {...fadeUp}
        transition={{
          duration: 0.5,
          ease: "easeOut",
          delay: shouldReduceMotion ? 0 : 0.28,
        }}
      >
        {t("tagline")}
      </motion.p>
    </div>
  );
}
