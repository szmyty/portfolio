import { existsSync, readFileSync } from "node:fs";
import { join } from "node:path";

const root = process.cwd();
const errors = [];

function read(relativePath) {
  return readFileSync(join(root, relativePath), "utf8");
}

function requireText(source, fragment, label) {
  if (!source.includes(fragment)) {
    errors.push(`${label} is missing ${JSON.stringify(fragment)}`);
  }
}

function rejectText(source, fragment, label) {
  if (source.includes(fragment)) {
    errors.push(`${label} still contains ${JSON.stringify(fragment)}`);
  }
}

const page = read("src/app/page.tsx");
const background = read(
  "src/features/landing/LandingBackground/LandingBackground.tsx",
);
const visualEnhancement = read(
  "src/features/landing/LandingVisualEnhancement/LandingVisualEnhancement.tsx",
);
const visualSupport = read("src/features/landing/visualSupport.ts");
const sectionVisual = read(
  "src/features/landing/sections/shared/SectionVisualTarget.tsx",
);
const hero = read(
  "src/features/landing/sections/HeroSection/HeroSection.tsx",
);
const siteConfig = read("src/config/site.ts");
const messages = JSON.parse(read("messages/en.json"));

rejectText(page, '"use client"', "homepage server component");
rejectText(page, "LandingEntry", "homepage server component");
rejectText(page, "IdentityBlock", "homepage server component");
rejectText(page, "GalaxyBackground", "homepage server component");
requireText(page, "<MainContent />", "homepage server component");
requireText(
  page,
  "<LandingVisualEnhancement />",
  "homepage progressive enhancement",
);
requireText(
  page,
  "homepage-static-background",
  "server-rendered static background",
);
requireText(page, 'href="#main-content"', "homepage skip link");
requireText(page, "min-h-dvh", "homepage responsive shell");
requireText(page, "overflow-x-hidden", "homepage responsive shell");

requireText(background, "supportsWebGL", "progressive visual boundary");
requireText(background, 'VisualMode = "static"', "static visual fallback");
requireText(background, "VisualErrorBoundary", "visual error fallback");
requireText(background, "data-visual-mode", "visual fallback state");
requireText(visualEnhancement, "{ ssr: false }", "client-only WebGL bridge");
requireText(
  visualEnhancement,
  "EnhancementBoundary",
  "dynamic import fallback",
);
requireText(visualSupport, "VISUAL_READY_TIMEOUT_MS = 2500", "visual timeout");
requireText(sectionVisual, "supportsWebGL", "section WebGL boundary");
requireText(sectionVisual, "SceneBoundary", "section visual error fallback");
requireText(sectionVisual, '"static"', "section static visual fallback");

requireText(hero, "mailto:", "homepage professional contact");
requireText(hero, "sm:", "homepage mobile-first hero");

const expectedRoleLine =
  "Software engineer building reliable developer platforms, local-first systems, and AI-assisted workflows.";
if (messages.HeroSection?.description !== expectedRoleLine) {
  errors.push("homepage role line differs from the approved positioning");
}
requireText(siteConfig, expectedRoleLine, "portfolio metadata");
if (!messages.HeroSection?.contactResume) {
  errors.push("homepage contact/resume action is missing");
}
if (!messages.HeroSection?.resumeNote) {
  errors.push("homepage resume availability note is missing");
}

for (const retiredPath of [
  "src/features/landing/LandingEntry",
  "src/features/landing/EntryTrigger",
]) {
  if (existsSync(join(root, retiredPath))) {
    errors.push(`retired mandatory-entry path remains: ${retiredPath}`);
  }
}

if (errors.length > 0) {
  for (const error of errors) {
    console.error(`ERROR: ${error}`);
  }
  process.exitCode = 1;
} else {
  console.log(
    "Verified server-rendered homepage shell, professional contact path, and bounded static visual fallback.",
  );
}
