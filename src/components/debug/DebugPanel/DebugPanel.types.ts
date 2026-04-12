export interface DebugInfo {
  siteUrl: string;
  nextVersion: string;
  reactVersion: string;
  locale: string;
}

export interface DebugPanelProps {
  info: DebugInfo;
}
