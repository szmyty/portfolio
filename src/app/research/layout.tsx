import { createRouteMetadata } from "@portfolio/config/route-metadata";

export const metadata = createRouteMetadata("/research");

export default function ResearchLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return children;
}
