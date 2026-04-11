"use client";

import { motion } from "framer-motion";

interface EntryTriggerProps {
  onEnter?: () => void;
}

export function EntryTrigger({ onEnter }: EntryTriggerProps) {
  return (
    <motion.div
      className="absolute bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 select-none"
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 1.2, duration: 0.6, ease: "easeOut" }}
      role="button"
      tabIndex={0}
      aria-label="Enter the site"
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
        animate={{ opacity: [0.4, 1, 0.4] }}
        transition={{ duration: 2.4, repeat: Infinity, ease: "easeInOut" }}
      >
        Click anywhere, or press Enter / Space
      </motion.p>
      <motion.span
        className="block w-px h-6 bg-text-muted origin-top"
        animate={{ scaleY: [0.4, 1, 0.4], opacity: [0.3, 0.8, 0.3] }}
        transition={{ duration: 2.4, repeat: Infinity, ease: "easeInOut" }}
      />
    </motion.div>
  );
}
