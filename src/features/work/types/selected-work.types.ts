export type SelectedWorkLink = {
  label: string;
  href: string;
};

export type SelectedWorkCaseStudy = {
  id: string;
  title: string;
  lane: string;
  summary: string;
  problem: string;
  constraints: string;
  decisions: string;
  implementation: string;
  validation: string;
  outcome: string;
  role: string;
  aiAssistance: string;
  repositoryUrl: string;
  relatedLinks: SelectedWorkLink[];
};
