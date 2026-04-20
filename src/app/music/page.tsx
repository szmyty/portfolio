import { PageShell } from "@portfolio/components/ui/PageShell";
import { MusicClient } from "@portfolio/features/music/components/MusicClient";
import { fetchSoundCloudRssItems } from "@portfolio/features/music/lib/soundcloud-service";
import { transformSoundCloudItems } from "@portfolio/features/music/lib/soundcloud-transform";

export default async function MusicPage() {
  const rawItems = await fetchSoundCloudRssItems();
  const tracks = transformSoundCloudItems(rawItems);

  return (
    <PageShell>
      <section className="flex flex-col gap-12 max-w-6xl mx-auto px-4 sm:px-8">
        {/* 🎧 Title */}
        <h1 className="text-3xl sm:text-4xl font-bold tracking-tight">
          Music
        </h1>

        <MusicClient tracks={tracks} />
      </section>
    </PageShell>
  );
}
