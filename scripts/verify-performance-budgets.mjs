import { readFile, readdir, stat } from "node:fs/promises";
import { extname, join, relative, resolve } from "node:path";

const root = process.cwd();
const budgets = JSON.parse(
  await readFile(resolve(root, "budgets/performance.json"), "utf8"),
);

async function walkFiles(directory) {
  const entries = await readdir(directory, { withFileTypes: true });
  const paths = [];

  for (const entry of entries) {
    const path = join(directory, entry.name);
    if (entry.isDirectory()) paths.push(...(await walkFiles(path)));
    if (entry.isFile()) paths.push(path);
  }

  return paths;
}

async function readSource(path) {
  return readFile(resolve(root, path), "utf8");
}

function countMatches(source, pattern) {
  return source.match(pattern)?.length ?? 0;
}

const errors = [];
const publicRoot = resolve(root, "public");
const publicFiles = await walkFiles(publicRoot);
const assetStats = await Promise.all(
  publicFiles.map(async (path) => ({
    path: relative(root, path),
    bytes: (await stat(path)).size,
  })),
);

const totalPublicBytes = assetStats.reduce(
  (total, asset) => total + asset.bytes,
  0,
);
const largestAsset = assetStats.reduce(
  (largest, asset) => (asset.bytes > largest.bytes ? asset : largest),
  { path: "none", bytes: 0 },
);

if (totalPublicBytes > budgets.maxTrackedPublicBytes) {
  errors.push(
    `tracked public assets total ${totalPublicBytes} bytes; budget is ${budgets.maxTrackedPublicBytes}`,
  );
}

for (const asset of assetStats) {
  if (asset.bytes > budgets.maxSinglePublicAssetBytes) {
    errors.push(
      `${asset.path} is ${asset.bytes} bytes; per-asset budget is ${budgets.maxSinglePublicAssetBytes}`,
    );
  }

  if (
    budgets.forbiddenPublicExtensions.includes(
      extname(asset.path).toLowerCase(),
    )
  ) {
    errors.push(`${asset.path} uses a forbidden heavyweight asset extension`);
  }
}

let homepageCanvasContexts = 0;
for (const owner of budgets.homepageCanvasOwners) {
  homepageCanvasContexts += countMatches(await readSource(owner), /<Canvas\b/g);
}

if (homepageCanvasContexts > budgets.maxHomepageCanvasContexts) {
  errors.push(
    `homepage can mount ${homepageCanvasContexts} Canvas contexts; budget is ${budgets.maxHomepageCanvasContexts}`,
  );
}

const galaxy = await readSource(
  "src/components/ui/GalaxyBackground/GalaxyBackground.tsx",
);
if (/Canvas|EXRLoader|galaxy\.exr/.test(galaxy)) {
  errors.push("sub-page atmosphere depends on Canvas or the retired EXR asset");
}

const sectionTarget = await readSource(
  "src/features/landing/sections/shared/SectionVisualTarget.tsx",
);
for (const marker of [
  "useVisualInView",
  "registerSectionVisualSlot",
  "unregisterSectionVisualSlot",
]) {
  if (!sectionTarget.includes(marker)) {
    errors.push(`section visual target is missing lifecycle marker: ${marker}`);
  }
}
if (/<Canvas\b|Scene\b/.test(sectionTarget)) {
  errors.push(
    "individual below-fold visual targets must not own Canvas or scene instances",
  );
}

const sharedCanvas = await readSource(
  "src/features/landing/sections/shared/SharedSectionVisualCanvas.tsx",
);
const sectionCanvasContexts = countMatches(sharedCanvas, /<Canvas\b/g);
if (sectionCanvasContexts > budgets.maxSectionCanvasContexts) {
  errors.push(
    `section visuals define ${sectionCanvasContexts} Canvas contexts; budget is ${budgets.maxSectionCanvasContexts}`,
  );
}
for (const marker of [
  "useReducedMotion",
  "supportsWebGL",
  "shouldMountCanvas",
  "SectionCanvasBoundary",
  "webglcontextlost",
  "data-canvas-budget",
]) {
  if (!sharedCanvas.includes(marker)) {
    errors.push(`shared Canvas is missing fallback marker: ${marker}`);
  }
}

const landingBackground = await readSource(
  "src/features/landing/LandingBackground/LandingBackground.tsx",
);
if (
  !landingBackground.includes("useVisualInView") ||
  !landingBackground.includes("data-visual-mode={displayVisualMode}")
) {
  errors.push("hero Canvas is not governed by near-viewport visibility");
}

const magazine = await readSource(
  "src/features/three/objects/Magazine/Magazine.tsx",
);
if (/preload\s*=\s*["']auto["']/.test(magazine)) {
  errors.push("magazine video uses eager preload=auto");
}
if (!magazine.includes('video.preload = "metadata"')) {
  errors.push(
    "magazine video must limit preload to metadata while near the viewport",
  );
}

const musicClient = await readSource(
  "src/features/music/components/MusicClient/MusicClient.tsx",
);
if (!musicClient.includes('preload="none"')) {
  errors.push("music player must not preload an unplayed remote track");
}

if (errors.length > 0) {
  console.error("Performance budget contract failed:");
  for (const error of errors) console.error(`- ${error}`);
  process.exit(1);
}

console.log("Performance budget contract passed.");
console.log(`- tracked public assets: ${totalPublicBytes} bytes`);
console.log(
  `- largest public asset: ${largestAsset.path} (${largestAsset.bytes} bytes)`,
);
console.log(
  `- homepage Canvas budget: ${homepageCanvasContexts}/${budgets.maxHomepageCanvasContexts}`,
);
console.log(
  `- below-fold Canvas budget: ${sectionCanvasContexts}/${budgets.maxSectionCanvasContexts}`,
);
