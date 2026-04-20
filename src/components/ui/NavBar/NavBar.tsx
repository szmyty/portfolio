"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useTranslations } from "next-intl";
import { ThemeToggle } from "@portfolio/components/ui/ThemeToggle";

type NavItem = {
  href: string;
  labelKey: string;
};

const navItems: NavItem[] = [
  { href: "/", labelKey: "home" },
  { href: "/music", labelKey: "music" },
  { href: "/publishing", labelKey: "publishing" },
  { href: "/development", labelKey: "development" },
];

export function NavBar() {
  const t = useTranslations("NavBar");
  const pathname = usePathname();

  return (
    <nav
      aria-label={t("ariaLabel")}
      className="w-full px-4 sm:px-8 py-3 sm:py-4 flex items-center gap-3 sm:gap-6 overflow-x-auto"
    >
      {navItems.map(({ href, labelKey }) => {
        const isActive = pathname === href;
        return (
          <Link
            key={href}
            href={href}
            aria-current={isActive ? "page" : undefined}
            className={`text-sm font-medium transition-colors duration-200 ${
              isActive
                ? "text-accent"
                : "text-text-secondary hover:text-accent"
            }`}
          >
            {t(labelKey)}
          </Link>
        );
      })}
      <div className="ml-auto shrink-0">
        <ThemeToggle />
      </div>
    </nav>
  );
}
