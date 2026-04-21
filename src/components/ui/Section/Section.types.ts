import type { ReactNode } from "react";

export type SectionBackground = "background" | "surface";

export type SectionProps = {
  id?: string;
  "aria-label"?: string;

  /** Optional section heading (i18n-ready) */
  title?: ReactNode;

  /** Main content */
  children?: ReactNode;

  /** Optional visual slot (3D, Lottie, etc.) */
  visual?: ReactNode;

  /** Background token */
  background?: SectionBackground;

  /** Whether to render the CosmicBackground overlay */
  cosmicBackground?: boolean;

  /** Root wrapper class */
  className?: string;

  /** Inner content wrapper class */
  contentClassName?: string;
};
