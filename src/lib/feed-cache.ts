// src/lib/feed-cache.ts
// Server-side only — do NOT import in client components.

/**
 * Cache TTL constants in seconds.
 *
 * Music feeds update infrequently; 1 hour is sufficient.
 * Publishing feeds update even less often; 6 hours is sufficient.
 */
export const FEED_CACHE_TTL = {
  /** SoundCloud RSS — 1 hour */
  MUSIC: 3600,
  /** Medium RSS — 6 hours */
  PUBLISHING: 21_600,
} as const;

/**
 * Cache tag constants.
 * Use with Next.js `revalidateTag()` for on-demand cache invalidation.
 */
export const FEED_CACHE_TAGS = {
  SOUNDCLOUD: "soundcloud-feed",
  MEDIUM: "medium-feed",
} as const;

type FeedMetricsParams = {
  /** Feed name for identification in logs */
  feed: string;
  /** Whether this was a cache hit (true) or a live fetch (false) */
  hit: boolean;
  /** Wall-clock duration in milliseconds */
  durationMs: number;
  /** Number of items returned */
  itemCount: number;
};

/**
 * Log server-side feed cache metrics.
 *
 * Writes structured output to the server console.
 * Never exposed to users or the browser.
 */
export function logFeedMetrics({
  feed,
  hit,
  durationMs,
  itemCount,
}: FeedMetricsParams): void {
  // Guard: only run on the server
  if (typeof window !== "undefined") return;

  const status = hit ? "HIT" : "MISS";
  console.log(
    `[feed-cache] ${feed} | ${status} | duration=${durationMs}ms | items=${itemCount}`,
  );
}
