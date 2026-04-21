import type { IconProps } from "./Icon.types";

export function Icon(props: IconProps) {
  const {
    icon: LucideIcon,
    size = 24,
    className,
    label,
    ariaLabel,
    strokeWidth,
  } = props;

  const rootClassName = className;

  const accessibilityProps = ariaLabel
    ? {
        role: "img" as const,
        "aria-label": ariaLabel,
      }
    : {
        "aria-hidden": "true" as const,
      };

  return (
    <LucideIcon
      width={size}
      height={size}
      strokeWidth={strokeWidth}
      className={rootClassName}
      {...accessibilityProps}
    />
  );
}
