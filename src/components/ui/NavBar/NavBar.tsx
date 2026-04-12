"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { ThemeToggle } from "@portfolio/components/ui/ThemeToggle";

interface SectionNavItem {
  id: string;
  label: string;
}

const sectionItems: SectionNavItem[] = [
  { id: "music", label: "Music" },
  { id: "publishing", label: "Publishing" },
  { id: "development", label: "Development" },
];

const sectionIds = sectionItems.map((item) => item.id);

function useSectionObserver(ids: string[], enabled: boolean): string | null {
  const [activeId, setActiveId] = useState<string | null>(null);

  useEffect(() => {
    if (!enabled) return;

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            setActiveId(entry.target.id);
          }
        }
      },
      {
        // Top margin trims the hero area so a section is only "active" once
        // it's scrolled ~20% into view. Bottom margin removes the lower 60%
        // of the viewport so only one section is active at a time.
        rootMargin: "-20% 0px -60% 0px",
        threshold: 0,
      }
    );

    for (const id of ids) {
      const element = document.getElementById(id);
      if (element) observer.observe(element);
    }

    return () => observer.disconnect();
  }, [ids, enabled]);

  return activeId;
}

export function NavBar() {
  const pathname = usePathname();
  const isHome = pathname === "/";
  const activeId = useSectionObserver(sectionIds, isHome);

  function getSectionHref(id: string): string {
    return isHome ? `#${id}` : `/#${id}`;
  }

  return (
    <nav
      aria-label="Main navigation"
      className="w-full px-4 sm:px-8 py-3 sm:py-4 flex items-center gap-3 sm:gap-6 overflow-x-auto"
    >
      <Link
        href="/"
        className="text-sm font-medium text-text-muted hover:text-accent transition-colors duration-200"
      >
        Home
      </Link>
      {sectionItems.map(({ id, label }) => {
        const isActive = isHome && activeId === id;
        return (
          <Link
            key={id}
            href={getSectionHref(id)}
            aria-current={isActive ? "location" : undefined}
            className={`text-sm font-medium transition-colors duration-200 ${
              isActive
                ? "text-accent"
                : "text-text-muted hover:text-accent"
            }`}
          >
            {label}
          </Link>
        );
      })}
      <div className="ml-auto">
        <ThemeToggle />
      </div>
    </nav>
  );
}
