import Image from "next/image";
import type { PublishingComicCardProps } from "./PublishingComicCard.types";

export function PublishingComicCard({ comic }: PublishingComicCardProps) {
  return (
    <article className="flex flex-col overflow-hidden rounded-2xl border border-border bg-surface transition-all duration-200 hover:-translate-y-1 hover:border-accent hover:shadow-lg">
      <div className="relative flex aspect-[2/3] w-full items-center justify-center bg-surface-raised overflow-hidden">
        <Image
          src={comic.imageSrc}
          alt={comic.imageAlt}
          fill
          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
          className="object-contain"
        />
      </div>

      <div className="p-4">
        <p className="font-semibold text-text-primary">{comic.title}</p>
        <p className="text-sm text-text-muted">{comic.subtitle}</p>
      </div>
    </article>
  );
}
