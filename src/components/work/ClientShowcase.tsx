"use client";

import Image from "next/image";
import Link from "next/link";
import { getCategory } from "@/content/categories";
import { getClient, getProject, projectsOf, showcase, thumbOf, type Media } from "@/content/projects";
import { home } from "@/content/site";
import { Reveal, RevealItem } from "../motion/Reveal";
import { ArrowUpRightIcon } from "../ui/icons";
import { MediaPiece } from "./MediaPiece";


/**
 * Work by client, one chapter per client:
 * - the story on the left (sticky while the pictures scroll on desktop): name, one line,
 *   three figures, two actions (see the project, start one);
 * - the work on the right: the lead piece large, the two others side by side under it.
 * Story and work swap sides from one client to the next. Phones: index, story, then the pictures.
 */
export function ClientShowcase() {
  return (
    <ol className="flex flex-col gap-[calc(var(--space-block)*1.4)]">
      {showcase.map((block, b) => {
        const c = getClient(block.client);
        const ps = projectsOf(c.id);
        const types = [...new Set(ps.map((p) => getCategory(p.category).name))];
        const stills = block.pieces.map(([slug, i]) => thumbOf(getProject(slug)!.media[i] as Media));
        const href = `/projets/${ps[0].slug}`;
        // The client's video, if any: it takes the tall slot beside the pictures.
        const video = ps.flatMap((p) => p.media).find((m) => m.kind === "video");
        const medias = ps.reduce((n, p) => n + p.media.length, 0);
        const img = "object-cover transition-transform duration-[900ms] ease-[var(--ease-out-quint)] group-hover:scale-[1.04]";
        const stats = [
          { v: String(medias), l: "médias" },
          { v: String(ps.length), l: ps.length > 1 ? "projets" : "projet" },
          { v: String(types.length), l: types.length > 1 ? "services" : "service" },
        ];
        return (
          <li key={c.id}>
            <Reveal>

              <div className="grid gap-[var(--space-grid)] gap-y-8 lg:grid-cols-12 lg:gap-x-12">
                {/* The story */}
                <RevealItem className={b % 2 ? "lg:order-2 lg:col-span-4" : "lg:col-span-4"}>
                  <div className="flex flex-col gap-6 lg:sticky lg:top-28">
                    <h3 className="font-display text-[clamp(2rem,3.4vw,3.5rem)] font-bold leading-[1] tracking-[-0.03em]">{c.name}</h3>
                    <p className="max-w-[36ch] text-lead text-ink-muted">{c.line}</p>
                    <dl className="grid grid-cols-3 rounded-[var(--radius-lg)] bg-sand/60 py-4">
                      {stats.map((st) => (
                        <div key={st.l} className="flex flex-col items-center gap-1">
                          <dt className="sr-only">{st.l}</dt>
                          <dd className="font-display text-h3 leading-none tabular">{st.v}</dd>
                          <span aria-hidden="true" className="font-sans text-meta uppercase tracking-[0.14em] text-ink-muted">{st.l}</span>
                        </div>
                      ))}
                    </dl>
                    <div className="flex flex-wrap gap-3">
                      <Link href={href} className="btn btn-primary">
                        <span className="btn-label">{home.showcase.open}</span>
                        <ArrowUpRightIcon size={14} />
                      </Link>
                      <Link href="#contact" className="btn btn-secondary">
                        <span className="btn-label">{home.showcase.start}</span>
                      </Link>
                    </div>
                  </div>
                </RevealItem>

                {/* The work */}
                {video ? (
                  // With a video: two pictures stacked on the left, the video tall on the right.
                  <RevealItem className={`grid grid-cols-3 gap-[var(--space-grid)] lg:col-span-8 ${b % 2 ? "lg:order-1" : ""}`}>
                    <div className="col-span-2 grid gap-[var(--space-grid)]">
                      {stills.filter((src) => src !== thumbOf(video)).slice(0, 2).map((src, k) => (
                        <Link key={k} href={href} aria-label={`${c.name}, ${home.showcase.open}`} className="group relative block aspect-[16/10] overflow-hidden rounded-[var(--radius-lg)] bg-sand">
                          <Image src={src} alt="" fill sizes="(min-width: 1024px) 42vw, 66vw" className={img} />
                        </Link>
                      ))}
                    </div>
                    <div className="relative min-h-0">
                      <MediaPiece
                        plain
                        media={video}
                        href={href}
                        label={`${c.name}, ${video.title}`}
                        edges={{ top: "flat", right: "flat", bottom: "flat", left: "flat" }}
                        sizes="(min-width: 1024px) 21vw, 33vw"
                        className="!absolute inset-0 !rounded-[var(--radius-lg)]"
                        style={{ aspectRatio: "auto" }}
                      />
                    </div>
                  </RevealItem>
                ) : (
                  <RevealItem className={`grid grid-cols-2 gap-[var(--space-grid)] lg:col-span-8 ${b % 2 ? "lg:order-1" : ""}`}>
                    <Link href={href} aria-label={`${c.name}, ${home.showcase.open}`} className="group relative col-span-2 block aspect-[16/10] overflow-hidden rounded-[var(--radius-xl)] bg-sand">
                      <Image src={stills[0]} alt="" fill sizes="(min-width: 1024px) 62vw, 100vw" className={img} />
                    </Link>
                    {stills.slice(1, 3).map((src, k) => (
                      <Link key={k} href={href} aria-label={`${c.name}, ${home.showcase.open}`} className="group relative block aspect-[4/3] overflow-hidden rounded-[var(--radius-lg)] bg-sand">
                        <Image src={src} alt="" fill sizes="(min-width: 1024px) 31vw, 50vw" className={img} />
                      </Link>
                    ))}
                  </RevealItem>
                )}
              </div>
            </Reveal>
          </li>
        );
      })}
    </ol>
  );
}
