"use client";

import clsx from "clsx";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { devCopy, devMedia, devSites, type Device } from "@/content/dev";
import { ArrowUpRightIcon } from "../ui/icons";

const EASE = [0.23, 1, 0.32, 1] as const;

/** Mockup frames (public/mockups/*-frame.webp, screens cut out) and where their screen sits, in %. */
const FRAMES: Record<
  Device,
  {
    src: string;
    w: number;
    h: number;
    screen: [number, number, number, number];
    radius: string;
  }
> = {
  desktop: {
    src: "/mockups/mac-frame.webp",
    w: 1360,
    h: 837,
    screen: [10.588, 3.345, 78.824, 83.154],
    radius: "0.8% / 1.2%",
  },
  tablet: {
    src: "/mockups/ipad-frame.webp",
    w: 936,
    h: 1319,
    screen: [4.808, 3.639, 90.064, 93.025],
    radius: "3.4% / 2.4%",
  },
  phone: {
    src: "/mockups/iphone-frame.webp",
    w: 667,
    h: 1333,
    screen: [5.247, 2.101, 89.355, 95.874],
    radius: "14% / 6.6%",
  },
};

/** `still`: a photo of the site (tablet, phone). Otherwise the scrolling recording (laptop). */
function Screen({
  device,
  id,
  play,
  still = false,
  onProgress,
  onEnded,
}: {
  device: Device;
  id: string;
  play: boolean;
  still?: boolean;
  onProgress?: (p: number) => void;
  onEnded?: () => void;
}) {
  const f = FRAMES[device];
  const m = devMedia(id, device);
  const ref = useRef<HTMLVideoElement>(null);
  useEffect(() => {
    const v = ref.current;
    if (!v) return;
    if (play) v.play().catch(() => {});
    else v.pause();
  }, [play, id]);
  return (
    <div className="relative" style={{ aspectRatio: `${f.w} / ${f.h}` }}>
      <div
        className="absolute overflow-hidden bg-teal-deep"
        style={{
          left: `${f.screen[0]}%`,
          top: `${f.screen[1]}%`,
          width: `${f.screen[2]}%`,
          height: `${f.screen[3]}%`,
          borderRadius: f.radius,
        }}
      >
        <AnimatePresence initial={false}>
          {still ? (
            <motion.img
              loading="lazy"
              decoding="async"
              key={id}
              src={`/dev/${id}-${device}-still.webp`}
              alt=""
              className="absolute inset-0 size-full object-cover object-top"
              initial={{ opacity: 0, scale: 1.04 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.5, ease: EASE }}
            />
          ) : (
            <motion.video
              key={id}
              ref={ref}
              src={m.video}
              poster={m.poster}
              muted
              playsInline
              loop={!onEnded}
              preload="metadata"
              autoPlay={play}
              onEnded={onEnded}
              onTimeUpdate={
                onProgress
                  ? (e) =>
                      onProgress(
                        e.currentTarget.currentTime /
                          (e.currentTarget.duration || 1),
                      )
                  : undefined
              }
              className="absolute inset-0 size-full object-cover object-top"
              initial={{ opacity: 0, scale: 1.04 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.5, ease: EASE }}
            />
          )}
        </AnimatePresence>
      </div>
      <Image
        src={f.src}
        alt=""
        fill
        sizes="(min-width: 1024px) 55vw, 90vw"
        className="pointer-events-none select-none object-contain"
      />
    </div>
  );
}

/**
 * Développement: the sites the agency built, live. One stage, three screens: a laptop, a tablet
 * and a phone show the same site: the laptop scrolls it (real recording), the others hold a photo. The list picks the site; the laptop
 * recording drives the ochre progress line and moves on to the next site when it ends.
 * Behind: an ochre puzzle piece, and the active domain as a giant outlined word sliding past.
 */
export function DevShowcase() {
  const reduce = useReducedMotion();
  const [active, setActive] = useState(0);
  const [progress, setProgress] = useState(0);
  const [inView, setInView] = useState(false);
  const stage = useRef<HTMLDivElement>(null);
  const site = devSites[active];

  useEffect(() => {
    if (!stage.current) return;
    const io = new IntersectionObserver(([e]) => setInView(e.isIntersecting), {
      rootMargin: "20% 0px",
    });
    io.observe(stage.current);
    return () => io.disconnect();
  }, []);

  const pick = (i: number) => {
    setActive(i);
    setProgress(0);
  };
  const play = inView && !reduce;

  const features = [
    { n: "01", title: "Toutes les solutions digitales", line: "Sites vitrines, boutiques en ligne, applications web et mobiles, plateformes sur mesure." },
    { n: "02", title: "Pensé pour le téléphone", line: "La majorité des visites arrivent sur mobile : chaque page y est conçue d’abord." },
    { n: "03", title: "Mis en ligne et suivi", line: "Hébergement, nom de domaine et mises à jour, on s’en occupe." },
  ];
  // Concave corner: a 28px square of page colour with a quarter circle of the panel left in it,
  // so the panel turns a rounded corner around a notch. `at` = where the panel's circle centre is.
  const concave = (at: string) => ({ background: `radial-gradient(circle 28px at ${at}, transparent 27.5px, var(--color-cream) 28px)` });
  const card = "relative flex flex-col gap-3 bg-cream p-6 text-teal lg:min-h-[168px] lg:p-7";
  const cardHead = (f: (typeof features)[number]) => (
    <>
      <span className="flex items-center gap-3">
        <span className="flex size-10 shrink-0 items-center justify-center rounded-full bg-sand font-sans text-small tabular">{f.n}</span>
        <span className="font-display text-piece font-semibold leading-tight">{f.title}</span>
      </span>
      <p className="text-small text-teal-muted">{f.line}</p>
    </>
  );
  return (
    // One dark shape on the page (the reference's second and third blocks). The three light cards
    // are not laid on it: they are the page biting into it. Card 1 is a notch from the left edge,
    // card 2 an island, card 3 a notch from the right edge; all three on one line. The
    // laptop breaks out of the top.
    <div className="tone-teal relative rounded-[var(--radius-xl)] bg-teal text-cream lg:mt-28">
      {/* Top: title, line, two pills. */}
      <div className="relative px-6 pb-10 pt-10 md:px-12 md:pt-14 lg:min-h-[440px] lg:pb-14">
        <div className="flex flex-col gap-6 max-lg:items-center max-lg:text-center lg:max-w-[44%]">
          <h2 id="dev-title" className="font-display text-[clamp(2.25rem,4.2vw,4rem)] font-bold leading-[0.98] tracking-[-0.035em]">
            {devCopy.title.map((l) => (
              <span key={l} className="block">
                {l}
              </span>
            ))}
          </h2>
          <p className="max-w-[40ch] text-lead text-ink-muted">{devCopy.lead}</p>
          <div className="flex flex-wrap items-center gap-3 max-lg:justify-center">
            <a href={site.url} target="_blank" rel="noreferrer" className="btn btn-primary">
              <span className="btn-label">{devCopy.visit}</span>
              <ArrowUpRightIcon size={14} />
            </a>
            <Link href="/projets#dossier-site-web" className="btn btn-secondary">
              <span className="btn-label">Tous nos sites</span>
            </Link>
          </div>
        </div>
        {/* The laptop: out of the top of the shape, over the cards' corner. */}
        <div
          ref={stage}
          role="img"
          aria-label={devCopy.devicesLabel(site.name)}
          className="relative z-[3] max-lg:mt-10 lg:absolute lg:right-[3%] lg:top-[-5.5rem] lg:w-[54%]"
        >
          <motion.div
            initial={reduce ? false : { y: 40, opacity: 0 }}
            whileInView={{ y: 0, opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, ease: EASE }}
            className="drop-shadow-[0_36px_36px_color-mix(in_oklab,var(--color-teal-deep)_60%,transparent)]"
          >
            <Screen device="desktop" id={site.id} play={play} onProgress={setProgress} onEnded={() => pick((active + 1) % devSites.length)} />
          </motion.div>
        </div>
      </div>

      <div className="relative overflow-hidden rounded-b-[var(--radius-xl)]">
        {/* Cards: stepping down, left to right. */}
        <ul className="relative grid gap-9 lg:grid-cols-3 lg:items-stretch lg:gap-5">
          <li className={`${card} mr-10 rounded-r-[var(--radius-lg)] lg:mr-0`}>
            <span aria-hidden="true" className="absolute -top-7 left-0 size-7" style={concave("100% 0")} />
            <span aria-hidden="true" className="absolute -bottom-7 left-0 size-7" style={concave("100% 100%")} />
            {cardHead(features[0])}
          </li>
          <li className={`${card} mx-6 rounded-[var(--radius-lg)] lg:mx-0`}>{cardHead(features[1])}</li>
          <li className={`${card} ml-10 rounded-l-[var(--radius-lg)] lg:ml-0`}>
            <span aria-hidden="true" className="absolute -top-7 right-0 size-7" style={concave("0 0")} />
            <span aria-hidden="true" className="absolute -bottom-7 right-0 size-7" style={concave("0 100%")} />
            {cardHead(features[2])}
          </li>
        </ul>

        {/* Bottom of the shape: which site is on the laptop, and the round buttons to change it. */}
        <div className="grid items-center gap-8 px-6 pb-10 pt-10 md:px-12 lg:grid-cols-12 lg:pb-12 lg:pt-10">
          <div className="flex flex-col gap-2 max-lg:items-center max-lg:text-center lg:col-span-6">
            <p className="font-display text-h3">{site.name}</p>
            <p className="text-small text-ink-muted">
              {site.kind} · {site.domain}
            </p>
            <span aria-hidden="true" className="mt-3 block h-0.5 w-full max-w-[320px] overflow-hidden rounded-full bg-cream/15">
              <span className="block h-full bg-ochre" style={{ width: `${(reduce ? 1 : progress) * 100}%` }} />
            </span>
          </div>
          <ul aria-label={devCopy.listLabel} className="flex flex-wrap gap-2 max-lg:justify-center md:gap-3 lg:col-span-6 lg:justify-end">
            {devSites.map((s, i) => {
              const on = i === active;
              return (
                <li key={s.id}>
                  <button
                    type="button"
                    onClick={() => pick(i)}
                    aria-pressed={on}
                    aria-label={s.name}
                    title={s.name}
                    className={clsx(
                      "flex size-12 items-center justify-center rounded-full font-display md:size-14 text-small font-bold transition-[transform,background-color,color] duration-[var(--dur-ui)] ease-[var(--ease-out-quint)] active:scale-90",
                      on ? "scale-110 bg-cream text-teal" : "bg-teal-deep text-cream hover:bg-cream/15",
                    )}
                  >
                    {s.name.slice(0, 2).toUpperCase()}
                  </button>
                </li>
              );
            })}
          </ul>
        </div>
      </div>
    </div>
  );
}
