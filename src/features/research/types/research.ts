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
  publicationSource: string;
  pdfUrl: string;
  thumbnailUrl: string;
  authors: string[];
  source: ResearchSource;
};

export type ResearchProfile = {
  orcidId: string;
  orcidUrl: string;
  displayName: string;
  publicationCount: number;
  lastSynchronizedAt: string;
};

export type ResearchStatus =
  | "not-configured"
  | "credentials-unavailable"
  | "auth-failed"
  | "sync-failed"
  | "no-publications"
  | "available";

export type ResearchConnectionStatus =
  | "connected"
  | "configured"
  | "error"
  | "not-configured";

export type ResearchState = {
  status: ResearchStatus;
  connectionStatus: ResearchConnectionStatus;
  statusMessage: string;
  profile: ResearchProfile;
  publications: ResearchPaper[];
};
