import type { ResearchPaper, ResearchSource } from "@portfolio/features/research/types";

type ResearchPaperInput = Partial<Omit<ResearchPaper, "source">> & {
  source?: ResearchSource;
};

/**
 * Provider-agnostic normalization used by ORCID, Crossref, Zenodo, arXiv, and future sources.
 */
export function normalizeResearchPaper(input: ResearchPaperInput): ResearchPaper {
  return {
    title: input.title?.trim() || "Untitled publication",
    abstract: input.abstract?.trim() || "",
    doi: normalizeDoi(input.doi),
    externalUrl: normalizeUrl(input.externalUrl),
    publicationDate: input.publicationDate?.trim() || "",
    publicationType: input.publicationType?.trim() || "",
    sourceName: input.sourceName?.trim() || "ORCID",
    pdfUrl: normalizeUrl(input.pdfUrl),
    thumbnailUrl: normalizeUrl(input.thumbnailUrl),
    authors: normalizeAuthors(input.authors),
    source: input.source || "unknown",
    putCode: input.putCode ?? null,
  };
}

function normalizeAuthors(authors?: string[]): string[] {
  if (!authors?.length) {
    return [];
  }

  return authors.map((author) => author.trim()).filter(Boolean);
}

function normalizeDoi(doi?: string): string {
  const normalized = doi?.trim() || "";
  return normalized.replace(/^https?:\/\/doi\.org\//i, "");
}

function normalizeUrl(url?: string): string {
  const normalized = url?.trim() || "";

  if (!normalized) {
    return "";
  }

  try {
    return new URL(normalized).toString();
  } catch {
    return "";
  }
}
