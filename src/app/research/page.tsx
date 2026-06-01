import { PageShell } from "@portfolio/components/ui/PageShell";
import { getTranslations } from "next-intl/server";
import {
  fetchResearchState,
  ResearchEmptyState,
  ResearchIdentityCard,
  ResearchPublicationCard,
  ResearchStatusCard,
} from "@portfolio/features/research";

export default async function ResearchPage() {
  const research = await fetchResearchState();
  const t = await getTranslations("ResearchPage");

  return (
    <PageShell>
      <section className="mx-auto flex w-full max-w-6xl flex-col gap-8 px-4 py-12 sm:px-6 lg:px-8">
        <header className="space-y-3">
          <h1 className="text-3xl font-semibold tracking-tight text-text-primary sm:text-4xl">
            {t("title")}
          </h1>
          <p className="max-w-3xl text-base text-text-secondary sm:text-lg">
            {t("description")}
          </p>
        </header>

        <section className="space-y-4">
          <ResearchIdentityCard
            profile={research.profile}
            connectionStatus={research.connectionStatus}
          />
          <ResearchStatusCard
            publicationCount={research.profile.publicationCount}
            lastSynchronizedAt={research.profile.lastSynchronizedAt}
            statusMessage={research.statusMessage}
          />

          <h2 className="text-2xl font-semibold tracking-tight text-text-primary">
            {t("publications")}
          </h2>

          {research.publications.length === 0 ? (
            <ResearchEmptyState />
          ) : (
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {research.publications.map((paper) => (
                <ResearchPublicationCard
                  key={`${paper.source}-${paper.doi || paper.title}`}
                  paper={paper}
                />
              ))}
            </div>
          )}
        </section>
      </section>
    </PageShell>
  );
}
