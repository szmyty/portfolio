import { PageShell } from "@portfolio/components/ui/PageShell";
import { MusicClient } from "@portfolio/features/music/components/MusicClient";
import { fetchSoundCloudRssItems } from "@portfolio/features/music/lib/soundcloud-service";
import { transformSoundCloudItems } from "@portfolio/features/music/lib/soundcloud-transform";

export default async function MusicPage() {
  const rawItems = await fetchSoundCloudRssItems();
  console.log("RAW SOUND CLOUD ITEMS:", rawItems.slice(0, 3));

  const tracks = transformSoundCloudItems(rawItems);
  console.log("TRANSFORMED TRACKS:", tracks.slice(0, 3));

  return (
    <PageShell>
      <section className="flex w-full max-w-6xl flex-col gap-12 mx-auto px-4 sm:px-8">
        {/* 🎧 Title */}
        <h1 className="text-3xl sm:text-4xl font-bold tracking-tight">
          Music
        </h1>

        <MusicClient tracks={tracks} />
      </section>
    </PageShell>
  );
}
