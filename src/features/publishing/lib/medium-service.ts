// src/features/publishing/lib/medium-service.ts

import { unstable_cache } from "next/cache";
import Parser from "rss-parser";
import type { MediumRssItem } from "@portfolio/features/publishing/types";
import {
  FEED_CACHE_TAGS,
  FEED_CACHE_TTL,
  logFeedMetrics,
} from "@portfolio/lib/feed-cache";

const parser = new Parser();

/**
 * Fetch raw Medium RSS feed items for a given username.
 *
 * This function ONLY handles:
 * - fetching RSS
 * - parsing XML → JSON
 *
 * It does NOT:
 * - transform data
 * - extract images
 * - compute read time
 *
 * Results are cached for {@link FEED_CACHE_TTL.PUBLISHING} seconds via
 * `unstable_cache`. The underlying HTTP response is also cached by Next.js
 * via the `next: { revalidate }` fetch option.
 */
export function fetchMediumRssItems(
  username: string,
): Promise<MediumRssItem[]> {
  return unstable_cache(
    async (): Promise<MediumRssItem[]> => {
      const feedUrl = `https://medium.com/feed/@${username}`;
      const start = Date.now();

      try {
        const response = await fetch(feedUrl, {
          next: {
            revalidate: FEED_CACHE_TTL.PUBLISHING,
            tags: [FEED_CACHE_TAGS.MEDIUM],
          },
        });

        if (!response.ok) {
          throw new Error(
            `Failed to fetch Medium RSS: ${response.status} ${response.statusText}`,
          );
        }

        const xml = await response.text();
        const feed = await parser.parseString(xml);
        const items = (feed.items as MediumRssItem[]) ?? [];

        logFeedMetrics({
          feed: `medium:${username}`,
          hit: false,
          durationMs: Date.now() - start,
          itemCount: items.length,
        });

        return items;
      } catch {
        logFeedMetrics({
          feed: `medium:${username}`,
          hit: false,
          durationMs: Date.now() - start,
          itemCount: 0,
        });

        return [];
      }
    },
    [`${FEED_CACHE_TAGS.MEDIUM}:${username}`],
    {
      revalidate: FEED_CACHE_TTL.PUBLISHING,
      tags: [FEED_CACHE_TAGS.MEDIUM],
    },
  )();
}
