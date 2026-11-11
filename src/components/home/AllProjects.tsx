"use client";

import clsx from "clsx";
import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import type { Project } from "@/content/projects";
import { poles, serviceName, servicePole, type PoleId } from "@/content/services";
import { home } from "@/content/site";
import { ProjectImage } from "../project/ProjectImage";
import { MetaLabel } from "../type/Labels";

const PAGE = 6;
type Filter = PoleId | "all";

const isPole = (v: string): v is PoleId => poles.some((p) => p.id === v);

/**
 * Project grid with four pole filters and "Voir plus" (6 at a time).
 * Services link to #filtre-<pole>: the anchor scrolls here natively, and this component
 * reads the hash to apply the filter.
 */
export function AllProjects({ projects }: { projects: Project[] }) {
  const [filter, setFilter] = useState<Filter>("all");
  const [shown, setShown] = useState(PAGE);
  const t = home.all;

  useEffect(() => {
    const apply = () => {
      const id = window.location.hash.replace("#filtre-", "");
      if (window.location.hash.startsWith("#filtre-") && isPole(id)) {
        setFilter(id);
        setShown(PAGE);
      }
    };
    apply();
    window.addEventListener("hashchange", apply);
    return () => window.removeEventListener("hashchange", apply);
  }, []);

  const list = useMemo(() => (filter === "all" ? projects : projects.filter((p) => servicePole(p.category) === filter)), [filter, projects]);
  const visible = list.slice(0, shown);

  const choose = (f: Filter) => {
    setFilter(f);
    setShown(PAGE);
  };

  return (
    <div>
      {/* Native scroll targets for the service links. */}
      {poles.map((p) => (
        <span key={p.id} id={`filtre-${p.id}`} className="block scroll-mt-24" aria-hidden="true" />
      ))}

      <div className="flex flex-wrap items-center justify-between gap-x-6 gap-y-2 border-b border-line pb-2">
        <div role="group" aria-label={t.filterLabel} className="-ml-3 flex flex-wrap gap-x-1">
          {[{ id: "all" as const, name: t.all }, ...poles].map((f) => {
            const on = filter === f.id;
            return (
              <button
                key={f.id}
                type="button"
                aria-pressed={on}
                onClick={() => choose(f.id)}
                className={clsx(
                  "relative min-h-12 px-3 font-display text-body font-semibold transition-colors duration-[var(--dur-ui)] ease-[var(--ease-out-quint)]",
                  on ? "text-ink" : "text-ink-muted hover:text-ink",
                )}
              >
                {f.name}
                <span
                  aria-hidden="true"
                  className={clsx(
                    "absolute inset-x-3 bottom-2 h-0.5 origin-left bg-ochre transition-transform duration-[var(--dur-ui)] ease-[var(--ease-out-quint)]",
                    on ? "scale-x-100" : "scale-x-0",
                  )}
                />
              </button>
            );
          })}
        </div>
        <p className="text-small text-ink-muted tabular" aria-live="polite">
          {t.count(visible.length, list.length)}
        </p>
      </div>

      {list.length === 0 ? (
        <div className="mt-10 flex flex-col items-start gap-4">
          <p className="text-lead">{t.empty}</p>
          <button type="button" className="btn btn-secondary -ml-5" onClick={() => choose("all")}>
            <span className="btn-label">{t.emptyAction}</span>
          </button>
        </div>
      ) : (
        <ul className="mt-10 grid grid-cols-1 gap-x-6 gap-y-12 sm:grid-cols-2 lg:grid-cols-3">
          {visible.map((p) => (
            <li key={p.slug}>
              <Link href={`/projets/${p.slug}`} className="group flex flex-col gap-4 no-underline">
                <ProjectImage
                  src={p.cover}
                  alt={`${p.title}, ${p.client}`}
                  ratio="16/10"
                  sizes="(min-width: 1024px) 400px, (min-width: 640px) 50vw, 100vw"
                  index={p.index}
                  category={serviceName(p.category)}
                />
                <span className="flex flex-col gap-1">
                  <span className="font-display text-h3 decoration-ochre decoration-2 underline-offset-4 group-hover:underline">{p.client}</span>
                  <MetaLabel>
                    {serviceName(p.category)} · {p.year}
                  </MetaLabel>
                </span>
              </Link>
            </li>
          ))}
        </ul>
      )}

      {shown < list.length ? (
        <button type="button" className="btn btn-secondary -ml-5 mt-12" onClick={() => setShown((n) => n + PAGE)}>
          <span className="btn-label">{t.more}</span>
        </button>
      ) : null}
    </div>
  );
}
