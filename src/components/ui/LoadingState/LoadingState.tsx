import type { LoadingStateProps } from "./LoadingState.types";

/**
 * LoadingState — a reusable component for asynchronous operations in progress.
 *
 * Renders an animated spinner with an accessible ARIA label. An optional
 * description can provide additional context while the user waits.
 *
 * Usage (minimal):
 * ```tsx
 * <LoadingState />
 * ```
 *
 * Usage (with context):
 * ```tsx
 * <LoadingState label="Loading projects…" description="Fetching your latest work." />
 * ```
 */
export function LoadingState({ label = "Loading…", description, className }: LoadingStateProps) {
  const classes = [
    "flex flex-col items-center justify-center gap-4 text-center w-full px-4 py-12 sm:py-16",
    className,
  ]
    .filter(Boolean)
    .join(" ");

  return (
    <div className={classes} role="status" aria-live="polite">
      <span className="sr-only">{label}</span>
      <div
        className="w-10 h-10 rounded-full border-4 border-border border-t-accent animate-spin"
        aria-hidden="true"
      />

      {description && (
        <p className="text-base sm:text-lg text-text-secondary max-w-sm sm:max-w-md leading-relaxed">
          {description}
        </p>
      )}
    </div>
  );
}
