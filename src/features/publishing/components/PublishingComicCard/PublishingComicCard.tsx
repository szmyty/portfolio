import type { PublishingComicCardProps } from "./PublishingComicCard.types";

export function PublishingComicCard({ comic }: PublishingComicCardProps) {
  return (
    <article className="flex flex-col overflow-hidden rounded-2xl border border-border bg-surface transition-all duration-200 hover:-translate-y-1 hover:border-accent hover:shadow-lg">
      <div className="flex aspect-[2/3] w-full items-center justify-center bg-surface-raised">
        <img
          src={comic.imageSrc}
          alt={comic.imageAlt}
          className="max-h-full max-w-full object-contain"
        />
      </div>

      <div className="p-4">
        <p className="font-semibold text-text-primary">{comic.title}</p>
        <p className="text-sm text-text-muted">{comic.subtitle}</p>
      </div>
    </article>
  );
}
