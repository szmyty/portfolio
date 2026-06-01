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
    doi: input.doi?.trim() || "",
    publicationDate: input.publicationDate?.trim() || "",
    pdfUrl: input.pdfUrl?.trim() || "",
    thumbnailUrl: input.thumbnailUrl?.trim() || "",
    authors: normalizeAuthors(input.authors),
    source: input.source || "unknown",
  };
}

function normalizeAuthors(authors?: string[]): string[] {
  if (!authors?.length) {
    return [];
  }

  return authors.map((author) => author.trim()).filter(Boolean);
}
