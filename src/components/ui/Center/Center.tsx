import type { CenterProps } from "./Center.types";

/**
 * Center — primitive layout component for centering content
 * horizontally and vertically using flexbox.
 */
export function Center({ children, className }: CenterProps) {
  const rootClassName = [
    "flex items-center justify-center",
    className,
  ]
    .filter(Boolean)
    .join(" ");

  return <div className={rootClassName}>{children}</div>;
}
