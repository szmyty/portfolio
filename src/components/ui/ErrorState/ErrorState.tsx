import { AlertCircle } from "lucide-react";
import { Icon } from "@portfolio/components/ui/Icon";
import type { ErrorStateProps } from "./ErrorState.types";

/**
 * ErrorState — a reusable component for displaying error feedback.
 *
 * Renders a warning icon, a required title, an optional description, and an
 * optional action (e.g. a retry button). Keeps the same visual rhythm as
 * `EmptyState` so both states feel cohesive.
 *
 * Usage (minimal):
 * ```tsx
 * <ErrorState title="Something went wrong" />
 * ```
 *
 * Usage (full):
 * ```tsx
 * <ErrorState
 *   title="Failed to load projects"
 *   description="Check your connection and try again."
 *   action={<button onClick={retry}>Retry</button>}
 * />
 * ```
 */
export function ErrorState({
  title = "Something went wrong",
  description,
  action,
  className,
  headingLevel: Heading = "h2",
}: ErrorStateProps) {
  const classes = [
    "flex flex-col items-center justify-center gap-4 text-center w-full px-4 py-12 sm:py-16",
    className,
  ]
    .filter(Boolean)
    .join(" ");

  return (
    <div className={classes} role="alert" aria-live="assertive">
      <div className="text-red-500 mb-2" aria-hidden="true">
        <Icon icon={AlertCircle} size={48} strokeWidth={1.5} />
      </div>

      <Heading className="text-2xl sm:text-3xl font-bold tracking-tight text-text-primary">
        {title}
      </Heading>

      {description && (
        <p className="text-base sm:text-lg text-text-secondary max-w-sm sm:max-w-md leading-relaxed">
          {description}
        </p>
      )}

      {action && <div className="mt-2">{action}</div>}
    </div>
  );
}
