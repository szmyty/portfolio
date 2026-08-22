"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { useTranslations } from "next-intl";
import { siteConfig } from "@portfolio/config";
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
      aria-label={t("ariaLabel")}
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

        <div className="hero-infinity-slot" aria-hidden="true">
          <svg
            className="hero-infinity-fallback"
            viewBox="0 0 320 160"
            fill="none"
            role="presentation"
          >
            <defs>
              <linearGradient
                id="hero-infinity-gradient"
                x1="24"
                y1="32"
                x2="296"
                y2="128"
                gradientUnits="userSpaceOnUse"
              >
                <stop stopColor="#f0abfc" />
                <stop offset="0.48" stopColor="#a5f3fc" />
                <stop offset="1" stopColor="#e879f9" />
              </linearGradient>
              <filter
                id="hero-infinity-glow"
                x="-20%"
                y="-35%"
                width="140%"
                height="170%"
              >
                <feGaussianBlur stdDeviation="5" result="blur" />
                <feMerge>
                  <feMergeNode in="blur" />
                  <feMergeNode in="SourceGraphic" />
                </feMerge>
              </filter>
            </defs>
            <path
              d="M24 80C48 22 104 22 160 80C216 138 272 138 296 80C272 22 216 22 160 80C104 138 48 138 24 80Z"
              stroke="url(#hero-infinity-gradient)"
              strokeWidth="18"
              strokeLinecap="round"
              strokeLinejoin="round"
              filter="url(#hero-infinity-glow)"
            />
          </svg>
        </div>

        <div className="mt-4 flex w-full flex-wrap justify-center gap-4">
          <Link
            href="#development"
            className="button-primary inline-flex min-h-12 w-full max-w-72 items-center justify-center rounded-xl px-6 py-3 font-semibold transition-colors duration-200 min-[420px]:w-auto min-[420px]:min-w-44"
          >
            {t("viewWork")}
          </Link>
          <a
            href={`mailto:${siteConfig.author.email}`}
            className="button-secondary inline-flex min-h-12 w-full max-w-72 items-center justify-center rounded-xl px-6 py-3 font-medium transition-colors duration-200 min-[420px]:w-auto min-[420px]:min-w-44"
          >
            {t("contactResume")}
          </a>
        </div>
        <p className="mt-4 text-sm text-text-muted">{t("resumeNote")}</p>
      </motion.div>
    </section>
  );
}
