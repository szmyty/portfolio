export type DebugInfo = {
  siteUrl: string;
  nextVersion: string;
  reactVersion: string;
  locale: string;
};

export type DebugPanelProps = {
  info: DebugInfo;
};
