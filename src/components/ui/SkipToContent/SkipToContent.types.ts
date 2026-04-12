import type { MouseEvent } from "react";

export type SkipToContentProps = {
  targetId?: string;
  label: string;
  onSkip?: (e: MouseEvent<HTMLAnchorElement>) => void;
}
