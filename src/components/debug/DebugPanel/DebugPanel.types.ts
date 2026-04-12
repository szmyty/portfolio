export type DebugInfo = {
  siteUrl: string;
  nextVersion: string;
  reactVersion: string;
  locale: string;
  nodeEnv: string;
};

export type DebugPanelProps = {
  info: DebugInfo;
};

export type SectionKey =
  | "interaction"
  | "device"
  | "environment"
  | "performance"
  | "theme";
