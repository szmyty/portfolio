import type { ReactNode } from "react";

type CenterProps = {
  children: ReactNode;
  className?: string;
}

export function Center({ children, className }: CenterProps) {
  const classes = ["flex items-center justify-center", className]
    .filter(Boolean)
    .join(" ");
  return <div className={classes}>{children}</div>;
}
