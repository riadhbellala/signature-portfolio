/**
 * Projects. To publish a real project, edit its entry here only:
 * - `cover` / `gallery`: paths in /public (e.g. "/projets/murs-01/cover.jpg"); null = placeholder.
 *   Images are shown at their category's ratio (see categories.ts).
 * - fill the bracketed text and set `isPlaceholder: false`.
 * Counts on the page are computed from this list.
 */

import { categories, type CategoryId } from "./categories";

export interface Project {
  slug: string;
  category: CategoryId;
  client: string;
  title: string;
  year: string;
  /** 2–3 lines for the project page. */
  brief: string;
  cover: string | null;
  gallery: (string | null)[];
  /** Shown in the "selected work" puzzle at the top of the page (7 at most). */
  featured: boolean;
  isPlaceholder: boolean;
}

const placeholder = (category: CategoryId, n: number): Project => ({
  slug: `${category}-${String(n).padStart(2, "0")}`,
  category,
  client: "[Nom du client]",
  title: "[Titre du projet]",
  year: "[Année]",
  brief: "[Brief à venir]",
  cover: null,
  gallery: [null, null, null],
  // The first project of every type is featured until real projects arrive.
  featured: n === 1,
  isPlaceholder: true,
});

/** Three placeholders per category (21), so every section layout can be checked. */
export const projects: Project[] = categories.flatMap((c) => [1, 2, 3].map((n) => placeholder(c.id, n)));

export const featuredProjects = () => projects.filter((p) => p.featured).slice(0, 7);
export const projectsIn = (id: CategoryId) => projects.filter((p) => p.category === id);
export const getProject = (slug: string) => projects.find((p) => p.slug === slug);

/** Next project in the same category, wrapping round. */
export const nextInCategory = (p: Project) => {
  const list = projectsIn(p.category);
  return list[(list.indexOf(p) + 1) % list.length];
};

/** Position of a project inside its category, as "01". */
export const projectNumber = (p: Project) => String(projectsIn(p.category).indexOf(p) + 1).padStart(2, "0");
