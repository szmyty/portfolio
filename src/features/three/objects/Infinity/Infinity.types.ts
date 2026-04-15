import type { ComponentType, ReactNode } from "react";
import type { MeshStandardMaterial } from "three";

export type InfinityProps = {
  GeometryComponent?: ComponentType;
  MaterialComponent?: ComponentType<{ matRef?: React.Ref<MeshStandardMaterial> }>;
  effects?: { glow?: boolean; particles?: boolean; rotation?: boolean };
  position?: [number, number, number];
  children?: ReactNode;
};
