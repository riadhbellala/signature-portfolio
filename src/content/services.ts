/**
 * Services, shown as the puzzle grid. One piece per service; clicking it scrolls to the
 * project section of `category`. Order here = order of the pieces.
 */

import type { CategoryId } from "./categories";

export interface Service {
  name: string;
  line: string;
  category: CategoryId;
  /** Illustration (public/helpers), in the brand colours. */
  image: string;
}

export const services: Service[] = [
  { name: "Sites web & applications", line: "Conçus, développés et mis en ligne.", category: "site-web", image: "/helpers/cut/dev.webp" },
  { name: "Branding & design", line: "Logo, charte, affiches et supports imprimés.", category: "identite", image: "/helpers/cut/design.webp" },
  { name: "Murs peints", line: "Fresques à la main, intérieur et façade.", category: "murs", image: "/helpers/cut/murs.webp" },
  { name: "Tableaux", line: "Toiles sur commande.", category: "tableaux", image: "/helpers/cut/table.webp" },
  { name: "Signalétique & décoration", line: "Enseignes, façades et aménagement.", category: "facade", image: "/helpers/cut/deco.webp" },
  { name: "Stands", line: "Salons et événements, du plan au montage.", category: "stands", image: "/helpers/cut/stands.webp" },
  { name: "Contenu & community management", line: "Création, montage, stratégie et animation.", category: "reseaux-sociaux", image: "/helpers/cut/content.webp" },
];
