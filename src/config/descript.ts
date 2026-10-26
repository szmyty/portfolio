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
    src: "https://qexewt9x6rtawul4.public.blob.vercel-storage.com/manifest_descript_subbed_v1.mp4",
    captions: null,
  },
  edited: {
    src: "https://qexewt9x6rtawul4.public.blob.vercel-storage.com/manifest_descript_v1.mp4",
    captions: null,
  },
  original: {
    src: "https://qexewt9x6rtawul4.public.blob.vercel-storage.com/manifest.mp4",
    captions: null,
  },
  descriptShareUrl: null,
};
