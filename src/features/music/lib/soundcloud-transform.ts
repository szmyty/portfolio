// src/features/music/lib/soundcloud-transform.ts

import type {
  SoundCloudProfile,
  SoundCloudRssChannel,
  SoundCloudRssItem,
  SoundCloudTrack,
} from "@portfolio/features/music/types";

/**
 * Convert seconds → mm:ss
 */
function secondsToTime(seconds: number): string {
  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = Math.floor(seconds % 60);
  return `${minutes}:${String(remainingSeconds).padStart(2, "0")}`;
}

/**
 * Normalize duration
 * Priority:
 * 1. itunes.duration (already formatted)
 * 2. enclosure.length (bytes → approximate duration)
 */
function normalizeDuration(item: SoundCloudRssItem): string {
  const itunes = (item as any).itunes;

  if (itunes?.duration) {
    // already "00:03:50" → normalize to "3:50"
    const parts = itunes.duration.split(":").map(Number);

    if (parts.length === 3) {
      const [, minutes, seconds] = parts;
      return `${minutes}:${String(seconds).padStart(2, "0")}`;
    }

    if (parts.length === 2) {
      const [minutes, seconds] = parts;
      return `${minutes}:${String(seconds).padStart(2, "0")}`;
    }

    return itunes.duration;
  }

  // fallback: enclosure.length (bytes → seconds approximation)
  if (item.enclosure?.length) {
    const bytes = Number(item.enclosure.length);
    const seconds = bytes / 16000; // rough mp3 bitrate estimate
    return secondsToTime(seconds);
  }

  return "0:00";
}

/**
 * Extract artwork
 */
function extractArtworkUrl(item: SoundCloudRssItem): string | null {
  const itunes = (item as any).itunes;

  if (itunes?.image) {
    return itunes.image;
  }

  return null;
}

/**
 * Extract description
 */
function extractDescription(item: SoundCloudRssItem): string {
  const itunes = (item as any).itunes;

  return (
    item.content?.trim() ||
    itunes?.summary?.trim() ||
    itunes?.subtitle?.trim() ||
    item.description?.trim() ||
    "Listen on SoundCloud"
  );
}

/**
 * Transform single item
 */
export function transformSoundCloudItem(
  item: SoundCloudRssItem,
): SoundCloudTrack {
  const itunes = (item as any).itunes;

  console.log("Transforming SoundCloud item:", {
    title: item.title,
    artwork: itunes?.image,
    duration: itunes?.duration,
    audio: item.enclosure?.url,
  });

  return {
    title: item.title?.trim() || "Untitled Track",
    link: item.link?.trim() || "#",
    pubDate: item.pubDate
      ? new Date(item.pubDate).toISOString()
      : new Date().toISOString(),

    description: extractDescription(item),
    artwork: extractArtworkUrl(item),

    duration: normalizeDuration(item),

    audioUrl: item.enclosure?.url?.trim() || null,
  };
}

/**
 * Transform array
 */
export function transformSoundCloudItems(
  items: SoundCloudRssItem[],
): SoundCloudTrack[] {
  return items.map(transformSoundCloudItem);
}

export function transformSoundCloudProfile(
  channel: SoundCloudRssChannel,
): SoundCloudProfile {
  const itunesImage = channel.itunes?.image;
  const avatar =
    (typeof itunesImage === "string" ? itunesImage : itunesImage?.href) ??
    channel.image?.url ??
    null;

  return {
    name: channel.title?.trim() || "SoundCloud",
    url: channel.link?.trim() || "#",
    avatar,
  };
}
