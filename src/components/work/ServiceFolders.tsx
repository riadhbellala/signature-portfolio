"use client";

import { AnimatePresence, motion } from "motion/react";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { categoryNumber, type CategoryId } from "@/content/categories";
import {
  cover,
  folders,
  getClient,
  projectsIn,
  thumbOf,
} from "@/content/projects";
import { home } from "@/content/site";
import { IconFolder } from "../ui/icon-folder";
import { MediaPiece } from "./MediaPiece";

const EASE = [0.23, 1, 0.32, 1] as const;
const pad = (n: number) => String(n).padStart(2, "0");

/**
 * Every project, one folder per service. Folders fan out their work; choosing one (click,
 * Enter, or #dossier-<type> in the URL) opens it below: the type's definition and all its
 * projects as pieces. Only types with work get a folder.
 */
export function ServiceFolders() {
  const cats = useMemo(() => folders(), []);
  const [active, setActive] = useState<CategoryId>(cats[0].id);
  // Phones: two folders per row, so each one is smaller and fans its pictures tighter.
  const [small, setSmall] = useState(false);
  useEffect(() => {
    const mq = window.matchMedia("(max-width: 767px)");
    const on = () => setSmall(mq.matches);
    on();
    mq.addEventListener("change", on);
    return () => mq.removeEventListener("change", on);
  }, []);

  useEffect(() => {
    const apply = (hash = window.location.hash) => {
      const id = hash.replace(/^.*#dossier-/, "");
      const c = cats.find((x) => x.id === id);
      if (hash.includes("#dossier-") && c) {
        setActive(c.id);
        document.getElementById("dossiers")?.scrollIntoView({ block: "start" });
      }
    };
    // Next.js links change the hash with pushState, which fires no hashchange: also catch clicks
    // on any #dossier- link (the navbar) and back/forward.
    const onClick = (e: MouseEvent) => {
      const a = (e.target as Element | null)?.closest?.("a[href*=\"#dossier-\"]");
      if (a) apply(a.getAttribute("href") ?? "");
    };
    const fromUrl = () => apply();
    apply();
    window.addEventListener("hashchange", fromUrl);
    window.addEventListener("popstate", fromUrl);
    document.addEventListener("click", onClick);
    return () => {
      window.removeEventListener("hashchange", fromUrl);
      window.removeEventListener("popstate", fromUrl);
      document.removeEventListener("click", onClick);
    };
  }, [cats]);

  const c = cats.find((x) => x.id === active)!;
  const list = projectsIn(c.id);

  return (
    <div>
      <ul className="grid grid-cols-2 gap-x-[var(--space-grid)] gap-y-8 md:gap-y-12 lg:grid-cols-3">
        {cats.map((x) => {
          const ps = projectsIn(x.id);
          return (
            <li key={x.id}>
              <IconFolder
                index={pad(categoryNumber(x.id))}
                title={x.name}
                count={
                  ps.length
                    ? home.category.count(ps.length)
                    : home.category.soon
                }
                items={ps.map((p) => ({
                  src: thumbOf(cover(p)),
                  label: getClient(p.client).name,
                }))}
                active={x.id === active}
                controls="dossier-ouvert"
                onSelect={() => setActive(x.id)}
                spread={small ? 26 : 64}
                compact={small}
                className={small ? "!h-[210px]" : undefined}
              />
            </li>
          );
        })}
      </ul>

      <div id="dossier-ouvert" aria-live="polite" className="mt-[var(--space-block)]">
        <AnimatePresence mode="wait" initial={false}>
          <motion.div
            key={c.id}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -6, transition: { duration: 0.12 } }}
            transition={{ duration: 0.32, ease: EASE }}
          >
            <div className="grid gap-x-6 gap-y-4 border-t-2 border-ochre pt-8 lg:grid-cols-12 lg:items-end">
              <h3 className="font-display text-h1 lg:col-span-7">{c.name}</h3>
              <div className="flex flex-col gap-2 lg:col-span-4 lg:col-start-9">
                <p className="measure text-lead">{c.definition}</p>
                <p className="font-sans text-small text-ink-muted tabular">
                  {list.length
                    ? home.category.count(list.length)
                    : home.category.soon}
                </p>
              </div>
            </div>
            {list.length === 0 ? (
              <p className="mt-10 max-w-[48ch] text-lead text-ink-muted">
                {home.category.empty}
              </p>
            ) : null}
            <ul className="mt-[var(--space-head)] grid grid-cols-2 gap-x-[var(--space-grid)] gap-y-10 md:gap-y-14 lg:grid-cols-3">
              {list.map((p) => (
                <li key={p.slug} className="group flex flex-col gap-4">
                  {/* Every card the same shape (4:3), so the grid lines up whatever the media. */}
                  <div>
                    {p.category === "site-web" ? (
                      // Sites: the bare laptop mockup, no card, no puzzle shape.
                      <Link
                        href={`/projets/${p.slug}`}
                        aria-label={`${getClient(p.client).name}, ${p.title}`}
                        className="relative block aspect-[4/3]"
                      >
                        <Image
                          src={
                            cover(p).kind === "image"
                              ? (cover(p) as { src: string }).src.replace(
                                  "-mockup-laptop",
                                  "-laptop",
                                )
                              : ""
                          }
                          alt=""
                          fill
                          sizes="(min-width: 1024px) 420px, 90vw"
                          className="object-contain drop-shadow-[0_24px_24px_color-mix(in_oklab,var(--color-teal-deep)_25%,transparent)]"
                        />
                      </Link>
                    ) : (
                      <MediaPiece
                        plain
                        media={cover(p)}
                        shape={4 / 3}
                        href={`/projets/${p.slug}`}
                        label={`${getClient(p.client).name}, ${p.title}`}
                        edges={{
                          top: "flat",
                          right: "tab",
                          bottom: "flat",
                          left: "flat",
                        }}
                        sizes="(min-width: 1024px) 380px, 45vw"
                      />
                    )}
                  </div>
                  <Link
                    href={`/projets/${p.slug}`}
                    tabIndex={-1}
                    className="flex flex-col gap-0.5 no-underline"
                  >
                    <span className="font-display text-list decoration-ochre decoration-2 underline-offset-4 group-hover:underline">
                      {getClient(p.client).name}
                    </span>
                    <span className="text-small text-ink-muted">
                      {p.title} · {p.media.length}{" "}
                      {p.media.length > 1 ? "médias" : "média"}
                    </span>
                  </Link>
                </li>
              ))}
            </ul>
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
}
