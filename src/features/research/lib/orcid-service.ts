import { researchConfig } from "@portfolio/config";
import { normalizeResearchPaper } from "@portfolio/features/research/lib/research-transform";
import type { ResearchPaper, ResearchState } from "@portfolio/features/research/types";

const ORCID_DISPLAY_NAME = "Alan Szmyt";

export async function fetchResearchState(): Promise<ResearchState> {
  if (!researchConfig.orcidId) {
    return {
      status: "not-configured",
      profile: buildProfile([]),
      publications: [],
    };
  }

  const clientId = process.env.ORCID_CLIENT_ID?.trim() || "";
  const clientSecret = process.env.ORCID_CLIENT_SECRET?.trim() || "";

  if (researchConfig.requireCredentials && (!clientId || !clientSecret)) {
    console.warn(
      "[research] ORCID credentials are required but missing. Returning non-blocking not-configured state.",
    );

    return {
      status: "not-configured",
      profile: buildProfile([]),
      publications: [],
    };
  }

  if ((clientId && !clientSecret) || (!clientId && clientSecret)) {
    console.warn(
      "[research] ORCID credentials are partially configured. Synchronization may fail until ORCID_CLIENT_ID and ORCID_CLIENT_SECRET are both configured.",
    );
  }

  try {
    const publications = await fetchOrcidPublications(researchConfig.orcidId);

    return {
      status: publications.length > 0 ? "available" : "no-publications",
      profile: buildProfile(publications),
      publications,
    };
  } catch {
    console.warn(
      "[research] Unable to synchronize ORCID publications. Returning empty research state.",
    );

    return {
      status: "unavailable",
      profile: buildProfile([]),
      publications: [],
    };
  }
}

async function fetchOrcidPublications(orcidId: string): Promise<ResearchPaper[]> {
  void orcidId;

  // TODO(research): integrate ORCID Works API as primary publication source.
  // TODO(research): enrich ORCID records with Crossref, Zenodo, OpenAlex, and Semantic Scholar metadata.
  // TODO(research): retain partial records when one enrichment provider fails.

  const rawRecords: Array<Partial<ResearchPaper>> = [];

  return rawRecords.map((record) =>
    normalizeResearchPaper({
      ...record,
      source: "orcid",
    }),
  );
}

function buildProfile(publications: ResearchPaper[]) {
  return {
    orcidId: researchConfig.orcidId,
    displayName: ORCID_DISPLAY_NAME,
    publications,
  };
}
