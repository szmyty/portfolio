import { PageShell } from "@portfolio/components/ui/PageShell";
import { PublishingPageContent } from "@portfolio/features/publishing/components";
import { fetchMediumRssItems } from "@portfolio/features/publishing/lib/medium-service";
import { transformMediumItems } from "@portfolio/features/publishing/lib/medium-transform";
import { MediumArticle, MediumRssItem } from "@portfolio/features/publishing/types";

export default async function PublishingPage() {
  const rawItems: MediumRssItem[] = await fetchMediumRssItems("szmyty");
  const articles: MediumArticle[] = transformMediumItems(rawItems);

  return (
    <PageShell>
      <PublishingPageContent articles={articles} />
    </PageShell>
  );
}
