/**
 * Services: the agency's métiers, grouped as the folders of "Tous les projets, par service".
 * One tile per group in "Ce qu'on fait, de A à Z"; `items` are the services inside it.
 * `image`: the banner (public/services/<category>.webp); null shows the plain tile.
 */

import type { CategoryId } from "./categories";

export interface Service {
  name: string;
  line: string;
  items: string[];
  category: CategoryId;
  image: string | null;
}

export const services: Service[] = [
  { name: "Stands d’exposition", line: "Du plan 3D au montage, un espace qui arrête les visiteurs.", items: ["Conception 3D", "Fabrication", "Montage"], category: "stands", image: "/A-z/standss.webp" },
  { name: "Web & mobile", line: "Sites et applications conçus, développés et mis en ligne.", items: ["Développement web", "Applications mobiles"], category: "site-web", image: "/A-z/devss.webp" },
  { name: "Réseaux sociaux & vidéo", line: "Vos comptes animés, vos vidéos tournées et montées.", items: ["Social media management", "Production audiovisuelle"], category: "reseaux-sociaux", image: "/services/audiovisual.webp" },
  { name: "Branding & packaging", line: "Une marque reconnaissable, jusque sur l’emballage.", items: ["Identité de marque", "Packaging"], category: "identite", image: "/A-z/desig,-branding.webp" },
  { name: "Façades & grand format", line: "Vitrines, enseignes et bâches qui se voient de loin.", items: ["Design et montage de façades", "Publicité grand format"], category: "facade", image: "/services/storefront.webp" },
  { name: "Édition & impression", line: "Tout ce qui s’imprime à votre nom, du catalogue au stylo.", items: ["Design éditorial & print", "Impression de marque", "Impression UV & numérique", "Objets publicitaires"], category: "supports", image: "/services/impression.webp" },
];
