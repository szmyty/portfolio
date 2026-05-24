// src/features/music/lib/soundcloud-service.ts

import Parser from "rss-parser";
import type {
  SoundCloudFeed,
  SoundCloudRssChannel,
  SoundCloudRssItem,
} from "@portfolio/features/music/types";

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
export async function fetchSoundCloudRssItems(): Promise<SoundCloudFeed> {
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

    return {
      items: (feed.items as SoundCloudRssItem[]) ?? [],
      channel: {
        title: feed.title,
        link: feed.link,
        image: (feed.image as SoundCloudRssChannel["image"]) ?? undefined,
        itunes: (feed.itunes as SoundCloudRssChannel["itunes"]) ?? undefined,
      },
    };
  } catch {
    return {
      items: [],
      channel: {},
    };
  }
}
