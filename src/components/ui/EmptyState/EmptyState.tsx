import type { EmptyStateProps } from "./EmptyState.types";

/**
 * EmptyState — reusable component for when content is unavailable.
 *
 * Pure UI component. Content is passed via props (i18n-ready).
 */
export function EmptyState({
  title,
  description,
  icon,
  action,
  className,
}: EmptyStateProps) {
  const rootClassName = [
    "flex flex-col items-center justify-center gap-4 text-center w-full px-4 py-12 sm:py-16",
    className,
  ]
    .filter(Boolean)
    .join(" ");

  return (
    <div className={rootClassName} role="status" aria-live="polite">
      {icon && (
        <div className="text-text-muted mb-2" aria-hidden="true">
          {icon}
        </div>
      )}

      {title && (
        <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-text-primary">
          {title}
        </h2>
      )}

      {description && (
        <p className="text-base sm:text-lg text-text-secondary max-w-sm sm:max-w-md leading-relaxed">
          {description}
        </p>
      )}

      {action && <div className="mt-2">{action}</div>}
    </div>
  );
}
