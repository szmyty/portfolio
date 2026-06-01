export type ResearchThumbnailJob = {
  sourcePdfUrl: string;
  outputThumbnailUrl?: string;
};

/**
 * Placeholder for future pipeline:
 * PDF → first-page thumbnail → research card image.
 */
export function queueResearchThumbnail(job: ResearchThumbnailJob): void {
  void job;
  // TODO(research): implement PDF thumbnail generation pipeline.
}
