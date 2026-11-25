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
  { id: "site-web", name: "Web & mobile", definition: "Votre adresse sur internet et dans la poche de vos clients : sites et applications.", line: "Sites web et applications mobiles, conçus et développés par l’équipe.", ratio: "16/10", layout: "screens", tone: "cream" },
  { id: "identite", name: "Branding & packaging", definition: "Le visage de votre marque, jusque sur ses emballages : logo, couleurs, ton, boîte, étiquette.", line: "Identités de marque complètes et packagings.", ratio: "1/1", layout: "boards", tone: "cream" },
  { id: "murs", name: "Murs", definition: "Une fresque peinte à la main qui transforme un mur en enseigne, en décor ou en repère.", line: "Fresques peintes à la main, en intérieur comme en façade.", ratio: "3/2", layout: "murals", tone: "teal" },
  { id: "tableaux", name: "Tableaux", definition: "Une toile unique, peinte pour un lieu précis : un hall, un bureau, une boutique.", line: "Toiles réalisées sur commande pour vos espaces.", ratio: "4/5", layout: "gallery", tone: "cream" },
  { id: "facade", name: "Façades & grand format", definition: "Ce que le passant voit avant d’entrer, et ce que la ville voit de loin : vitrine, enseigne, bâche.", line: "Conception et montage de façades, enseignes et publicité grand format.", ratio: "3/2", layout: "landscape", tone: "cream" },
  { id: "stands", name: "Stands d’exposition", definition: "Votre espace dans un salon, pensé pour arrêter les visiteurs et leur parler de vous.", line: "Conception 3D, fabrication et montage de stands de salon.", ratio: "3/2", layout: "feature", tone: "teal" },
  { id: "reseaux-sociaux", name: "Réseaux sociaux & production audiovisuelle", definition: "Ce que vos abonnés voient chaque semaine : vidéos, visuels et publications sur vos comptes.", line: "Gestion des réseaux sociaux et production audiovisuelle.", ratio: "4/5", layout: "posts", tone: "cream" },
  { id: "marketing", name: "Stratégie marketing", definition: "Le plan qui relie vos objectifs à vos clients : qui viser, quoi dire, sur quels canaux.", line: "Études, plans de communication et campagnes.", ratio: "16/10", layout: "screens", tone: "cream" },
  { id: "supports", name: "Édition & impression", definition: "Tout ce qui s’imprime à votre nom : catalogues, brochures, supports de marque et objets publicitaires.", line: "Design éditorial, impression UV et numérique, objets publicitaires.", ratio: "4/5", layout: "gallery", tone: "cream" },
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
export const folderOrder: CategoryId[] = ["stands", "facade", "identite", "supports", "reseaux-sociaux", "site-web"];
