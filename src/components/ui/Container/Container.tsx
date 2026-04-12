import type { ContainerProps } from "./Container.types";

export function Container({ children, className }: ContainerProps) {
  const classes = ["max-w-2xl w-full", className].filter(Boolean).join(" ");
  return <div className={classes}>{children}</div>;
}
