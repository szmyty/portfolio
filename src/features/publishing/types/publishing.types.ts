// src/features/publishing/types/publishing.types.ts

/**
 * Represents a Medium article after normalization from RSS.
 */
export type MediumArticle = {
  /**
   * Article title
   */
  title: string;

  /**
   * Direct link to the Medium article
   */
  link: string;

  /**
   * Publication date (ISO string for consistency)
   */
  pubDate: string;

  /**
   * Short preview text (plain text, no HTML)
   */
  description: string;

  /**
   * Thumbnail image extracted from content (if available)
   */
  thumbnail: string | null;

  /**
   * Estimated read time in minutes
   */
  readTime: number;

  /**
   * Article categories/tags
   */
  categories: string[];
};

/**
 * Raw RSS item shape (subset of rss-parser output)
 * Used as input to transformation layer
 */
export type MediumRssItem = {
  title?: string;
  link?: string;
  pubDate?: string;

  content?: string;
  contentSnippet?: string;
  "content:encoded"?: string;

  categories?: string[];
};
