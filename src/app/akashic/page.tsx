import type { Metadata } from "next";
import Link from "next/link";
import {
  ArrowDown,
  ArrowUpRight,
  AudioLines,
  Infinity,
  Sparkles,
} from "lucide-react";
import { akashicMedia } from "@portfolio/config/akashic";
import { FilmViewer } from "@portfolio/features/akashic";
import styles from "@portfolio/features/descript/descript.module.css";

const description =
  "akashic: an original song by Alan Szmyt / .play(), bringing music and visual storytelling together across portrait and landscape films.";

export const metadata: Metadata = {
  title: "akashic — An original song & film",
  description,
  alternates: { canonical: "/akashic" },
  robots: {
    index: false,
    follow: true,
    googleBot: { index: false, follow: true },
  },
  openGraph: {
    title: "akashic — An original song & film | Alan Szmyt",
    description,
    url: "/akashic",
    type: "website",
  },
  twitter: {
    card: "summary",
    title: "akashic | Alan Szmyt",
    description,
  },
};

const workflow = [
  {
    title: "Find the feeling",
    tool: "Creative direction",
    text: "The idea, lyrics, characters, and world I want to express.",
  },
  {
    title: "Shape the song",
    tool: "Music + Ableton",
    text: "Bringing the words, sound, and arrangement into a finished piece.",
  },
  {
    title: "Imagine the world",
    tool: "Visual exploration",
    text: "Developing imagery and scenes that belong to the song.",
  },
  {
    title: "Give it motion",
    tool: "AI-assisted filmmaking",
    text: "Creating clips, choosing moments, and arranging them into a story.",
  },
  {
    title: "Bring it together",
    tool: "Editing + Descript",
    text: "Finishing the picture, preparing captions, and checking the final sound.",
  },
];

export default function AkashicPage() {
  return (
    <div className={styles.page}>
      <header className={styles.header}>
        <nav className={styles.nav} aria-label="Showcase navigation">
          <Link
            href="/"
            className={styles.signature}
            aria-label="Alan Szmyt — back to portfolio"
          >
            <Infinity size={28} strokeWidth={1.4} aria-hidden="true" />
            <span>
              alan szmyt<span className={styles.signatureDot}>.</span>
            </span>
          </Link>
          <div className={styles.navRight}>
            <span className={styles.recipient}>
              An original song & film by <strong>.play()</strong>
            </span>
            <Link href="/" className={styles.backLink}>
              Portfolio <ArrowUpRight size={15} aria-hidden="true" />
            </Link>
          </div>
        </nav>
      </header>
      <main id="main-content" tabIndex={-1} className={styles.main}>
        <section aria-labelledby="film-title" className={styles.hero}>
          <div className={styles.heroTop}>
            <div>
              <p className={styles.eyebrow}>
                <span className={styles.signal} /> A FILM & SONG BY ALAN SZMYT /
                .PLAY()
              </p>
              <h1 id="film-title" className={styles.title}>
                akashic<span>.</span>
              </h1>
            </div>
            <div className={styles.heroAside}>
              <p>
                One song.
                <br />
                Two ways into its world.
              </p>
              <a href="#the-process" className={styles.processLink}>
                Explore the process <ArrowDown size={15} aria-hidden="true" />
              </a>
            </div>
          </div>
          <FilmViewer media={akashicMedia} />
          <div className={styles.filmCredit}>
            <span>
              <AudioLines size={15} aria-hidden="true" /> Best experienced with
              sound
            </span>
            <span>Creative direction · Alan Szmyt / .play()</span>
          </div>
        </section>
        <section
          id="the-idea"
          className={styles.idea}
          aria-labelledby="idea-title"
        >
          <div>
            <p className={styles.eyebrow}>01 / THE IDEA</p>
            <h2 id="idea-title">
              One song.
              <br />
              <span>More than one perspective.</span>
            </h2>
          </div>
          <div className={styles.ideaCopy}>
            <p>
              akashic brings my music and visual storytelling into the same
              world. The words, sound, imagery, and sequence of scenes are parts
              of one expression.
            </p>
            <p>
              The films share a song and theme, with each format giving the
              story its own scenes and composition.
            </p>
            <p className={styles.smallNote}>
              {akashicMedia.portrait.src
                ? "Watch the portrait film in the screening room above."
                : "The portrait film is in its finishing stage."}{" "}
              {akashicMedia.landscape.src
                ? "The landscape film is also available."
                : "A separate landscape film is planned."}
            </p>
          </div>
        </section>
        <section
          id="the-process"
          className={styles.process}
          aria-labelledby="process-title"
        >
          <div className={styles.sectionHeading}>
            <div>
              <p className={styles.eyebrow}>02 / THE PROCESS</p>
              <h2 id="process-title">One idea. Many instruments.</h2>
            </div>
            <p>
              The tools change.
              <br />
              The creative thread stays human.
            </p>
          </div>
          <ol className={styles.workflow}>
            {workflow.map((step, index) => (
              <li key={step.title}>
                <span className={styles.stepNumber}>
                  0{index + 1}
                  <span aria-hidden="true" />
                </span>
                <p className={styles.tool}>{step.tool}</p>
                <h3>{step.title}</h3>
                <p>{step.text}</p>
              </li>
            ))}
          </ol>
        </section>
        <section className={styles.why} aria-labelledby="why-title">
          <div className={styles.whyMark} aria-hidden="true">
            <Sparkles size={30} strokeWidth={1} />
          </div>
          <p className={styles.eyebrow}>03 / THE CREATIVE THREAD</p>
          <h2 id="why-title">
            Music becomes imagery.
            <br />
            <span>Imagery becomes a story.</span>
          </h2>
          <p className={styles.whyCopy}>
            I move between music, storytelling, art, and engineering, using AI
            tools within a creative process shaped by my choices. This is a
            place to bring those pieces together and share what I make.
          </p>
          <div className={styles.actions}>
            <Link href="/music" className={styles.primaryLink}>
              Explore my music <ArrowUpRight size={18} aria-hidden="true" />
            </Link>
            <Link href="/development" className={styles.secondaryLink}>
              Explore my engineering{" "}
              <ArrowUpRight size={16} aria-hidden="true" />
            </Link>
          </div>
        </section>
      </main>
      <footer className={styles.footer}>
        <span>
          <Infinity size={20} strokeWidth={1.2} aria-hidden="true" /> Made with
          imagination. Built with intention.
        </span>
        <Link href="/">
          Alan Szmyt <ArrowUpRight size={14} aria-hidden="true" />
        </Link>
      </footer>
    </div>
  );
}
