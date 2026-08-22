import type { ReactNode } from "react";

export type NavItem = {
  href: string;
  label: ReactNode;
};

export type NavBarMobileConfig = {
  brandHref: string;
  brandLabel: ReactNode;
  menuLabel: string;
  closeLabel: string;
  actions?: ReactNode;
};

export type NavBarProps = {
  items: NavItem[];
  activeHref?: string;
  ariaLabel?: string;
  rightSlot?: ReactNode;
  mobile: NavBarMobileConfig;
};
