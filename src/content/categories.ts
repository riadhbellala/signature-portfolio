/**
 * Project types. The ORDER of this array is the order of the sections on the page,
 * in the hero index and in the sticky category bar. Reorder by moving entries.
 *
 * `tone`: at most 2 teal sections, never two teal in a row (checked by the unit test).
 * `ratio`: the ratio every image of this type is shown at, placeholder or real.
 * `layout`: how the section lays its projects out (see CategoryGrid).
 */

export type CategoryId = "site-web" | "identite" | "murs" | "tableaux" | "facade" | "stands" | "reseaux-sociaux";
export type Ratio = "16/10" | "1/1" | "3/2" | "4/5";
export type Layout = "screens" | "boards" | "murals" | "gallery" | "landscape" | "feature" | "posts";

export interface Category {
  id: CategoryId;
  name: string;
  /** Plain-words definition of the type, for someone who has never ordered one. */
  definition: string;
  /** One line on what Signature does in this field. */
  line: string;
  ratio: Ratio;
  layout: Layout;
  tone: "cream" | "teal";
}

export const categories: Category[] = [
  { id: "site-web", name: "Site web", definition: "Votre adresse sur internet : là où un client vous découvre, vous compare et vous contacte.", line: "Sites vitrines, boutiques en ligne et applications, conçus et développés par l’équipe.", ratio: "16/10", layout: "screens", tone: "cream" },
  { id: "identite", name: "Identité & logo", definition: "Le visage de votre marque : un logo, des couleurs et des règles pour que tout se ressemble.", line: "Logos, couleurs et chartes, prêts à vivre sur tous vos supports.", ratio: "1/1", layout: "boards", tone: "cream" },
  { id: "murs", name: "Murs", definition: "Une fresque peinte à la main qui transforme un mur en enseigne, en décor ou en repère.", line: "Fresques peintes à la main, en intérieur comme en façade.", ratio: "3/2", layout: "murals", tone: "teal" },
  { id: "tableaux", name: "Tableaux", definition: "Une toile unique, peinte pour un lieu précis : un hall, un bureau, une boutique.", line: "Toiles réalisées sur commande pour vos espaces.", ratio: "4/5", layout: "gallery", tone: "cream" },
  { id: "facade", name: "Façade & enseigne", definition: "Ce que le passant voit avant d’entrer : l’enseigne, la vitrine, la façade.", line: "Habillage de boutique, enseignes et signalétique.", ratio: "3/2", layout: "landscape", tone: "cream" },
  { id: "stands", name: "Stands & événements", definition: "Votre espace dans un salon ou un événement, pensé pour arrêter les visiteurs.", line: "Stands de salon et décors d’événement, de la maquette au montage.", ratio: "3/2", layout: "feature", tone: "teal" },
  { id: "reseaux-sociaux", name: "Réseaux sociaux", definition: "Ce que vos abonnés voient chaque semaine : visuels, vidéos et textes publiés sur vos comptes.", line: "Contenus, visuels et vidéos pour vos comptes.", ratio: "4/5", layout: "posts", tone: "cream" },
];

/** Section number shown as (02)…(08): the hero is (01). */
export const categoryNumber = (id: CategoryId) => categories.findIndex((c) => c.id === id) + 2;
export const getCategory = (id: CategoryId) => categories.find((c) => c.id === id)!;
