import { createRouteMetadata } from "@portfolio/config/route-metadata";

export const metadata = createRouteMetadata("/development");

export default function DevelopmentLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return children;
}
