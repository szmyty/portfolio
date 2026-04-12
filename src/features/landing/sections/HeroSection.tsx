import Link from "next/link";

export function HeroSection() {
  return (
    <section
      id="hero"
      aria-label="Hero"
      className="relative flex flex-col items-center justify-center min-h-screen px-4 sm:px-8 text-center"
    >
      <div className="flex flex-col items-center gap-6 max-w-2xl">
        <h1 className="text-5xl sm:text-6xl md:text-7xl font-bold tracking-tight text-text-primary">
          Alan Szmyt
        </h1>
        <p className="text-lg sm:text-xl text-text-secondary max-w-md leading-relaxed">
          Software engineer, musician, and creator — exploring the intersections
          of technology, sound, and the written word.
        </p>
        <div className="flex flex-wrap gap-4 justify-center mt-2">
          <Link
            href="#development"
            className="px-6 py-3 rounded-lg bg-accent text-background font-medium hover:bg-accent-hover transition-colors duration-200"
          >
            View Work
          </Link>
          <Link
            href="#music"
            className="px-6 py-3 rounded-lg border border-border text-text-primary hover:border-accent hover:text-accent transition-colors duration-200"
          >
            Explore Music
          </Link>
        </div>
      </div>
    </section>
  );
}
