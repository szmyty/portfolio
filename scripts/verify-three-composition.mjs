import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { join } from "node:path";
import { Box3, Vector3 } from "three";
import { OBJLoader } from "three/examples/jsm/loaders/OBJLoader.js";

import {
  getPerspectiveCameraFitDistanceToSphere,
  getRotationSafeRadius,
} from "../src/features/three/lib/perspectiveCameraFit.mjs";
import {
  FLOPPY_CAMERA_FOV,
  FLOPPY_CAMERA_PADDING_RATIO,
  FLOPPY_TARGET_SIZE,
} from "../src/features/three/lib/floppyPresentation.mjs";
import {
  getInfinityCoordinates,
  getInfinityVisualScale,
  INFINITY_CROSSOVER_DEPTH,
  INFINITY_CURVE_WIDTH,
  INFINITY_TUBE_RADIUS,
  INFINITY_VISUAL_WIDTH,
} from "../src/features/three/geometry/InfinityGeometry/infinityComposition.mjs";

const root = process.cwd();
const epsilon = 1e-6;

function approximatelyEqual(left, right, tolerance = epsilon) {
  return Math.abs(left - right) <= tolerance;
}

function toVector3(coordinates) {
  return new Vector3(...coordinates);
}

function assertVectorClose(left, right, label) {
  assert.ok(toVector3(left).distanceTo(toVector3(right)) <= epsilon, label);
}

const seamStart = getInfinityCoordinates(0);
const seamEnd = getInfinityCoordinates(1);
assertVectorClose(seamStart, seamEnd, "infinity path must close exactly");
assert.ok(
  approximatelyEqual(seamStart[0], INFINITY_CURVE_WIDTH),
  "closed-loop frame seam must live at the outer extremum",
);

const tangentEpsilon = 0.0001;
const seamStartVector = toVector3(seamStart);
const seamEndVector = toVector3(seamEnd);
const startTangent = toVector3(getInfinityCoordinates(tangentEpsilon))
  .sub(seamStartVector)
  .normalize();
const endTangent = seamEndVector
  .sub(toVector3(getInfinityCoordinates(1 - tangentEpsilon)))
  .normalize();
assert.ok(
  startTangent.dot(endTangent) > 0.999,
  "infinity tangent must remain continuous across the closed-loop seam",
);

const crossoverFront = toVector3(getInfinityCoordinates(0.75));
const crossoverBack = toVector3(getInfinityCoordinates(0.25));
assert.ok(
  crossoverFront.distanceTo(crossoverBack) > INFINITY_TUBE_RADIUS * 2,
  "crossover passes must remain physically separated",
);
assert.ok(
  approximatelyEqual(
    crossoverFront.z - crossoverBack.z,
    INFINITY_CROSSOVER_DEPTH * 2,
  ),
  "crossover depth must remain symmetric",
);

const heroCameraDistance = 4;
const heroVerticalFovRadians = (50 * Math.PI) / 180;
for (const [width, height] of [
  [360, 740],
  [390, 844],
  [412, 915],
]) {
  const viewportHeight =
    2 * heroCameraDistance * Math.tan(heroVerticalFovRadians / 2);
  const viewportWidth = viewportHeight * (width / height);
  const scale = getInfinityVisualScale(viewportWidth, viewportHeight);
  const footprintFraction = (INFINITY_VISUAL_WIDTH * scale) / viewportWidth;
  const cssMargin = (width * (1 - footprintFraction)) / 2;

  assert.ok(
    cssMargin >= 24,
    `infinity footprint needs 24px breathing room at ${width}x${height}`,
  );
}

const heroSource = readFileSync(
  join(root, "src/features/landing/sections/HeroSection/HeroSection.tsx"),
  "utf8",
);
assert.ok(heroSource.includes("hero-infinity-slot"));
assert.ok(heroSource.includes("hero-infinity-fallback"));
assert.ok(
  heroSource.indexOf("hero-infinity-slot") <
    heroSource.indexOf("button-primary"),
  "the reserved infinity slot must precede the CTA row",
);

const floppySource = readFileSync(
  join(root, "public/models/floppy-disk.obj"),
  "utf8",
);
const floppy = new OBJLoader().parse(floppySource);
floppy.updateMatrixWorld(true);
const rawSize = new Box3().setFromObject(floppy).getSize(new Vector3());
const normalizationScale =
  FLOPPY_TARGET_SIZE / Math.max(rawSize.x, rawSize.y, rawSize.z);
const measuredSize = {
  width: rawSize.x * normalizationScale,
  height: rawSize.y * normalizationScale,
  depth: rawSize.z * normalizationScale,
};
const rotationSafeRadius = getRotationSafeRadius(measuredSize);
const fittedDistances = [];

for (const [width, height] of [
  [248, 300],
  [280, 300],
  [312, 300],
  [412, 240],
]) {
  const aspect = width / height;
  const distance = getPerspectiveCameraFitDistanceToSphere({
    radius: rotationSafeRadius,
    aspect,
    verticalFovDegrees: FLOPPY_CAMERA_FOV,
    paddingRatio: FLOPPY_CAMERA_PADDING_RATIO,
  });
  fittedDistances.push(distance);

  const verticalFovRadians = (FLOPPY_CAMERA_FOV * Math.PI) / 180;
  const verticalHalfFov = verticalFovRadians / 2;
  const horizontalHalfFov = Math.atan(Math.tan(verticalHalfFov) * aspect);
  const limitingHalfFov = Math.min(verticalHalfFov, horizontalHalfFov);
  const angularRadius = Math.asin(rotationSafeRadius / distance);

  assert.ok(
    angularRadius < limitingHalfFov,
    `rotation-safe floppy sphere must fit at ${width}x${height}`,
  );
}

assert.notEqual(
  fittedDistances[0],
  fittedDistances.at(-1),
  "camera distance must respond to viewport aspect rather than stay fixed",
);

console.log(
  "Verified infinity seam/crossover/footprint and measured floppy camera fit across portrait and landscape slots.",
);
