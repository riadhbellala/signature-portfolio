"use client";

import clsx from "clsx";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { getCategory } from "@/content/categories";
import { getClient, getProject, showcase, thumbOf, type Media } from "@/content/projects";
import { home } from "@/content/site";
import { ArrowUpRightIcon } from "../ui/icons";
import { MediaPiece } from "./MediaPiece";

/**
 * Latest work, editorial index (one project per picture, every service).
 * Desktop: a sticky column on the left (title, the service of each project as an index, the active one's
 * client and description at the bottom); on the right one large picture per client, scrolling.
 * The picture in the middle of the screen sets the active project.
 * Phones: one picture per project, its name and line under it.
 */
export function ClientShowcase({ titleId }: { titleId: string }) {
  const items = showcase.map(([slug, i]) => {
    const p = getProject(slug)!;
    const media = p.media[i] as Media;
    return {
      id: slug,
      name: getClient(p.client).name,
      line: p.brief,
      types: getCategory(p.category).name,
      href: `/projets/${slug}`,
      media,
      cover: thumbOf(media),
    };
  });
  const [active, setActive] = useState(0);
  const refs = useRef<(HTMLLIElement | null)[]>([]);

  useEffect(() => {
    const io = new IntersectionObserver(
      (entries) => {
        for (const e of entries) if (e.isIntersecting) setActive(Number((e.target as HTMLElement).dataset.i));
      },
      { rootMargin: "-50% 0px -50% 0px" },
    );
    refs.current.forEach((el) => el && io.observe(el));
    return () => io.disconnect();
  }, []);

  const cur = items[active];
  const t = home.showcase;

  return (
    <div className="grid gap-[var(--space-head)] lg:grid-cols-12 lg:gap-x-[var(--space-grid)]">
      <div className="lg:col-span-5">
        <div className="flex flex-col gap-10 lg:sticky lg:top-28 lg:h-[calc(100svh-10rem)] lg:justify-between">
          <div className="flex flex-col gap-8">
            <h2 id={titleId} className="max-w-[14ch] font-display text-h2">{t.title}</h2>
            <ul className="flex flex-col gap-1 max-lg:hidden">
              {items.map((it, i) => (
                <li key={it.id}>
                  <Link
                    href={it.href}
                    className={clsx(
                      "font-display text-h3 no-underline transition-colors duration-[var(--dur-ui)] ease-out",
                      i === active ? "text-ink" : "text-ink-muted/45 hover:text-ink-muted",
                    )}
                  >
                    {it.types}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
          <div className="flex flex-col gap-5 max-lg:hidden">
            <div className="flex items-start gap-4">
              <span className="relative size-12 shrink-0 overflow-hidden rounded-[var(--radius-xs)] bg-sand">
                <Image src={cur.cover} alt="" fill sizes="48px" className="object-cover" />
              </span>
              <span className="flex flex-col gap-1">
                <span className="font-display text-body font-semibold text-ink">{cur.name}</span>
                <span className="max-w-[44ch] text-small text-ink-muted">{cur.line}</span>
              </span>
            </div>
          </div>
        </div>
      </div>

      <ol className="flex flex-col gap-[var(--space-grid)] max-lg:gap-14 lg:col-span-7">
        {items.map((it, i) => (
          <li
            key={it.id}
            data-i={i}
            ref={(el) => { refs.current[i] = el; }}
            // Desktop: the project in the middle of the screen stays sharp; the ones above and
            // below fade and blur, so the eye stays on one piece at a time.
            className={clsx(
              "lg:transition-[opacity,filter] lg:duration-500 lg:ease-[var(--ease-out-quint)]",
              i !== active && "lg:opacity-35 lg:[filter:blur(4px)] lg:hover:opacity-70 lg:hover:[filter:blur(0)]",
            )}
          >
            {it.media.kind === "video" ? (
              <div className="relative aspect-[4/3] overflow-hidden rounded-[var(--radius-sm)] bg-teal-deep lg:aspect-[16/10]">
                <MediaPiece
                  plain
                  media={it.media}
                  href={it.href}
                  label={`${it.name}, ${it.media.title}`}
                  edges={{ top: "flat", right: "flat", bottom: "flat", left: "flat" }}
                  sizes="(min-width: 1024px) 58vw, 100vw"
                  className="!absolute inset-0 !rounded-[var(--radius-sm)]"
                  style={{ aspectRatio: "auto" }}
                />
              </div>
            ) : (
            <Link href={it.href} aria-label={`${it.name}, ${t.open}`} className="group relative block aspect-[4/3] overflow-hidden rounded-[var(--radius-sm)] bg-sand no-underline lg:aspect-[16/10]">
              <Image src={it.cover} alt="" fill sizes="(min-width: 1024px) 58vw, 100vw" className="object-cover transition-transform duration-[900ms] ease-[var(--ease-out-quint)] group-hover:scale-[1.03]" />
              <span className="absolute bottom-4 right-4 inline-flex h-10 items-center gap-2 rounded-full bg-cream px-4 font-display text-small font-semibold text-teal transition-opacity duration-[var(--dur-ui)] ease-out [@media(hover:hover)]:opacity-0 [@media(hover:hover)]:group-hover:opacity-100 group-focus-visible:opacity-100">
                {t.open}
                <ArrowUpRightIcon size={12} />
              </span>
            </Link>
            )}
            <div className="mt-4 flex flex-col gap-1 lg:hidden">
              <p className="text-meta uppercase text-ink-muted">{it.types}</p>
              <p className="font-display text-h3">{it.name}</p>
              <p className="text-body text-ink-muted">{it.line}</p>
            </div>
          </li>
        ))}
      </ol>
    </div>
  );
}
