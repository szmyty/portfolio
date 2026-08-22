import { createRouteMetadata } from "@portfolio/config/route-metadata";

export const metadata = createRouteMetadata("/music");

export default function MusicLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return children;
}
