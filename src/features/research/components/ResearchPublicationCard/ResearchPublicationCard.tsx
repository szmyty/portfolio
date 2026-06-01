import type { ResearchPaper } from "@portfolio/features/research/types";
import Link from "next/link";

type ResearchPublicationCardProps = {
  paper: ResearchPaper;
};

export function ResearchPublicationCard({ paper }: ResearchPublicationCardProps) {
  return (
    <article className="overflow-hidden rounded-2xl border border-border/60 bg-surface-overlay">
      {paper.thumbnailUrl && (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={paper.thumbnailUrl}
          alt={paper.title}
          className="h-44 w-full object-cover"
        />
      )}

      <div className="space-y-3 p-4">
        <h3 className="text-lg font-medium text-text-primary">{paper.title}</h3>

        {paper.publicationDate && (
          <p className="text-xs uppercase tracking-[0.2em] text-text-muted">
            {formatDate(paper.publicationDate)}
          </p>
        )}

        {paper.abstract && (
          <p className="line-clamp-4 text-sm leading-relaxed text-text-secondary">
            {paper.abstract}
          </p>
        )}

        <div className="flex flex-wrap gap-3 text-sm text-text-secondary">
          {paper.publicationSource && <span>Source: {paper.publicationSource}</span>}

          {paper.doi && (
            <Link
              href={`https://doi.org/${paper.doi}`}
              target="_blank"
              rel="noopener noreferrer"
              className="text-emerald-300 transition-colors hover:text-emerald-200"
            >
              DOI: {paper.doi}
            </Link>
          )}

          {paper.pdfUrl && (
            <Link
              href={paper.pdfUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="text-emerald-300 transition-colors hover:text-emerald-200"
            >
              View PDF
            </Link>
          )}
        </div>
      </div>
    </article>
  );
}

function formatDate(value: string): string {
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) {
    return value;
  }

  return new Intl.DateTimeFormat("en", { dateStyle: "medium" }).format(date);
}
