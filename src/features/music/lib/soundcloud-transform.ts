// src/features/music/lib/soundcloud-transform.ts

import type {
  SoundCloudRssItem,
  SoundCloudTrack,
} from "@portfolio/features/music/types";

/**
 * Normalize a duration string from RSS.
 *
 * SoundCloud RSS appears to provide durations like:
 * - "00:03:50"
 * - "03:50"
 *
 * This function normalizes them into a cleaner display format:
 * - "3:50"
 * - "1:02:14"
 */
function normalizeDuration(rawDuration: string | undefined): string {
  if (!rawDuration) {
    return "0:00";
  }

  const durationParts = rawDuration.split(":").map((part) => part.trim());

  if (durationParts.length === 3) {
    const [hours, minutes, seconds] = durationParts;
    const normalizedHours = Number(hours);
    const normalizedMinutes = Number(minutes);
    const normalizedSeconds = Number(seconds);

    if (normalizedHours > 0) {
      return `${normalizedHours}:${String(normalizedMinutes).padStart(2, "0")}:${String(normalizedSeconds).padStart(2, "0")}`;
    }

    return `${normalizedMinutes}:${String(normalizedSeconds).padStart(2, "0")}`;
  }

  if (durationParts.length === 2) {
    const [minutes, seconds] = durationParts;
    return `${Number(minutes)}:${String(Number(seconds)).padStart(2, "0")}`;
  }

  return rawDuration;
}

/**
 * Extract artwork URL from SoundCloud RSS item.
 */
function extractArtworkUrl(item: SoundCloudRssItem): string | null {
  const possibleImageValue = item["itunes:image"];

  if (!possibleImageValue) {
    return null;
  }

  if (typeof possibleImageValue === "object") {
    if ("href" in possibleImageValue && typeof possibleImageValue.href === "string") {
      return possibleImageValue.href;
    }

    if (
      "$" in possibleImageValue &&
      possibleImageValue.$ &&
      typeof possibleImageValue.$.href === "string"
    ) {
      return possibleImageValue.$.href;
    }
  }

  return null;
}

/**
 * Choose the best available description field.
 */
function extractDescription(item: SoundCloudRssItem): string {
  return (
    item["itunes:summary"]?.trim() ||
    item.description?.trim() ||
    "Listen on SoundCloud"
  );
}

/**
 * Transform a single raw SoundCloud RSS item into a normalized track model.
 */
export function transformSoundCloudItem(
  item: SoundCloudRssItem,
): SoundCloudTrack {
  return {
    title: item.title?.trim() || "Untitled Track",
    link: item.link?.trim() || "#",
    pubDate: item.pubDate
      ? new Date(item.pubDate).toISOString()
      : new Date().toISOString(),
    description: extractDescription(item),
    artwork: extractArtworkUrl(item),
    duration: normalizeDuration(item["itunes:duration"]),
    audioUrl: item.enclosure?.url?.trim() || null,
  };
}

/**
 * Transform an array of raw SoundCloud RSS items into normalized tracks.
 */
export function transformSoundCloudItems(
  items: SoundCloudRssItem[],
): SoundCloudTrack[] {
  return items.map(transformSoundCloudItem);
}
