"use client";

import { useState, useRef } from "react";
import ReactPlayer from "react-player";
import type { SoundCloudTrack } from "@portfolio/features/music/types";

type MusicClientProps = {
  tracks: SoundCloudTrack[];
};

export function MusicClient({ tracks }: MusicClientProps) {
  console.log("CLIENT TRACKS:", tracks);

  const [activeTrack, setActiveTrack] = useState<SoundCloudTrack | null>(
    tracks[0] ?? null,
  );

  const playerRef = useRef<HTMLDivElement | null>(null);

  function handleTrackClick(track: SoundCloudTrack) {
    setActiveTrack(track);
    playerRef.current?.scrollIntoView({ behavior: "smooth" });
  }

  return (
    <div className="w-full flex flex-col gap-10">
      {/* 🎧 PLAYER */}
      {activeTrack && (
        <div
          ref={playerRef}
          className="w-full max-w-md mx-auto rounded-2xl border overflow-hidden"
        >
          {/* Artwork */}
          {activeTrack.artwork && (
            <img
              src={activeTrack.artwork}
              alt={activeTrack.title}
              className="w-full aspect-square object-cover max-h-[400px]"
            />
          )}

          {/* Player UI */}
          <div className="p-4 flex flex-col gap-3">
            <p className="font-semibold text-lg">
              {activeTrack.title}
            </p>

            <div className="pt-2">
              {activeTrack.audioUrl && (
                <ReactPlayer
                  src={activeTrack.audioUrl}
                  controls
                  playing
                  width="100%"
                  height="50px"
                />
              )}
            </div>
          </div>
        </div>
      )}

      {/* 🎶 GRID */}
      <div className="w-full grid gap-6 grid-cols-[repeat(auto-fill,minmax(240px,1fr))]">
        {tracks.map((track) => {
          console.log("TRACK ITEM:", track);

          const isActive = activeTrack?.link === track.link;

          return (
            <button
              key={track.link}
              onClick={() => handleTrackClick(track)}
              className={`text-left rounded-2xl border overflow-hidden transition-all duration-200 cursor-pointer
                hover:shadow-lg hover:-translate-y-1
                ${isActive ? "border-primary" : ""}
              `}
            >
              {/* Artwork */}
              {track.artwork && (
                <div className="relative">
                  <img
                    src={track.artwork}
                    alt={track.title}
                    className="w-full aspect-square object-cover"
                  />

                  {/* ▶ overlay */}
                  <div className="absolute inset-0 flex items-center justify-center bg-black/40 opacity-0 hover:opacity-100 transition-opacity">
                    <span className="text-white text-xl">▶</span>
                  </div>
                </div>
              )}

              {/* Info */}
              <div className="p-3 flex flex-col gap-1">
                <p className="font-medium text-sm leading-tight">
                  {track.title}
                </p>

                <p className="text-xs text-muted-foreground line-clamp-1">
                  {track.description}
                </p>

                <div className="flex justify-between text-xs text-muted-foreground pt-1">
                  <span>{track.duration}</span>
                  <span>
                    {new Date(track.pubDate).toLocaleDateString()}
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
