import {
  IdentityBlock,
  LandingEntry,
  MainContent,
} from "@portfolio/features/landing";

export default function Home() {
  return (
    <LandingEntry mainContent={<MainContent />}>
      <IdentityBlock />
    </LandingEntry>
  );
}
