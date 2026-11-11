import { contact } from "@/content/contact";
import { home } from "@/content/site";
import { Container } from "../layout/Section";

/** One line: copyright and Instagram. */
export function Footer({ tone = "cream" }: { tone?: "cream" | "teal" }) {
  return (
    <footer className={`tone-${tone}`}>
      <Container className="flex min-h-16 border-t border-line flex-wrap items-center justify-between gap-x-6 gap-y-2 py-4 text-small text-ink-muted">
        <p>{home.footer}</p>
        <a href={contact.instagram.href} target="_blank" rel="noreferrer" className="inline-flex min-h-11 items-center underline decoration-2 underline-offset-8 hover:text-ink">
          {contact.instagram.display}
        </a>
      </Container>
    </footer>
  );
}
