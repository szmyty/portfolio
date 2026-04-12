"use client";

import { useState, useCallback, useSyncExternalStore } from "react";
import { AnimatePresence, motion } from "framer-motion";
import type { ReactNode } from "react";
import { useTranslations } from "next-intl";
import { LandingBackground } from "@portfolio/features/landing/LandingBackground";
import { EntryTrigger } from "@portfolio/features/landing/EntryTrigger";
import { Center } from "@portfolio/components/ui/Center";
import { SkipToContent } from "@portfolio/components/ui/SkipToContent";

const STORAGE_KEY = "landing-entered";

function subscribe(callback: () => void) {
  window.addEventListener("storage", callback);
  return () => window.removeEventListener("storage", callback);
}

function getSnapshot() {
  if (typeof window === "undefined") return false;
  return sessionStorage.getItem(STORAGE_KEY) === "true";
}

function getServerSnapshot() {
  return false;
}

interface LandingEntryProps {
  children: ReactNode;
  mainContent?: ReactNode;
}

export function LandingEntry({ children, mainContent }: LandingEntryProps) {
  const t = useTranslations("LandingEntry");
  const storedEntered = useSyncExternalStore(
    subscribe,
    getSnapshot,
    getServerSnapshot,
  );
  const [manuallyEntered, setManuallyEntered] = useState(false);
  const entered = storedEntered || manuallyEntered;

  const handleEnter = useCallback(() => {
    sessionStorage.setItem(STORAGE_KEY, "true");
    setManuallyEntered(true);
  }, []);

  // Delay focus until after the enter animation (0.55s) has completed
  const SKIP_FOCUS_DELAY_MS = 600;

  const handleSkip = useCallback(() => {
    handleEnter();
    setTimeout(() => {
      document.getElementById("main-content")?.focus();
    }, SKIP_FOCUS_DELAY_MS);
  }, [handleEnter]);

  return (
    <div className="relative min-h-screen w-full overflow-x-hidden bg-background">
      {/*
       * Layer 0 + 1 — background & 3D canvas (z-0).
       * CosmicBackground is pointer-events-none; LandingVisualLayer is pointer-events-auto.
       * See LandingBackground for the full layering breakdown.
       */}
      <LandingBackground />
      <SkipToContent
        label={t("skipToContent")}
        onSkip={(e) => {
          e.preventDefault();
          handleSkip();
        }}
      />
      <AnimatePresence mode="wait">
        {!entered ? (
          /*
           * Layer 2 — UI overlay (z-10), pre-enter state.
           * Container is pointer-events-none so events fall through to the
           * 3D canvas below. Only the identity block and EntryTrigger restore
           * pointer-events-auto to remain interactive.
           */
          <motion.main
            key="landing"
            className="absolute inset-0 z-10 flex items-center justify-center px-4 sm:px-8 py-8 sm:py-16 pointer-events-none"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{
              opacity: 0,
              scale: 1.04,
              transition: { duration: 0.5, ease: "easeInOut" },
            }}
            transition={{ duration: 0.4, ease: "easeOut" }}
          >
            {/* Interactive identity block — pointer-events-auto restores input */}
            <div
              className="pb-16 sm:pb-20 [@media(max-height:500px)]:pb-0 pointer-events-auto cursor-pointer"
              onClick={handleEnter}
            >
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
