import type { ResearchStatus } from "@portfolio/features/research/types";

type ResearchStatusCardProps = {
  status: ResearchStatus;
};

const STATUS_COPY: Record<ResearchStatus, string> = {
  "not-configured": "Research synchronization is not yet configured.",
  "no-publications": "Research publications will appear here as they are published and synchronized through ORCID.",
  loading: "Publications loading.",
  unavailable: "Unable to synchronize publications at this time.",
  available: "Publications available.",
};

export function ResearchStatusCard({ status }: ResearchStatusCardProps) {
  return (
    <div className="rounded-xl border border-border/70 bg-surface-overlay px-4 py-3 text-sm text-text-secondary">
      {STATUS_COPY[status]}
    </div>
  );
}
