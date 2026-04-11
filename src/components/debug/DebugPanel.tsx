"use client";

import { useState } from "react";

interface DebugInfo {
  siteUrl: string;
  nextVersion: string;
  reactVersion: string;
  locale: string;
}

interface DebugPanelProps {
  info: DebugInfo;
}

export function DebugPanel({ info }: DebugPanelProps) {
  const [open, setOpen] = useState(false);

  return (
    <div className="fixed bottom-4 right-4 z-[9999] font-mono text-xs">
      <button
        onClick={() => setOpen((prev) => !prev)}
        aria-expanded={open}
        className="flex items-center gap-1.5 rounded-md bg-yellow-400/90 px-2.5 py-1.5 text-black shadow-md backdrop-blur-sm hover:bg-yellow-300 transition-colors duration-150"
      >
        <span aria-hidden="true">🐛</span>
        <span>debug</span>
      </button>

      {open && (
        <div
          role="region"
          aria-label="Debug information"
          className="mt-1.5 w-64 rounded-md border border-yellow-400/40 bg-black/85 px-4 py-3 text-yellow-300 shadow-xl backdrop-blur-sm"
        >
          <p className="mb-2 text-yellow-400 font-semibold uppercase tracking-wider text-[10px]">
            Dev Info
          </p>
          <dl className="space-y-1">
            <Row label="site" value={info.siteUrl} />
            <Row label="next" value={info.nextVersion} />
            <Row label="react" value={info.reactVersion} />
            <Row label="locale" value={info.locale} />
          </dl>
        </div>
      )}
    </div>
  );
}

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex gap-2">
      <dt className="text-yellow-500/70 shrink-0">{label}:</dt>
      <dd className="truncate text-yellow-200">{value}</dd>
    </div>
  );
}
