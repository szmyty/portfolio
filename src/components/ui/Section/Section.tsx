import { CosmicBackground } from "@portfolio/components/ui/CosmicBackground";
import type { SectionProps } from "./Section.types";

/**
 * Section — reusable page-section layout primitive.
 *
 * Pure layout + composition component.
 */
export function Section({
  id,
  "aria-label": ariaLabel,
  title,
  children,
  visual,
  background = "background",
  cosmicBackground = true,
  className,
  contentClassName,
}: SectionProps) {
  const backgroundClassName = cosmicBackground
    ? "bg-transparent"
    : background === "surface"
      ? "bg-surface"
      : "bg-background";

  const rootClassName = [
    "relative px-4 sm:px-8 py-16 sm:py-20 scroll-mt-16 pointer-events-auto",
    backgroundClassName,
    className,
  ]
    .filter(Boolean)
    .join(" ");

  return (
    <section id={id} aria-label={ariaLabel} className={rootClassName}>
      {cosmicBackground && <CosmicBackground mode="content" />}

      <SectionContent visual={visual} className={contentClassName}>
        <SectionText title={title} hasVisual={!!visual}>
          {children}
        </SectionText>

        <SectionVisual visual={visual} />
      </SectionContent>
    </section>
  );
}

/* -------------------------------------------------------------------------------------------------
 * Internal components (private to Section)
 * -----------------------------------------------------------------------------------------------*/

type SectionContentProps = {
  visual?: React.ReactNode;
  className?: string;
  children: React.ReactNode;
};

function SectionContent({ visual, className, children }: SectionContentProps) {
  const layoutClassName = visual
    ? "max-w-5xl flex flex-col md:flex-row md:items-center gap-8 md:gap-12"
    : "max-w-3xl flex flex-col gap-6";

  const rootClassName = [
    "relative z-10 mx-auto",
    layoutClassName,
    className,
  ]
    .filter(Boolean)
    .join(" ");

  return <div className={rootClassName}>{children}</div>;
}

type SectionTextProps = {
  title?: React.ReactNode;
  children?: React.ReactNode;
  hasVisual?: boolean;
};

function SectionText({ title, children, hasVisual }: SectionTextProps) {
  const rootClassName = [
    "flex flex-col gap-5",
    hasVisual && "flex-1",
  ]
    .filter(Boolean)
    .join(" ");

  return (
    <div className={rootClassName}>
      {title && (
        <h2 className="text-3xl sm:text-4xl font-bold tracking-tight text-text-primary">
          {title}
        </h2>
      )}
      {children}
    </div>
  );
}

type SectionVisualProps = {
  visual?: React.ReactNode;
};

function SectionVisual({ visual }: SectionVisualProps) {
  if (!visual) return null;

  return (
    <div className="flex w-full items-center justify-center md:flex-shrink-0 max-w-[360px] sm:max-w-[440px] md:max-w-[30rem] lg:max-w-[36rem]">
      {visual}
    </div>
  );
}
