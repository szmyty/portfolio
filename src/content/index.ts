/**
 * Content abstraction layer — public API.
 *
 * Import content types and data from this module rather than reaching into
 * individual files directly. This keeps consumers decoupled from the internal
 * file layout and makes future refactoring easier.
 *
 * @example
 * ```ts
 * import { projects, type Project } from "@portfolio/content";
 * ```
 */

export type { ContentStatus, CreativeWork, Project, ProjectLinks, Tag } from "./types";

export { creativeWorks } from "./creative";
export { projects } from "./projects";
