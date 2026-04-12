import type { MouseEvent } from "react";

export interface SkipToContentProps {
  targetId?: string;
  label: string;
  onSkip?: (e: MouseEvent<HTMLAnchorElement>) => void;
}
