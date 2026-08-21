import { readFile } from "node:fs/promises";
import { resolve } from "node:path";

const root = process.cwd();
const dataPath = resolve(root, "src/features/work/data/selected-work.json");
const pagePath = resolve(root, "src/app/development/page.tsx");
const professionalContextPath = resolve(
  root,
  "src/features/work/components/ProfessionalContext/ProfessionalContext.tsx",
);

const [caseStudies, page, professionalContext] = await Promise.all([
  readFile(dataPath, "utf8").then(JSON.parse),
  readFile(pagePath, "utf8"),
  readFile(professionalContextPath, "utf8"),
]);

const requiredProjects = ["Reflector", "Renderflow", "Relay", "Optiflow"];
const requiredFields = [
  "problem",
  "constraints",
  "decisions",
  "implementation",
  "validation",
  "outcome",
  "role",
  "aiAssistance",
  "repositoryUrl",
];

const errors = [];

if (
  !Array.isArray(caseStudies) ||
  caseStudies.length < 3 ||
  caseStudies.length > 5
) {
  errors.push("selected work must contain three to five case studies");
}

for (const project of requiredProjects) {
  if (!caseStudies.some((study) => study.title === project)) {
    errors.push(`missing required case study: ${project}`);
  }
}

for (const study of caseStudies) {
  for (const field of requiredFields) {
    if (typeof study[field] !== "string" || study[field].trim().length < 20) {
      errors.push(
        `${study.title ?? "unknown case study"} has an incomplete ${field} field`,
      );
    }
  }

  if (!study.repositoryUrl.startsWith("https://github.com/")) {
    errors.push(
      `${study.title ?? "unknown case study"} lacks a public GitHub proof path`,
    );
  }
}

for (const marker of [
  "<SelectedWork />",
  "<ProfessionalContext />",
  "Public engineering inventory",
]) {
  if (!page.includes(marker)) {
    errors.push(`development page is missing marker: ${marker}`);
  }
}

for (const marker of [
  "Request current resume",
  'href="/research"',
  "Experience",
  "Education",
]) {
  if (!professionalContext.includes(marker)) {
    errors.push(`professional context is missing marker: ${marker}`);
  }
}

if (errors.length > 0) {
  console.error("Selected work contract failed:");
  for (const error of errors) console.error(`- ${error}`);
  process.exit(1);
}

console.log(
  `Selected work contract passed (${caseStudies.length} evidence-backed case studies).`,
);
