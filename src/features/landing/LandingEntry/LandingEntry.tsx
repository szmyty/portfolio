"use client";

import { useState, useCallback, useEffect, useRef, useSyncExternalStore } from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import type { ReactNode } from "react";
import { useTranslations } from "next-intl";
import { LandingBackground } from "@portfolio/features/landing/LandingBackground";
import { EntryTrigger } from "@portfolio/features/landing/EntryTrigger";
import { Center } from "@portfolio/components/ui/Center";
import { GalaxyBackground } from "@portfolio/components/ui/GalaxyBackground";
import { SkipToContent } from "@portfolio/components/ui/SkipToContent";
import { useLifecycleLogger } from "@portfolio/lib/debug/useLifecycleLogger";
import { LANDING_ENTERED_KEY } from "@portfolio/lib/storageKeys";

function subscribe(callback: () => void) {
  window.addEventListener("storage", callback);
  return () => window.removeEventListener("storage", callback);
}

function getSnapshot() {
  if (typeof window === "undefined") return false;
  return sessionStorage.getItem(LANDING_ENTERED_KEY) === "true";
}

function getServerSnapshot() {
  return false;
}

let preloadHomepageExperiencePromise: Promise<unknown[]> | null = null;

function preloadHomepageExperience() {
  preloadHomepageExperiencePromise ??= Promise.all([
    import("@portfolio/features/landing/animation/LandingVisualLayer"),
    import("@portfolio/features/three/scenes/HeroScene"),
  ]);

  return preloadHomepageExperiencePromise;
}

type HomepageLoadingOverlayProps = {
  message: string;
}

function HomepageLoadingOverlay({ message }: HomepageLoadingOverlayProps) {
  const shouldReduceMotion = useReducedMotion();

  return (
    <motion.div
      aria-live="polite"
      className="pointer-events-none fixed inset-0 z-30 flex items-center justify-center px-6"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: shouldReduceMotion ? 0.12 : 0.22, ease: "easeOut" }}
    >
      <div className="flex flex-col items-center gap-4 rounded-[2rem] border border-border/60 bg-background/45 px-6 py-5 text-center shadow-[0_0_40px_rgba(64,84,148,0.2)] backdrop-blur-xl">
        <div className="relative h-10 w-20">
          <span className="absolute inset-x-3 top-1/2 h-px -translate-y-1/2 bg-gradient-to-r from-transparent via-border to-transparent opacity-70" />
          <motion.span
            className="absolute left-2 top-1/2 h-3 w-3 -translate-y-1/2 rounded-full bg-cyan-300/85 shadow-[0_0_18px_rgba(103,232,249,0.65)]"
            animate={
              shouldReduceMotion
                ? { opacity: 0.85 }
                : { x: [0, 24, 0], y: [0, -10, 0], opacity: [0.45, 1, 0.45] }
            }
            transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
          />
          <motion.span
            className="absolute right-2 top-1/2 h-3 w-3 -translate-y-1/2 rounded-full bg-fuchsia-300/85 shadow-[0_0_18px_rgba(244,114,182,0.55)]"
            animate={
              shouldReduceMotion
                ? { opacity: 0.85 }
                : { x: [0, -24, 0], y: [0, 10, 0], opacity: [0.45, 1, 0.45] }
            }
            transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
          />
        </div>
        <p className="text-[0.7rem] sm:text-xs font-medium uppercase tracking-[0.32em] text-text-muted">
          {message}
        </p>
      </div>
    </motion.div>
  );
}

type LandingEntryProps = {
  children: ReactNode;
  mainContent?: ReactNode;
}

export function LandingEntry({ children, mainContent }: LandingEntryProps) {
  const t = useTranslations("LandingEntry");
  const logger = useLifecycleLogger("LandingEntry");
  const storedEntered = useSyncExternalStore(
    subscribe,
    getSnapshot,
    getServerSnapshot,
  );
  const [manuallyEntered, setManuallyEntered] = useState(false);
  const [experienceReady, setExperienceReady] = useState(false);
  const entryStartedAtRef = useRef<number | null>(null);
  const entered = storedEntered || manuallyEntered;

  const warmHomepageExperience = useCallback(() => {
    void preloadHomepageExperience().catch(() => undefined);
  }, []);

  const markExperienceStart = useCallback(
    (source: "manual-entry" | "session-storage") => {
      if (entryStartedAtRef.current !== null) return;

      entryStartedAtRef.current = performance.now();
      logger.emit("experience-started", { source });
    },
    [logger],
  );

  const handleEnter = useCallback(() => {
    warmHomepageExperience();
    markExperienceStart("manual-entry");
    sessionStorage.setItem(LANDING_ENTERED_KEY, "true");
    setManuallyEntered(true);
  }, [markExperienceStart, warmHomepageExperience]);

  const handleExperienceReady = useCallback(() => {
    setExperienceReady((current) => {
      if (current) return current;

      logger.emit("experience-ready", {
        startupDurationMs:
          entryStartedAtRef.current === null
            ? undefined
            : Math.round(performance.now() - entryStartedAtRef.current),
      });

      return true;
    });
  }, [logger]);

  useEffect(() => {
    if (!entered) return;

    markExperienceStart(storedEntered ? "session-storage" : "manual-entry");
  }, [entered, markExperienceStart, storedEntered]);

  useEffect(() => {
    if (entered) return;

    if ("requestIdleCallback" in window) {
      const idleHandle = window.requestIdleCallback(
        () => {
          void preloadHomepageExperience()
            .then(() => {
              logger.emit("experience-preloaded");
            })
            .catch(() => undefined);
        },
        { timeout: 1200 },
      );

      return () => window.cancelIdleCallback(idleHandle);
    }

    const timeoutHandle = window.setTimeout(() => {
      void preloadHomepageExperience()
        .then(() => {
          logger.emit("experience-preloaded");
        })
        .catch(() => undefined);
    }, 150);

    return () => window.clearTimeout(timeoutHandle);
  }, [entered, logger, warmHomepageExperience]);

  // Delay focus until after the enter animation (0.55s) has completed
  const SKIP_FOCUS_DELAY_MS = 600;

  const handleSkip = useCallback(() => {
    handleEnter();
    setTimeout(() => {
      document.getElementById("main-content")?.focus();
    }, SKIP_FOCUS_DELAY_MS);
  }, [handleEnter]);

  return (
    <div className="relative min-h-screen min-h-dvh w-full overflow-x-hidden bg-background">
      <GalaxyBackground />
      {/*
       * Layer 0 + 1 — background & 3D canvas (z-0).
       * CosmicBackground is pointer-events-none; LandingVisualLayer is pointer-events-auto.
       * See LandingBackground for the full layering breakdown.
       */}
      {entered ? <LandingBackground onReady={handleExperienceReady} /> : null}
      <SkipToContent
        label={t("skipToContent")}
        onSkip={(e) => {
          e.preventDefault();
          handleSkip();
        }}
      />
      <AnimatePresence>
        {entered && !experienceReady ? (
          <HomepageLoadingOverlay message={t("loadingStatus")} />
        ) : null}
      </AnimatePresence>
      <AnimatePresence mode="wait">
        {!entered ? (
          /*
           * Layer 2 — UI overlay (z-10), pre-enter state.
           * The full viewport acts as the activation target so touch users can
           * enter from anywhere without precision tapping.
           */
          <motion.main
            key="landing"
            role="button"
            tabIndex={0}
            aria-label={t("interactiveAriaLabel")}
            className="absolute inset-0 z-10 flex items-center justify-center px-4 sm:px-8 py-8 sm:py-16 pointer-events-auto cursor-pointer"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{
              opacity: 0,
              scale: 1.04,
              transition: { duration: 0.5, ease: "easeInOut" },
            }}
            transition={{ duration: 0.4, ease: "easeOut" }}
            onPointerEnter={warmHomepageExperience}
            onPointerDown={warmHomepageExperience}
            onFocus={warmHomepageExperience}
            onClick={handleEnter}
            onKeyDown={(e) => {
              if (e.key === "Enter" || e.key === " ") {
                e.preventDefault();
                handleEnter();
              }
            }}
          >
            {/* Identity block stays centered while the full viewport is interactive. */}
            <div className="pb-16 sm:pb-20 [@media(max-height:500px)]:pb-0">
              {children}
            </div>
            <EntryTrigger onEnter={handleEnter} />
          </motion.main>
        ) : (
          /*
           * Layer 2 — UI overlay (z-10), post-enter state.
           * Container is pointer-events-none so the 3D canvas behind the hero
           * section remains interactive. MainContent selectively restores
           * pointer-events-auto on the sticky header and interactive sections.
           */
          <motion.div
            key="main"
            className="relative z-10 pointer-events-none"
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.55, ease: "easeOut" }}
          >
            {mainContent ?? (
              <Center className="min-h-screen">
                <p className="text-text-secondary">{t("comingSoon")}</p>
              </Center>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
