import { IdentityBlock, LandingEntry, MainContent } from "@/features/landing";

export default function Home() {
  return (
    <LandingEntry mainContent={<MainContent />}>
      <IdentityBlock />
    </LandingEntry>
  );
}
