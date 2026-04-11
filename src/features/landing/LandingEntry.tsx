"use client";

import { useState, useCallback } from "react";
import { AnimatePresence, motion } from "framer-motion";
import type { ReactNode } from "react";
import { LandingBackground } from "@portfolio/features/landing/LandingBackground";
import { EntryTrigger } from "@portfolio/features/landing/EntryTrigger";
import { Center } from "@portfolio/components/ui/Center";

interface LandingEntryProps {
  children: ReactNode;
  mainContent?: ReactNode;
}

export function LandingEntry({ children, mainContent }: LandingEntryProps) {
  const [entered, setEntered] = useState(false);

  const handleEnter = useCallback(() => {
    setEntered((prev) => {
      if (prev) return prev;
      return true;
    });
  }, []);

  return (
    <div className="relative min-h-screen w-full overflow-hidden bg-background">
      <AnimatePresence mode="wait">
        {!entered ? (
          <motion.main
            key="landing"
            className="absolute inset-0 flex items-center justify-center px-4 sm:px-8 py-8 sm:py-16 cursor-pointer"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0, scale: 1.04, transition: { duration: 0.5, ease: "easeInOut" } }}
            transition={{ duration: 0.4, ease: "easeOut" }}
            onClick={handleEnter}
          >
            <LandingBackground />
            <div className="relative z-10 pb-16 sm:pb-20 [@media(max-height:500px)]:pb-0">{children}</div>
            <EntryTrigger onEnter={handleEnter} />
          </motion.main>
        ) : (
          <motion.div
            key="main"
            className="absolute inset-0"
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.55, ease: "easeOut" }}
          >
            {mainContent ?? (
              <Center className="min-h-screen">
                <p className="text-text-secondary">Main content coming soon.</p>
              </Center>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
