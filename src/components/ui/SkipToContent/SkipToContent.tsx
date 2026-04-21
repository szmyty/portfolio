import type { SkipToContentProps } from "./SkipToContent.types";

/**
 * SkipToContent — accessibility utility for bypassing navigation.
 *
 * Appears on keyboard focus and allows users to jump directly to the main content.
 */
export function SkipToContent({
  targetId = "main-content",
  label,
  onSkip,
}: SkipToContentProps) {
  function handleClick(event: React.MouseEvent<HTMLAnchorElement>) {
    onSkip?.(event);

    const target = document.getElementById(targetId);

    if (target) {
      target.focus();
    }
  }

  const rootClassName = [
    "sr-only",
    "focus:not-sr-only",
    "focus:fixed focus:z-50 focus:top-4 focus:left-4",
    "focus:px-4 focus:py-2",
    "focus:bg-accent focus:text-accent-foreground",
    "focus:rounded focus:font-medium",
  ].join(" ");

  return (
    <a
      href={`#${targetId}`}
      onClick={handleClick}
      className={rootClassName}
    >
      {label}
    </a>
  );
}
