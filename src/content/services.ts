/**
 * Services, shown as the puzzle grid. One piece per service; clicking it scrolls to the
 * project section of `category`. Order here = order of the pieces.
 */

import type { CategoryId } from "./categories";

export interface Service {
  name: string;
  line: string;
  category: CategoryId;
  /** Photo of the work (public/A-z), in the brand colours. */
  image: string;
}

export const services: Service[] = [
  { name: "Sites web & applications", line: "Conçus, développés et mis en ligne.", category: "site-web", image: "/A-z/devss.webp" },
  { name: "Branding & design", line: "Logo, charte, affiches et supports imprimés.", category: "identite", image: "/A-z/desig,-branding.webp" },
  { name: "Murs peints", line: "Fresques à la main, intérieur et façade.", category: "murs", image: "/A-z/murs.webp" },
  { name: "Tableaux", line: "Toiles sur commande.", category: "tableaux", image: "/A-z/tabs.webp" },
  { name: "Signalétique & décoration", line: "Enseignes, façades et aménagement.", category: "facade", image: "/A-z/decos.webp" },
  { name: "Stands", line: "Salons et événements, du plan au montage.", category: "stands", image: "/A-z/standss.webp" },
  { name: "Contenu & community management", line: "Création, montage, stratégie et animation.", category: "reseaux-sociaux", image: "/A-z/contents.webp" },
];
