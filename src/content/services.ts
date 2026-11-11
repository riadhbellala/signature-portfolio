/**
 * Services. Ten trades grouped in four poles. The poles are also the project filters,
 * so the filter bar stays short. Order here = order on the page.
 */

export type PoleId = "marque" | "digital" | "contenu" | "espace";

export type ServiceId =
  | "branding"
  | "design"
  | "supports"
  | "web-apps"
  | "community"
  | "marketing"
  | "contenu"
  | "montage"
  | "signaletique"
  | "stands";

export interface Pole {
  id: PoleId;
  name: string;
}

export interface Service {
  id: ServiceId;
  pole: PoleId;
  name: string;
  /** One sentence shown when the service is selected. */
  line: string;
}

export const poles: Pole[] = [
  { id: "marque", name: "Marque" },
  { id: "digital", name: "Digital" },
  { id: "contenu", name: "Contenu" },
  { id: "espace", name: "Espace" },
];

export const services: Service[] = [
  { id: "branding", pole: "marque", name: "Branding", line: "Nom, logo, couleurs et ton : une identité complète, prête à vivre partout." },
  { id: "design", pole: "marque", name: "Design", line: "Affiches, visuels et maquettes, pour l’écran comme pour l’impression." },
  { id: "supports", pole: "marque", name: "Supports imprimés", line: "Flyers, cartes de visite, brochures et menus, de la maquette à l’impression." },
  { id: "web-apps", pole: "digital", name: "Sites web & applications", line: "Sites vitrines, boutiques en ligne et applications, conçus et développés par l’équipe." },
  { id: "community", pole: "digital", name: "Community management", line: "Vos comptes animés chaque jour : calendrier, publications et réponses." },
  { id: "marketing", pole: "digital", name: "Stratégies marketing", line: "Un plan clair : vos cibles, vos messages, vos canaux et votre budget." },
  { id: "contenu", pole: "contenu", name: "Création de contenu", line: "Photos, vidéos et textes produits pour vos réseaux et vos campagnes." },
  { id: "montage", pole: "contenu", name: "Montage", line: "Montage vidéo, habillage et sous-titres, livrés prêts à publier." },
  { id: "signaletique", pole: "espace", name: "Signalétique & décoration", line: "Enseignes, façades, murs peints et décoration de vos espaces." },
  { id: "stands", pole: "espace", name: "Stands", line: "Stands de salon et d’événement, conçus, fabriqués et montés." },
];

export const serviceName = (id: ServiceId) => services.find((s) => s.id === id)?.name ?? id;
export const servicePole = (id: ServiceId) => services.find((s) => s.id === id)?.pole ?? "marque";
export const poleName = (id: PoleId) => poles.find((p) => p.id === id)?.name ?? id;
