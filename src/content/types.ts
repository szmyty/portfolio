/**
 * Content types — TypeScript interfaces for structured portfolio content.
 *
 * These types define the shape of content items such as projects and creative
 * works. No CMS or database is involved; content is defined as plain data
 * objects that conform to these interfaces.
 */

/** A short label used to categorise or describe a content item. */
export type Tag = string;

/** Lifecycle state of a content item. */
export type ContentStatus = "active" | "archived" | "in-progress" | "planned";

/** External URL links associated with a project. */
export interface ProjectLinks {
  /** Public live URL, if deployed. */
  live?: string;
  /** Source-code repository URL. */
  repo?: string;
}

/** A software project entry. */
export interface Project {
  /** Unique slug used as an identifier and in URLs. */
  slug: string;
  /** Human-readable display title. */
  title: string;
  /** One-sentence summary shown in listings. */
  summary: string;
  /** Optional longer description for a detail view. */
  description?: string;
  /** Technology or topic tags (e.g. "TypeScript", "Next.js"). */
  tags: Tag[];
  /** Current development status of the project. */
  status: ContentStatus;
  /** Related external URLs. */
  links?: ProjectLinks;
}

/** A creative work entry (design, writing, art, etc.). */
export interface CreativeWork {
  /** Unique slug used as an identifier and in URLs. */
  slug: string;
  /** Human-readable display title. */
  title: string;
  /** One-sentence summary shown in listings. */
  summary: string;
  /** Optional longer description for a detail view. */
  description?: string;
  /** Medium or category tags (e.g. "illustration", "writing"). */
  tags: Tag[];
  /** Current status of the work. */
  status: ContentStatus;
  /** Optional URL pointing to the work or a related resource. */
  url?: string;
}
