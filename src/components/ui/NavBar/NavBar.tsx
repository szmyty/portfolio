import Link from "next/link";
import type { NavBarProps } from "./NavBar.types";

export function NavBar({
  items,
  activeHref,
  ariaLabel,
  rightSlot,
}: NavBarProps) {
  return (
    <nav
      aria-label={ariaLabel}
      className="flex w-full items-center gap-3 px-4 py-3 sm:gap-6 sm:px-8 sm:py-4"
    >
      <div className="min-w-0 flex-1 overflow-x-auto">
        <NavBarItems items={items} activeHref={activeHref} />
      </div>
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
    <div className="flex min-w-max items-center gap-3 pr-1 sm:gap-6">
      {items.map(({ href, label }) => {
        const isActive = activeHref === href;
        const linkClassName = [
          "shrink-0 whitespace-nowrap text-sm font-medium transition-colors duration-200",
          isActive ? "text-accent" : "text-text-secondary hover:text-accent",
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
