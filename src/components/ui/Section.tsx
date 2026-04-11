import type { ReactNode } from "react";

interface SectionProps {
  children: ReactNode;
  className?: string;
}

export function Section({ children, className }: SectionProps) {
  const classes = ["px-4 sm:px-8 py-16", className].filter(Boolean).join(" ");
  return <section className={classes}>{children}</section>;
}
