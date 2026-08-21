import { existsSync, readFileSync } from "node:fs";
import { join } from "node:path";

const root = process.cwd();
const errors = [];
const releaseChecks = [];

function read(relativePath) {
  return readFileSync(join(root, relativePath), "utf8");
}

function readJson(relativePath) {
  return JSON.parse(read(relativePath));
}

function requireFile(relativePath, label = relativePath) {
  if (!existsSync(join(root, relativePath))) {
    errors.push(`${label} is missing (${relativePath})`);
    return false;
  }
  return true;
}

function requireText(source, fragment, label) {
  if (!source.includes(fragment)) {
    errors.push(`${label} is missing ${JSON.stringify(fragment)}`);
  }
}

function rejectText(source, fragment, label) {
  if (source.includes(fragment)) {
    errors.push(`${label} contains forbidden ${JSON.stringify(fragment)}`);
  }
}

function parseVariables(block, label) {
  if (!block) {
    errors.push(`${label} color token block is missing`);
    return {};
  }

  return Object.fromEntries(
    [...block.matchAll(/--([\w-]+):\s*(#[\da-fA-F]{6})\s*;/g)].map(
      ([, name, value]) => [name, value],
    ),
  );
}

function relativeLuminance(hex) {
  const channels = hex
    .slice(1)
    .match(/../g)
    .map((value) => Number.parseInt(value, 16) / 255)
    .map((value) =>
      value <= 0.04045 ? value / 12.92 : ((value + 0.055) / 1.055) ** 2.4,
    );

  return channels[0] * 0.2126 + channels[1] * 0.7152 + channels[2] * 0.0722;
}

function contrastRatio(foreground, background) {
  const foregroundLuminance = relativeLuminance(foreground);
  const backgroundLuminance = relativeLuminance(background);
  const lighter = Math.max(foregroundLuminance, backgroundLuminance);
  const darker = Math.min(foregroundLuminance, backgroundLuminance);
  return (lighter + 0.05) / (darker + 0.05);
}

function verifyContrast(theme, variables) {
  const checks = [
    ["text-primary", "background", 4.5],
    ["text-secondary", "background", 4.5],
    ["text-muted", "background", 4.5],
    ["text-muted", "surface-raised", 4.5],
    ["accent", "background", 3],
    ["button-primary-fg", "button-primary-bg", 4.5],
  ];

  for (const [foregroundName, backgroundName, minimum] of checks) {
    const foreground = variables[foregroundName];
    const background = variables[backgroundName];

    if (!foreground || !background) {
      errors.push(
        `${theme} contrast check is missing ${foregroundName} or ${backgroundName}`,
      );
      continue;
    }

    const ratio = contrastRatio(foreground, background);
    if (ratio < minimum) {
      errors.push(
        `${theme} ${foregroundName}/${backgroundName} contrast ${ratio.toFixed(2)} is below ${minimum.toFixed(1)}`,
      );
    }
  }
}

const routesFixture = readJson(
  "tests/application-readiness/fixtures/routes.json",
);
const routePaths = routesFixture.routes.map((route) => route.path);
if (new Set(routePaths).size !== routePaths.length) {
  errors.push("route fixture contains duplicate paths");
}

const sitemap = read("src/app/sitemap.ts");
for (const route of routesFixture.routes) {
  requireFile(route.pageFile, `${route.path} page`);
  requireFile(route.metadataFile, `${route.path} metadata owner`);

  if (route.path === "/") {
    const metadata = read(route.metadataFile);
    requireText(metadata, 'canonical: "/"', "homepage canonical");
    requireText(sitemap, "url: baseUrl", "homepage sitemap entry");
  } else {
    const metadata = read(route.metadataFile);
    requireText(
      metadata,
      `createRouteMetadata("${route.path}")`,
      `${route.path} metadata`,
    );
    requireText(
      sitemap,
      `\${baseUrl}${route.path}`,
      `${route.path} sitemap entry`,
    );
  }

  if (route.headingCheck === "static") {
    if (requireFile(route.headingFile, `${route.path} heading owner`)) {
      requireText(read(route.headingFile), "<h1", `${route.path} heading`);
    }
  } else {
    releaseChecks.push(
      `${route.path}: assert one non-empty h1 against the release deployment`,
    );
  }
}

const routeMetadata = read("src/config/route-metadata.ts");
for (const route of routesFixture.routes.filter(
  (candidate) => candidate.path !== "/",
)) {
  requireText(routeMetadata, `"${route.path}"`, "route metadata map");
}
requireText(routeMetadata, "alternates", "route metadata map");
requireText(routeMetadata, "openGraph", "route metadata map");
requireText(routeMetadata, "twitter", "route metadata map");

const layout = read("src/app/layout.tsx");
const homepageMain = read("src/features/landing/MainContent/MainContent.tsx");
const pageShell = read("src/components/ui/PageShell/PageShell.tsx");
const notFound = read("src/app/not-found.tsx");
const navBar = read("src/components/ui/NavBar/NavBar.tsx");
const scopeSelector = read(
  "src/features/github/components/GitHubScopeSelector/GitHubScopeSelector.tsx",
);

requireText(layout, "<SkipToContent", "root layout skip link");
requireText(homepageMain, 'id="main-content"', "homepage main landmark");
requireText(pageShell, 'id="main-content"', "subpage main landmark");
requireText(notFound, 'id="main-content"', "not-found main landmark");
requireText(navBar, "aria-label={ariaLabel}", "primary navigation");
requireText(scopeSelector, 'role="group"', "GitHub scope selector");
requireText(scopeSelector, "aria-pressed", "GitHub scope selector buttons");
rejectText(scopeSelector, 'role="tab"', "GitHub scope selector");

for (const route of [
  "development",
  "music",
  "publishing",
  "research",
  "insights",
]) {
  requireFile(`src/app/${route}/loading.tsx`, `/${route} loading state`);
}

const globals = read("src/app/globals.css");
requireText(globals, ":focus-visible", "global keyboard focus style");
requireText(
  globals,
  "@media (prefers-reduced-motion: reduce)",
  "global reduced-motion override",
);

const rootBlock = globals.match(/:root\s*{([\s\S]*?)\n}/)?.[1];
const lightBlock = globals.match(
  /\[data-theme="light"\]\s*{([\s\S]*?)\n}/,
)?.[1];
verifyContrast("dark", parseVariables(rootBlock, "dark"));
verifyContrast("light", parseVariables(lightBlock, "light"));

const apiFixture = readJson(
  "tests/application-readiness/fixtures/api-states.json",
);
const scenarios = new Map(
  apiFixture.scenarios.map((scenario) => [scenario.id, scenario]),
);
for (const requiredState of [
  "loading",
  "empty",
  "available",
  "stale",
  "last-known-good",
  "error",
]) {
  if (!scenarios.has(requiredState)) {
    errors.push(`remote-data fixture is missing ${requiredState}`);
  }
}

const lastKnownGood = scenarios.get("last-known-good");
if (
  lastKnownGood?.status !== "available" ||
  lastKnownGood?.freshness !== "stale" ||
  lastKnownGood?.source !== "last-known-good" ||
  !lastKnownGood?.hasData
) {
  errors.push("last-known-good must be available, stale, and backed by data");
}

const githubFallback = readJson(
  "src/features/github/data/github-fallback.json",
);
const githubService = read("src/features/github/lib/github-service.ts");
if (Number.isNaN(Date.parse(githubFallback.capturedAt))) {
  errors.push("GitHub fallback snapshot has an invalid capturedAt timestamp");
}
if ((githubFallback.scopes.egohygiene?.length ?? 0) < 4) {
  errors.push(
    "GitHub fallback snapshot is missing the selected public systems",
  );
}
requireText(
  githubService,
  "serving last-known-good data captured",
  "GitHub rate-limit fallback",
);
requireText(
  githubService,
  'data_source: repository._portfolio_source ?? "live"',
  "GitHub data source marker",
);
requireFile(
  "scripts/verify-github-fallback-build.mjs",
  "GitHub rate-limit build check",
);

const remoteDataTypes = read(
  "src/components/ui/RemoteDataStatus/RemoteDataStatus.types.ts",
);
const remoteDataStories = read(
  "src/components/ui/RemoteDataStatus/RemoteDataStatus.stories.tsx",
);
for (const value of [
  '"loading"',
  '"available"',
  '"empty"',
  '"error"',
  '"fresh"',
  '"stale"',
  '"last-known-good"',
]) {
  requireText(remoteDataTypes, value, "remote-data contract");
}
for (const scenario of apiFixture.scenarios.filter((item) => item.story)) {
  requireText(
    remoteDataStories,
    `export const ${scenario.story}`,
    `${scenario.id} state story`,
  );
}

const visualFixture = readJson(
  "tests/application-readiness/fixtures/visual-matrix.json",
);
if (!visualFixture.projects.some(({ viewport }) => viewport.width <= 320)) {
  errors.push("visual matrix is missing a 320px-or-smaller viewport");
}
if (!visualFixture.projects.some(({ viewport }) => viewport.width >= 1280)) {
  errors.push("visual matrix is missing a desktop viewport");
}
if (
  !visualFixture.projects.some(
    ({ reducedMotion }) => reducedMotion === "reduce",
  )
) {
  errors.push("visual matrix is missing reduced-motion coverage");
}

const destinations = readJson(
  "tests/application-readiness/fixtures/promoted-destinations.json",
);
for (const destination of [
  ...destinations.staticDestinations,
  ...destinations.dynamicDestinations,
]) {
  if (requireFile(destination.sourceFile, `${destination.id} source`)) {
    requireText(
      read(destination.sourceFile),
      destination.sourceToken,
      `${destination.id} destination contract`,
    );
  }
}

const theme = read("src/lib/theme.tsx");
const dateFormatter = read("src/lib/format-date.ts");
requireText(theme, "useSyncExternalStore", "hydration-safe theme state");
requireText(dateFormatter, 'timeZone: "UTC"', "deterministic date formatter");

for (const sourcePath of [
  "src/app/layout.tsx",
  "src/lib/theme.tsx",
  "src/features/music/components/MusicClient/MusicClient.tsx",
  "src/features/github/components/GitHubRepoCard/GitHubRepoCard.tsx",
  "src/features/github/components/GitHubConstellationScene/ConstellationScene.tsx",
]) {
  rejectText(read(sourcePath), "suppressHydrationWarning", sourcePath);
}

requireFile(
  "tests/application-readiness/browser/application-readiness.spec.mjs",
  "release browser suite",
);

if (errors.length > 0) {
  for (const error of errors) {
    console.error(`ERROR: ${error}`);
  }
  process.exitCode = 1;
} else {
  console.log(
    `Verified ${routesFixture.routes.length} recruiter-facing routes, accessible shell contracts, WCAG contrast tokens, six remote-data states, and the mobile release matrix.`,
  );
  for (const check of releaseChecks) {
    console.log(`RELEASE: ${check}`);
  }
}
