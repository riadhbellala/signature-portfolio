/** Interface copy (labels, buttons, titles). Content lives in the other files. */

export const nav = {
  links: [
    { label: "Projets", href: "/projets" },
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
    title: ["Agence 360° à Oran,", "de l’idée au montage."],
    line: "Stands de salon, vidéos, sites web et identités de marque, conçus et réalisés par une seule équipe.",
    puzzle: { a: "votre marque", b: "nos solutions", groupLabel: "Votre marque, plus nos solutions" },
    primary: { label: "Démarrer un projet", href: "#contact" },
    /** Shortcut for visitors in a hurry: straight to the page with every project. */
    rush: { kicker: "Pressé ?", hint: "Tous nos projets, classés par service, en un clic.", title: "Tous nos projets", count: (n: number) => `${n} projets`, href: "/projets" },
    /** Showreel. Put the file in /public (e.g. "/video/showreel.mp4"); null shows the placeholder. */
    video: {
      src: null as string | null,
      vimeoId: "1246303778" as string | null,
      /** Length in seconds (Vimeo): the hero splits its puzzle just before the end. */
      duration: 6,
      poster: "https://i.vimeocdn.com/video/2225662275-a2e1c5273745ba045abd3d92c02a4cdda6144d226d27abb4b1a5878cdae08f04-d_720x1280" as string | null,
      label: "Showreel Signature",
      pending: "Vidéo à venir",
    },
    indexLabel: "Types de projets",
    /** From the agency's own banner (public/brand/banner-strip.webp). */
    stats: [
      { value: "600", label: "clients accompagnés depuis nos débuts" },
      { value: "15", label: "ans à concevoir stands, sites et marques" },
    ],
    mobileServices: [
      { id: "stands", label: "Stands" },
      { id: "facade", label: "Façades" },
      { id: "site-web", label: "Sites web" },
      { id: "identite", label: "Branding" },
    ],
    bgAlt: "Un stand de salon aux arches teal, salon crème et touches ocre, dans un hall d’exposition",
    talk: "Un projet ? Écrivez-nous sur WhatsApp.",
    trusted: "Ils nous font confiance :",
    trustedMore: (n: number) => `et ${n} autres.`,
    soundOn: "Activer le son",
    soundOff: "Couper le son",
  },
  showcase: {
    title: "Nos derniers projets.",
    lead: "Stands, sites web, marques, vidéos et impression : un projet par image. Ouvrez-en un pour tout voir.",
    open: "Voir le projet",
    start: "Un projet similaire",
  },
  projectsPage: {
    metaTitle: "Tous nos projets",
    metaDescription: "Tous les projets de Signature creative co., classés par service : stands, vidéo, développement, branding, supports.",
    back: "Retour à l’accueil",
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
    title: "Ce qu’on fait, de A à Z.",
    lead: "Six pôles, quatorze métiers, une seule équipe. Chaque carte ouvre ses projets.",
    customTitle: "Un besoin qui n’est pas dans la liste ?",
    customAction: "Parlons-en",
    flyerTitle: "Nos services",
    videosLabel: "L’agence, en vidéo.",
    videosKicker: "Signature en vidéo",
    videosLine: "Trois courtes vidéos pour découvrir nos sites web, nos menus et l’équipe Signature.",
    videosCta: "Nos vidéos réseaux sociaux",
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
    mapLabel: "Plan",
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
