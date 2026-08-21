import Link from "next/link";
import selectedWorkData from "@portfolio/features/work/data/selected-work.json";
import type { SelectedWorkCaseStudy } from "@portfolio/features/work/types/selected-work.types";

const selectedWork = selectedWorkData as SelectedWorkCaseStudy[];

const engineeringNotes: Array<{
  key: keyof Pick<
    SelectedWorkCaseStudy,
    | "problem"
    | "constraints"
    | "decisions"
    | "implementation"
    | "validation"
    | "outcome"
  >;
  label: string;
}> = [
  { key: "problem", label: "Problem" },
  { key: "constraints", label: "Constraints" },
  { key: "decisions", label: "Decisions" },
  { key: "implementation", label: "Implementation" },
  { key: "validation", label: "Validation" },
  { key: "outcome", label: "Outcome" },
];

function CaseStudyLink({ label, href }: { label: string; href: string }) {
  const isInternal = href.startsWith("/");
  const className =
    "inline-flex min-h-11 items-center gap-2 rounded-full border border-border-strong bg-background/70 px-4 py-2 text-sm font-semibold text-accent transition-colors hover:border-accent hover:text-accent-hover focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-accent";

  if (isInternal) {
    return (
      <Link href={href} className={className}>
        {label}
        <span aria-hidden="true">→</span>
      </Link>
    );
  }

  return (
    <a href={href} className={className}>
      {label}
      <span aria-hidden="true">↗</span>
    </a>
  );
}

function CaseStudy({
  study,
  index,
}: {
  study: SelectedWorkCaseStudy;
  index: number;
}) {
  const titleId = `${study.id}-title`;

  return (
    <article
      aria-labelledby={titleId}
      className="overflow-hidden rounded-[2rem] border border-border bg-surface/90 shadow-[0_24px_80px_rgba(0,0,0,0.2)] backdrop-blur-sm"
    >
      <div className="grid gap-6 border-b border-border px-5 py-6 sm:px-8 sm:py-8 lg:grid-cols-[minmax(0,1fr)_minmax(18rem,0.65fr)] lg:gap-10">
        <div>
          <div className="mb-4 flex flex-wrap items-center gap-3 text-xs font-semibold uppercase tracking-[0.18em] text-text-muted">
            <span className="text-accent">
              {String(index + 1).padStart(2, "0")}
            </span>
            <span aria-hidden="true">/</span>
            <span>{study.lane}</span>
          </div>
          <h3
            id={titleId}
            className="text-3xl font-bold text-text-primary sm:text-4xl"
          >
            {study.title}
          </h3>
          <p className="mt-4 max-w-3xl text-base leading-relaxed text-text-secondary sm:text-lg">
            {study.summary}
          </p>
        </div>

        <dl className="grid content-start gap-5 rounded-2xl border border-border bg-background/55 p-5">
          <div>
            <dt className="text-xs font-semibold uppercase tracking-[0.16em] text-text-muted">
              Role
            </dt>
            <dd className="mt-2 text-sm leading-relaxed text-text-secondary">
              {study.role}
            </dd>
          </div>
          <div>
            <dt className="text-xs font-semibold uppercase tracking-[0.16em] text-text-muted">
              AI assistance
            </dt>
            <dd className="mt-2 text-sm leading-relaxed text-text-secondary">
              {study.aiAssistance}
            </dd>
          </div>
        </dl>
      </div>

      <dl className="grid md:grid-cols-2">
        {engineeringNotes.map(({ key, label }, noteIndex) => (
          <div
            key={key}
            className={`border-border px-5 py-6 sm:px-8 ${
              noteIndex < engineeringNotes.length - 1 ? "border-b" : ""
            } ${noteIndex % 2 === 0 ? "md:border-r" : ""} ${
              noteIndex === engineeringNotes.length - 2 ? "md:border-b-0" : ""
            }`}
          >
            <dt className="text-xs font-semibold uppercase tracking-[0.16em] text-accent">
              {label}
            </dt>
            <dd className="mt-3 text-sm leading-relaxed text-text-secondary sm:text-base">
              {study[key]}
            </dd>
          </div>
        ))}
      </dl>

      <div className="flex flex-wrap gap-3 border-t border-border bg-background/35 px-5 py-5 sm:px-8">
        <CaseStudyLink label="Inspect repository" href={study.repositoryUrl} />
        {study.relatedLinks.map((link) => (
          <CaseStudyLink key={link.href} {...link} />
        ))}
      </div>
    </article>
  );
}

export function SelectedWork() {
  return (
    <section aria-labelledby="selected-work-title" className="px-4 sm:px-8">
      <div className="mx-auto max-w-6xl">
        <div className="max-w-3xl">
          <p className="text-sm font-semibold uppercase tracking-[0.2em] text-accent">
            Selected engineering systems
          </p>
          <h2
            id="selected-work-title"
            className="mt-4 text-3xl font-bold tracking-tight text-text-primary sm:text-5xl"
          >
            Four systems, shown through the decisions behind them.
          </h2>
          <p className="mt-5 text-base leading-relaxed text-text-secondary sm:text-lg">
            The repository dashboard is useful inventory. These case studies are
            the higher-signal layer: what each system needed to solve, the
            boundaries that shaped it, and how the work is validated.
          </p>
        </div>

        <div className="mt-10 flex flex-col gap-8 sm:mt-14 sm:gap-12">
          {selectedWork.map((study, index) => (
            <CaseStudy key={study.id} study={study} index={index} />
          ))}
        </div>
      </div>
    </section>
  );
}
