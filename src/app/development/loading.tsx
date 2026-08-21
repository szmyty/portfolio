import { LoadingState } from "@portfolio/components/ui/LoadingState";
import { PageShell } from "@portfolio/components/ui/PageShell";

export default function DevelopmentLoading() {
  return (
    <PageShell>
      <LoadingState
        label="Loading development work"
        description="Preparing selected systems and public repository data."
        className="min-h-[32rem]"
      />
    </PageShell>
  );
}
