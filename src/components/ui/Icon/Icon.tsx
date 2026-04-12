import type { IconProps } from "./Icon.types";

/**
 * Icon — a lightweight wrapper around lucide-react icon components.
 *
 * Provides a consistent size, stroke-width, and accessibility pattern
 * for all icons used across the application.
 *
 * Usage:
 * ```tsx
 * import { Icon } from "@portfolio/components/ui/Icon";
 * import { Search } from "lucide-react";
 *
 * <Icon icon={Search} size={48} label="Search" />
 * ```
 */
export function Icon({ icon: LucideIcon, size = 24, className, label, strokeWidth }: IconProps) {
  if (label) {
    return (
      <LucideIcon
        width={size}
        height={size}
        strokeWidth={strokeWidth}
        className={className}
        aria-label={label}
        role="img"
      />
    );
  }

  return (
    <LucideIcon
      width={size}
      height={size}
      strokeWidth={strokeWidth}
      className={className}
      aria-hidden="true"
    />
  );
}
