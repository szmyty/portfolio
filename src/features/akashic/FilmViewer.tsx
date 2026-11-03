"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import {
  ArrowUpRight,
  Check,
  Monitor,
  Play,
  RotateCcw,
  Smartphone,
} from "lucide-react";
import type {
  AkashicFormat,
  AkashicMedia,
  AkashicVideoSource,
} from "@portfolio/config/akashic";
import styles from "@portfolio/features/descript/descript.module.css";
import filmStyles from "./akashic.module.css";

const formats = [
  {
    id: "portrait",
    number: "01",
    title: "Portrait film",
    detail: "9:16 · Vertical",
    description: "The portrait film, made for a vertical frame.",
    pending: "Finishing in progress",
    pendingDetail: "The portrait film will appear here when it is ready.",
    Icon: Smartphone,
  },
  {
    id: "landscape",
    number: "02",
    title: "Landscape film",
    detail: "16:9 · Widescreen",
    description:
      "A separate widescreen film exploring the same song and theme.",
    pending: "Coming later",
    pendingDetail: "A separate landscape film is planned for this song.",
    Icon: Monitor,
  },
] as const;

type Format = (typeof formats)[number];

/** Match the existing showcase's public HTTPS and same-origin URL contract. */
function playbackUrl(value: string | null): string | null {
  const candidate = value?.trim();
  if (!candidate) return null;
  if (
    candidate.startsWith("/") &&
    !candidate.startsWith("//") &&
    !candidate.includes("\\")
  )
    return candidate;
  try {
    const url = new URL(candidate);
    return url.protocol === "https:" && !url.username && !url.password
      ? url.href
      : null;
  } catch {
    return null;
  }
}

function Screening({
  format,
  source,
}: {
  format: Format;
  source: AkashicVideoSource;
}) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [started, setStarted] = useState(false);
  const [failed, setFailed] = useState(false);
  const [attempt, setAttempt] = useState(0);
  const [playbackMessage, setPlaybackMessage] = useState("");
  const src = playbackUrl(source.src);
  const captions = playbackUrl(source.captions);
  const poster = playbackUrl(source.poster);

  useEffect(() => {
    const video = videoRef.current;
    // Strict Mode may replay this effect after cleanup clears the source.
    if (video && src && !video.getAttribute("src")) video.src = src;
    return () => {
      if (!video) return;
      video.pause();
      video.removeAttribute("src");
      video.load();
    };
  }, [src, failed, attempt]);

  async function play() {
    setStarted(true);
    try {
      await videoRef.current?.play();
      setPlaybackMessage("");
    } catch {
      setPlaybackMessage("Press play in the video controls to begin.");
    }
  }

  return (
    <div
      className={`${styles.screen} ${filmStyles.screen} ${format.id === "portrait" ? filmStyles.portrait : ""}`}
    >
      {src && !failed && (
        <video
          key={attempt}
          ref={videoRef}
          className={styles.video}
          src={src}
          poster={poster ?? undefined}
          controls
          playsInline
          preload="none"
          crossOrigin={captions ? "anonymous" : undefined}
          aria-label={`akashic — ${format.title}`}
          aria-describedby="akashic-film-description"
          onPlay={() => {
            setStarted(true);
            setPlaybackMessage("");
          }}
          onError={() => setFailed(true)}
        >
          {captions && (
            <track
              kind="captions"
              src={captions}
              srcLang="en"
              label="English"
              default
            />
          )}
          Your browser cannot play this video. <a href={src}>Open the film.</a>
        </video>
      )}
      {(!src || !started || failed) && (
        <div className={styles.posterLayer}>
          <div className={filmStyles.backdrop} aria-hidden="true" />
          {poster && (
            <Image
              src={poster}
              alt={source.posterAlt}
              fill
              unoptimized
              sizes="(max-width: 640px) 100vw, 1180px"
              className={styles.video}
            />
          )}
          {src && !failed ? (
            <button
              type="button"
              onClick={play}
              className={styles.playButton}
              aria-label={`Play akashic — ${format.title}`}
            >
              <span>
                <Play
                  size={25}
                  fill="currentColor"
                  strokeWidth={1}
                  aria-hidden="true"
                />
              </span>
              <strong>Play film</strong>
            </button>
          ) : (
            <div className={filmStyles.emptyState} role="status">
              <span className={filmStyles.wordmark} aria-hidden="true">
                akashic<span>.</span>
              </span>
              <strong>
                {failed ? "Let’s try that again." : format.pending}
              </strong>
              <p>
                {failed
                  ? "This film couldn’t load. Retry or open it directly."
                  : format.pendingDetail}
              </p>
              {failed && (
                <div className={styles.errorActions}>
                  <button
                    type="button"
                    onClick={() => {
                      setFailed(false);
                      setStarted(false);
                      setPlaybackMessage("");
                      setAttempt(attempt + 1);
                    }}
                  >
                    <RotateCcw size={14} aria-hidden="true" /> Retry
                  </button>
                  {src && (
                    <a href={src} target="_blank" rel="noopener noreferrer">
                      Open film <ArrowUpRight size={14} aria-hidden="true" />
                    </a>
                  )}
                </div>
              )}
            </div>
          )}
        </div>
      )}
      {playbackMessage && (
        <p className={styles.playbackMessage} role="status">
          {playbackMessage}
        </p>
      )}
    </div>
  );
}

export function FilmViewer({ media }: { media: AkashicMedia }) {
  const [selectedId, setSelectedId] = useState<AkashicFormat>("portrait");
  const selected = formats.find((format) => format.id === selectedId)!;
  const src = playbackUrl(media[selectedId].src);

  return (
    <div className={styles.viewer}>
      <div className={styles.screenFrame}>
        <div className={styles.screenTop}>
          <span>
            <i /> akashic / SCREENING ROOM
          </span>
          <span>{selected.title}</span>
        </div>
        <Screening
          key={selectedId}
          format={selected}
          source={media[selectedId]}
        />
        <div className={styles.screenBottom}>
          <p id="akashic-film-description" aria-live="polite">
            {selected.description}
          </p>
          {src && (
            <a
              href={src}
              target="_blank"
              rel="noopener noreferrer"
              className={styles.directLink}
            >
              Open film <ArrowUpRight size={14} aria-hidden="true" />
            </a>
          )}
        </div>
      </div>
      <div className={styles.versionBar}>
        <div className={styles.versionIntro}>
          <span>ONE SONG.</span>
          <strong>Two films.</strong>
        </div>
        <div
          className={`${styles.versions} ${filmStyles.formats}`}
          role="group"
          aria-label="Choose a film format"
        >
          {formats.map((format) => (
            <button
              key={format.id}
              type="button"
              aria-pressed={selectedId === format.id}
              onClick={() => setSelectedId(format.id)}
              className={styles.versionButton}
            >
              <span className={styles.versionIcon}>
                <format.Icon size={19} strokeWidth={1.4} aria-hidden="true" />
              </span>
              <span className={styles.versionCopy}>
                <strong>{format.title}</strong>
                <span>{format.detail}</span>
              </span>
              <span className={styles.versionNumber} aria-hidden="true">
                {selectedId === format.id ? <Check size={15} /> : format.number}
              </span>
            </button>
          ))}
        </div>
      </div>
      <noscript>
        <p className={styles.noScript}>
          JavaScript is needed to switch films in this viewer.
          {formats.map((format) => {
            const url = playbackUrl(media[format.id].src);
            return url ? (
              <a key={format.id} href={url}>
                Open {format.title}
              </a>
            ) : null;
          })}
        </p>
      </noscript>
    </div>
  );
}
