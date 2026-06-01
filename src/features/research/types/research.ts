export type ResearchSource =
  | "orcid"
  | "crossref"
  | "zenodo"
  | "arxiv"
  | "openalex"
  | "semantic-scholar"
  | "unknown";

export type ResearchPaper = {
  title: string;
  abstract: string;
  doi: string;
  publicationDate: string;
  pdfUrl: string;
  thumbnailUrl: string;
  authors: string[];
  source: ResearchSource;
};

export type ResearchProfile = {
  orcidId: string;
  displayName: string;
  publications: ResearchPaper[];
};

export type ResearchStatus =
  | "not-configured"
  | "no-publications"
  | "loading"
  | "unavailable"
  | "available";

export type ResearchState = {
  status: ResearchStatus;
  profile: ResearchProfile;
  publications: ResearchPaper[];
};
