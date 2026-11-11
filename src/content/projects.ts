/**
 * Projects. Edit this file only to replace placeholders with real projects:
 * set `cover` / `gallery` to image paths in /public (e.g. "/projets/branding-01/cover.jpg"),
 * fill the bracketed text, and set `isPlaceholder: false`. No component changes needed.
 *
 * Image ratios the layout reserves: cover 16:10; gallery alternates 4:5 and 1:1.
 */

import type { ServiceId } from "./services";

/** A project belongs to one service; the grid filters by that service's pole. */
export type CategoryId = ServiceId;

export interface ProjectFigure {
  value: string; // "[CHIFFRE À CONFIRMER]" until real
  label: string;
}

export interface Project {
  slug: string;
  index: string;
  client: string;
  title: string;
  category: CategoryId;
  year: string;
  /** One line on the result, shown on cards. */
  result: string;
  /** null = placeholder block at the same ratio. */
  cover: string | null;
  gallery: (string | null)[];
  featured: boolean;
  isPlaceholder: boolean;
  /** Project page: the client's problem, 2–3 sentences. */
  need: string;
  /** Project page: what Signature did, 2–4 sentences. */
  response: string;
  /** Project page: real figures only. Leave empty to hide the figures row. */
  figures: ProjectFigure[];
}

const placeholder = (index: string, category: CategoryId, featured: boolean, galleryCount = 4): Project => ({
  slug: `projet-${index}`,
  index,
  client: "[Nom du client]",
  title: "[Titre du projet]",
  category,
  year: "[Année]",
  result: "[Résultat à confirmer]",
  cover: null,
  gallery: Array.from({ length: galleryCount }, () => null),
  featured,
  isPlaceholder: true,
  need: "[Le besoin du client : la situation de départ, en 2 ou 3 phrases.]",
  response: "[Notre réponse : ce que l’équipe a conçu et réalisé, en 2 à 4 phrases.]",
  figures: [
    { value: "[CHIFFRE À CONFIRMER]", label: "[Indicateur]" },
    { value: "[CHIFFRE À CONFIRMER]", label: "[Indicateur]" },
  ],
});

/** Ten placeholders: one per service, four featured (one per pole). */
export const projects: Project[] = [
  placeholder("01", "branding", true),
  placeholder("02", "web-apps", true),
  placeholder("03", "signaletique", true),
  placeholder("04", "contenu", true),
  placeholder("05", "stands", false),
  placeholder("06", "community", false),
  placeholder("07", "design", false),
  placeholder("08", "supports", false),
  placeholder("09", "montage", false),
  placeholder("10", "marketing", false),
];

export const featuredProjects = () => projects.filter((p) => p.featured);
export const getProject = (slug: string) => projects.find((p) => p.slug === slug);
export const nextProject = (slug: string) => {
  const i = projects.findIndex((p) => p.slug === slug);
  return projects[(i + 1) % projects.length];
};
