export type ObjectSize = {
  width: number;
  height: number;
  depth: number;
};

export type PerspectiveCameraFitOptions = {
  size: ObjectSize;
  aspect: number;
  verticalFovDegrees: number;
  paddingRatio?: number;
};

export function getRotationSafeSize(size: ObjectSize): ObjectSize;
export function getRotationSafeRadius(size: ObjectSize): number;
export function getPerspectiveCameraFitDistance(
  options: PerspectiveCameraFitOptions,
): number;
export function getPerspectiveCameraFitDistanceToSphere(options: {
  radius: number;
  aspect: number;
  verticalFovDegrees: number;
  paddingRatio?: number;
}): number;
