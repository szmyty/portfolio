import type { ResearchConnectionStatus, ResearchProfile } from "@portfolio/features/research/types";
import { ExternalLink } from "lucide-react";
import Link from "next/link";

type ResearchIdentityCardProps = {
  profile: ResearchProfile;
  connectionStatus: ResearchConnectionStatus;
};

const STATUS_LABELS: Record<ResearchConnectionStatus, string> = {
  connected: "🟢 Connected",
  configured: "🟡 Configured",
  error: "🔴 Error",
  "not-configured": "⚪ Not Configured",
};

export function ResearchIdentityCard({
  profile,
  connectionStatus,
}: ResearchIdentityCardProps) {
  const hasOrcid = Boolean(profile.orcidId);

  return (
    <div className="flex flex-col gap-4 rounded-2xl border border-border/60 bg-surface-overlay p-5">
      <div className="flex items-center gap-4">
        {hasOrcid ? (
          <Link
            href={profile.orcidUrl}
            target="_blank"
            rel="noreferrer"
            aria-label="Open ORCID profile"
            className="flex size-12 items-center justify-center rounded-full border border-border/60 bg-surface text-sm font-semibold text-text-primary transition hover:border-brand-primary/60"
          >
            OR
          </Link>
        ) : (
          <div className="flex size-12 items-center justify-center rounded-full border border-border/60 bg-surface text-sm font-semibold text-text-muted">
            OR
          </div>
        )}

        <div className="space-y-1">
          <p className="text-xs uppercase tracking-wide text-text-muted">ORCID Identifier</p>
          {hasOrcid ? (
            <Link
              href={profile.orcidUrl}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-1 text-sm font-medium text-brand-primary hover:underline"
            >
              {profile.orcidId}
              <ExternalLink className="size-3.5" aria-hidden="true" />
            </Link>
          ) : (
            <p className="text-sm font-medium text-text-secondary">Not configured</p>
          )}
        </div>
      </div>

      <div className="space-y-2 text-sm text-text-secondary">
        <p>{STATUS_LABELS[connectionStatus]}</p>
        {profile.displayName ? <p>Researcher: {profile.displayName}</p> : null}
        <p>Publication Count: {profile.publicationCount}</p>
        {profile.lastSynchronizedAt ? (
          <p>Last synchronization: {new Date(profile.lastSynchronizedAt).toLocaleString()}</p>
        ) : null}
      </div>

      {hasOrcid ? (
        <Link
          href={profile.orcidUrl}
          target="_blank"
          rel="noreferrer"
          className="inline-flex w-fit items-center gap-2 rounded-full border border-brand-primary/50 px-3 py-1.5 text-xs font-medium text-brand-primary transition hover:border-brand-primary hover:bg-brand-primary/10"
        >
          Open ORCID Profile
          <ExternalLink className="size-3.5" aria-hidden="true" />
        </Link>
      ) : null}
    </div>
  );
}
