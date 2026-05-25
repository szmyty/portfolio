"use client";

export type SectionVisualKind = "vinyl" | "magazine" | "floppy";

type SectionVisualSlot = {
  id: string;
  kind: SectionVisualKind;
  element: HTMLDivElement | null;
};

type SectionVisualSnapshot = {
  activeId: string | null;
  activeKind: SectionVisualKind | null;
  activeElement: HTMLDivElement | null;
  lastActiveKind: SectionVisualKind;
};

const slots = new Map<string, SectionVisualSlot>();
const listeners = new Set<() => void>();
let cachedSnapshot: SectionVisualSnapshot = {
  activeId: null,
  activeKind: null,
  activeElement: null,
  lastActiveKind: "vinyl",
};

function emitChange() {
  listeners.forEach((listener) => listener());
}

function getViewportMetrics() {
  if (typeof window === "undefined") {
    return {
      width: 0,
      height: 0,
      centerX: 0,
      centerY: 0,
    };
  }

  return {
    width: window.innerWidth,
    height: window.innerHeight,
    centerX: window.innerWidth / 2,
    centerY: window.innerHeight / 2,
  };
}

function getVisibleRatio(rect: DOMRect, viewportWidth: number, viewportHeight: number) {
  const visibleWidth =
    Math.max(0, Math.min(rect.right, viewportWidth) - Math.max(rect.left, 0));
  const visibleHeight =
    Math.max(0, Math.min(rect.bottom, viewportHeight) - Math.max(rect.top, 0));
  const visibleArea = visibleWidth * visibleHeight;
  const totalArea = Math.max(rect.width * rect.height, 1);

  return visibleArea / totalArea;
}

function getActiveSlot(): SectionVisualSlot | null {
  const availableSlots = Array.from(slots.values()).filter((slot) => slot.element);

  if (availableSlots.length === 0) {
    return null;
  }

  const viewport = getViewportMetrics();
  const rankedSlots = availableSlots.map((slot) => {
    const rect = slot.element?.getBoundingClientRect();
    if (!rect) {
      return {
        slot,
        visibleRatio: -1,
        centerDistance: Number.POSITIVE_INFINITY,
      };
    }

    const visibleRatio = getVisibleRatio(rect, viewport.width, viewport.height);
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;
    const centerDistance = Math.hypot(
      centerX - viewport.centerX,
      centerY - viewport.centerY,
    );

    return {
      slot,
      visibleRatio,
      centerDistance,
    };
  });

  rankedSlots.sort((left, right) => {
    if (right.visibleRatio !== left.visibleRatio) {
      return right.visibleRatio - left.visibleRatio;
    }

    return left.centerDistance - right.centerDistance;
  });

  const candidate = rankedSlots[0]?.slot ?? null;
  if (!candidate) return null;

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
    lastActiveKind: activeSlot?.kind ?? cachedSnapshot.lastActiveKind,
  };

  if (
    cachedSnapshot.activeId === nextSnapshot.activeId &&
    cachedSnapshot.activeKind === nextSnapshot.activeKind &&
    cachedSnapshot.activeElement === nextSnapshot.activeElement &&
    cachedSnapshot.lastActiveKind === nextSnapshot.lastActiveKind
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
  });

  emitChange();
}

export function unregisterSectionVisualSlot(id: string) {
  slots.delete(id);
  emitChange();
}

export function notifySectionVisualLayoutChange() {
  emitChange();
}
