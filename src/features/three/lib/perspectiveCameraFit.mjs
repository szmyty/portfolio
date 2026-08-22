const MIN_ASPECT = 0.01;
const MIN_FOV_DEGREES = 1;
const MAX_FOV_DEGREES = 179;

/**
 * Converts measured object bounds into a rotation-safe cube.
 *
 * The floppy remains draggable, so its presentation envelope cannot be
 * represented by the idle box alone. The bounding-sphere diameter preserves
 * the measured geometry while guaranteeing that any supported rotation stays
 * inside the fitted frame.
 */
export function getRotationSafeSize(size) {
  const diameter = Math.hypot(size.width, size.height, size.depth);

  return {
    width: diameter,
    height: diameter,
    depth: diameter,
  };
}

export function getRotationSafeRadius(size) {
  return Math.hypot(size.width, size.height, size.depth) / 2;
}

/**
 * Calculates a perspective-camera distance from measured bounds.
 *
 * Both vertical and horizontal FOV constrain the fit. Half the object depth is
 * added after the angular calculation so the front-most point, rather than the
 * object origin, owns the requested safety margin.
 */
export function getPerspectiveCameraFitDistance({
  size,
  aspect,
  verticalFovDegrees,
  paddingRatio = 1.15,
}) {
  const safeAspect = Math.max(aspect, MIN_ASPECT);
  const safeFov = Math.min(
    Math.max(verticalFovDegrees, MIN_FOV_DEGREES),
    MAX_FOV_DEGREES,
  );
  const verticalFovRadians = (safeFov * Math.PI) / 180;
  const horizontalFovRadians =
    2 * Math.atan(Math.tan(verticalFovRadians / 2) * safeAspect);
  const paddedHalfHeight = (size.height * paddingRatio) / 2;
  const paddedHalfWidth = (size.width * paddingRatio) / 2;
  const verticalDistance = paddedHalfHeight / Math.tan(verticalFovRadians / 2);
  const horizontalDistance =
    paddedHalfWidth / Math.tan(horizontalFovRadians / 2);

  return Math.max(verticalDistance, horizontalDistance) + size.depth / 2;
}

/** Fits a rotation-safe bounding sphere without inflating it into a cube. */
export function getPerspectiveCameraFitDistanceToSphere({
  radius,
  aspect,
  verticalFovDegrees,
  paddingRatio = 1.15,
}) {
  const safeAspect = Math.max(aspect, MIN_ASPECT);
  const safeFov = Math.min(
    Math.max(verticalFovDegrees, MIN_FOV_DEGREES),
    MAX_FOV_DEGREES,
  );
  const verticalHalfFov = (safeFov * Math.PI) / 180 / 2;
  const horizontalHalfFov = Math.atan(Math.tan(verticalHalfFov) * safeAspect);
  const limitingHalfFov = Math.min(verticalHalfFov, horizontalHalfFov);

  return (radius * paddingRatio) / Math.sin(limitingHalfFov);
}
