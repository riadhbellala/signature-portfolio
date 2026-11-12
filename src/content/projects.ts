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
}

export type ClientId = "island-petroleum" | "logis" | "montazah" | "royaume-blanc" | "souipanel" | "riff" | "louiz" | "hasena" | "altusplast";

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

export const projects: Project[] = [
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
