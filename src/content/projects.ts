/**
 * Real projects (from the client's Drive and Vimeo). Edit here only.
 * - Images: files in /public/projets/… (extracted from the stand PDFs).
 * - Videos: Vimeo id + its thumbnail; `portrait` true for 9:16 reels.
 * A project belongs to one client and one type (categories.ts). Counts are computed.
 */

import { categories, folderOrder, getCategory, type CategoryId } from "./categories";
import ratios from "./media-ratios.json";

/** `ratio` = width / height of the real picture or video, so pieces take its shape. */
export type Media =
  | { kind: "image"; src: string; alt: string; ratio: number }
  | { kind: "video"; vimeo: string; thumb: string; portrait: boolean; title: string; ratio: number };

export interface Project {
  slug: string;
  client: ClientId;
  category: CategoryId;
  title: string;
  /** 2–3 lines for the project page. */
  brief: string;
  media: Media[];
  /** Live site, for web work: linked from the project page. */
  url?: string;
}

export type ClientId = "island-petroleum" | "logis" | "montazah" | "royaume-blanc" | "souipanel" | "riff" | "louiz" | "hasena" | "altusplast" | "pharma-express" | "yas-home" | "batioil" | "signature" | "etinia" | "kayaki" | "riadh-moulins" | "la-lionne" | "kinkers" | "madi-sushi" | "ya-hala" | "palais-dor" | "sour-khaled" | "el-bayrak" | "btp-mebarki" | "belgaid" | "broderie-royale" | "geo-medica" | "naps" | "ndwi";

export interface Client {
  id: ClientId;
  name: string;
  /** Path in /public to the client's logo (teal, one colour). null = name set in type. */
  logo: string | null;
  /** One line under the name in the client block. */
  line: string;
}

export const clients: Client[] = [
  { id: "island-petroleum", name: "Island Petroleum", logo: null, line: "Quatre propositions de stand en 3D pour le salon de l’énergie." },
  { id: "logis", name: "Logis", logo: null, line: "Le stand, de la 3D au salon, et sa vidéo." },
  { id: "montazah", name: "Mountazah Promotion", logo: null, line: "Stand de promotion immobilière, conçu en 3D puis filmé au salon." },
  { id: "royaume-blanc", name: "Royaume Blanc", logo: null, line: "Le stand imaginé en 3D, puis monté tel quel." },
  { id: "souipanel", name: "Souipanel", logo: null, line: "Stand en 3D, stand monté et vidéo du salon." },
  { id: "riff", name: "RIFF Promotion", logo: null, line: "Stand immobilier en 3D et vidéos de promotion." },
  { id: "louiz", name: "Louiz", logo: null, line: "Vidéos des journées de salon." },
  { id: "hasena", name: "Hasena", logo: null, line: "Vidéo de présentation." },
  { id: "altusplast", name: "Altusplast", logo: null, line: "Film de présentation de l’entreprise." },
  { id: "pharma-express", name: "Pharma Express", logo: null, line: "Le site de l’application." },
  { id: "yas-home", name: "Yas Home", logo: null, line: "La plateforme immobilière." },
  { id: "batioil", name: "Batioil", logo: null, line: "Le site de la marque de lubrifiants." },
  { id: "signature", name: "Signature creative co.", logo: null, line: "Notre propre site." },
  { id: "etinia", name: "Etinia", logo: null, line: "Le packaging de la gamme de gels douche." },
  { id: "kayaki", name: "Kayaki", logo: null, line: "Logo et cartes de visite." },
  { id: "riadh-moulins", name: "Riadh Moulins", logo: null, line: "Le packaging de la farine." },
  { id: "la-lionne", name: "La Lionne", logo: null, line: "Les sacs de farine, du 1 kg au 50 kg." },
  { id: "kinkers", name: "Kinker’s", logo: null, line: "L’emballage de la barre au nougat." },
  { id: "madi-sushi", name: "Madi Sushi", logo: null, line: "Les boîtes à emporter." },
  { id: "ya-hala", name: "Ya Hala", logo: null, line: "Les emballages du restaurant." },
  { id: "palais-dor", name: "Palais d’Or Construction", logo: null, line: "Cartes de visite." },
  { id: "sour-khaled", name: "Sour Khaled", logo: null, line: "L’habillage du véhicule de livraison." },
  { id: "el-bayrak", name: "El Bayrak Construction", logo: null, line: "Le calendrier 2025." },
  { id: "btp-mebarki", name: "BTP Mebarki", logo: null, line: "Les beach flags." },
  { id: "belgaid", name: "Promotion Belgaid", logo: null, line: "La brochure du programme immobilier." },
  { id: "broderie-royale", name: "Broderie Royale Algérie", logo: null, line: "Cartes de visite." },
  { id: "geo-medica", name: "Geo Medica", logo: null, line: "La brochure Via Care." },
  { id: "naps", name: "Nap’s", logo: null, line: "Le menu." },
  { id: "ndwi", name: "NDWi", logo: null, line: "L’habillage du camion." },
];

const img = (dir: string, n: number, alt: string): Media => {
  const name = `${dir}-${String(n).padStart(2, "0")}`;
  return { kind: "image", src: `/projets/stands/${name}.webp`, alt, ratio: (ratios as Record<string, number>)[name] ?? 1.5 };
};
const imgs = (dir: string, count: number, alt: string) => Array.from({ length: count }, (_, i) => img(dir, i + 1, `${alt}, vue ${i + 1}`));
const vimeo = (id: string, thumb: string, title: string, portrait = true): Media => ({
  kind: "video",
  vimeo: id,
  // 1280px thumbnails: sharp at the size the pieces are shown.
  thumb: `https://i.vimeocdn.com/video/${thumb}-d_${portrait ? "720x1280" : "1280x720"}`,
  portrait,
  title,
  ratio: portrait ? 9 / 16 : 16 / 9,
});

const V = {
  logis: vimeo("1246212082", "2225543369-2a4604073f08d75824de2f4a84f50ad4c35a22da309001d77e7d00eebdccd4d3", "Logis, vidéo du stand"),
  montazah: vimeo("1246212088", "2225543357-614d244d71c6071ab06da6dc5a760718d9a4c3d73bcc5ccd529e3391fdf02c73", "Mountazah, vidéo du stand"),
  souipanel: vimeo("1246220225", "2225553681-e38a4554b57f3ed0e0cc0682a2e6760f755247f5e3716c1013ef1b3d61c691ac", "Souipanel, vidéo du stand"),
  riffCollage: vimeo("1246220224", "2225554127-6f1190d10d77e07ad42f62f7b7d58bc09edbe8325784ae8d68af4e42775fc3dd", "RIFF, collage vidéo"),
  riffPromo: vimeo("1246220229", "2225554665-c45ee11f93fdd05ff767cf9f5609d4eacd08e6fe489f16c7ab3d6892528c95ce", "RIFF Promotion, film", false),
  zahraSite: vimeo("1246219262", "2225552431-5607d67894f624819b6870011d8b6f064ab7d61e01f59caf11c48bc049a104ca", "Signature, sites web — présenté par Zahra"),
  zahraSignature: vimeo("1246219263", "2225552573-9ce5f59d381f8ed9814f9a778bc318fac4b84c5bacba03df5a4577d06239db01", "Signature, vidéo de l’agence — présentée par Zahra"),
  zahraMenu: vimeo("1246219302", "2225552487-a11de38ed830914be96540437da5b204c80ccb8c5af1fdf4cc1bba7e597be57b", "Signature, menus — présenté par Zahra"),
  louiz1: vimeo("1246213183", "2225546069-2313c53f622f31f73799d07c1fbde6bd11d99c01db8d85eeff42f987002cb159", "Louiz, salon jour 1"),
  louiz2: vimeo("1246213184", "2225545959-66766f77af45da05a7195cd3112726961e977d4e71aa7a197504c0901f44c106", "Louiz, salon jour 2"),
  hasena: vimeo("1246213181", "2225546905-cee9333ad7778f0d8397d23d6c88cbc7af9818add93ae1d45b724f0090500b1f", "Hasena Millénium"),
  altusplast: vimeo("1246213185", "2225545685-767cd3fe413f2b1257a1819a072bbca4291350083646cfadaf2cb568c42e324c", "Altusplast, film", false),
};

/** A site the agency built, shown in device mockups (public/dev, built from retina screenshots). */
const site = (id: string, name: string): Media[] => [
  { kind: "image", src: `/dev/${id}-mockup-laptop.webp`, alt: `${name}, le site sur ordinateur`, ratio: 4 / 3 },
  { kind: "image", src: `/dev/${id}-mockup-trio.webp`, alt: `${name}, le site sur ordinateur, tablette et téléphone`, ratio: 4 / 3 },
  { kind: "image", src: `/dev/${id}-mockup-mobile.webp`, alt: `${name}, le site sur tablette et téléphone`, ratio: 4 / 3 },
];

export const projects: Project[] = [
  { slug: "etinia-packaging", client: "etinia", category: "identite", title: "Packaging", brief: "Les flacons de gel douche Etinia : quatre parfums, quatre couleurs, une même gamme.", media: [{ kind: "image", src: "/projets/creations/etinia-packaging.webp", alt: "Les quatre flacons de gel douche Etinia", ratio: 1.4004 }] },
  { slug: "kayaki-identite", client: "kayaki", category: "identite", title: "Identité visuelle", brief: "Le logo de Kayaki, décliné sur ses cartes de visite.", media: [{ kind: "image", src: "/projets/creations/kayaki-identite.webp", alt: "Logo et cartes de visite Kayaki", ratio: 0.8166 }] },
  { slug: "riadh-moulins-farine", client: "riadh-moulins", category: "identite", title: "Packaging", brief: "Le paquet de farine Riadh Moulins, en français et en arabe.", media: [{ kind: "image", src: "/projets/creations/riadh-moulins-farine.webp", alt: "Paquets de farine Riadh Moulins", ratio: 1.3845 }] },
  { slug: "la-lionne-farine", client: "la-lionne", category: "identite", title: "Packaging", brief: "Toute la gamme de farine La Lionne : paquets et sacs de 25 et 50 kg.", media: [{ kind: "image", src: "/projets/creations/la-lionne-farine.webp", alt: "Paquets de farine La Lionne", ratio: 1.5094 }, { kind: "image", src: "/projets/creations/la-lionne-25kg.webp", alt: "Sac de farine La Lionne, 25 kg", ratio: 1.1497 }, { kind: "image", src: "/projets/creations/la-lionne-50kg.webp", alt: "Sac de farine La Lionne, 50 kg", ratio: 1.1497 }] },
  { slug: "kinkers-packaging", client: "kinkers", category: "identite", title: "Packaging", brief: "L’emballage de la barre au nougat Kinker’s.", media: [{ kind: "image", src: "/projets/creations/kinkers-packaging.webp", alt: "Barre au nougat Kinker’s", ratio: 1.2075 }] },
  { slug: "madi-sushi-packaging", client: "madi-sushi", category: "identite", title: "Packaging", brief: "Les boîtes à sushis de Madi Sushi, à emporter.", media: [{ kind: "image", src: "/projets/creations/madi-sushi-packaging.webp", alt: "Boîtes à sushis Madi Sushi", ratio: 1.4942 }] },
  { slug: "ya-hala-packaging", client: "ya-hala", category: "identite", title: "Packaging", brief: "Les emballages du restaurant Ya Hala pour son poulet croustillant.", media: [{ kind: "image", src: "/projets/creations/ya-hala-packaging.webp", alt: "Emballages Ya Hala", ratio: 1.0 }] },
  { slug: "palais-dor-cartes", client: "palais-dor", category: "supports", title: "Cartes de visite", brief: "Les cartes de visite de Palais d’Or Construction, en doré sur blanc.", media: [{ kind: "image", src: "/projets/creations/palais-dor-cartes.webp", alt: "Cartes de visite Palais d’Or Construction", ratio: 1.3333 }] },
  { slug: "sour-khaled-vehicule", client: "sour-khaled", category: "supports", title: "Habillage de véhicule", brief: "Le véhicule de livraison de Sour Khaled habillé aux couleurs de ses produits.", media: [{ kind: "image", src: "/projets/creations/sour-khaled-vehicule.webp", alt: "Fourgon habillé Sour Khaled", ratio: 1.8165 }] },
  { slug: "el-bayrak-calendrier", client: "el-bayrak", category: "supports", title: "Calendrier 2025", brief: "Le calendrier de bureau 2025 d’El Bayrak Construction.", media: [{ kind: "image", src: "/projets/creations/el-bayrak-calendrier.webp", alt: "Calendrier 2025 El Bayrak", ratio: 1.4667 }] },
  { slug: "btp-mebarki-flags", client: "btp-mebarki", category: "supports", title: "Beach flags", brief: "Les beach flags de BTP Mebarki, pour être vu de loin.", media: [{ kind: "image", src: "/projets/creations/btp-mebarki-flags.webp", alt: "Beach flags BTP Mebarki", ratio: 1.3333 }] },
  { slug: "belgaid-brochure", client: "belgaid", category: "supports", title: "Brochure", brief: "La brochure du programme immobilier Belgaid : plans des appartements et contacts.", media: [{ kind: "image", src: "/projets/creations/belgaid-brochure.webp", alt: "Brochure Promotion Belgaid", ratio: 1.1463 }] },
  { slug: "broderie-royale-cartes", client: "broderie-royale", category: "supports", title: "Cartes de visite", brief: "Les cartes de visite de Broderie Royale Algérie, Maison du Drapeau.", media: [{ kind: "image", src: "/projets/creations/broderie-royale-cartes.webp", alt: "Cartes de visite Broderie Royale", ratio: 1.0081 }] },
  { slug: "geo-medica-brochure", client: "geo-medica", category: "supports", title: "Brochure", brief: "La brochure Via Care de Geo Medica.", media: [{ kind: "image", src: "/projets/creations/geo-medica-brochure.webp", alt: "Brochure Via Care", ratio: 1.5 }] },
  { slug: "island-petroleum-iso", client: "island-petroleum", category: "supports", title: "Brochure", brief: "Le dossier des certifications d’Island Petroleum.", media: [{ kind: "image", src: "/projets/creations/island-petroleum-iso.webp", alt: "Brochure des certifications Island Petroleum", ratio: 1.5 }] },
  { slug: "naps-menu", client: "naps", category: "supports", title: "Menu", brief: "Le menu de Nap’s.", media: [{ kind: "image", src: "/projets/creations/naps-menu.webp", alt: "Menu Nap’s", ratio: 1.8713 }] },
  { slug: "ndwi-camion", client: "ndwi", category: "supports", title: "Habillage de camion", brief: "Le camion de NDWi habillé de sa campagne « More than a door ».", media: [{ kind: "image", src: "/projets/creations/ndwi-camion.webp", alt: "Camion habillé NDWi", ratio: 1.786 }] },
  { slug: "riff-site", client: "riff", category: "site-web", title: "Site web", brief: "Le site de RIFF Promotion : ses programmes immobiliers, ses projets et sa galerie.", media: site("riff", "RIFF Promotion"), url: "https://riffpromotion.com" },
  { slug: "pharma-express-site", client: "pharma-express", category: "site-web", title: "Site web", brief: "Le site de l’application Pharma Express : ce qu’elle fait, comment l’utiliser, où la télécharger.", media: site("pharma", "Pharma Express"), url: "https://pharmaexpress.app" },
  { slug: "yas-home-site", client: "yas-home", category: "site-web", title: "Site web", brief: "La plateforme immobilière Yas Home : recherche de biens, nouveaux projets et annonces.", media: site("yas", "Yas Home"), url: "https://yas-home.com" },
  { slug: "batioil-site", client: "batioil", category: "site-web", title: "Site web", brief: "Le site de Batioil : les catégories de produits, les meilleures ventes et la marque.", media: site("batioil", "Batioil"), url: "https://batioil.com" },
  { slug: "signature-site", client: "signature", category: "site-web", title: "Site web", brief: "Le site de l’agence Signature creative co. : nos services, nos réalisations et nos partenaires.", media: site("signature", "Signature creative co."), url: "https://signature-alg.com" },
  {
    slug: "island-petroleum-stands",
    client: "island-petroleum",
    category: "stands",
    title: "Stands en 3D, quatre propositions",
    brief: "Quatre directions pour le stand d’Island Petroleum : volumes, lumière, accueil et espaces de rendez-vous, rendus en 3D avant fabrication.",
    media: [...imgs("ip-1-3d", 11, "Island Petroleum, proposition 1"), ...imgs("ip-2-3d", 12, "Island Petroleum, proposition 2"), ...imgs("ip-3-3d", 5, "Island Petroleum, proposition 3"), ...imgs("ip-4-3d", 8, "Island Petroleum, proposition 4")],
  },
  {
    slug: "logis-stand",
    client: "logis",
    category: "stands",
    title: "Stand de salon",
    brief: "Le stand Logis conçu en 3D, puis réalisé et filmé pendant le salon.",
    media: [...imgs("logis-3d", 5, "Logis, stand en 3D"), V.logis],
  },
  {
    slug: "montazah-stand",
    client: "montazah",
    category: "stands",
    title: "Stand de promotion immobilière",
    brief: "Un stand bleu nuit aux lignes de façade, pensé pour présenter les programmes de Mountazah Promotion.",
    media: [...imgs("montazah-3d", 8, "Mountazah, stand en 3D"), V.montazah],
  },
  {
    slug: "royaume-blanc-stand",
    client: "royaume-blanc",
    category: "stands",
    title: "Stand, de la 3D au montage",
    brief: "Les matières de Royaume Blanc mises en scène : le stand en 3D, puis le stand monté au salon.",
    media: [...imgs("royaume-blanc-reel", 4, "Royaume Blanc, stand monté"), ...imgs("royaume-blanc-3d", 6, "Royaume Blanc, stand en 3D")],
  },
  {
    slug: "souipanel-stand",
    client: "souipanel",
    category: "stands",
    title: "Stand de salon",
    brief: "Rouge, noir et nuancier de panneaux : le stand Souipanel en 3D, monté, puis filmé.",
    media: [...imgs("souipanel-reel", 3, "Souipanel, stand monté"), ...imgs("souipanel-3d", 2, "Souipanel, stand en 3D"), V.souipanel],
  },
  {
    slug: "riff-stand",
    client: "riff",
    category: "stands",
    title: "Stand de promotion immobilière",
    brief: "Le stand RIFF Promotion en 3D : maquettes, comptoir et grands visuels des programmes.",
    media: imgs("riff-3d", 7, "RIFF Promotion, stand en 3D"),
  },
  {
    slug: "riff-videos",
    client: "riff",
    category: "reseaux-sociaux",
    title: "Vidéos de promotion",
    brief: "Un collage vertical pour les réseaux et un film de promotion des programmes RIFF.",
    media: [V.riffCollage, V.riffPromo],
  },
  {
    slug: "louiz-salon",
    client: "louiz",
    category: "reseaux-sociaux",
    title: "Journées de salon",
    brief: "Les journées de Louiz au salon, montées en vidéos verticales.",
    media: [V.louiz1, V.louiz2],
  },
  {
    slug: "hasena-video",
    client: "hasena",
    category: "reseaux-sociaux",
    title: "Vidéo de présentation",
    brief: "Hasena Millénium, en vidéo verticale.",
    media: [V.hasena],
  },
  {
    slug: "altusplast-film",
    client: "altusplast",
    category: "reseaux-sociaux",
    title: "Film d’entreprise",
    brief: "Le film de présentation d’Altusplast.",
    media: [V.altusplast],
  },
];

/**
 * Client blocks (puzzle layout): the order on the page and the three pieces each shows,
 * as [project slug, media index] pairs.
 */
export const showcase: { client: ClientId; pieces: [string, number][] }[] = [
  { client: "logis", pieces: [["logis-stand", 0], ["logis-stand", 2], ["logis-stand", 5]] },
  { client: "royaume-blanc", pieces: [["royaume-blanc-stand", 0], ["royaume-blanc-stand", 4], ["royaume-blanc-stand", 2]] },
  { client: "montazah", pieces: [["montazah-stand", 0], ["montazah-stand", 8], ["montazah-stand", 4]] },
  { client: "souipanel", pieces: [["souipanel-stand", 0], ["souipanel-stand", 3], ["souipanel-stand", 5]] },
  { client: "riff", pieces: [["riff-stand", 1], ["riff-videos", 0], ["riff-stand", 6]] },
  { client: "island-petroleum", pieces: [["island-petroleum-stands", 1], ["island-petroleum-stands", 16], ["island-petroleum-stands", 30]] },
];

/**
 * Signature's own promotional videos, presented by Zahra (commerciale de l'agence). Not client
 * work: shown with the services, each next to the service it promotes.
 */
export const agencyVideos: { title: string; media: Media }[] = [
  { title: "Nos sites web", media: V.zahraSite },
  { title: "Nos menus", media: V.zahraMenu },
  { title: "Signature, en vidéo", media: V.zahraSignature },
];

export const getClient = (id: ClientId) => clients.find((c) => c.id === id)!;
export const getProject = (slug: string) => projects.find((p) => p.slug === slug);
export const projectsIn = (id: CategoryId) => projects.filter((p) => p.category === id);
export const projectsOf = (id: ClientId) => projects.filter((p) => p.client === id);
/** Types that have work, in categories.ts order: one folder each. */
export const categoriesWithWork = () => categories.filter((c) => projectsIn(c.id).length > 0);
/** The service folders, in folderOrder, empty ones included. */
export const folders = () => folderOrder.map(getCategory);
export const cover = (p: Project) => p.media[0];
export const thumbOf = (m: Media) => (m.kind === "image" ? m.src : m.thumb);

/** Next project of the same type, wrapping round. */
export const nextInCategory = (p: Project) => {
  const list = projectsIn(p.category);
  return list[(list.indexOf(p) + 1) % list.length];
};
