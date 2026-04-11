"use client";

import { motion, useReducedMotion } from "framer-motion";
import { useTranslations } from "next-intl";

interface EntryTriggerProps {
  onEnter?: () => void;
}

export function EntryTrigger({ onEnter }: EntryTriggerProps) {
  const shouldReduceMotion = useReducedMotion();
  const t = useTranslations("EntryTrigger");

  return (
    <motion.div
      className="absolute bottom-6 sm:bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 select-none [@media(max-height:500px)]:hidden"
      initial={{ opacity: 0, y: shouldReduceMotion ? 0 : 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{
        delay: shouldReduceMotion ? 0 : 1.2,
        duration: shouldReduceMotion ? 0.1 : 0.6,
        ease: "easeOut",
      }}
      role="button"
      tabIndex={0}
      aria-label={t("ariaLabel")}
      onClick={(e) => {
        e.stopPropagation();
        onEnter?.();
      }}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          onEnter?.();
        }
      }}
    >
      <motion.p
        className="text-xs sm:text-sm text-text-muted tracking-widest uppercase"
        animate={shouldReduceMotion ? {} : { opacity: [0.4, 1, 0.4] }}
        transition={{ duration: 2.4, repeat: Infinity, ease: "easeInOut" }}
      >
        {t("prompt")}
      </motion.p>
      <motion.span
        className="block w-px h-6 bg-text-muted origin-top"
        animate={
          shouldReduceMotion
            ? {}
            : { scaleY: [0.4, 1, 0.4], opacity: [0.3, 0.8, 0.3] }
        }
        transition={{ duration: 2.4, repeat: Infinity, ease: "easeInOut" }}
      />
    </motion.div>
  );
}
