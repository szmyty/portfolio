import { IdentityBlock } from "@/components/landing/IdentityBlock";
import { LandingEntry } from "@/components/landing/LandingEntry";
import { MainContent } from "@/components/landing/MainContent";

export default function Home() {
  return (
    <LandingEntry mainContent={<MainContent />}>
      <IdentityBlock />
    </LandingEntry>
  );
}
