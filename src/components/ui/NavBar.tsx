"use client";

import Link from "next/link";
import { ThemeToggle } from "@portfolio/components/ui/ThemeToggle";

interface NavItem {
  href: string;
  label: string;
}

const navItems: NavItem[] = [
  { href: "/", label: "Home" },
  { href: "/development", label: "Development" },
  { href: "/music", label: "Music" },
  { href: "/publishing", label: "Publishing" },
];

export function NavBar() {
  return (
    <nav
      aria-label="Main navigation"
      className="w-full px-4 sm:px-8 py-4 flex items-center gap-6"
    >
      {navItems.map(({ href, label }) => (
        <Link
          key={href}
          href={href}
          className="text-sm font-medium text-text-muted hover:text-accent transition-colors duration-200"
        >
          {label}
        </Link>
      ))}
      <div className="ml-auto">
        <ThemeToggle />
      </div>
    </nav>
  );
}
