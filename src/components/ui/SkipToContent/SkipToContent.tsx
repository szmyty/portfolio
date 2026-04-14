import type { SkipToContentProps } from "./SkipToContent.types";

export function SkipToContent({
  targetId = "main-content",
  label,
  onSkip,
}: SkipToContentProps) {
  return (
    <a
      href={`#${targetId}`}
      onClick={onSkip}
      className="sr-only focus:not-sr-only focus:fixed focus:z-50 focus:top-4 focus:left-4 focus:px-4 focus:py-2 focus:bg-accent focus:text-accent-foreground focus:rounded focus:font-medium"
    >
      {label}
    </a>
  );
}
