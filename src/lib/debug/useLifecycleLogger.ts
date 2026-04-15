"use client";

import { useCallback, useEffect, useMemo, useRef } from "react";
import { isDev } from "@portfolio/config";

type LogPayload =
  | string
  | number
  | boolean
  | null
  | undefined
  | Record<string, unknown>;

/**
 * Dev-only lifecycle logger for 3D objects/scenes.
 *
 * Gives us structured, namespaced logs like:
 * - [3D:FloppyDisk] mounted
 * - [3D:FloppyDisk] loader-resolved { children: 4 }
 * - [3D:FloppyDiskScene] webgl-context-lost
 */
export function useLifecycleLogger(name: string) {
  const loggedKeys = useRef<Set<string>>(new Set());

  const emit = useCallback(
    (stage: string, payload?: LogPayload) => {
      if (!isDev) return;

      const prefix = `[3D:${name}] ${stage}`;

      if (payload === undefined) {
        console.info(prefix);
        return;
      }

      console.info(prefix, payload);
    },
    [name],
  );

  const emitOnce = useCallback(
    (key: string, stage: string, payload?: LogPayload) => {
      if (loggedKeys.current.has(key)) return;
      loggedKeys.current.add(key);
      emit(stage, payload);
    },
    [emit],
  );

  useEffect(() => {
    emit("mounted");

    return () => {
      emit("unmounted");
    };
  }, [emit]);

  return useMemo(
    () => ({
      emit,
      emitOnce,
    }),
    [emit, emitOnce],
  );
}
