// src/features/music/types/music.types.ts

/**
 * Clean, normalized SoundCloud track model
 * Used throughout the UI layer
 */
export type SoundCloudTrack = {
  /**
   * Track title
   */
  title: string;

  /**
   * Public SoundCloud link
   */
  link: string;

  /**
   * Publication date (ISO string)
   */
  pubDate: string;

  /**
   * Short description / caption
   */
  description: string;

  /**
   * Artwork image URL
   */
  artwork: string | null;

  /**
   * Duration string (e.g. "03:45")
   */
  duration: string;

  /**
   * Direct audio stream URL (from enclosure)
   */
  audioUrl: string | null;
};

/**
 * Raw RSS item shape from SoundCloud feed
 * This is intentionally loose because RSS is inconsistent
 */
export type SoundCloudRssItem = {
  title?: string;
  link?: string;
  pubDate?: string;

  description?: string;

  enclosure?: {
    url?: string;
    type?: string;
    length?: string;
  };

  "itunes:duration"?: string;

  "itunes:summary"?: string;

  "itunes:image"?: {
    $?: {
      href?: string;
    };
    href?: string;
  };
};
