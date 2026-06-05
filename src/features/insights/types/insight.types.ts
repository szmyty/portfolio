export type InsightSource = "pinterest";

export type InsightPin = {
  id: string;
  title: string;
  description: string;
  url: string;
  imageUrl: string | null;
  publishedAt: string | null;
  tags: string[];
  source: InsightSource;
  guid: string;
};

export type PinterestRssItem = {
  title?: string;
  link?: string;
  guid?: string;
  pubDate?: string;
  isoDate?: string;
  description?: string;
  content?: string;
  contentSnippet?: string;
  categories?: string[];
};

export type InsightFeedChannel = {
  title: string;
  link: string;
  description: string;
};

export type InsightFeedState = "available" | "empty" | "error";

export type InsightFeed = {
  channel: InsightFeedChannel;
  items: InsightPin[];
  state: InsightFeedState;
};
