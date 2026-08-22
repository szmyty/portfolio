import { createRouteMetadata } from "@portfolio/config/route-metadata";

export const metadata = createRouteMetadata("/insights");

export default function InsightsLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return children;
}
