export type PublishingComic = {
  title: string;
  subtitle: string;
  imageSrc: string;
  imageAlt: string;
};

export type PublishingComicCardProps = {
  comic: PublishingComic;
};
