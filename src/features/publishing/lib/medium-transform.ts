// src/features/publishing/lib/medium-transform.ts

import type {
  MediumArticle,
  MediumRssItem,
} from "@portfolio/features/publishing/types";

/**
 * Estimate read time based on word count.
 * Uses ~200 words per minute standard.
 */
function estimateReadTime(text: string): number {
  const words = text.trim().split(/\s+/).length;
  return Math.max(1, Math.round(words / 200));
}

/**
 * Extract first image URL from HTML content.
 */
function extractFirstImage(html: string): string | null {
  const match = html.match(/<img[^>]+src="([^">]+)"/);
  return match?.[1] ?? null;
}

/**
 * Strip HTML tags to get plain text.
 */
function stripHtml(html: string): string {
  return html
    .replace(/<[^>]*>/g, "") // remove tags
    .replace(/\s+/g, " ") // normalize whitespace
    .trim();
}

/**
 * Transform a single RSS item → MediumArticle
 */
export function transformMediumItem(item: MediumRssItem): MediumArticle {
  const rawContent =
    item["content:encoded"] ??
    item.content ??
    item.contentSnippet ??
    "";

  const thumbnail = extractFirstImage(rawContent);

  const plainText = stripHtml(rawContent);

  // Take a short excerpt (first ~200 chars)
  const description = plainText.slice(0, 200).trim() + "...";

  return {
    title: item.title ?? "Untitled",
    link: item.link ?? "#",
    pubDate: item.pubDate
      ? new Date(item.pubDate).toISOString()
      : new Date().toISOString(),

    description,
    thumbnail,

    readTime: estimateReadTime(plainText),

    categories: item.categories ?? [],
  };
}

/**
 * Transform full RSS array → MediumArticle[]
 */
export function transformMediumItems(
  items: MediumRssItem[],
): MediumArticle[] {
  return items.map(transformMediumItem);
}
