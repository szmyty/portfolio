"use client";

import dynamic from "next/dynamic";

const ConstellationScene = dynamic(
  () =>
    import(
      "@portfolio/features/github/components/GitHubConstellationScene/ConstellationScene"
    ).then((mod) => mod.ConstellationScene),
  { ssr: false },
);

export function GitHubConstellationScene() {
  return <ConstellationScene />;
}
