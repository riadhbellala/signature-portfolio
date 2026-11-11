/**
 * The agency: about block, figures, clients, testimonials.
 * Bracketed values are placeholders. Empty lists hide their section or row.
 */

export interface Stat {
  value: string;
  label: string;
}
export interface Client {
  name: string;
  /** Path in /public to the client's logo in one colour (teal). null = labelled placeholder. */
  logo: string | null;
}
export interface Testimonial {
  quote: string;
  name: string;
  role: string;
  company: string;
}

export const agency = {
  name: "Signature Consulting",
  brand: "Signature creative co.",

  /**
   * Clients wall. Seven pieces, the eighth is the invitation ("Votre marque ici ?").
   * Replace each entry with a real client; never list a client that is not one.
   * An empty list hides the whole section.
   */
  clients: Array.from({ length: 7 }, () => ({ name: "[Nom du client]", logo: null })) as Client[],

  about: {
    title: "Une équipe, toute votre image.",
    paragraphs: [
      "Signature est une agence de publicité et de marketing 360° installée à Oran.",
      "L’identité, le site, le contenu, l’enseigne et le stand sortent du même atelier. Vos supports se ressemblent parce qu’ils sont pensés ensemble.",
      "[Présentation de l’équipe à compléter : nombre de personnes, métiers, année de création.]",
    ],
    /** Replace [XX] with real figures. An empty list hides the row. */
    stats: [
      { value: "[XX]", label: "projets livrés" },
      { value: "[XX]", label: "années d’activité" },
      { value: "[XX]", label: "clients" },
      { value: "[XX]", label: "abonnés Instagram" },
    ] satisfies Stat[],
    /** Team or studio photos. null = placeholder block. First is 16:10, the others 4:5. */
    photos: [null, null, null] as (string | null)[],
    photoCaptions: ["[PHOTO ÉQUIPE]", "[PHOTO ATELIER]", "[PHOTO CHANTIER]"],
    hiring: {
      text: "On recrute : community manager, chef de projet, designer, commercial.",
      linkLabel: "Voir l’annonce",
      /** Replace with the URL of the "On Recrute!" Instagram post. */
      href: "https://www.instagram.com/signature.alg/",
    },
  },

  /** Real testimonials only. The section is hidden while this list is empty. */
  testimonials: [] as Testimonial[],
};
