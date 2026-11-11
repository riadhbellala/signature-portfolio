/**
 * Services, shown as the puzzle grid. One piece per service; clicking it scrolls to the
 * project section of `category`. Order here = order of the pieces.
 */

import type { CategoryId } from "./categories";

export interface Service {
  name: string;
  line: string;
  category: CategoryId;
}

export const services: Service[] = [
  { name: "Sites web & applications", line: "Conçus, développés et mis en ligne.", category: "site-web" },
  { name: "Branding & design", line: "Logo, charte, affiches et supports imprimés.", category: "identite" },
  { name: "Murs peints", line: "Fresques à la main, intérieur et façade.", category: "murs" },
  { name: "Tableaux", line: "Toiles sur commande.", category: "tableaux" },
  { name: "Signalétique & décoration", line: "Enseignes, façades et aménagement.", category: "facade" },
  { name: "Stands", line: "Salons et événements, du plan au montage.", category: "stands" },
  { name: "Contenu & community management", line: "Création, montage, stratégie et animation.", category: "reseaux-sociaux" },
];
