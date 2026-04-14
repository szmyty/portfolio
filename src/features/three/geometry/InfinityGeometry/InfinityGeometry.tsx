"use client";

import { useMemo } from "react";
import * as THREE from "three";
import {
  getInfinityPoint,
  INFINITY_RADIAL_SEGMENTS,
  INFINITY_TUBE_RADIUS,
  INFINITY_TUBULAR_SEGMENTS,
} from "./infinityCurve";

/**
 * Custom parametric curve for a 3D lemniscate.
 *
 * The base shape uses the Gerono lemniscate in the XY plane. A localized Z
 * offset is then applied near the center so the two passes separate into a
 * readable over/under crossover instead of collapsing into one flat blob.
 */
class InfinityCurve extends THREE.Curve<THREE.Vector3> {
  constructor(private readonly scale = 1) {
    super();
  }

  getPoint(t: number) {
    return getInfinityPoint(t).multiplyScalar(this.scale);
  }
}

/**
 * InfinityGeometry
 *
 * TubeGeometry extruded along the 3D infinity curve.
 */
export function InfinityGeometry() {
  const geometry = useMemo(() => {
    const path = new InfinityCurve(1);

    return new THREE.TubeGeometry(
      path,
      INFINITY_TUBULAR_SEGMENTS,
      INFINITY_TUBE_RADIUS,
      INFINITY_RADIAL_SEGMENTS,
      true, // closed loop
    );
  }, []);

  return <primitive object={geometry} />;
}
