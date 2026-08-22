import { EmptyState } from "@portfolio/components/ui/EmptyState";
import { ErrorState } from "@portfolio/components/ui/ErrorState";
import { LoadingState } from "@portfolio/components/ui/LoadingState";
import type { RemoteDataStatusProps } from "./RemoteDataStatus.types";

/**
 * Accessible presentation for the shared remote-data contract.
 * Fresh available data renders no notice; callers render the data itself.
 */
export function RemoteDataStatus({
  contract,
  messages,
  action,
  className,
}: RemoteDataStatusProps) {
  if (contract.status === "loading") {
    return <LoadingState label={messages.loading} className={className} />;
  }

  if (contract.status === "empty") {
    return (
      <EmptyState
        title={messages.emptyTitle}
        description={messages.emptyDescription}
        action={action}
        className={className}
      />
    );
  }

  if (contract.status === "error") {
    return (
      <ErrorState
        title={messages.errorTitle}
        description={messages.errorDescription}
        action={action}
        className={className}
      />
    );
  }

  if (contract.freshness === "stale") {
    const description =
      contract.source === "last-known-good"
        ? messages.lastKnownGoodDescription
        : messages.staleDescription;

    return (
      <div
        className={[
          "rounded-xl border border-border-strong bg-surface-raised px-4 py-3",
          className,
        ]
          .filter(Boolean)
          .join(" ")}
        role="status"
        aria-live="polite"
      >
        <p className="font-semibold text-text-primary">{messages.staleTitle}</p>
        <p className="mt-1 text-sm text-text-secondary">{description}</p>
      </div>
    );
  }

  return null;
}
