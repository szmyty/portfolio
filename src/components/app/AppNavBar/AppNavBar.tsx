"use client";

import { usePathname } from "next/navigation";
import { useTranslations } from "next-intl";
import { NavBar } from "@portfolio/components/ui/NavBar";
import { ThemeToggle } from "@portfolio/components/ui/ThemeToggle";

export function AppNavBar() {
  const t = useTranslations("NavBar");
  const pathname = usePathname();

  const items = [
    { href: "/", label: t("home") },
    { href: "/music", label: t("music") },
    { href: "/publishing", label: t("publishing") },
    { href: "/development", label: t("development") },
  ];

  return (
    <NavBar
      items={items}
      activeHref={pathname}
      rightSlot={<ThemeToggle />}
    />
  );
}
