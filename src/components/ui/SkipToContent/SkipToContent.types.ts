import type { MouseEvent, ReactNode } from "react";

export type SkipToContentProps = {
  /** Target element id to focus/scroll to */
  targetId?: string;

  /** Accessible label (i18n-ready) */
  label: ReactNode;

  /** Optional hook for custom skip behavior */
  onSkip?: (event: MouseEvent<HTMLAnchorElement>) => void;
};
