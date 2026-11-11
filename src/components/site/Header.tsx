"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { nav } from "@/content/site";
import { Logo } from "../brand/Logo";
import { Container } from "../layout/Section";
import { Button } from "../ui/Button";

/**
 * Sticky 64px header: logo, four links, one action. The action is the ochre primary button,
 * except while another primary button is on screen; then it steps down to the secondary
 * style, so two ochre buttons are never visible at once.
 */
export function Header() {
  const [open, setOpen] = useState(false);
  const [othersVisible, setOthersVisible] = useState(false);

  useEffect(() => {
    const targets = Array.from(document.querySelectorAll<HTMLElement>("[data-primary-cta]"));
    if (!targets.length) return;
    const visible = new Set<Element>();
    const io = new IntersectionObserver(
      (entries) => {
        for (const e of entries) {
          if (e.isIntersecting) visible.add(e.target);
          else visible.delete(e.target);
        }
        setOthersVisible(visible.size > 0);
      },
      { rootMargin: "-64px 0px 0px 0px" },
    );
    targets.forEach((t) => io.observe(t));
    return () => io.disconnect();
  }, []);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open]);

  return (
    <header className="tone-cream sticky top-0 z-40 border-b border-line">
      <a href="#contenu" className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:z-50 focus:bg-cream focus:p-3">
        {nav.skip}
      </a>
      <Container className="flex h-16 items-center justify-between gap-4">
        <Link href="/" aria-label={nav.homeLabel} className="shrink-0 no-underline">
          <Logo width={104} />
        </Link>

        <nav aria-label={nav.mainLabel} className="hidden lg:block">
          <ul className="flex gap-8 font-display text-body font-semibold">
            {nav.links.map((l) => (
              <li key={l.href}>
                <Link href={l.href} className="no-underline decoration-2 underline-offset-8 hover:underline">
                  {l.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        <div className="flex items-center gap-2">
          <Button href={nav.cta.href} variant={othersVisible ? "secondary" : "primary"} className="max-sm:hidden">
            {nav.cta.label}
          </Button>
          <button
            type="button"
            className="btn btn-secondary lg:hidden"
            aria-expanded={open}
            aria-controls="menu-mobile"
            onClick={() => setOpen((o) => !o)}
          >
            <span className="btn-label">{open ? nav.menuClose : nav.menuOpen}</span>
          </button>
        </div>
      </Container>

      <div id="menu-mobile" hidden={!open} className="border-t border-line lg:hidden">
        <Container className="py-6">
          <nav aria-label={nav.mobileLabel}>
            <ul className="flex flex-col gap-1">
              {nav.links.map((l) => (
                <li key={l.href}>
                  <Link href={l.href} onClick={() => setOpen(false)} className="flex min-h-12 items-center font-display text-h3 no-underline">
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>
          <Button href={nav.cta.href} className="mt-6 sm:hidden" onClick={() => setOpen(false)}>
            {nav.cta.label}
          </Button>
        </Container>
      </div>
    </header>
  );
}
