import { LoadingState } from "@portfolio/components/ui/LoadingState";
import { PageShell } from "@portfolio/components/ui/PageShell";

export default function InsightsLoading() {
  return (
    <PageShell>
      <LoadingState
        label="Loading insights"
        description="Preparing the latest visual knowledge artifacts."
        className="min-h-[32rem]"
      />
    </PageShell>
  );
}
