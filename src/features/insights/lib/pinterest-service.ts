import { unstable_cache } from "next/cache";
import Parser from "rss-parser";
import { env } from "@portfolio/config";
import type {
  InsightFeed,
  InsightFeedChannel,
  PinterestRssItem,
} from "@portfolio/features/insights/types";
import {
  transformPinterestItem,
  extractCleanText,
  normalizePinterestUrl,
} from "@portfolio/features/insights/lib/insight-transform";
import {
  FEED_CACHE_TAGS,
  FEED_CACHE_TTL,
  logFeedMetrics,
} from "@portfolio/lib/feed-cache";

const parser: Parser<PinterestRssItem> = new Parser();
const FALLBACK_CHANNEL: InsightFeedChannel = {
  title: "Ego Hygiene",
  link: "https://www.pinterest.com/playfunctionmusic/ego-hygiene/",
  description:
    "Visual knowledge artifacts exploring emotional awareness, nervous system regulation, personal growth, and reflective self-development.",
};

export const fetchPinterestInsightsFeed: () => Promise<InsightFeed> =
  unstable_cache(
    async (): Promise<InsightFeed> => {
      const start = Date.now();

      try {
        const response = await fetch(env.PINTEREST_EGO_HYGIENE_RSS_URL, {
          next: {
            revalidate: FEED_CACHE_TTL.INSIGHTS,
            tags: [FEED_CACHE_TAGS.PINTEREST],
          },
        });

        if (!response.ok) {
          throw new Error(
            `Failed to fetch Pinterest RSS: ${response.status} ${response.statusText}`,
          );
        }

        const xml = await response.text();
        const feed = await parser.parseString(xml);
        const items = ((feed.items as PinterestRssItem[]) ?? []).map(
          transformPinterestItem,
        );

        logFeedMetrics({
          feed: "pinterest:ego-hygiene",
          hit: false,
          durationMs: Date.now() - start,
          itemCount: items.length,
        });

        return {
          channel: {
            title: feed.title?.trim() || FALLBACK_CHANNEL.title,
            link: normalizePinterestUrl(feed.link),
            description:
              extractCleanText(feed.description ?? "") ||
              FALLBACK_CHANNEL.description,
          },
          items,
          state: items.length > 0 ? "available" : "empty",
        };
      } catch {
        logFeedMetrics({
          feed: "pinterest:ego-hygiene",
          hit: false,
          durationMs: Date.now() - start,
          itemCount: 0,
        });

        return {
          channel: FALLBACK_CHANNEL,
          items: [],
          state: "error",
        };
      }
    },
    [FEED_CACHE_TAGS.PINTEREST],
    {
      revalidate: FEED_CACHE_TTL.INSIGHTS,
      tags: [FEED_CACHE_TAGS.PINTEREST],
    },
  );
