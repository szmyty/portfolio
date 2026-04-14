"use client";

import { useCallback, useEffect, useRef } from "react";
import { useFrame } from "@react-three/fiber";
import type { MeshStandardMaterial } from "three";
import type { ExtendedShader } from "../types";
import vertexBeginShader from "../shaders/infinityEnergy.vertex.begin.glsl";
import vertexCommonShader from "../shaders/infinityEnergy.vertex.common.glsl";
import fragmentColorShader from "../shaders/infinityEnergy.fragment.color.glsl";
import fragmentCommonShader from "../shaders/infinityEnergy.fragment.common.glsl";
import fragmentEmissiveShader from "../shaders/infinityEnergy.fragment.emissive.glsl";

type InfinityEnergyMaterialProps = {
  matRef?: React.Ref<MeshStandardMaterial>;
}

type InfinityUniforms = {
  uTime: { value: number };
}

/**
 * Shader-augmented physical material for the infinity ribbon.
 *
 * The material keeps Three's physically-based lighting model but replaces the
 * generic surface color with a GLSL-driven luminous ribbon treatment so the
 * object reads closer to the provided reference: deep core, bright fresnel rim,
 * and animated cyan/pink energy flowing across the loops.
 */
export function InfinityEnergyMaterial({
  matRef,
}: InfinityEnergyMaterialProps) {
  const localMatRef = useRef<MeshStandardMaterial>(null);
  const uniformsRef = useRef<InfinityUniforms | null>(null);

  const resolvedMatRef =
    (matRef as React.MutableRefObject<MeshStandardMaterial | null>) ??
    localMatRef;

  const onBeforeCompile = useCallback((shader: ExtendedShader) => {
    shader.uniforms.uTime = { value: 0 };
    uniformsRef.current = shader.uniforms as InfinityUniforms;

    shader.vertexShader = shader.vertexShader.replace(
      "#include <common>",
      `#include <common>
${vertexCommonShader}`,
    );

    shader.vertexShader = shader.vertexShader.replace(
      "#include <begin_vertex>",
      `#include <begin_vertex>
${vertexBeginShader}`,
    );

    shader.fragmentShader = shader.fragmentShader.replace(
      "#include <common>",
      `#include <common>
${fragmentCommonShader}`,
    );

    shader.fragmentShader = shader.fragmentShader.replace(
      "#include <color_fragment>",
      fragmentColorShader,
    );

    shader.fragmentShader = shader.fragmentShader.replace(
      "#include <emissivemap_fragment>",
      fragmentEmissiveShader,
    );
  }, []);

  useEffect(() => {
    if (!resolvedMatRef.current) return;

    resolvedMatRef.current.emissiveIntensity = 0.18;
  }, [resolvedMatRef]);

  useFrame((state) => {
    if (uniformsRef.current) {
      uniformsRef.current.uTime.value = state.clock.getElapsedTime();
    }
  });

  return (
    <meshPhysicalMaterial
      ref={resolvedMatRef}
      color="#120f2f"
      emissive="#8bdcff"
      emissiveIntensity={0.18}
      roughness={0.12}
      metalness={0.05}
      clearcoat={1}
      clearcoatRoughness={0.08}
      iridescence={0.35}
      iridescenceIOR={1.4}
      reflectivity={0.6}
      onBeforeCompile={onBeforeCompile}
      customProgramCacheKey={() => "infinity-energy-material-v1"}
    />
  );
}
