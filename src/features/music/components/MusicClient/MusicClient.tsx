"use client";

import { useState } from "react";
import ReactPlayer from "react-player";
import type { SoundCloudTrack } from "@portfolio/features/music/types";
import type { MusicClientProps } from "./MusicClient.types";

function formatPublishedDate(pubDate: string): string {
  return new Date(pubDate).toLocaleDateString();
}

function TrackArtwork({ track }: { track: SoundCloudTrack }) {
  if (!track.artwork) {
    return null;
  }

  return (
    <img
      src={track.artwork}
      alt={track.title}
      className="aspect-square w-full object-cover"
    />
  );
}

export function MusicClient({ tracks }: MusicClientProps) {
  const [activeTrack, setActiveTrack] = useState<SoundCloudTrack | null>(null);

  return (
    <div className="flex flex-col gap-8">
      {activeTrack && (
        <div className="flex flex-col gap-4 rounded-2xl border p-4">
          <div className="flex flex-col gap-1">
            <p className="font-semibold text-text-primary">
              {activeTrack.title}
            </p>

            <p className="text-sm text-muted-foreground">
              Now playing from SoundCloud
            </p>
          </div>

          <ReactPlayer
            src={activeTrack.link}
            controls
            width="100%"
            height="50px"
          />
        </div>
      )}

      <div className="grid gap-6 md:grid-cols-2">
        {tracks.map((track) => {
          const isActive = activeTrack?.link === track.link;

          return (
            <button
              key={track.link}
              type="button"
              onClick={() => setActiveTrack(track)}
              className={`overflow-hidden rounded-2xl border text-left transition-all duration-200 hover:-translate-y-1 hover:shadow-lg cursor-pointer ${
                isActive ? "border-accent shadow-lg" : ""
              }`}
            >
              <TrackArtwork track={track} />

              <div className="flex flex-col gap-2 p-4">
                <p className="font-semibold leading-tight text-text-primary">
                  {track.title}
                </p>

                <p className="text-sm text-muted-foreground">
                  {track.description}
                </p>

                <div className="flex justify-between text-xs text-muted-foreground">
                  <span>{track.duration}</span>
                  <span>{formatPublishedDate(track.pubDate)}</span>
                </div>
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
}
