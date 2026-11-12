"use client";

import clsx from "clsx";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { categoryNumber } from "@/content/categories";
import { contact } from "@/content/contact";
import { folders, projectsIn } from "@/content/projects";
import { nav } from "@/content/site";
import { Logo } from "../brand/Logo";
import { Container } from "../layout/Section";
import { Button } from "../ui/Button";
import { ArrowUpRightIcon, ChevronDownIcon } from "../ui/icons";

const pad = (n: number) => String(n).padStart(2, "0");

/**
 * Sticky 64px header: logo, "Projets" (opens the seven project types, each straight into its
 * folder), three anchor links, the agency site, and one action. The action is the ochre button
 * except while another ochre button is on screen; then it steps down to the underlined style.
 */
export function Header() {
  const [menu, setMenu] = useState(false);
  const [types, setTypes] = useState(false);
  const [othersVisible, setOthersVisible] = useState(false);
  const typesRef = useRef<HTMLDivElement>(null);
  const listRef = useRef<HTMLUListElement>(null);
  const [hidden, setHidden] = useState(false);
  const [current, setCurrent] = useState<string | null>(null);
  const [bar, setBar] = useState({ x: 0, w: 0 });
  const [projets, ...rest] = nav.links;

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

  // Hide while scrolling down (more room for the work), come back on the way up.
  useEffect(() => {
    let last = window.scrollY;
    let frame = 0;
    const onScroll = () => {
      if (frame) return;
      frame = requestAnimationFrame(() => {
        frame = 0;
        const y = window.scrollY;
        if (Math.abs(y - last) > 6) {
          setHidden(y > last && y > 160);
          last = y;
        }
      });
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      window.removeEventListener("scroll", onScroll);
      cancelAnimationFrame(frame);
    };
  }, []);

  // Which section the visitor is in: its link gets the ochre underline.
  useEffect(() => {
    const ids: Record<string, string> = { projets: "/#dossiers", dossiers: "/#dossiers", services: "/#services", clients: "/#clients", contact: "/#contact" };
    const els = Object.keys(ids).map((id) => document.getElementById(id)).filter(Boolean) as HTMLElement[];
    if (!els.length) return;
    const io = new IntersectionObserver(
      (entries) => {
        for (const e of entries) if (e.isIntersecting) setCurrent(ids[e.target.id]);
      },
      { rootMargin: "-40% 0px -55% 0px" },
    );
    els.forEach((el) => io.observe(el));
    const hero = document.getElementById("hero-title");
    const top = new IntersectionObserver(([e]) => e.isIntersecting && setCurrent(null));
    if (hero) top.observe(hero);
    return () => {
      io.disconnect();
      top.disconnect();
    };
  }, []);

  useEffect(() => {
    const list = listRef.current;
    if (!list) return;
    const el = current ? list.querySelector<HTMLElement>(`[data-href="${current}"]`) : null;
    setBar(el ? { x: el.offsetLeft, w: el.offsetWidth } : { x: 0, w: 0 });
  }, [current]);

  useEffect(() => {
    if (!menu && !types) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setMenu(false);
        setTypes(false);
      }
    };
    const onDown = (e: PointerEvent) => {
      if (types && typesRef.current && !typesRef.current.contains(e.target as Node)) setTypes(false);
    };
    window.addEventListener("keydown", onKey);
    window.addEventListener("pointerdown", onDown);
    return () => {
      window.removeEventListener("keydown", onKey);
      window.removeEventListener("pointerdown", onDown);
    };
  }, [menu, types]);

  const close = () => {
    setMenu(false);
    setTypes(false);
  };

  const typeLinks = (compact: boolean) =>
    folders().map((c) => (
      <li key={c.id}>
        <a
          href={`/#dossier-${c.id}`}
          onClick={close}
          className={clsx("group flex items-baseline gap-3 no-underline", compact ? "min-h-11 py-1" : "flex-col gap-1 py-4")}
        >
          <span className="flex w-full items-baseline gap-3">
            <span className="font-sans text-meta text-ink-muted tabular">({pad(categoryNumber(c.id))})</span>
            <span className={clsx("font-display font-semibold decoration-ochre decoration-2 underline-offset-4 group-hover:underline", compact ? "text-body" : "text-list")}>
              {c.name}
            </span>
            <span className="ml-auto font-sans text-small text-ink-muted tabular">{projectsIn(c.id).length}</span>
          </span>
          {compact ? null : <span className="measure line-clamp-2 pl-10 text-small text-ink-muted">{c.definition}</span>}
        </a>
      </li>
    ));

  return (
    <header
      className={clsx(
        "tone-cream sticky top-0 z-40 border-b border-line transition-transform duration-300 ease-[var(--ease-out-quint)]",
        hidden && !menu && !types && "-translate-y-full",
      )}
    >
      <a href="#contenu" className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:z-50 focus:bg-cream focus:p-3">
        {nav.skip}
      </a>
      <div ref={typesRef}>
        <Container className="flex h-16 items-center justify-between gap-4">
          <Link href="/" aria-label={nav.homeLabel} className="shrink-0 no-underline">
            <Logo width={104} />
          </Link>

          <nav aria-label={nav.mainLabel} className="hidden lg:block">
            <ul ref={listRef} className="relative flex items-center gap-8 font-display text-body font-semibold">
              <li data-href={projets.href}>
                <button
                  type="button"
                  aria-expanded={types}
                  aria-controls="menu-types"
                  onClick={() => setTypes((o) => !o)}
                  className={clsx("flex min-h-11 items-center gap-1.5 decoration-ochre decoration-2 underline-offset-8 hover:underline", types && "underline")}
                >
                  {projets.label}
                  <ChevronDownIcon className={clsx("transition-transform duration-[var(--dur-ui)] ease-[var(--ease-out-quint)]", types && "rotate-180")} />
                </button>
              </li>
              {rest.map((l) => (
                <li key={l.href} data-href={l.href}>
                  <Link
                    href={l.href}
                    aria-current={current === l.href ? "location" : undefined}
                    className="flex min-h-11 items-center no-underline decoration-ochre decoration-2 underline-offset-8 hover:underline"
                  >
                    {l.label}
                  </Link>
                </li>
              ))}
              <span
                aria-hidden="true"
                className="absolute -bottom-[11px] left-0 h-0.5 w-px origin-left bg-ochre transition-[transform,opacity] duration-300 ease-[var(--ease-out-quint)]"
                style={{ transform: `translateX(${bar.x}px) scaleX(${bar.w})`, opacity: bar.w ? 1 : 0 }}
              />
            </ul>
          </nav>

          <div className="flex items-center gap-2">
            <a
              href={contact.website.href}
              target="_blank"
              rel="noreferrer"
              aria-label={nav.externalLabel}
              className="mr-4 hidden min-h-12 items-center gap-1.5 text-small text-ink-muted no-underline decoration-2 underline-offset-8 hover:text-ink hover:underline lg:inline-flex"
            >
              {nav.external}
              <ArrowUpRightIcon size={12} />
            </a>
            <Button href={nav.cta.href} variant={othersVisible ? "secondary" : "primary"} className="max-sm:hidden">
              {nav.cta.label}
            </Button>
            <button type="button" className="btn btn-secondary lg:hidden" aria-expanded={menu} aria-controls="menu-mobile" onClick={() => setMenu((o) => !o)}>
              <span className="btn-label">{menu ? nav.menuClose : nav.menuOpen}</span>
            </button>
          </div>
        </Container>

        {/* Desktop: the seven types, each opening its folder. */}
        <div
          id="menu-types"
          inert={!types}
          className={clsx(
            "absolute inset-x-0 top-full hidden border-b border-line bg-cream transition-[opacity,transform] duration-[var(--dur-ui)] ease-[var(--ease-out-quint)] lg:block",
            types ? "translate-y-0 opacity-100" : "pointer-events-none -translate-y-1 opacity-0",
          )}
        >
          <Container className="grid grid-cols-12 gap-x-6 py-8">
            <p className="col-span-3 pt-4 font-display text-h3">{nav.projectsMenu}</p>
            <ul className="col-span-9 grid grid-cols-3 gap-x-8 border-l-2 border-ochre pl-8">{typeLinks(false)}</ul>
          </Container>
        </div>
      </div>

      {/* Mobile menu */}
      <div id="menu-mobile" hidden={!menu} className="max-h-[calc(100svh-64px)] overflow-y-auto border-t border-line lg:hidden">
        <Container className="py-6">
          <nav aria-label={nav.mobileLabel}>
            <p className="font-display text-h3">{projets.label}</p>
            <ul className="mt-2 flex flex-col border-l-2 border-ochre pl-4">{typeLinks(true)}</ul>
            <ul className="mt-6 flex flex-col gap-1">
              {rest.map((l) => (
                <li key={l.href}>
                  <Link href={l.href} onClick={close} className="flex min-h-12 items-center font-display text-h3 no-underline">
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>
          <a
            href={contact.website.href}
            target="_blank"
            rel="noreferrer"
            aria-label={nav.externalLabel}
            className="mt-4 inline-flex min-h-12 items-center gap-1.5 text-body underline decoration-2 underline-offset-8"
          >
            {nav.external}
            <ArrowUpRightIcon size={12} />
          </a>
          <Button href={nav.cta.href} className="mt-6 flex w-fit sm:hidden" onClick={close}>
            {nav.cta.label}
          </Button>
        </Container>
      </div>
    </header>
  );
}
