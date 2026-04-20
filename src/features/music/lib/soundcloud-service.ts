// src/features/music/lib/soundcloud-service.ts

import Parser from "rss-parser";
import type { SoundCloudRssItem } from "@portfolio/features/music/types";

const parser: Parser<SoundCloudRssItem> = new Parser();

/**
 * Fetch raw SoundCloud RSS feed items.
 *
 * This function ONLY handles:
 * - fetching RSS
 * - parsing XML → JSON
 *
 * It does NOT:
 * - transform data
 * - format durations
 * - normalize artwork/audio URLs
 */
export async function fetchSoundCloudRssItems(): Promise<SoundCloudRssItem[]> {
  const feedUrl: string =
    "https://feeds.soundcloud.com/users/soundcloud:users:325554244/sounds.rss";

  try {
    const response: Response = await fetch(feedUrl, {
      next: { revalidate: 3600 },
    });

    if (!response.ok) {
      throw new Error(
        `Failed to fetch SoundCloud RSS: ${response.status} ${response.statusText}`,
      );
    }

    const xml: string = await response.text();
    const feed: Parser.Output<SoundCloudRssItem> = await parser.parseString(xml);

    console.log("SoundCloud RSS fetched:", {
      title: feed.title,
      itemCount: feed.items.length,
    });

    return (feed.items as SoundCloudRssItem[]) ?? [];
  } catch (error) {
    console.error("Failed to fetch SoundCloud RSS:", error);

    return [];
  }
}
