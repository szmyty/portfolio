export interface AkashicVideoSource {
  src: string | null;
  captions: string | null;
  poster: string | null;
  posterAlt: string;
}

export type AkashicFormat = "portrait" | "landscape";
export type AkashicMedia = Record<AkashicFormat, AkashicVideoSource>;

/** Public playback URLs only. See docs/akashic-showcase.md for the upload handoff. */
export const akashicMedia: AkashicMedia = {
  portrait: {
    src: null,
    captions: null,
    poster: null,
    posterAlt: "akashic portrait film artwork",
  },
  landscape: {
    src: null,
    captions: null,
    poster: null,
    posterAlt: "akashic landscape film artwork",
  },
};
