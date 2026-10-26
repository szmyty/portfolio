"use client";

import { useEffect, useRef, useState } from "react";
import Image, { getImageProps } from "next/image";
import {
  ArrowUpRight,
  Check,
  Clapperboard,
  Film,
  Play,
  RotateCcw,
} from "lucide-react";
import type {
  DescriptMedia,
  DescriptVideoSource,
} from "@portfolio/config/descript";
import styles from "./descript.module.css";

const versions = [
  {
    id: "final",
    number: "01",
    title: "Final film",
    detail: "Descript edit + captions",
    description:
      "The finished viewing experience, with captions included in the film.",
    Icon: Play,
  },
  {
    id: "edited",
    number: "02",
    title: "Descript edit",
    detail: "The finishing pass",
    description:
      "The film after Descript processing, before the captioned export.",
    Icon: Clapperboard,
  },
  {
    id: "original",
    number: "03",
    title: "Original cut",
    detail: "Where it began",
    description:
      "The original assembly from my creative workflow, before Descript finishing.",
    Icon: Film,
  },
] as const;
type Version = (typeof versions)[number];

/** Only public HTTPS or same-origin paths are suitable for reviewer links. */
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
  version,
  source,
  poster,
}: {
  version: Version;
  source: DescriptVideoSource;
  poster: string;
}) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [started, setStarted] = useState(false);
  const [failed, setFailed] = useState(false);
  const [attempt, setAttempt] = useState(0);
  const [playbackMessage, setPlaybackMessage] = useState("");
  const src = playbackUrl(source.src);
  const captions = playbackUrl(source.captions);
  const optimizedPoster = getImageProps({
    src: poster,
    width: 1254,
    height: 1254,
    alt: "",
  }).props.src;

  useEffect(() => {
    const video = videoRef.current;
    // Strict Mode may replay this effect; restore a source cleared by cleanup.
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
    <div className={styles.screen}>
      {src && !failed && (
        <video
          key={attempt}
          ref={videoRef}
          className={styles.video}
          src={src}
          poster={optimizedPoster}
          controls
          playsInline
          preload="none"
          crossOrigin={captions ? "anonymous" : undefined}
          aria-label={`manifest — ${version.title}`}
          aria-describedby="version-description"
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
          Your browser cannot play this video.{" "}
          <a href={src}>Open the film directly.</a>
        </video>
      )}
      {(!src || !started || failed) && (
        <div className={styles.posterLayer}>
          <Image
            src={poster}
            alt="Void, a dark cosmic robot, imagining a luminous world within its mind"
            fill
            sizes="(max-width: 720px) 100vw, 1180px"
            preload
            className={styles.poster}
          />
          <div className={styles.posterShade} />
          {src && !failed ? (
            <button
              type="button"
              onClick={play}
              className={styles.playButton}
              aria-label={`Play manifest — ${version.title}`}
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
            <div className={styles.screenMessage} role="status">
              <span className={styles.screenMessageIcon}>
                {failed ? (
                  <Film size={24} aria-hidden="true" />
                ) : (
                  <Clapperboard size={24} aria-hidden="true" />
                )}
              </span>
              <strong>
                {failed
                  ? "Let’s try that again."
                  : "The screening is coming soon."}
              </strong>
              <p>
                {failed
                  ? "This version couldn’t load. You can retry or open the film directly."
                  : "The artwork is here. The film will be available here shortly."}
              </p>
              {failed && (
                <div className={styles.errorActions}>
                  <button
                    type="button"
                    onClick={() => {
                      setFailed(false);
                      setStarted(false);
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
          <div className={styles.posterCredit} aria-hidden="true">
            <span>AN ORIGINAL SONG & CINEMATIC FILM</span>
            <span>.play()</span>
          </div>
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

export function FilmViewer({ media }: { media: DescriptMedia }) {
  const [selected, setSelected] = useState<Version>(versions[0]);
  const src = playbackUrl(media[selected.id].src);
  const shareUrl = playbackUrl(media.descriptShareUrl);

  return (
    <div className={styles.viewer}>
      <div className={styles.screenFrame}>
        <div className={styles.screenTop}>
          <span>
            <i /> manifest / SCREENING ROOM
          </span>
          <span>
            {selected.title}
            {selected.id === "final" ? " · Captioned" : ""}
          </span>
        </div>
        <Screening
          key={selected.id}
          version={selected}
          source={media[selected.id]}
          poster={media.poster}
        />
        <div className={styles.screenBottom}>
          <p id="version-description" aria-live="polite">
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
          <span>ONE FILM.</span>
          <strong>Three perspectives.</strong>
        </div>
        <div
          className={styles.versions}
          role="group"
          aria-label="Choose a film version"
        >
          {versions.map((version) => (
            <button
              key={version.id}
              type="button"
              aria-pressed={selected.id === version.id}
              onClick={() => setSelected(version)}
              className={styles.versionButton}
            >
              <span className={styles.versionIcon}>
                <version.Icon size={19} strokeWidth={1.4} aria-hidden="true" />
              </span>
              <span className={styles.versionCopy}>
                <strong>{version.title}</strong>
                <span>{version.detail}</span>
              </span>
              <span className={styles.versionNumber} aria-hidden="true">
                {selected.id === version.id ? (
                  <Check size={15} />
                ) : (
                  version.number
                )}
              </span>
            </button>
          ))}
        </div>
      </div>
      {shareUrl && (
        <a
          href={shareUrl}
          target="_blank"
          rel="noopener noreferrer"
          className={styles.shareLink}
        >
          Also watch on Descript <ArrowUpRight size={14} aria-hidden="true" />
        </a>
      )}
      <noscript>
        <p className={styles.noScript}>
          JavaScript is needed to switch versions in this viewer.
          {versions.map((version) => {
            const url = playbackUrl(media[version.id].src);
            return url ? (
              <a key={version.id} href={url}>
                Open {version.title}
              </a>
            ) : null;
          })}
        </p>
      </noscript>
    </div>
  );
}
