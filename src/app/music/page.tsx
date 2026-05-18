import { PageShell } from "@portfolio/components/ui/PageShell";
import { getTranslations } from "next-intl/server";
import { MusicClient } from "@portfolio/features/music/components/MusicClient";
import { fetchSoundCloudRssItems } from "@portfolio/features/music/lib/soundcloud-service";
import {
  transformSoundCloudItems,
  transformSoundCloudProfile,
} from "@portfolio/features/music/lib/soundcloud-transform";

export default async function MusicPage() {
  const t = await getTranslations("MusicPage");
  const { items, channel } = await fetchSoundCloudRssItems();
  console.log("RAW SOUND CLOUD ITEMS:", items.slice(0, 3));

  const tracks = transformSoundCloudItems(items);
  const profile = transformSoundCloudProfile(channel);
  console.log("TRANSFORMED TRACKS:", tracks.slice(0, 3));

  return (
    <PageShell>
        <section className="flex w-full max-w-6xl flex-col gap-12 mx-auto px-4 sm:px-8">
          {/* 🎧 Title */}
          <h1 className="text-3xl sm:text-4xl font-bold tracking-tight">
            {t("title")}
          </h1>

        <MusicClient tracks={tracks} profile={profile} />
      </section>
    </PageShell>
  );
}
