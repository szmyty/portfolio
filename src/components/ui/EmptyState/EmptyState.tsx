import type { EmptyStateProps } from "./EmptyState.types";

/**
 * EmptyState — a reusable component for scenarios where content is unavailable,
 * not yet implemented, or still loading.
 *
 * Inspired by the PatternFly Empty State pattern: centered layout with an
 * optional icon, a required title, optional description, and an optional action.
 *
 * Usage (minimal):
 * ```tsx
 * <EmptyState title="No results found" />
 * ```
 *
 * Usage (full):
 * ```tsx
 * <EmptyState
 *   icon={<SearchIcon />}
 *   title="No results found"
 *   description="Try adjusting your search terms."
 *   action={<button>Clear filters</button>}
 * />
 * ```
 */
export function EmptyState({ title, description, icon, action, className }: EmptyStateProps) {
  const classes = [
    "flex flex-col items-center justify-center gap-4 text-center w-full px-4 py-12 sm:py-16",
    className,
  ]
    .filter(Boolean)
    .join(" ");

  return (
    <div className={classes} role="status" aria-live="polite">
      {icon && (
        <div className="text-text-muted mb-2" aria-hidden="true">
          {icon}
        </div>
      )}

      <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-text-primary">
        {title}
      </h2>

      {description && (
        <p className="text-base sm:text-lg text-text-secondary max-w-sm sm:max-w-md leading-relaxed">
          {description}
        </p>
      )}

      {action && <div className="mt-2">{action}</div>}
    </div>
  );
}
