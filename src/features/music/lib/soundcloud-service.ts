// src/features/music/lib/soundcloud-service.ts

import { unstable_cache } from "next/cache";
import Parser from "rss-parser";
import type {
  SoundCloudFeed,
  SoundCloudRssChannel,
  SoundCloudRssItem,
} from "@portfolio/features/music/types";
import {
  FEED_CACHE_TAGS,
  FEED_CACHE_TTL,
  logFeedMetrics,
} from "@portfolio/lib/feed-cache";

const parser: Parser<SoundCloudRssItem> = new Parser();

const FEED_URL =
  "https://feeds.soundcloud.com/users/soundcloud:users:325554244/sounds.rss";

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
 *
 * Results are cached for {@link FEED_CACHE_TTL.MUSIC} seconds via
 * `unstable_cache`. The underlying HTTP response is also cached by Next.js
 * via the `next: { revalidate }` fetch option.
 */
export const fetchSoundCloudRssItems: () => Promise<SoundCloudFeed> =
  unstable_cache(
    async (): Promise<SoundCloudFeed> => {
      const start = Date.now();

      try {
        const response: Response = await fetch(FEED_URL, {
          next: {
            revalidate: FEED_CACHE_TTL.MUSIC,
            tags: [FEED_CACHE_TAGS.SOUNDCLOUD],
          },
        });

        if (!response.ok) {
          throw new Error(
            `Failed to fetch SoundCloud RSS: ${response.status} ${response.statusText}`,
          );
        }

        const xml: string = await response.text();
        const feed: Parser.Output<SoundCloudRssItem> =
          await parser.parseString(xml);

        const items = (feed.items as SoundCloudRssItem[]) ?? [];

        logFeedMetrics({
          feed: "soundcloud",
          hit: false,
          durationMs: Date.now() - start,
          itemCount: items.length,
        });

        return {
          items,
          channel: {
            title: feed.title,
            link: feed.link,
            image: (feed.image as SoundCloudRssChannel["image"]) ?? undefined,
            itunes:
              (feed.itunes as SoundCloudRssChannel["itunes"]) ?? undefined,
          },
        };
      } catch {
        logFeedMetrics({
          feed: "soundcloud",
          hit: false,
          durationMs: Date.now() - start,
          itemCount: 0,
        });

        return {
          items: [],
          channel: {},
        };
      }
    },
    [FEED_CACHE_TAGS.SOUNDCLOUD],
    {
      revalidate: FEED_CACHE_TTL.MUSIC,
      tags: [FEED_CACHE_TAGS.SOUNDCLOUD],
    },
  );
