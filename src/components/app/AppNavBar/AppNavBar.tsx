"use client";

import { usePathname } from "next/navigation";
import { useTranslations } from "next-intl";
import { siteConfig } from "@portfolio/config";
import { NavBar } from "@portfolio/components/ui/NavBar";
import { ThemeToggle } from "@portfolio/components/ui/ThemeToggle";

export function AppNavBar() {
  const t = useTranslations("NavBar");
  const pathname = usePathname();

  const items = [
    { href: "/", label: t("home") },
    { href: "/music", label: t("music") },
    { href: "/publishing", label: t("publishing") },
    { href: "/research", label: t("research") },
    { href: "/development", label: t("development") },
    { href: "/insights", label: t("insights") },
  ];

  const rightSlot = (
    <div className="flex items-center gap-2">
      <ThemeToggle />
      <a
        href={siteConfig.githubRepoUrl}
        target="_blank"
        rel="noopener noreferrer"
        className="flex h-11 w-11 items-center justify-center rounded-full border border-border bg-surface-overlay text-text-secondary backdrop-blur-md transition-colors duration-200 hover:bg-surface-raised hover:text-text-primary"
        aria-label={t("repositoryLink")}
        title={t("repositoryLink")}
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 24 24"
          fill="currentColor"
          className="h-5 w-5"
          aria-hidden="true"
        >
          <path d="M12 2C6.48 2 2 6.58 2 12.26c0 4.52 2.87 8.35 6.84 9.7.5.1.68-.22.68-.48 0-.24-.01-.87-.01-1.7-2.78.62-3.37-1.38-3.37-1.38-.45-1.18-1.1-1.5-1.1-1.5-.9-.63.07-.62.07-.62 1 .07 1.52 1.05 1.52 1.05.88 1.55 2.3 1.1 2.86.84.09-.66.35-1.1.64-1.35-2.22-.26-4.55-1.14-4.55-5.08 0-1.12.39-2.04 1.03-2.76-.1-.26-.45-1.3.1-2.7 0 0 .84-.27 2.75 1.05A9.3 9.3 0 0 1 12 6.84c.85.004 1.7.12 2.5.36 1.9-1.32 2.74-1.05 2.74-1.05.56 1.4.21 2.44.1 2.7.64.72 1.03 1.64 1.03 2.76 0 3.95-2.34 4.82-4.57 5.07.36.32.68.94.68 1.9 0 1.37-.01 2.47-.01 2.8 0 .27.18.59.69.48A10.27 10.27 0 0 0 22 12.26C22 6.58 17.52 2 12 2z" />
        </svg>
      </a>
    </div>
  );

  return (
    <NavBar
      items={items}
      activeHref={pathname}
      ariaLabel={t("ariaLabel")}
      rightSlot={rightSlot}
    />
  );
}
