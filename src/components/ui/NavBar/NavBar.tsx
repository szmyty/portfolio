import Link from "next/link";
import type { NavBarProps } from "./NavBar.types";

export function NavBar({ items, activeHref, rightSlot }: NavBarProps) {
  return (
    <nav
      className="w-full px-4 sm:px-8 py-3 sm:py-4 flex items-center gap-3 sm:gap-6 overflow-x-auto"
    >
      <NavBarItems items={items} activeHref={activeHref} />
      <NavBarActions>{rightSlot}</NavBarActions>
    </nav>
  );
}

type NavBarItemsProps = {
  items: NavBarProps["items"];
  activeHref?: string;
};

function NavBarItems({ items, activeHref }: NavBarItemsProps) {
  return (
    <>
      {items.map(({ href, label }) => {
        const isActive = activeHref === href;
        const linkClassName = [
          "text-sm font-medium transition-colors duration-200",
          isActive
            ? "text-accent"
            : "text-text-secondary hover:text-accent",
        ].join(" ");

        return (
          <Link
            key={href}
            href={href}
            aria-current={isActive ? "page" : undefined}
            className={linkClassName}
          >
            {label}
          </Link>
        );
      })}
    </>
  );
}

type NavBarActionsProps = {
  children?: React.ReactNode;
};

function NavBarActions({ children }: NavBarActionsProps) {
  if (!children) {
    return null;
  }

  return <div className="ml-auto shrink-0">{children}</div>;
}
