"use client";

import { useEffect } from "react";
import { useSelector } from "react-redux";
import { ResponsiveContainer, Tooltip, Treemap } from "recharts";
import {
  logGitHubDebug,
  logGitHubLifecycle,
} from "@portfolio/features/github/lib/github-debug";
import { selectGlobalLanguageTreemapData } from "@portfolio/features/github/store/github.selectors";
import type { GitHubState } from "@portfolio/features/github/store/github.slice";
import type { GitHubTechTreemapProps } from "./GitHubTechTreemap.types";

type GitHubStoreState = {
  github: GitHubState;
};

type TreemapContentProps = {
  x?: number;
  y?: number;
  width?: number;
  height?: number;
  name?: string;
  fill?: string;
};

function TreemapCell({ x = 0, y = 0, width = 0, height = 0, name = "", fill = "#888" }: TreemapContentProps) {
  const fontSize = Math.max(9, Math.min(14, width / 6));
  const showLabel = width > 40 && height > 28;

  return (
    <g>
      <rect
        x={x + 1}
        y={y + 1}
        width={width - 2}
        height={height - 2}
        rx={6}
        ry={6}
        style={{
          fill,
          fillOpacity: 0.82,
          stroke: "var(--background)",
          strokeWidth: 2,
        }}
      />
      {showLabel && (
        <text
          x={x + width / 2}
          y={y + height / 2}
          textAnchor="middle"
          dominantBaseline="middle"
          style={{
            fontSize,
            fontWeight: 600,
            fill: "#ffffff",
            pointerEvents: "none",
            textShadow: "0 1px 3px rgba(0,0,0,0.7)",
          }}
        >
          {name}
        </text>
      )}
    </g>
  );
}

export function GitHubTechTreemap(_props: GitHubTechTreemapProps) {
  const treemapData = useSelector((state: GitHubStoreState) =>
    selectGlobalLanguageTreemapData(state),
  );

  useEffect(() => {
    logGitHubLifecycle("GitHubTechTreemap");
  }, []);

  useEffect(() => {
    logGitHubDebug("Tech treemap data:", treemapData);
  }, [treemapData]);

  if (!treemapData.length) {
    return null;
  }

  return (
    <div className="flex h-full min-w-0 flex-col rounded-3xl border border-border bg-surface px-5 py-6 shadow-sm sm:px-6 sm:py-7">
      <div className="mb-5 flex items-start justify-between gap-4">
        <div>
          <h3 className="text-xl font-semibold tracking-tight text-text-primary">
            Technology Landscape
          </h3>
          <p className="mt-1 text-sm text-text-muted">
            Language distribution across all repositories.
          </p>
        </div>
      </div>

      <div className="h-[320px] w-full min-w-0">
        <ResponsiveContainer width="100%" height={320} minWidth={0}>
          <Treemap
            data={treemapData}
            dataKey="size"
            nameKey="name"
            isAnimationActive
            animationDuration={500}
            content={<TreemapCell />}
          >
            <Tooltip
              formatter={(value) => [`${value ?? 0} repositories`, ""]}
              contentStyle={{
                borderRadius: "16px",
                border: "1px solid var(--border)",
                background: "color-mix(in srgb, var(--surface) 92%, transparent)",
                color: "var(--text-primary)",
              }}
            />
          </Treemap>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
