import { LoadingState } from "@portfolio/components/ui/LoadingState";
import { PageShell } from "@portfolio/components/ui/PageShell";

export default function ResearchLoading() {
  return (
    <PageShell>
      <LoadingState
        label="Loading research"
        description="Synchronizing public identity and publication data."
        className="min-h-[32rem]"
      />
    </PageShell>
  );
}
