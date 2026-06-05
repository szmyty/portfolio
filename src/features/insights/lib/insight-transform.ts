import type {
  InsightPin,
  PinterestRssItem,
} from "@portfolio/features/insights/types";

const HTML_ENTITIES: Record<string, string> = {
  "&amp;": "&",
  "&apos;": "'",
  "&#39;": "'",
  "&quot;": '"',
  "&lt;": "<",
  "&gt;": ">",
  "&nbsp;": " ",
};

const PINTEREST_IMAGE_SIZE_PATTERN = /\/(?:\d+x|originals)\//i;
const PINTEREST_BOARD_URL =
  "https://www.pinterest.com/playfunctionmusic/ego-hygiene/";

function decodeHtmlEntities(value: string): string {
  return value.replace(/&(amp|apos|#39|quot|lt|gt|nbsp);/g, (entity) => {
    return HTML_ENTITIES[entity] ?? entity;
  });
}

export function stripUnsafeHtml(html: string): string {
  return html
    .replace(/<script[\s\S]*?<\/script>/gi, " ")
    .replace(/<style[\s\S]*?<\/style>/gi, " ")
    .replace(/<!--([\s\S]*?)-->/g, " ");
}

export function extractCleanText(html: string): string {
  return decodeHtmlEntities(
    stripUnsafeHtml(html)
      .replace(/<br\s*\/?>/gi, " ")
      .replace(/<\/p>/gi, " ")
      .replace(/<[^>]*>/g, " ")
      .replace(/\s+/g, " ")
      .trim(),
  );
}

function normalizeUrl(url: string): string | null {
  if (!url.trim()) {
    return null;
  }

  try {
    const normalizedUrl = new URL(url.trim());
    normalizedUrl.hash = "";

    return normalizedUrl.toString();
  } catch {
    return null;
  }
}

function normalizePinterestImageResolution(imageUrl: string): string {
  try {
    const url = new URL(imageUrl);

    if (
      url.hostname !== "i.pinimg.com" ||
      !PINTEREST_IMAGE_SIZE_PATTERN.test(url.pathname)
    ) {
      return url.toString();
    }

    url.pathname = url.pathname.replace(/\/(\d+)x\//i, "/736x/");

    return url.toString();
  } catch {
    return imageUrl;
  }
}

export function extractImageUrl(html: string): string | null {
  const sanitizedHtml = stripUnsafeHtml(html);
  const match = sanitizedHtml.match(/<img[^>]+src=["']([^"']+)["']/i);
  const imageUrl = match?.[1] ?? "";
  const normalizedUrl = normalizeUrl(imageUrl);

  if (!normalizedUrl) {
    return null;
  }

  return normalizePinterestImageResolution(normalizedUrl);
}

function normalizeTag(tag: string): string | null {
  const normalizedTag = tag.trim().replace(/^#+/, "").toLowerCase();

  return normalizedTag ? normalizedTag : null;
}

export function extractTags(...values: Array<string | undefined>): string[] {
  const tags = new Set<string>();

  for (const value of values) {
    if (!value) {
      continue;
    }

    const hashtags = value.match(/#([\p{L}\p{N}_-]+)/gu) ?? [];

    for (const hashtag of hashtags) {
      const normalizedTag = normalizeTag(hashtag);

      if (normalizedTag) {
        tags.add(normalizedTag);
      }
    }
  }

  return Array.from(tags);
}

export function normalizePublishedAt(date: string | undefined): string | null {
  if (!date) {
    return null;
  }

  const normalizedDate = new Date(date);

  if (Number.isNaN(normalizedDate.getTime())) {
    return null;
  }

  return normalizedDate.toISOString();
}

export function normalizePinterestUrl(url: string | undefined): string {
  const normalizedUrl = normalizeUrl(url ?? "");

  if (!normalizedUrl) {
    return PINTEREST_BOARD_URL;
  }

  try {
    const pinterestUrl = new URL(normalizedUrl);

    if (pinterestUrl.hostname.endsWith("pinterest.com")) {
      pinterestUrl.protocol = "https:";
      pinterestUrl.search = "";
      pinterestUrl.hash = "";
      pinterestUrl.pathname = pinterestUrl.pathname.replace(/\/+$/, "") || "/";
    }

    return pinterestUrl.toString();
  } catch {
    return PINTEREST_BOARD_URL;
  }
}

export function transformPinterestItem(item: PinterestRssItem): InsightPin {
  const rawDescription =
    item.description ?? item.content ?? item.contentSnippet ?? "";
  const cleanTitle = decodeHtmlEntities(item.title?.trim() ?? "");
  const cleanDescription = extractCleanText(rawDescription);
  const description =
    cleanDescription || cleanTitle || "Visual insight from Pinterest.";
  const url = normalizePinterestUrl(item.link ?? item.guid);
  const guid = item.guid?.trim() || url;

  return {
    id: guid,
    title: cleanTitle || description,
    description,
    url,
    imageUrl: extractImageUrl(rawDescription),
    publishedAt: normalizePublishedAt(item.isoDate ?? item.pubDate),
    tags: extractTags(cleanTitle, cleanDescription, ...(item.categories ?? [])),
    source: "pinterest",
    guid,
  };
}
