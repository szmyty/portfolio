import type { ComponentType } from "react";
import type { MeshStandardMaterial } from "three";

export type VinylRecordProps = {
  GeometryComponent?: ComponentType;
  MaterialComponent?: ComponentType<{ matRef?: React.Ref<MeshStandardMaterial> }>;
  effects?: { rotation?: boolean };
};
