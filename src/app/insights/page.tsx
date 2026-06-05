import { PageShell } from "@portfolio/components/ui/PageShell";
import {
  fetchPinterestInsightsFeed,
  InsightsPageContent,
} from "@portfolio/features/insights";

export default async function InsightsPage() {
  const feed = await fetchPinterestInsightsFeed();

  return (
    <PageShell>
      <InsightsPageContent feed={feed} />
    </PageShell>
  );
}
