import type { ResearchStatus } from "@portfolio/features/research/types";

type ResearchStatusCardProps = {
  status: ResearchStatus;
  statusMessage: string;
};

const STATUS_COPY: Record<ResearchStatus, string> = {
  "not-configured": "ORCID not configured",
  "credentials-unavailable": "ORCID client credentials unavailable",
  "auth-failed": "Unable to authenticate with ORCID",
  "sync-failed": "Unable to synchronize publications",
  "no-publications": "No publications found",
  available: "Publications synchronized",
};

export function ResearchStatusCard({
  status,
  statusMessage,
}: ResearchStatusCardProps) {
  return (
    <div className="rounded-xl border border-border/70 bg-surface-overlay px-4 py-3 text-sm text-text-secondary">
      <p>{statusMessage || STATUS_COPY[status]}</p>
      {status === "no-publications" ? (
        <p className="mt-2">
          Publications will automatically appear here once they are published and
          synchronized through ORCID.
        </p>
      ) : null}
    </div>
  );
}
