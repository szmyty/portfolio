"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { useTranslations } from "next-intl";
import { useScrollParallax } from "@portfolio/lib/hooks/useScrollParallax";

/**
 * HeroSection — full-viewport hero with scroll-driven content parallax.
 *
 * As the user scrolls down, the text/button group drifts upward at a slower
 * rate than the background starfield layers, creating a multi-plane depth
 * effect between foreground content and cosmic background.
 *
 * Parallax is disabled when the user prefers reduced motion.
 */
export function HeroSection() {
  const tAuthor = useTranslations("Author");
  const t = useTranslations("HeroSection");

  // Content drifts upward at a gentler rate than the background star layers,
  // reinforcing foreground/background depth separation.
  const { y } = useScrollParallax({
    mode: "global",
    inputRange: [0, 600],
    outputRange: [0, -30],
  });

  return (
    <section
      id="hero"
      aria-label="Hero"
      className="relative flex flex-col items-center justify-center min-h-screen min-h-dvh px-4 sm:px-8 text-center pointer-events-none"
    >
      <motion.div
        style={{ y }}
        className="flex flex-col items-center w-full max-w-3xl pointer-events-auto"
      >
        <div className="flex flex-col items-center gap-6">
          <h1 className="text-5xl sm:text-6xl md:text-7xl font-bold tracking-tight text-text-primary">
            {tAuthor("name")}
          </h1>
          <p className="text-lg sm:text-xl text-text-secondary max-w-md leading-relaxed">
            {t("description")}
          </p>
        </div>

        <div className="flex flex-wrap gap-4 justify-center mt-48 sm:mt-56 md:mt-64">
          <Link
            href="#development"
            className="button-primary inline-flex items-center justify-center min-w-44 px-6 py-3 rounded-xl font-semibold transition-colors duration-200"
          >
            {t("viewWork")}
          </Link>
          <Link
            href="#music"
            className="button-secondary inline-flex items-center justify-center min-w-44 px-6 py-3 rounded-xl font-medium transition-colors duration-200"
          >
            {t("exploreMusic")}
          </Link>
        </div>
      </motion.div>
    </section>
  );
}
