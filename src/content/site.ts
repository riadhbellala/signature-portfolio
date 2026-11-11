/** Interface copy: navigation, section titles, buttons. All French. */

export const nav = {
  links: [
    { label: "Projets", href: "/#projets" },
    { label: "Services", href: "/#services" },
    { label: "L’agence", href: "/#agence" },
    { label: "Contact", href: "/#contact" },
  ],
  cta: { label: "Démarrer un projet", href: "/#contact" },
  menuOpen: "Menu",
  menuClose: "Fermer",
  homeLabel: "Signature, accueil",
  skip: "Aller au contenu",
  mainLabel: "Principale",
  mobileLabel: "Mobile",
  footerLabel: "Pied de page",
};

export const home = {
  meta: {
    title: "Signature creative co. — Agence 360° à Oran",
    description:
      "Agence de publicité et de marketing 360° à Oran : branding, design, sites web et applications, contenu, community management, signalétique et stands.",
  },
  hero: {
    title: ["Votre marque,", "on la construit."],
    sentence:
      "Agence 360° à Oran. Branding, sites et applications, contenu, signalétique et stands : chaque pièce de votre image, posée par la même équipe.",
    primary: { label: "Voir nos projets", href: "#projets" },
    secondary: { label: "Démarrer un projet", href: "#contact" },
    puzzle: { a: "votre marque", b: "nos solutions", groupLabel: "Votre marque, plus nos solutions : la pièce qui manquait." },
    peek: "Derniers projets",
  },
  selected: {
    title: "Projets choisis",
    lead: "Quatre réalisations, une par métier.",
    open: "Voir le projet",
    next: { label: "Ils nous font confiance", href: "#clients" },
  },
  clients: {
    title: "Ils nous ont confié leur image.",
    lead: "Chaque client est une pièce du mur. Il en reste une.",
    logoPending: "Logo à venir",
    invite: { label: "Votre marque ici ?", action: "Démarrer un projet", href: "#contact" },
    next: { label: "Ce que l’on fait", href: "#services" },
  },
  services: {
    title: "Chaque pièce de votre image",
    lead: "Dix métiers, quatre pôles, une seule équipe. Choisissez une pièce.",
    action: "Voir les projets",
    listLabel: "Nos services",
    next: { label: "Tous les projets", href: "#tous-les-projets" },
  },
  all: {
    title: "Tous les projets",
    lead: "Filtrez par pôle pour trouver le projet qui ressemble au vôtre.",
    filterLabel: "Filtrer par pôle",
    all: "Tous",
    more: "Voir plus",
    empty: "Pas encore de projet publié dans ce pôle.",
    emptyAction: "Voir tous les projets",
    count: (shown: number, total: number) => `${shown} sur ${total}`,
    next: { label: "Qui sommes-nous", href: "#agence" },
  },
  agency: { statsLabel: "Signature en chiffres", next: { label: "Parlons de votre projet", href: "#contact" } },
  testimonials: { title: "Ce qu’en disent nos clients" },
  cta: {
    title: ["Un projet en tête ?", "On en parle."],
    intro: "Écrivez-nous ou appelez, on vous répond.",
    whatsapp: "Écrire sur WhatsApp",
    phone: "Téléphone",
    email: "E-mail",
    address: "Adresse",
    instagram: "Instagram",
  },
  footer: { rights: "© 2026 Signature Consulting", tagline: "Agence 360° · Oran" },
};

export const projectPage = {
  back: "Tous les projets",
  backHref: "/#tous-les-projets",
  labels: { client: "Client", category: "Service", year: "Année" },
  need: "Le besoin",
  response: "Notre réponse",
  gallery: "En images",
  result: "Le résultat",
  cta: { title: "Un projet du même genre ?", label: "Démarrer un projet", href: "/#contact" },
  next: "Projet suivant",
};

export const placeholderImage = { pending: "Image à venir" };
