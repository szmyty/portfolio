export type ResearchThumbnailJob = {
  sourcePdfUrl: string;
  outputThumbnailUrl?: string;
};

/**
 * Placeholder for future thumbnail enrichment architecture:
 * DOI → Crossref / Zenodo metadata → PDF URL → first-page thumbnail.
 *
 * This hook intentionally performs no I/O yet and reserves a stable API for
 * a future background worker pipeline.
 */
export function queueResearchThumbnail(job: ResearchThumbnailJob): void {
  void job;
  // TODO(research): implement PDF thumbnail generation pipeline.
}
