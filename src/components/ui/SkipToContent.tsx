import type { MouseEvent } from "react";

interface SkipToContentProps {
  targetId?: string;
  label: string;
  onSkip?: (e: MouseEvent<HTMLAnchorElement>) => void;
}

export function SkipToContent({
  targetId = "main-content",
  label,
  onSkip,
}: SkipToContentProps) {
  return (
    <a
      href={`#${targetId}`}
      onClick={onSkip}
      className="sr-only focus:not-sr-only focus:fixed focus:z-50 focus:top-4 focus:left-4 focus:px-4 focus:py-2 focus:bg-accent focus:text-background focus:rounded focus:font-medium"
    >
      {label}
    </a>
  );
}
