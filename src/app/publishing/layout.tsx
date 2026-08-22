import { createRouteMetadata } from "@portfolio/config/route-metadata";

export const metadata = createRouteMetadata("/publishing");

export default function PublishingLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return children;
}
