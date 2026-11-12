/** Interface copy (labels, buttons, titles). Content lives in the other files. */

export const nav = {
  links: [
    { label: "Projets", href: "/#dossiers" },
    { label: "Services", href: "/#services" },
    { label: "Clients", href: "/#clients" },
    { label: "Contact", href: "/#contact" },
  ],
  projectsMenu: "Types de projets",
  projectsAll: "Voir les projets choisis",
  external: "signature-alg.com",
  externalLabel: "Site de l’agence Signature (nouvel onglet)",
  cta: { label: "Nous contacter", href: "/#contact" },
  menuOpen: "Menu",
  menuClose: "Fermer",
  homeLabel: "Signature, accueil",
  skip: "Aller au contenu",
  mainLabel: "Principale",
  mobileLabel: "Mobile",
  categoriesLabel: "Types de projets",
};

export const home = {
  meta: {
    title: "Signature creative co. — Portfolio",
    description: "Les projets de Signature, agence 360° à Oran : sites web, identités, murs, tableaux, façades, stands et réseaux sociaux.",
  },
  hero: {
    title: ["Nos projets,", "pièce par pièce."],
    line: "Agence 360° à Oran — sites web, identité, murs, façades, stands, réseaux sociaux.",
    puzzle: { a: "votre marque", b: "nos solutions", groupLabel: "Votre marque, plus nos solutions" },
    primary: { label: "Démarrer un projet", href: "#contact" },
    secondary: { label: "Voir les projets", href: "#projets" },
    reelTag: "Showreel — Signature creative co. — Oran",
    /** Showreel. Put the file in /public (e.g. "/video/showreel.mp4"); null shows the placeholder. */
    video: {
      src: null as string | null,
      vimeoId: "1245835203" as string | null,
      poster: "https://i.vimeocdn.com/video/2225079737-6983ed37747a3a4f9c93e8576bfb652114a6c893840b3c9e6aa7c75700349a84-d_720x1280" as string | null,
      label: "Showreel Signature",
      pending: "Vidéo à venir",
    },
    indexLabel: "Types de projets",
  },
  showcase: {
    title: "Nos projets, client par client.",
    lead: "Pour chaque marque, trois pièces : la 3D, le résultat, la vidéo.",
    open: "Voir le projet",
  },
  folders: {
    title: "Tous les projets, par service.",
    lead: "Un dossier par service. Ouvrez-en un pour voir tous ses projets.",
  },
  category: {
    count: (n: number) => `${n} projet${n > 1 ? "s" : ""}`,
    soon: "Bientôt",
    empty: "Les projets de ce service arrivent bientôt. En attendant, parlons du vôtre.",
    more: (n: number) => `Voir les ${n} autre${n > 1 ? "s" : ""} projet${n > 1 ? "s" : ""}`,
  },
  services: {
    title: "Ce qu’on peut faire pour vous.",
    lead: "Prenez ce qu’il vous faut : chaque languette ouvre les projets du métier.",
    flyerTitle: "Nos services",
    videosLabel: "Nos vidéos de promotion, présentées par Zahra, commerciale de l’agence.",
    flyerSub: "Prenez ce qu’il vous faut",
    action: "Voir les projets",
  },
  clients: {
    title: "Ils nous ont fait confiance.",
    lead: "Chaque marque est une pièce du puzzle Signature.",
    logoPending: "Logo à venir",
    banner: { image: "/brand/banner-strip.webp", label: "Découvrez notre univers et nos réalisations sur signature-alg.com" },
  },
  contact: {
    title: ["Un projet en tête ?", "On en parle."],
    lead: "Il manque une pièce à votre projet : la conversation. Choisissez la vôtre.",
    whatsappSub: "Message direct",
    piecesLabel: "Nous contacter",
    whatsapp: "Écrire sur WhatsApp",
    phone: "Téléphone",
    email: "E-mail",
    instagram: "Instagram",
    address: "Adresse",
    map: "Voir sur la carte",
    website: "L’agence",
  },
  footer: "© 2026 Signature Consulting — Oran",
};

export const projectPage = {
  back: "Tous les projets",
  gallery: "Galerie",
  more: (client: string) => `Aussi pour ${client}`,
  next: "Projet suivant",
  cta: { title: "Un projet du même genre ?", label: "Nous contacter", href: "/#contact" },
};

export const placeholderImage = { pending: "Image à venir" };
