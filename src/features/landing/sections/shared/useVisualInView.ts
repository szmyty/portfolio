"use client";

import { useEffect, useRef, useState } from "react";

/**
 * Tracks whether a section visual is close enough to the viewport to justify
 * owning a live WebGL canvas.
 *
 * We keep this "live while nearby" rather than "mount once forever" so the home
 * page doesn't accumulate multiple active Three.js contexts as the user scrolls
 * through the section stack.
 */
export function useVisualInView(rootMargin = "240px 0px") {
  const ref = useRef<HTMLDivElement>(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const node = ref.current;
    if (!node) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        setIsVisible(entry.isIntersecting);
      },
      { rootMargin },
    );

    observer.observe(node);

    return () => observer.disconnect();
  }, [rootMargin]);

  return { ref, isVisible };
}
