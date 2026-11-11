/**
 * Clients. Real clients only, each with a one-colour teal logo in /public (SVG or PNG).
 * `logo: null` shows a labelled placeholder piece. An empty list hides the section.
 * The eight entries below are placeholders: replace or delete them, never invent a client.
 */

export interface Client {
  name: string;
  logo: string | null;
}

export const clients: Client[] = Array.from({ length: 8 }, () => ({ name: "[Nom du client]", logo: null }));
