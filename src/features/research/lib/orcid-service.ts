import { researchConfig } from "@portfolio/config";
import { normalizeResearchPaper } from "@portfolio/features/research/lib/research-transform";
import type { ResearchPaper, ResearchState } from "@portfolio/features/research/types";

const ORCID_API_URL = "https://pub.orcid.org/v3.0";
const ORCID_TOKEN_URL = "https://orcid.org/oauth/token";
const ORCID_SCOPE = "/read-public";
const MAX_WORKS = 12;
const ORCID_DISPLAY_NAME = "Alan Szmyt";

type OrcidErrorKind = "auth" | "sync";

class OrcidServiceError extends Error {
  constructor(
    public readonly kind: OrcidErrorKind,
    message: string,
  ) {
    super(message);
    this.name = "OrcidServiceError";
  }
}

type OrcidExternalId = {
  "external-id-type"?: string;
  "external-id-value"?: string;
  "external-id-url"?: { value?: string };
};

type OrcidWorkSummary = {
  "put-code"?: number;
  title?: { title?: { value?: string } };
  type?: string;
  source?: { "source-name"?: { value?: string } };
  "publication-date"?: {
    year?: { value?: string };
    month?: { value?: string };
    day?: { value?: string };
  };
  "external-ids"?: {
    "external-id"?: OrcidExternalId[];
  };
};

type OrcidWorkDetail = {
  title?: { title?: { value?: string } };
  "journal-title"?: { value?: string };
  "publication-date"?: OrcidWorkSummary["publication-date"];
  "short-description"?: string;
  url?: { value?: string };
  type?: string;
  source?: { "source-name"?: { value?: string } };
  "external-ids"?: {
    "external-id"?: OrcidExternalId[];
  };
};

export async function fetchResearchState(): Promise<ResearchState> {
  const orcidId = process.env.ORCID_ID?.trim() || researchConfig.orcidId;
  const clientId = process.env.ORCID_CLIENT_ID?.trim() || "";
  const clientSecret = process.env.ORCID_CLIENT_SECRET?.trim() || "";

  if (!orcidId) {
    console.info("[research] ORCID not configured.");
    return buildState({
      status: "not-configured",
      connectionStatus: "not-configured",
      statusMessage: "ORCID not configured",
      publications: [],
      orcidId,
    });
  }

  if (!clientId || !clientSecret) {
    console.warn("[research] ORCID client credentials unavailable.");
    return buildState({
      status: "credentials-unavailable",
      connectionStatus: "configured",
      statusMessage: "ORCID client credentials unavailable",
      publications: [],
      orcidId,
    });
  }

  try {
    const accessToken = await authenticateWithOrcid(clientId, clientSecret);
    console.info("[research] ORCID token acquired for /read-public scope.");

    const displayName = await fetchOrcidDisplayName(orcidId, accessToken);
    const publications = await fetchOrcidPublications(orcidId, accessToken);
    const synchronizedAt = new Date().toISOString();

    console.info(`[research] ORCID publications synchronized: ${publications.length}`);
    console.info("[research] ORCID synchronization succeeded.");

    return buildState({
      status: publications.length > 0 ? "available" : "no-publications",
      connectionStatus: "connected",
      statusMessage:
        publications.length > 0
          ? "Publications synchronized"
          : "No publications found",
      publications,
      orcidId,
      displayName,
      lastSynchronizedAt: synchronizedAt,
    });
  } catch (error) {
    if (error instanceof OrcidServiceError && error.kind === "auth") {
      console.warn("[research] ORCID authentication failed.");
      return buildState({
        status: "auth-failed",
        connectionStatus: "error",
        statusMessage: "Unable to authenticate with ORCID",
        publications: [],
        orcidId,
      });
    }

    console.warn("[research] ORCID synchronization failed.");
    return buildState({
      status: "sync-failed",
      connectionStatus: "error",
      statusMessage: "Unable to synchronize publications",
      publications: [],
      orcidId,
    });
  }
}

async function authenticateWithOrcid(
  clientId: string,
  clientSecret: string,
): Promise<string> {
  const response = await fetch(ORCID_TOKEN_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
    },
    body: new URLSearchParams({
      grant_type: "client_credentials",
      scope: ORCID_SCOPE,
      client_id: clientId,
      client_secret: clientSecret,
    }),
    next: { revalidate: 3600 },
  });

  if (!response.ok) {
    throw new OrcidServiceError("auth", `Token request failed: ${response.status}`);
  }

  const payload = (await response.json()) as { access_token?: string };
  const accessToken = payload.access_token?.trim() || "";

  if (!accessToken) {
    throw new OrcidServiceError("auth", "Token response did not contain access token");
  }

  return accessToken;
}

async function fetchOrcidPublications(
  orcidId: string,
  accessToken: string,
): Promise<ResearchPaper[]> {
  const worksResponse = await fetch(`${ORCID_API_URL}/${orcidId}/works`, {
    headers: {
      Accept: "application/json",
      Authorization: "Bearer " + accessToken,
    },
    next: { revalidate: 3600 },
  });

  if (!worksResponse.ok) {
    throw new OrcidServiceError(
      "sync",
      `Works request failed: ${worksResponse.status}`,
    );
  }

  const worksPayload = (await worksResponse.json()) as {
    group?: Array<{ "work-summary"?: OrcidWorkSummary[] }>;
  };

  const summaries =
    worksPayload.group
      ?.flatMap((group) => group["work-summary"] || [])
      .filter((summary): summary is OrcidWorkSummary => Boolean(summary["put-code"]))
      .slice(0, MAX_WORKS) || [];

  if (summaries.length === 0) {
    return [];
  }

  const publications = await Promise.all(
    summaries.map(async (summary) => {
      const work = await fetchOrcidWorkDetail(orcidId, summary["put-code"]!, accessToken);

      return normalizeResearchPaper({
        title:
          work?.title?.title?.value || summary.title?.title?.value || "Untitled publication",
        abstract: work?.["short-description"] || "",
        doi: extractDoi(work?.["external-ids"]?.["external-id"]) ||
          extractDoi(summary["external-ids"]?.["external-id"]),
        externalUrl:
          extractExternalUrl(work?.["external-ids"]?.["external-id"]) ||
          work?.url?.value ||
          extractExternalUrl(summary["external-ids"]?.["external-id"]) ||
          (summary["put-code"]
            ? `https://orcid.org/${orcidId}/work/${summary["put-code"]}`
            : ""),
        publicationDate:
          formatPublicationDate(work?.["publication-date"]) ||
          formatPublicationDate(summary["publication-date"]),
        publicationType: formatPublicationType(work?.type || summary.type),
        sourceName:
          work?.["journal-title"]?.value ||
          work?.source?.["source-name"]?.value ||
          summary.source?.["source-name"]?.value ||
          "ORCID",
        pdfUrl: extractPdfUrl(work),
        source: "orcid",
        putCode: summary["put-code"] ?? null,
      });
    }),
  );

  // TODO(research): enrich ORCID records with Crossref metadata.
  // TODO(research): enrich ORCID records with Zenodo artifact details.
  // TODO(research): enrich ORCID records with OpenAlex citation context.
  // TODO(research): enrich ORCID records with Semantic Scholar impact metadata.
  // TODO(research): enrich ORCID records with arXiv preprint linkage.

  return publications;
}

async function fetchOrcidDisplayName(
  orcidId: string,
  accessToken: string,
): Promise<string> {
  const response = await fetch(`${ORCID_API_URL}/${orcidId}/person`, {
    headers: {
      Accept: "application/json",
      Authorization: "Bearer " + accessToken,
    },
    next: { revalidate: 3600 },
  });

  if (!response.ok) {
    return ORCID_DISPLAY_NAME;
  }

  const payload = (await response.json()) as {
    name?: {
      "given-names"?: { value?: string };
      "family-name"?: { value?: string };
    };
  };

  const givenName = payload.name?.["given-names"]?.value?.trim() || "";
  const familyName = payload.name?.["family-name"]?.value?.trim() || "";
  return `${givenName} ${familyName}`.trim() || ORCID_DISPLAY_NAME;
}

async function fetchOrcidWorkDetail(
  orcidId: string,
  putCode: number,
  accessToken: string,
): Promise<OrcidWorkDetail | null> {
  const response = await fetch(`${ORCID_API_URL}/${orcidId}/work/${putCode}`, {
    headers: {
      Accept: "application/json",
      Authorization: "Bearer " + accessToken,
    },
    next: { revalidate: 3600 },
  });

  if (!response.ok) {
    return null;
  }

  return (await response.json()) as OrcidWorkDetail;
}

function extractDoi(externalIds: OrcidExternalId[] | undefined): string {
  if (!externalIds?.length) {
    return "";
  }

  const doi = externalIds.find((id) => id["external-id-type"]?.toLowerCase() === "doi");
  return doi?.["external-id-value"] || "";
}

function extractExternalUrl(externalIds: OrcidExternalId[] | undefined): string {
  if (!externalIds?.length) {
    return "";
  }

  return externalIds.find((id) => id["external-id-url"]?.value)?.["external-id-url"]?.value || "";
}

function extractPdfUrl(work: OrcidWorkDetail | null): string {
  const explicitUrl = work?.url?.value?.trim() || "";

  if (isPdfLikeUrl(explicitUrl)) {
    return explicitUrl;
  }

  const externalUrls =
    work?.["external-ids"]?.["external-id"]
      ?.map((identifier) => identifier["external-id-url"]?.value?.trim() || "")
      .filter(Boolean) || [];

  return externalUrls.find((url) => isPdfLikeUrl(url)) || "";
}

function isPdfLikeUrl(url: string): boolean {
  const trimmedUrl = url.trim();

  if (!trimmedUrl) {
    return false;
  }

  try {
    const parsedUrl = new URL(trimmedUrl);
    const host = parsedUrl.hostname.toLowerCase();
    const path = parsedUrl.pathname.toLowerCase();

    return (
      path.endsWith(".pdf") ||
      path.includes("/download") ||
      path.includes("pdf") ||
      host === "zenodo.org" ||
      host.endsWith(".zenodo.org")
    );
  } catch {
    return false;
  }
}

function formatPublicationDate(
  publicationDate: OrcidWorkSummary["publication-date"] | undefined,
): string {
  if (!publicationDate?.year?.value) {
    return "";
  }

  const year = publicationDate.year.value;
  const month = publicationDate.month?.value?.padStart(2, "0");
  const day = publicationDate.day?.value?.padStart(2, "0");

  if (year && month && day) {
    const date = new Date(`${year}-${month}-${day}T00:00:00Z`);
    if (!Number.isNaN(date.getTime())) {
      return date.toLocaleDateString("en-US", {
        year: "numeric",
        month: "long",
        day: "numeric",
      });
    }
    return `${year}-${month}-${day}`;
  }

  if (year && month) {
    const date = new Date(`${year}-${month}-01T00:00:00Z`);
    if (!Number.isNaN(date.getTime())) {
      return date.toLocaleDateString("en-US", {
        year: "numeric",
        month: "long",
      });
    }
    return `${year}-${month}`;
  }

  return year;
}

function formatPublicationType(publicationType?: string): string {
  if (!publicationType?.trim()) {
    return "";
  }

  return publicationType
    .trim()
    .toLowerCase()
    .split(/[-_\s]+/)
    .map((segment) => segment.charAt(0).toUpperCase() + segment.slice(1))
    .join(" ");
}

function buildState({
  status,
  connectionStatus,
  statusMessage,
  publications,
  orcidId,
  displayName = ORCID_DISPLAY_NAME,
  lastSynchronizedAt = "",
}: {
  status: ResearchState["status"];
  connectionStatus: ResearchState["connectionStatus"];
  statusMessage: string;
  publications: ResearchPaper[];
  orcidId: string;
  displayName?: string;
  lastSynchronizedAt?: string;
}): ResearchState {
  return {
    status,
    connectionStatus,
    statusMessage,
    profile: {
      orcidId,
      orcidUrl: orcidId ? `https://orcid.org/${orcidId}` : "",
      displayName,
      publicationCount: publications.length,
      lastSynchronizedAt,
    },
    publications,
  };
}
