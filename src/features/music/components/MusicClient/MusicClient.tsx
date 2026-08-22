"use client";

import { useState, useRef } from "react";
import Image from "next/image";
import ReactPlayer from "react-player";
import { formatDisplayDate } from "@portfolio/lib/format-date";
import type {
  SoundCloudProfile,
  SoundCloudTrack,
} from "@portfolio/features/music/types";

type MusicClientProps = {
  tracks: SoundCloudTrack[];
  profile: SoundCloudProfile;
};

export function MusicClient({ tracks, profile }: MusicClientProps) {
  const [activeTrack, setActiveTrack] = useState<SoundCloudTrack | null>(
    tracks[0] ?? null,
  );

  const playerRef = useRef<HTMLDivElement | null>(null);

  function handleTrackClick(track: SoundCloudTrack) {
    setActiveTrack(track);
    playerRef.current?.scrollIntoView({ behavior: "smooth" });
  }

  return (
    <div className="flex w-full min-w-0 flex-col gap-10">
      {/* Player */}
      {activeTrack && (
        <div
          ref={playerRef}
          className="w-full max-w-md mx-auto rounded-2xl border border-border bg-surface overflow-hidden shadow-sm"
        >
          {/* Artwork */}
          {activeTrack.artwork && (
            <div className="relative aspect-square max-h-[400px] overflow-hidden">
              <Image
                src={activeTrack.artwork}
                alt={activeTrack.title}
                fill
                sizes="(max-width: 768px) 100vw, 448px"
                className="object-cover"
                priority
              />
            </div>
          )}

          {/* Player UI */}
          <div className="p-4 flex flex-col gap-4">
            <a
              href={profile.url}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-3 transition-opacity hover:opacity-80"
            >
              {profile.avatar && (
                <Image
                  src={profile.avatar}
                  alt={profile.name}
                  width={40}
                  height={40}
                  className="rounded-full object-cover"
                />
              )}

              <span className="text-sm font-medium text-text-primary">
                {profile.name}
              </span>
            </a>

            <p className="font-semibold text-lg text-text-primary">
              {activeTrack.title}
            </p>

            <div>
              {activeTrack.audioUrl && (
                <ReactPlayer
                  src={activeTrack.audioUrl}
                  controls
                  preload="none"
                  width="100%"
                  height="50px"
                />
              )}
            </div>
          </div>
        </div>
      )}

      {/* Track grid */}
      <div className="grid w-full grid-cols-[repeat(auto-fill,minmax(200px,1fr))] gap-6">
        {tracks.map((track) => {
          const isActive = activeTrack?.link === track.link;

          return (
            <button
              key={track.link}
              onClick={() => handleTrackClick(track)}
              className={[
                "min-w-0 cursor-pointer overflow-hidden rounded-2xl border text-left transition-all duration-200",
                "hover:shadow-lg hover:-translate-y-1",
                isActive
                  ? "border-accent bg-surface shadow-md"
                  : "border-border bg-surface",
              ].join(" ")}
            >
              {/* Artwork */}
              {track.artwork && (
                <div className="relative aspect-square w-full">
                  <Image
                    src={track.artwork}
                    alt={track.title}
                    fill
                    sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 200px"
                    className="object-cover"
                  />

                  {/* Play overlay */}
                  <div className="absolute inset-0 flex items-center justify-center bg-black/40 opacity-0 hover:opacity-100 transition-opacity">
                    <span className="text-white text-xl">▶</span>
                  </div>

                  {/* Active indicator */}
                  {isActive && (
                    <div className="absolute bottom-2 right-2 flex h-6 w-6 items-center justify-center rounded-full bg-accent text-accent-foreground text-xs">
                      ♪
                    </div>
                  )}
                </div>
              )}

              {/* Info */}
              <div className="p-3 flex flex-col gap-1">
                <p
                  className={[
                    "font-medium text-sm leading-tight",
                    isActive ? "text-accent" : "text-text-primary",
                  ].join(" ")}
                >
                  {track.title}
                </p>

                <p className="text-xs text-text-muted line-clamp-1">
                  {track.description}
                </p>

                <div className="flex justify-between text-xs text-text-muted pt-1">
                  <span>{track.duration}</span>
                  <span>
                    {formatDisplayDate(track.pubDate)}
                  </span>
                </div>
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
}
