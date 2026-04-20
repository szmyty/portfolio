import { PublishingComicCard, type PublishingComic } from "@portfolio/features/publishing/components/PublishingComicCard";
import type { PublishingComicsSectionProps } from "./PublishingComicsSection.types";

const DEFAULT_COMICS: PublishingComic[] = [
  {
    title: "Ego Hygiene Edition 1",
    subtitle: "Coming soon",
    imageSrc: "/textures/publishing/ego-hygiene-edition-1.png",
    imageAlt: "Ego Hygiene Edition 1",
  },
  {
    title: "Forever & Always",
    subtitle: "Coming soon",
    imageSrc: "/textures/publishing/forever-and-always.png",
    imageAlt: "Forever & Always",
  },
];

export function PublishingComicsSection({
  comics = DEFAULT_COMICS,
}: PublishingComicsSectionProps) {
  return (
    <section className="flex flex-col gap-6" aria-labelledby="publishing-comics-title">
      <h2
        id="publishing-comics-title"
        className="text-2xl font-semibold text-text-primary"
      >
        Comics
      </h2>

      <div className="grid gap-6 sm:grid-cols-2">
        {comics.map((comic) => (
          <PublishingComicCard key={comic.title} comic={comic} />
        ))}
      </div>
    </section>
  );
}
