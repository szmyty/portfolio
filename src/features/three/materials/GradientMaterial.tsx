"use client";

import { useCallback, useRef, useEffect } from "react";
import { useFrame } from "@react-three/fiber";
import type { MeshStandardMaterial } from "three";
import { buildGradientFragmentShader } from "./shaders/gradientShader";

export type GradientMaterialProps = {
  matRef?: React.Ref<MeshStandardMaterial>;
  colors?: [string, string, string];
  energyColor?: string;
  flowSpeed?: number;
  flowIntensity?: number;
}

export function GradientMaterial({
  matRef,
  colors = ["#6366f1", "#a855f7", "#06b6d4"],
  energyColor = "#8be9fd",
  flowSpeed = 1.0,
  flowIntensity = 1.0,
}: GradientMaterialProps) {
  const uniformsRef = useRef<{ uTime: { value: number } } | null>(null);
  const localMatRef = useRef<MeshStandardMaterial>(null);

  const resolvedMatRef =
    (matRef as React.MutableRefObject<MeshStandardMaterial | null>) ??
    localMatRef;

  /**
   * Converts hex → GLSL vec3
   */
  const hexToVec3 = (hex: string) => {
    const r = parseInt(hex.slice(1, 3), 16) / 255;
    const g = parseInt(hex.slice(3, 5), 16) / 255;
    const b = parseInt(hex.slice(5, 7), 16) / 255;
    return `vec3(${r.toFixed(3)}, ${g.toFixed(3)}, ${b.toFixed(3)})`;
  };

  const colorA = hexToVec3(colors[0]);
  const colorB = hexToVec3(colors[1]);
  const colorC = hexToVec3(colors[2]);
  const energy = hexToVec3(energyColor);

  const onBeforeCompile = useCallback(
    (shader: {
      vertexShader: string;
      fragmentShader: string;
      uniforms: Record<string, { value: unknown }>;
    }) => {
      shader.uniforms.uTime = { value: 0 };
      uniformsRef.current = shader.uniforms as {
        uTime: { value: number };
      };

      /**
       * Vertex injection
       */
      shader.vertexShader = shader.vertexShader.replace(
        "#include <common>",
        `#include <common>
varying float vGradientY;
varying vec3 vLocalPos;`,
      );

      shader.vertexShader = shader.vertexShader.replace(
        "#include <begin_vertex>",
        `#include <begin_vertex>
vGradientY = position.y;
vLocalPos = position;`,
      );

      /**
       * Fragment injection
       */
      shader.fragmentShader = shader.fragmentShader.replace(
        "#include <common>",
        `#include <common>
uniform float uTime;
varying float vGradientY;
varying vec3 vLocalPos;`,
      );

      shader.fragmentShader = shader.fragmentShader.replace(
        "#include <color_fragment>",
        buildGradientFragmentShader({
          colorA,
          colorB,
          colorC,
          energy,
          flowSpeed,
          flowIntensity,
        }),
      );
    },
    [colorA, colorB, colorC, energy, flowSpeed, flowIntensity],
  );

  /**
   * Initialize emissive once
   */
  useEffect(() => {
    if (!resolvedMatRef.current) return;
    resolvedMatRef.current.emissiveIntensity = 0.15;
  }, [resolvedMatRef]);

  /**
   * Animate shader time
   */
  useFrame(({ clock }) => {
    if (uniformsRef.current) {
      uniformsRef.current.uTime.value = clock.getElapsedTime();
    }
  });

  return (
    <meshStandardMaterial
      ref={resolvedMatRef}
      roughness={0.3}
      metalness={0.7}
      emissive={energyColor}
      onBeforeCompile={onBeforeCompile}
    />
  );
}