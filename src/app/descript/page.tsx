import type { Metadata } from "next";
import Link from "next/link";
import {
  ArrowDown,
  ArrowUpRight,
  AudioLines,
  Infinity,
  Sparkles,
} from "lucide-react";
import { descriptMedia } from "@portfolio/config/descript";
import { siteConfig } from "@portfolio/config/site";
import { FilmViewer } from "@portfolio/features/descript";
import styles from "@portfolio/features/descript/descript.module.css";

const description =
  "Manifest: an original song and cinematic film by Alan Szmyt, exploring how imagination becomes something real through a human-directed AI creative workflow.";

export const metadata: Metadata = {
  title: "Manifest — A creative note for Descript",
  description,
  alternates: { canonical: "/descript" },
  robots: {
    index: false,
    follow: true,
    googleBot: { index: false, follow: true },
  },
  openGraph: {
    title: "Manifest — A creative note for Descript | Alan Szmyt",
    description,
    url: "/descript",
    type: "website",
    images: [
      {
        url: "/images/descript/manifest.webp",
        width: 1254,
        height: 1254,
        alt: "Manifest artwork: Void imagining a luminous cosmic world",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Manifest. | Alan Szmyt",
    description,
    images: ["/images/descript/manifest.webp"],
  },
};

const workflow = [
  {
    title: "Find the feeling",
    tool: "Creative direction",
    text: "The idea, lyrics, character, and world I wanted to bring to life.",
  },
  {
    title: "Imagine the world",
    tool: "ChatGPT",
    text: "Storyboarding, visual exploration, prompts, and reference images.",
  },
  {
    title: "Give it motion",
    tool: "Gemini",
    text: "Turning reference imagery into cinematic clips, then selecting what fits.",
  },
  {
    title: "Find its sound",
    tool: "Suno",
    text: "Shaping the song around the words, feeling, and world of the film.",
  },
  {
    title: "Make it whole",
    tool: "Editing + Descript",
    text: "Assembling the piece, then bringing it through Descript for finishing and captions.",
  },
];

export default function DescriptPage() {
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
              A creative note for <strong>Descript</strong>
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
                Manifest<span>.</span>
              </h1>
            </div>
            <div className={styles.heroAside}>
              <p>
                An idea becomes a world.
                <br />A feeling becomes something real.
              </p>
              <a href="#the-process" className={styles.processLink}>
                Explore the process <ArrowDown size={15} aria-hidden="true" />
              </a>
            </div>
          </div>
          <FilmViewer media={descriptMedia} />
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
              Imagination deserves
              <br />
              <span>a way into the world.</span>
            </h2>
          </div>
          <div className={styles.ideaCopy}>
            <p>
              Manifest is an original song and cinematic film about turning
              dreams into something tangible. It follows Void, a character whose
              black-hole mind becomes a place for possibilities to take shape.
            </p>
            <p>
              I made it by moving between story, imagery, motion, music, and
              editing—using AI tools as part of a creative workflow, with my
              direction connecting the pieces.
            </p>
            <p className={styles.smallNote}>
              The three cuts above trace that journey: the original, the
              Descript edit, and the captioned final.
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
          <p className={styles.eyebrow}>03 / WHY DESCRIPT</p>
          <h2 id="why-title">
            I make with these tools.
            <br />
            <span>I want to help build them.</span>
          </h2>
          <p className={styles.whyCopy}>
            I’m drawn to software that helps people take a creative impulse and
            turn it into something they can share. I experience that process as
            a creator, and I approach the tools behind it as a software
            engineer. Descript brings those two perspectives together in a way
            that resonates with me.
          </p>
          <div className={styles.actions}>
            <Link href="/development" className={styles.primaryLink}>
              Explore my engineering{" "}
              <ArrowUpRight size={18} aria-hidden="true" />
            </Link>
            <a
              href={siteConfig.author.github}
              target="_blank"
              rel="noopener noreferrer"
              className={styles.secondaryLink}
            >
              GitHub <ArrowUpRight size={16} aria-hidden="true" />
            </a>
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
