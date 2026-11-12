/**
 * Project types. The ORDER of this array is the order of the sections on the page,
 * in the hero index and in the sticky category bar. Reorder by moving entries.
 *
 * `tone`: at most 2 teal sections, never two teal in a row (checked by the unit test).
 * `ratio`: the ratio every image of this type is shown at, placeholder or real.
 * `layout`: how the section lays its projects out (see CategoryGrid).
 */

export type CategoryId = "site-web" | "identite" | "murs" | "tableaux" | "facade" | "stands" | "reseaux-sociaux" | "marketing" | "supports";
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
  { id: "site-web", name: "Développement", definition: "Votre adresse sur internet : sites et applications où un client vous découvre, vous compare et vous contacte.", line: "Sites vitrines, boutiques en ligne et applications, conçus et développés par l’équipe.", ratio: "16/10", layout: "screens", tone: "cream" },
  { id: "identite", name: "Branding", definition: "Le visage de votre marque : un nom, un logo, des couleurs et un ton reconnaissables partout.", line: "Logos, chartes graphiques et identités complètes.", ratio: "1/1", layout: "boards", tone: "cream" },
  { id: "murs", name: "Murs", definition: "Une fresque peinte à la main qui transforme un mur en enseigne, en décor ou en repère.", line: "Fresques peintes à la main, en intérieur comme en façade.", ratio: "3/2", layout: "murals", tone: "teal" },
  { id: "tableaux", name: "Tableaux", definition: "Une toile unique, peinte pour un lieu précis : un hall, un bureau, une boutique.", line: "Toiles réalisées sur commande pour vos espaces.", ratio: "4/5", layout: "gallery", tone: "cream" },
  { id: "facade", name: "Façade & enseigne", definition: "Ce que le passant voit avant d’entrer : l’enseigne, la vitrine, la façade.", line: "Habillage de boutique, enseignes et signalétique.", ratio: "3/2", layout: "landscape", tone: "cream" },
  { id: "stands", name: "Stands & événements", definition: "Votre espace dans un salon ou un événement, pensé pour arrêter les visiteurs.", line: "Stands de salon et décors d’événement, de la maquette au montage.", ratio: "3/2", layout: "feature", tone: "teal" },
  { id: "reseaux-sociaux", name: "Vidéo & réseaux sociaux", definition: "Ce que vos abonnés voient chaque semaine : vidéos, visuels et textes publiés sur vos comptes.", line: "Contenus, visuels et vidéos pour vos comptes.", ratio: "4/5", layout: "posts", tone: "cream" },
  { id: "marketing", name: "Stratégie marketing", definition: "Le plan qui relie vos objectifs à vos clients : qui viser, quoi dire, sur quels canaux.", line: "Études, plans de communication et campagnes.", ratio: "16/10", layout: "screens", tone: "cream" },
  { id: "supports", name: "Création de supports", definition: "Tout ce qui s’imprime à votre nom : flyers, affiches, menus, cartes et brochures.", line: "Flyers, affiches, menus, cartes de visite et brochures.", ratio: "4/5", layout: "gallery", tone: "cream" },
];

/** Section number shown as (02)…(08): the hero is (01). */
/** Number shown next to a type: its position among the folders (01…), else after them. */
export const categoryNumber = (id: CategoryId) => {
  const f = folderOrder.indexOf(id);
  return f >= 0 ? f + 1 : folderOrder.length + categories.filter((c) => !folderOrder.includes(c.id)).findIndex((c) => c.id === id) + 1;
};
export const getCategory = (id: CategoryId) => categories.find((c) => c.id === id)!;

/**
 * The folders of "Tous les projets, par service", in this order. A folder with no projects yet
 * is still shown, marked "Bientôt" — add projects to projects.ts and it fills itself.
 */
export const folderOrder: CategoryId[] = ["stands", "reseaux-sociaux", "site-web", "identite", "marketing", "supports"];
