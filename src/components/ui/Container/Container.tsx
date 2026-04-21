import type { ContainerProps, ContainerSize } from "./Container.types";

const sizeClassMap: Record<ContainerSize, string> = {
  sm: "max-w-sm",
  md: "max-w-2xl",
  lg: "max-w-4xl",
  xl: "max-w-6xl",
  full: "max-w-full",
};

/**
 * Container — layout primitive for constraining content width.
 */
export function Container({
  children,
  className,
  size = "md",
}: ContainerProps) {
  const rootClassName = [
    "w-full",
    sizeClassMap[size],
    className,
  ]
    .filter(Boolean)
    .join(" ");

  return <div className={rootClassName}>{children}</div>;
}
