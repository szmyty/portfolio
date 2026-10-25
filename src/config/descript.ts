export interface DescriptVideoSource {
  src: string | null;
  captions: string | null;
}

export interface DescriptMedia {
  poster: string;
  final: DescriptVideoSource;
  edited: DescriptVideoSource;
  original: DescriptVideoSource;
  descriptShareUrl: string | null;
}

/** Public playback URLs only. See docs/descript-showcase.md before publishing. */
export const descriptMedia: DescriptMedia = {
  poster: "/images/descript/manifest.webp",
  final: {
    src: null,
    captions: null,
  },
  edited: {
    src: null,
    captions: null,
  },
  original: {
    src: null,
    captions: null,
  },
  descriptShareUrl: null,
};
