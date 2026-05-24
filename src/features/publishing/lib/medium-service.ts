// src/features/publishing/lib/medium-service.ts

import Parser from "rss-parser";
import type { MediumRssItem } from "@portfolio/features/publishing/types";

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
 */
export async function fetchMediumRssItems(
  username: string,
): Promise<MediumRssItem[]> {
  const feedUrl = `https://medium.com/feed/@${username}`;

  try {
    const feed = await parser.parseURL(feedUrl);

    return (feed.items as MediumRssItem[]) ?? [];
  } catch {
    return [];
  }
}
