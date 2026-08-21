"use client";

import Link from "next/link";
import { Menu, X } from "lucide-react";
import { useEffect, useId, useRef, useState } from "react";
import type { NavBarProps } from "./NavBar.types";

export function NavBar({
  items,
  activeHref,
  ariaLabel,
  rightSlot,
  mobile,
}: NavBarProps) {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const menuId = useId();
  const menuButtonRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (!isMobileMenuOpen) return;

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key !== "Escape") return;

      setIsMobileMenuOpen(false);
      menuButtonRef.current?.focus();
    };

    const desktopQuery = window.matchMedia("(min-width: 64rem)");
    const handleDesktopChange = (event: MediaQueryListEvent) => {
      if (event.matches) {
        setIsMobileMenuOpen(false);
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    desktopQuery.addEventListener("change", handleDesktopChange);

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      desktopQuery.removeEventListener("change", handleDesktopChange);
    };
  }, [isMobileMenuOpen]);

  return (
    <nav aria-label={ariaLabel} className="site-nav relative w-full">
      <div className="flex min-h-17 items-center gap-3 py-3 lg:min-h-20 lg:gap-6 lg:py-4">
        <Link
          href={mobile.brandHref}
          onNavigate={() => setIsMobileMenuOpen(false)}
          className="min-w-0 flex-1 truncate text-base font-semibold text-text-primary hover:text-accent lg:hidden"
        >
          {mobile.brandLabel}
        </Link>

        <div className="hidden min-w-0 flex-1 lg:block">
          <NavBarItems items={items} activeHref={activeHref} />
        </div>

        <div className="hidden shrink-0 lg:block">
          <NavBarActions>{rightSlot}</NavBarActions>
        </div>

        <button
          ref={menuButtonRef}
          type="button"
          aria-expanded={isMobileMenuOpen}
          aria-controls={menuId}
          aria-label={isMobileMenuOpen ? mobile.closeLabel : mobile.menuLabel}
          className="flex h-11 min-w-11 shrink-0 items-center justify-center gap-2 rounded-full border border-border bg-surface-overlay px-3 text-sm font-medium text-text-primary backdrop-blur-md transition-colors hover:border-border-strong hover:bg-surface-raised lg:hidden"
          onClick={() => setIsMobileMenuOpen((isOpen) => !isOpen)}
        >
          {isMobileMenuOpen ? (
            <X className="h-5 w-5" aria-hidden="true" />
          ) : (
            <Menu className="h-5 w-5" aria-hidden="true" />
          )}
          <span>{isMobileMenuOpen ? mobile.closeLabel : mobile.menuLabel}</span>
        </button>
      </div>

      {isMobileMenuOpen ? (
        <div
          id={menuId}
          className="site-mobile-menu border-t border-border py-4 lg:hidden"
        >
          <NavBarItems
            items={items}
            activeHref={activeHref}
            mobile
            onNavigate={() => setIsMobileMenuOpen(false)}
          />
          {mobile.actions ? (
            <div className="mt-4 border-t border-border pt-4">
              {mobile.actions}
            </div>
          ) : null}
        </div>
      ) : null}
    </nav>
  );
}

type NavBarItemsProps = {
  items: NavBarProps["items"];
  activeHref?: string;
  mobile?: boolean;
  onNavigate?: () => void;
};

function NavBarItems({
  items,
  activeHref,
  mobile = false,
  onNavigate,
}: NavBarItemsProps) {
  return (
    <div
      className={
        mobile ? "grid grid-cols-2 gap-2" : "flex min-w-max items-center gap-6"
      }
    >
      {items.map(({ href, label }) => {
        const isActive = activeHref === href;
        const linkClassName = [
          mobile
            ? "flex min-h-11 min-w-0 items-center rounded-xl px-3 py-2 text-sm font-medium"
            : "shrink-0 whitespace-nowrap text-sm font-medium",
          "transition-colors duration-200",
          isActive
            ? mobile
              ? "bg-accent-soft text-accent"
              : "text-accent"
            : mobile
              ? "text-text-primary hover:bg-surface-raised hover:text-accent"
              : "text-text-secondary hover:text-accent",
        ].join(" ");

        return (
          <Link
            key={href}
            href={href}
            onNavigate={onNavigate}
            aria-current={isActive ? "page" : undefined}
            className={linkClassName}
          >
            {label}
          </Link>
        );
      })}
    </div>
  );
}

type NavBarActionsProps = {
  children?: React.ReactNode;
};

function NavBarActions({ children }: NavBarActionsProps) {
  if (!children) {
    return null;
  }

  return <div className="shrink-0">{children}</div>;
}
