"use client";

export type SectionVisualKind = "vinyl" | "magazine" | "floppy";

type SectionVisualSlot = {
  id: string;
  kind: SectionVisualKind;
  element: HTMLDivElement | null;
  isVisible: boolean;
  intersectionRatio: number;
  lastVisibleAt: number;
};

type SectionVisualSnapshot = {
  activeId: string | null;
  activeKind: SectionVisualKind | null;
  activeElement: HTMLDivElement | null;
};

const slots = new Map<string, SectionVisualSlot>();
const listeners = new Set<() => void>();
let cachedSnapshot: SectionVisualSnapshot = {
  activeId: null,
  activeKind: null,
  activeElement: null,
};

function emitChange() {
  listeners.forEach((listener) => listener());
}

function getActiveSlot(): SectionVisualSlot | null {
  const visibleSlots = Array.from(slots.values()).filter(
    (slot) => slot.isVisible && slot.element,
  );

  if (visibleSlots.length === 0) {
    return null;
  }

  visibleSlots.sort((a, b) => {
    if (b.intersectionRatio !== a.intersectionRatio) {
      return b.intersectionRatio - a.intersectionRatio;
    }

    return b.lastVisibleAt - a.lastVisibleAt;
  });

  const candidate = visibleSlots[0] ?? null;
  if (!candidate) return null;

  const currentActive = cachedSnapshot.activeId
    ? slots.get(cachedSnapshot.activeId) ?? null
    : null;

  if (
    currentActive &&
    currentActive.isVisible &&
    currentActive.element &&
    currentActive.kind === cachedSnapshot.activeKind &&
    currentActive.intersectionRatio >= candidate.intersectionRatio - 0.18
  ) {
    return currentActive;
  }

  return candidate;
}

export function subscribeSectionVisualStore(listener: () => void) {
  listeners.add(listener);

  return () => {
    listeners.delete(listener);
  };
}

export function getSectionVisualSnapshot(): SectionVisualSnapshot {
  const activeSlot = getActiveSlot();
  const nextSnapshot: SectionVisualSnapshot = {
    activeId: activeSlot?.id ?? null,
    activeKind: activeSlot?.kind ?? null,
    activeElement: activeSlot?.element ?? null,
  };

  if (
    cachedSnapshot.activeId === nextSnapshot.activeId &&
    cachedSnapshot.activeKind === nextSnapshot.activeKind &&
    cachedSnapshot.activeElement === nextSnapshot.activeElement
  ) {
    return cachedSnapshot;
  }

  cachedSnapshot = nextSnapshot;
  return cachedSnapshot;
}

export function registerSectionVisualSlot(
  id: string,
  kind: SectionVisualKind,
  element: HTMLDivElement | null,
) {
  const existing = slots.get(id);

  slots.set(id, {
    id,
    kind,
    element,
    isVisible: existing?.isVisible ?? false,
    intersectionRatio: existing?.intersectionRatio ?? 0,
    lastVisibleAt: existing?.lastVisibleAt ?? 0,
  });

  emitChange();
}

export function unregisterSectionVisualSlot(id: string) {
  slots.delete(id);
  emitChange();
}

export function updateSectionVisualVisibility(
  id: string,
  isVisible: boolean,
  intersectionRatio: number,
) {
  const slot = slots.get(id);
  if (!slot) return;

  slot.isVisible = isVisible;
  slot.intersectionRatio = intersectionRatio;
  if (isVisible) {
    slot.lastVisibleAt = performance.now();
  }

  emitChange();
}
