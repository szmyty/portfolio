"use client";

import { useMemo } from "react";
import * as THREE from "three";

/**
 * InfinityCurve
 *
 * Custom parametric curve representing a smooth infinity (lemniscate).
 *
 * We extend THREE.Curve so it can be fed into TubeGeometry.
 */
class InfinityCurve extends THREE.Curve<THREE.Vector3> {
  constructor(private scale = 1) {
    super();
  }

  getPoint(t: number) {
    const TWO_PI = Math.PI * 2;
    const angle = t * TWO_PI;

    const sin = Math.sin(angle);
    const cos = Math.cos(angle);

    /**
     * Bernoulli Lemniscate
     */
    const denom = 1 + sin * sin;

    const x = cos / denom;
    const y = (sin * cos) / denom;

    /**
     * Shape tuning
     */
    const horizontalScale = 2.2; // widen loops
    const verticalScale = 1.2;   // control height

    return new THREE.Vector3(
      x * horizontalScale,
      y * verticalScale,
      0
    ).multiplyScalar(this.scale);
  }
}

/**
 * InfinityGeometry
 *
 * TubeGeometry built along the custom InfinityCurve.
 *
 */
export function InfinityGeometry() {
  const geometry = useMemo(() => {
    const path = new InfinityCurve(1);

    return new THREE.TubeGeometry(
      path,
      200, // tubularSegments (smooth along curve)
      0.25, // radius (tube thickness)
      32, // radialSegments (smoothness of tube)
      true, // closed loop
    );
  }, []);

  return <primitive object={geometry} />;
}