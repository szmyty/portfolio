import { useTranslations } from "next-intl";
import { PublishingComicCard, type PublishingComic } from "@portfolio/features/publishing/components/PublishingComicCard";
import type { PublishingComicsSectionProps } from "./PublishingComicsSection.types";

export function PublishingComicsSection({
  comics,
}: PublishingComicsSectionProps) {
  const t = useTranslations("PublishingPage");
  const resolvedComics: PublishingComic[] = comics ?? [
    {
      title: t("comics.egoHygieneEdition1.title"),
      subtitle: t("comicStatusComingSoon"),
      imageSrc: "/textures/publishing/ego-hygiene-edition-1.png",
      imageAlt: t("comics.egoHygieneEdition1.imageAlt"),
    },
    {
      title: t("comics.foreverAndAlways.title"),
      subtitle: t("comicStatusComingSoon"),
      imageSrc: "/textures/publishing/forever-and-always.png",
      imageAlt: t("comics.foreverAndAlways.imageAlt"),
    },
  ];

  return (
    <section className="flex flex-col gap-6" aria-labelledby="publishing-comics-title">
      <h2
        id="publishing-comics-title"
        className="text-2xl font-semibold text-text-primary"
      >
        {t("comicsTitle")}
      </h2>

      <div className="grid gap-6 sm:grid-cols-2">
        {resolvedComics.map((comic) => (
          <PublishingComicCard key={comic.title} comic={comic} />
        ))}
      </div>
    </section>
  );
}
