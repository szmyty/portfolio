"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { FlaskConical, ChevronDown, ChevronRight } from "lucide-react";
import { usePathname } from "next/navigation";
import { useTheme } from "@portfolio/lib/theme";
import {
  getDebugInteraction,
  type DebugInteractionData,
} from "@portfolio/lib/debug/debugStore";
import type { DebugPanelProps, SectionKey } from "./DebugPanel.types";

/* ─────────────────────────────────────────────── helpers ── */

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex gap-2 leading-relaxed">
      <dt className="text-emerald-400/60 shrink-0 min-w-[5.5rem]">{label}:</dt>
      <dd className="truncate text-emerald-200/90 font-mono text-[10px]">
        {value}
      </dd>
    </div>
  );
}

function Section({
  title,
  isOpen,
  onToggle,
  children,
}: {
  title: string;
  isOpen: boolean;
  onToggle: () => void;
  children: React.ReactNode;
}) {
  return (
    <div className="border-b border-emerald-900/40 last:border-0">
      <button
        type="button"
        onClick={onToggle}
        className="flex w-full items-center justify-between py-2 text-left text-emerald-300/80 hover:text-emerald-200 transition-colors duration-100"
      >
        <span className="text-[10px] font-semibold uppercase tracking-widest">
          {title}
        </span>
        {isOpen ? (
          <ChevronDown size={10} className="shrink-0" />
        ) : (
          <ChevronRight size={10} className="shrink-0" />
        )}
      </button>
      {isOpen && (
        <dl className="space-y-0.5 pb-2 text-[10px]">{children}</dl>
      )}
    </div>
  );
}

/* ─────────────────────────────────────────── device helpers ── */

function useDeviceInfo() {
  const [info, setInfo] = useState({
    width: 0,
    height: 0,
    deviceType: "—",
    pixelRatio: 1,
    userAgent: "—",
    touchSupport: false,
  });

  useEffect(() => {
    const update = () => {
      const w = window.innerWidth;
      const h = window.innerHeight;
      setInfo({
        width: w,
        height: h,
        deviceType: w < 768 ? "mobile" : "desktop",
        pixelRatio: window.devicePixelRatio,
        userAgent: navigator.userAgent,
        touchSupport:
          "ontouchstart" in window || navigator.maxTouchPoints > 0,
      });
    };
    update();
    window.addEventListener("resize", update);
    return () => window.removeEventListener("resize", update);
  }, []);

  return info;
}

/* ─────────────────────────────────────── performance helpers ── */

function useFrameTime() {
  const frameTime = useRef(0);
  const last = useRef(performance.now());
  const rafId = useRef<number>(0);
  const [display, setDisplay] = useState("—");

  useEffect(() => {
    let ticks = 0;
    const loop = (now: number) => {
      frameTime.current = now - last.current;
      last.current = now;
      ticks++;
      if (ticks % 30 === 0) {
        setDisplay(`${frameTime.current.toFixed(1)} ms`);
      }
      rafId.current = requestAnimationFrame(loop);
    };
    rafId.current = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(rafId.current);
  }, []);

  return display;
}

/* ─────────────────────────────────────────────── main panel ── */

export function DebugPanel({ info }: DebugPanelProps) {
  const [panelOpen, setPanelOpen] = useState(false);
  const [sections, setSections] = useState<Record<SectionKey, boolean>>({
    interaction: true,
    device: true,
    environment: false,
    performance: false,
    theme: false,
  });

  const [interaction, setInteraction] = useState<DebugInteractionData>({
    interactionState: "idle",
    isHovered: false,
  });

  const device = useDeviceInfo();
  const frameTime = useFrameTime();
  const { theme, resolvedTheme } = useTheme();
  const pathname = usePathname();

  /* Poll debug store for real-time 3D interaction data */
  useEffect(() => {
    if (!panelOpen) return;
    const id = setInterval(() => {
      setInteraction(getDebugInteraction());
    }, 120);
    return () => clearInterval(id);
  }, [panelOpen]);

  const toggleSection = useCallback((key: SectionKey) => {
    setSections((prev) => ({ ...prev, [key]: !prev[key] }));
  }, []);

  return (
    /* Outer shell: pointer-events none so the panel never blocks canvas interaction */
    <div
      className="fixed top-0 right-0 z-[9999] pointer-events-none"
      aria-hidden={!panelOpen}
    >
      {/* Toggle handle — always visible, always interactive */}
      <button
        type="button"
        onClick={() => setPanelOpen((v) => !v)}
        aria-expanded={panelOpen}
        aria-label="Toggle debug panel"
        className={[
          "pointer-events-auto",
          "absolute top-4 right-4",
          "flex items-center gap-1.5",
          "rounded-lg px-2.5 py-1.5",
          "text-[11px] font-semibold font-mono",
          "shadow-lg backdrop-blur-md transition-all duration-200",
          panelOpen
            ? "bg-emerald-500/20 border border-emerald-500/40 text-emerald-300"
            : "bg-black/60 border border-white/10 text-white/60 hover:text-white/90 hover:bg-black/80",
        ].join(" ")}
      >
        <FlaskConical size={13} />
        <span>debug</span>
      </button>

      {/* Sliding panel */}
      <div
        role="region"
        aria-label="Debug panel"
        style={{
          transform: panelOpen ? "translateX(0)" : "translateX(calc(100% + 1rem))",
          transition: "transform 300ms cubic-bezier(0.4, 0, 0.2, 1)",
        }}
        className={[
          "pointer-events-auto",
          "absolute top-14 right-4",
          "w-72 max-h-[calc(100vh-6rem)]",
          "overflow-y-auto overscroll-contain",
          "rounded-xl border border-white/10",
          "bg-black/80 backdrop-blur-xl",
          "shadow-2xl shadow-black/40",
          "px-3 py-2 font-mono text-[10px]",
          "text-emerald-200",
        ].join(" ")}
      >
        {/* Panel header */}
        <p className="mb-2 text-[9px] font-semibold uppercase tracking-[0.15em] text-emerald-400/50 select-none">
          Developer Debug
        </p>

        {/* ── Interaction ── */}
        <Section
          title="Interaction"
          isOpen={sections.interaction}
          onToggle={() => toggleSection("interaction")}
        >
          <Row
            label="state"
            value={interaction.interactionState}
          />
          <Row
            label="hovered"
            value={interaction.isHovered ? "yes" : "no"}
          />
          <Row label="drag" value={interaction.interactionState === "engaged" ? "active" : "inactive"} />
        </Section>

        {/* ── Device Info ── */}
        <Section
          title="Device Info"
          isOpen={sections.device}
          onToggle={() => toggleSection("device")}
        >
          <Row label="viewport" value={`${device.width} × ${device.height}`} />
          <Row label="type" value={device.deviceType} />
          <Row label="pixel ratio" value={String(device.pixelRatio)} />
          <Row label="touch" value={device.touchSupport ? "yes" : "no"} />
          <Row label="UA" value={device.userAgent} />
        </Section>

        {/* ── Environment ── */}
        <Section
          title="Environment"
          isOpen={sections.environment}
          onToggle={() => toggleSection("environment")}
        >
          <Row label="NODE_ENV" value={info.nodeEnv} />
          <Row label="Next.js" value={info.nextVersion} />
          <Row label="React" value={info.reactVersion} />
          <Row label="route" value={pathname ?? "—"} />
          <Row label="locale" value={info.locale} />
          <Row label="base URL" value={info.siteUrl} />
        </Section>

        {/* ── Performance ── */}
        <Section
          title="Performance"
          isOpen={sections.performance}
          onToggle={() => toggleSection("performance")}
        >
          <Row label="frame time" value={frameTime} />
          <Row label="target fps" value="60" />
        </Section>

        {/* ── Visual / Theme ── */}
        <Section
          title="Visual / Theme"
          isOpen={sections.theme}
          onToggle={() => toggleSection("theme")}
        >
          <Row label="preference" value={theme} />
          <Row label="resolved" value={resolvedTheme} />
        </Section>
      </div>
    </div>
  );
}
