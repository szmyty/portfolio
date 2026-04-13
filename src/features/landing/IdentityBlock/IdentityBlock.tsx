"use client";

import { motion } from "framer-motion";
import { useTranslations } from "next-intl";
import { useFadeUp } from "@portfolio/features/landing/animation";

export function IdentityBlock() {
  const t = useTranslations("Author");
  const { variants: fadeUp, shouldReduceMotion } = useFadeUp();

  return (
    <div className="flex flex-col items-center gap-4 sm:gap-6 text-center w-full max-w-sm sm:max-w-md px-4">
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
