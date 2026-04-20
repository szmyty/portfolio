import { PageShell } from "@portfolio/components/ui/PageShell";
import { GitHubDashboardContainer } from "@portfolio/features/github";
import { buildGitHubScopes } from "@portfolio/features/github/lib/github-analytics";
import {
  fetchOrganizationRepositories,
  fetchUserRepositories,
} from "@portfolio/features/github/lib/github-service";

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
      <GitHubDashboardContainer initialScopes={scopes} />
    </PageShell>
  );
}
