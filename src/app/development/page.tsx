import type { Metadata } from "next";
import { PageShell } from "@portfolio/components/ui/PageShell";
import { GitHubDashboardContainer } from "@portfolio/features/github";
import { buildGitHubScopes } from "@portfolio/features/github/lib/github-analytics";
import {
  fetchOrganizationRepositories,
  fetchUserRepositories,
} from "@portfolio/features/github/lib/github-service";
import { ProfessionalContext, SelectedWork } from "@portfolio/features/work";

export const metadata: Metadata = {
  title: "Development",
  description:
    "Selected engineering case studies, professional experience, and public GitHub systems by Alan Szmyt.",
  alternates: {
    canonical: "/development",
  },
  openGraph: {
    title: "Development | Alan Szmyt",
    description:
      "Selected engineering case studies, professional experience, and public GitHub systems by Alan Szmyt.",
    url: "/development",
  },
};

export default async function DevelopmentPage() {
  const [szmyty, egohygiene, incomprisllc] = await Promise.all([
    fetchUserRepositories("szmyty"),
    fetchOrganizationRepositories("egohygiene"),
    fetchOrganizationRepositories("incomprisllc"),
  ]);

  const scopes = buildGitHubScopes({
    szmyty,
    egohygiene,
    incomprisllc,
  });

  return (
    <PageShell>
      <header className="px-4 pb-20 sm:px-8 sm:pb-28">
        <div className="mx-auto max-w-6xl">
          <p className="text-sm font-semibold uppercase tracking-[0.2em] text-accent">
            Development
          </p>
          <h1 className="mt-4 max-w-4xl text-4xl font-bold tracking-tight text-text-primary sm:text-6xl lg:text-7xl">
            Reliable systems with visible reasoning.
          </h1>
          <p className="mt-6 max-w-3xl text-lg leading-relaxed text-text-secondary sm:text-xl">
            I build developer platforms, local-first tools, and AI-assisted
            workflows around explicit constraints, reviewable decisions, and
            validation that survives the demo.
          </p>
        </div>
      </header>

      <SelectedWork />
      <ProfessionalContext />

      <div className="border-t border-border pt-4">
        <div className="mx-auto max-w-6xl px-4 pt-16 sm:px-8 sm:pt-20">
          <p className="text-sm font-semibold uppercase tracking-[0.2em] text-accent">
            Public engineering inventory
          </p>
          <p className="mt-3 max-w-3xl text-base leading-relaxed text-text-secondary">
            Explore the broader repository catalog, language mix, and public
            activity after the authored work above.
          </p>
        </div>
      </div>
      <GitHubDashboardContainer initialScopes={scopes} />
    </PageShell>
  );
}
