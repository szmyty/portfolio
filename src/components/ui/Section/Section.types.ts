import type { ReactNode } from "react";

export type SectionBackground = "background" | "surface";

export interface SectionProps {
  id?: string;
  "aria-label"?: string;
  title?: ReactNode;
  children?: ReactNode;
  visual?: ReactNode;
  background?: SectionBackground;
  cosmicBackground?: boolean;
  className?: string;
}
