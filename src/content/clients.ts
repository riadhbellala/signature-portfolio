/**
 * Clients. Real clients only, logos supplied by the agency (public/clients; SVG preferred, rasters only where no SVG), squared into tiles in
 * public/clients/tiles on each brand's own background colour. An empty list hides the section.
 */

export interface Client {
  name: string;
  logo: string | null;
}

export const clients: Client[] = [
  { name: "Island Petroleum", logo: "/clients/tiles/island-petroleum.webp" },
  { name: "SOMI Ascenseurs", logo: "/clients/tiles/somi.webp" },
  { name: "RIFF Promotion", logo: "/clients/tiles/riff.webp" },
  { name: "Royaume Blanc", logo: "/clients/tiles/royaume-blanc.webp" },
  { name: "Pharma Express", logo: "/clients/tiles/pharma-express.webp" },
  { name: "Mountazah Promotion", logo: "/clients/tiles/mountazah.webp" },
  { name: "Nadri Jewelry", logo: "/clients/tiles/nadri.webp" },
  { name: "Imaar El Djazair", logo: "/clients/tiles/imaar.webp" },
  { name: "Jysan Immobilier", logo: "/clients/tiles/jysan.webp" },
  { name: "Jastal Medical", logo: "/clients/tiles/jastal.webp" },
  { name: "Souipanel", logo: "/clients/tiles/souipanel.webp" },
  { name: "Altusplast", logo: "/clients/tiles/altusplast.webp" },
  { name: "Ya Hala", logo: "/clients/tiles/ya-hala.webp" },
  { name: "CPC Cheli Para Cos", logo: "/clients/tiles/cpc.webp" },
  { name: "Le Churros", logo: "/clients/tiles/le-churros.webp" },
];
