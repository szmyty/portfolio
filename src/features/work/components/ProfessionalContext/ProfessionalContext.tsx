import Link from "next/link";
import { siteConfig } from "@portfolio/config";

const timeline = [
  {
    period: "2019–2025",
    title: "Software Engineer, Associate Staff",
    organization: "MIT Lincoln Laboratory",
    description:
      "Six years of software engineering experience in a research-and-development environment, now distilled into public work around developer platforms, reliable automation, and inspectable systems.",
  },
  {
    period: "2023–Present",
    title: "Founder & Systems Architect",
    organization: "Incompris LLC",
    description:
      "An independent engineering and research lane for system architecture, open-source infrastructure, and evidence-backed product exploration.",
  },
] as const;

const education = [
  {
    year: "2023",
    degree: "M.S. Software Development",
    institution: "Boston University",
  },
  {
    year: "2017",
    degree: "B.S. Computer Science · Mathematics minor",
    institution: "University of Massachusetts Lowell",
  },
] as const;

export function ProfessionalContext() {
  return (
    <section
      aria-labelledby="professional-context-title"
      className="px-4 py-20 sm:px-8 sm:py-28"
    >
      <div className="mx-auto max-w-6xl">
        <div className="grid gap-10 lg:grid-cols-[minmax(0,0.8fr)_minmax(0,1.2fr)] lg:gap-16">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.2em] text-accent">
              Professional context
            </p>
            <h2
              id="professional-context-title"
              className="mt-4 text-3xl font-bold tracking-tight text-text-primary sm:text-5xl"
            >
              The experience behind the public systems.
            </h2>
            <p className="mt-5 text-base leading-relaxed text-text-secondary sm:text-lg">
              My current application lane centers platform engineering and
              developer experience, with research software, local-first systems,
              and creative technology as practical differentiators.
            </p>

            <div className="mt-8 flex flex-wrap gap-3">
              <a
                href={`mailto:${siteConfig.author.email}?subject=Resume%20request`}
                className="button-primary inline-flex min-h-12 items-center justify-center rounded-xl px-5 py-3 font-semibold focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-accent"
              >
                Request current resume
              </a>
              <Link
                href="/research"
                className="button-secondary inline-flex min-h-12 items-center justify-center rounded-xl px-5 py-3 font-semibold focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-accent"
              >
                Explore research
              </Link>
            </div>
            <p className="mt-4 text-sm text-text-muted">
              A permanent public resume edition is being finalized; the current
              version is available directly for professional inquiries.
            </p>
          </div>

          <div className="grid gap-6">
            <div className="rounded-[2rem] border border-border bg-surface/90 p-5 backdrop-blur-sm sm:p-8">
              <h3 className="text-xl font-semibold text-text-primary">
                Experience
              </h3>
              <ol className="mt-6 grid gap-7">
                {timeline.map((item) => (
                  <li
                    key={`${item.organization}-${item.period}`}
                    className="grid gap-2 sm:grid-cols-[8rem_1fr]"
                  >
                    <p className="font-mono text-sm text-accent">
                      {item.period}
                    </p>
                    <div>
                      <h4 className="text-lg font-semibold text-text-primary">
                        {item.title}
                      </h4>
                      <p className="mt-1 text-sm font-medium text-text-secondary">
                        {item.organization}
                      </p>
                      <p className="mt-3 text-sm leading-relaxed text-text-muted">
                        {item.description}
                      </p>
                    </div>
                  </li>
                ))}
              </ol>
            </div>

            <div className="rounded-[2rem] border border-border bg-background/75 p-5 backdrop-blur-sm sm:p-8">
              <h3 className="text-xl font-semibold text-text-primary">
                Education
              </h3>
              <ul className="mt-6 grid gap-5">
                {education.map((item) => (
                  <li
                    key={item.degree}
                    className="grid gap-2 sm:grid-cols-[5rem_1fr]"
                  >
                    <p className="font-mono text-sm text-accent">{item.year}</p>
                    <div>
                      <p className="font-semibold text-text-primary">
                        {item.degree}
                      </p>
                      <p className="mt-1 text-sm text-text-secondary">
                        {item.institution}
                      </p>
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
