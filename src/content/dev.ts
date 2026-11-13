/**
 * Sites built by the agency (Développement). Each one is shown scrolling on a laptop, a tablet and
 * a phone: real screen recordings of the live site, in /public/dev/<id>-<device>.mp4 (+ .jpg poster).
 */

export type Device = "desktop" | "tablet" | "phone";

export interface DevSite {
  id: string;
  name: string;
  domain: string;
  url: string;
  /** What the site is, in a few words. */
  kind: string;
}

export const devSites: DevSite[] = [
  { id: "riff", name: "RIFF Promotion", domain: "riffpromotion.com", url: "https://riffpromotion.com", kind: "Promotion immobilière" },
  { id: "pharma", name: "Pharma Express", domain: "pharmaexpress.app", url: "https://pharmaexpress.app", kind: "Application de pharmacie" },
  { id: "yas", name: "Yas Home", domain: "yas-home.com", url: "https://yas-home.com", kind: "Plateforme immobilière" },
  { id: "batioil", name: "Batioil", domain: "batioil.com", url: "https://batioil.com", kind: "Lubrifiants" },
  { id: "signature", name: "Signature creative co.", domain: "signature-alg.com", url: "https://signature-alg.com", kind: "Notre propre site" },
];

export const devMedia = (id: string, device: Device) => ({ video: `/dev/${id}-${device}.mp4`, poster: `/dev/${id}-${device}.jpg` });

export const devCopy = {
  eyebrow: "Développement",
  title: ["Des sites web", "qui travaillent pour vous."],
  lead: "Cinq sites conçus et développés par l’équipe, pour l’ordinateur comme pour le téléphone. Choisissez-en un : il défile en direct.",
  listLabel: "Sites réalisés",
  visit: "Visiter le site",
  devicesLabel: (name: string) => `${name} sur ordinateur, tablette et téléphone`,
};
