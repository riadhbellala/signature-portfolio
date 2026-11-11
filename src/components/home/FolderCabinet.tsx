"use client";

import clsx from "clsx";
import { AnimatePresence, motion } from "motion/react";
import { useCallback, useEffect, useRef, useState, type KeyboardEvent } from "react";
import { categories, categoryNumber, type CategoryId } from "@/content/categories";
import { projectsIn } from "@/content/projects";
import { home } from "@/content/site";
import { CategoryGrid } from "./CategoryGrid";

const EASE = [0.23, 1, 0.32, 1] as const;
const pad = (n: number) => String(n).padStart(2, "0");
const isCategory = (v: string): v is CategoryId => categories.some((c) => c.id === v);

/**
 * Project types as a filing cabinet. Each type is a folder tab; the open folder is the teal
 * panel joined to its tab: the type's definition, what we do, the count, then its projects in
 * the layout that suits the medium. Tabs are a real tablist (arrows, Home, End). The hash
 * #dossier-<type> opens a folder, so the navbar can link straight into it.
 */
export function FolderCabinet() {
  const [active, setActive] = useState<CategoryId>(categories[0].id);
  const tabs = useRef<Record<string, HTMLButtonElement | null>>({});
  const t = home.folders;

  const open = useCallback((id: CategoryId, focus = false) => {
    setActive(id);
    if (focus) tabs.current[id]?.focus();
    const tab = tabs.current[id];
    tab?.scrollIntoView({ block: "nearest", inline: "nearest" });
  }, []);

  useEffect(() => {
    const apply = () => {
      const h = window.location.hash;
      if (!h.startsWith("#dossier-")) return;
      const id = h.slice("#dossier-".length);
      if (isCategory(id)) {
        setActive(id);
        document.getElementById("dossiers")?.scrollIntoView({ block: "start" });
      }
    };
    apply();
    window.addEventListener("hashchange", apply);
    return () => window.removeEventListener("hashchange", apply);
  }, []);

  const onKey = (e: KeyboardEvent<HTMLDivElement>) => {
    const i = categories.findIndex((c) => c.id === active);
    const go = (j: number) => {
      e.preventDefault();
      open(categories[(j + categories.length) % categories.length].id, true);
    };
    if (e.key === "ArrowRight") go(i + 1);
    else if (e.key === "ArrowLeft") go(i - 1);
    else if (e.key === "Home") go(0);
    else if (e.key === "End") go(categories.length - 1);
  };

  const c = categories.find((x) => x.id === active)!;
  const list = projectsIn(c.id);

  return (
    <div>
      {/* Tabs: folders standing in the cabinet. The open one rises and joins the panel. */}
      <div className="-mx-[var(--gutter)] overflow-x-auto px-[var(--gutter)] [scrollbar-width:none]">
        <motion.div
          role="tablist"
          aria-label={t.tabsLabel}
          onKeyDown={onKey}
          className="flex w-max min-w-full items-end"
          initial="hidden"
          whileInView="shown"
          viewport={{ once: true, amount: 0.5 }}
          variants={{ hidden: {}, shown: { transition: { staggerChildren: 0.05 } } }}
        >
          {categories.map((x, i) => {
            const on = x.id === active;
            return (
              <motion.button
                key={x.id}
                variants={{ hidden: { y: 28, opacity: 0 }, shown: { y: 0, opacity: 1, transition: { duration: 0.55, ease: EASE } } }}
                ref={(el) => {
                  tabs.current[x.id] = el;
                }}
                id={`tab-${x.id}`}
                role="tab"
                type="button"
                aria-selected={on}
                aria-controls="dossier-panel"
                tabIndex={on ? 0 : -1}
                onClick={() => open(x.id)}
                className={clsx(
                  "group relative -ml-2 flex shrink-0 items-baseline gap-2 px-4 text-left 2xl:px-5 transition-[transform,background-color,color] duration-[var(--dur-ui)] ease-[var(--ease-out-quint)] first:ml-0 [clip-path:polygon(0_100%,10px_0,calc(100%-10px)_0,100%_100%)] focus-visible:outline-none",
                  on
                    ? "z-10 bg-teal pb-4 pt-4 text-cream"
                    : "bg-sand pb-3 pt-3 text-teal hover:-translate-y-1",
                )}
                style={{ zIndex: on ? 20 : categories.length - i }}
              >
                <span className={clsx("font-sans text-meta tabular", on ? "text-cream-muted" : "text-teal-muted")}>({pad(categoryNumber(x.id))})</span>
                <span className="whitespace-nowrap font-display text-small font-semibold 2xl:text-body group-focus-visible:underline group-focus-visible:decoration-ochre group-focus-visible:decoration-2 group-focus-visible:underline-offset-4">
                  {x.name}
                </span>
                <span className={clsx("font-sans text-meta tabular", on ? "text-ochre" : "text-teal-muted")}>{projectsIn(x.id).length}</span>
              </motion.button>
            );
          })}
        </motion.div>
      </div>

      {/* The open folder */}
      <div id="dossier-panel" role="tabpanel" aria-labelledby={`tab-${c.id}`} className="tone-teal relative z-[15] -mt-px">
        <AnimatePresence mode="wait" initial={false}>
          <motion.div
            key={c.id}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -4, transition: { duration: 0.12 } }}
            transition={{ duration: 0.28, ease: EASE }}
            className="px-5 pb-12 pt-10 md:px-10 md:pb-16 md:pt-14 lg:px-14"
          >
            <div className="grid gap-x-6 gap-y-6 lg:grid-cols-12 lg:items-end">
              <div className="lg:col-span-7">
                <h3 className="font-display text-h1">{c.name}</h3>
                <p className="measure mt-5 text-lead">{c.definition}</p>
              </div>
              <div className="flex flex-col gap-3 border-t border-line pt-5 lg:col-span-4 lg:col-start-9">
                <p className="measure text-body text-ink-muted">{c.line}</p>
                <p className="font-display text-body font-semibold text-ochre tabular">{home.category.count(list.length)}</p>
              </div>
            </div>
            <div className="mt-10 md:mt-14">
              <CategoryGrid category={c} projects={list} />
            </div>
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
}
