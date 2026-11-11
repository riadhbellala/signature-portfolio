import Link from "next/link";
import { contact } from "@/content/contact";
import { home, nav } from "@/content/site";
import { Logo } from "../brand/Logo";
import { Container } from "../layout/Section";

/** (10) Footer: logo, the four links, Instagram, copyright. */
export function Footer() {
  return (
    <footer className="tone-cream py-16">
      <Container className="flex flex-col gap-10 md:flex-row md:items-end md:justify-between">
        <Logo width={156} />
        <nav aria-label={nav.footerLabel}>
          <ul className="flex flex-wrap gap-x-8 gap-y-2 font-display text-body font-semibold">
            {nav.links.map((l) => (
              <li key={l.href}>
                <Link href={l.href} className="inline-flex min-h-12 items-center no-underline decoration-2 underline-offset-8 hover:underline">
                  {l.label}
                </Link>
              </li>
            ))}
            <li>
              <a href={contact.instagram.href} target="_blank" rel="noreferrer" className="inline-flex min-h-12 items-center no-underline decoration-2 underline-offset-8 hover:underline">
                {contact.instagram.display}
              </a>
            </li>
          </ul>
        </nav>
      </Container>
      <Container>
        <p className="mt-10 flex flex-wrap gap-x-6 gap-y-1 text-small text-ink-muted">
          <span>{home.footer.rights}</span>
          <span>{home.footer.tagline}</span>
        </p>
      </Container>
    </footer>
  );
}
