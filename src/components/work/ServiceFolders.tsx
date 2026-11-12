"use client";

import { AnimatePresence, motion } from "motion/react";
import Link from "next/link";
import { useEffect, useState } from "react";
import { categoryNumber, type CategoryId } from "@/content/categories";
import { cover, folders, getClient, projectsIn, thumbOf } from "@/content/projects";
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
  const cats = folders();
  const [active, setActive] = useState<CategoryId>(cats[0].id);

  useEffect(() => {
    const apply = () => {
      const id = window.location.hash.replace("#dossier-", "");
      const c = cats.find((x) => x.id === id);
      if (window.location.hash.startsWith("#dossier-") && c) {
        setActive(c.id);
        document.getElementById("dossiers")?.scrollIntoView({ block: "start" });
      }
    };
    apply();
    window.addEventListener("hashchange", apply);
    return () => window.removeEventListener("hashchange", apply);
  }, [cats]);

  const c = cats.find((x) => x.id === active)!;
  const list = projectsIn(c.id);

  return (
    <div>
      <ul className="grid grid-cols-1 gap-x-8 gap-y-10 sm:grid-cols-2 lg:grid-cols-3">
        {cats.map((x) => {
          const ps = projectsIn(x.id);
          return (
            <li key={x.id}>
              <IconFolder
                index={pad(categoryNumber(x.id))}
                title={x.name}
                count={ps.length ? home.category.count(ps.length) : home.category.soon}
                items={ps.map((p) => ({ src: thumbOf(cover(p)), label: getClient(p.client).name }))}
                active={x.id === active}
                controls="dossier-ouvert"
                onSelect={() => setActive(x.id)}
              />
            </li>
          );
        })}
      </ul>

      <div id="dossier-ouvert" aria-live="polite" className="mt-14 md:mt-20">
        <AnimatePresence mode="wait" initial={false}>
          <motion.div key={c.id} initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -6, transition: { duration: 0.12 } }} transition={{ duration: 0.32, ease: EASE }}>
            <div className="grid gap-x-6 gap-y-4 border-t-2 border-ochre pt-8 lg:grid-cols-12 lg:items-end">
              <h3 className="font-display text-h1 lg:col-span-7">{c.name}</h3>
              <div className="flex flex-col gap-2 lg:col-span-4 lg:col-start-9">
                <p className="measure text-lead">{c.definition}</p>
                <p className="font-sans text-small text-ink-muted tabular">{list.length ? home.category.count(list.length) : home.category.soon}</p>
              </div>
            </div>
            {list.length === 0 ? (
              <p className="mt-10 max-w-[48ch] text-lead text-ink-muted">{home.category.empty}</p>
            ) : null}
            <ul className="mt-10 grid grid-cols-2 gap-x-6 gap-y-12 md:grid-cols-3 lg:grid-cols-4">
              {list.map((p) => (
                <li key={p.slug}>
                  <Link href={`/projets/${p.slug}`} className="group flex flex-col gap-4 no-underline">
                    <div className="transition-transform duration-[var(--dur-ui)] ease-[var(--ease-out-quint)] group-hover:-translate-y-1.5">
                      <MediaPiece media={cover(p)} edges={{ top: "flat", right: "tab", bottom: "flat", left: "flat" }} sizes="(min-width: 1024px) 300px, 45vw" className="w-[80%]" />
                    </div>
                    <span className="flex flex-col gap-0.5">
                      <span className="font-display text-list decoration-ochre decoration-2 underline-offset-4 group-hover:underline">{getClient(p.client).name}</span>
                      <span className="text-small text-ink-muted">
                        {p.title} · {p.media.length} {p.media.length > 1 ? "médias" : "média"}
                      </span>
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
