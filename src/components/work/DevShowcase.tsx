"use client";

import clsx from "clsx";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import { devCopy, devMedia, devSites, type Device } from "@/content/dev";
import { PuzzlePiece } from "../puzzle/PuzzlePiece";
import { ArrowUpRightIcon } from "../ui/icons";

const EASE = [0.23, 1, 0.32, 1] as const;
const pad = (n: number) => String(n + 1).padStart(2, "0");

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

  return (
    <div className="relative">
      {/* The active domain, huge, outlined in ochre like the titles, sliding behind everything. */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-x-[calc(var(--gutter)*-1)] bottom-[-4rem] overflow-hidden md:bottom-[-6rem]"
      >
        <div className="dev-marquee flex w-max whitespace-nowrap font-display text-[clamp(4.5rem,15vw,15rem)] leading-none text-transparent [-webkit-text-stroke:1.5px_var(--color-ochre)] opacity-50">
          {[0, 1].map((k) => (
            <span key={k} className="pr-[0.4em]">
              {site.domain} — {site.domain} —
            </span>
          ))}
        </div>
      </div>

      <div className="relative grid gap-x-6 gap-y-10 lg:grid-cols-12 lg:gap-y-8">
        <div className="flex flex-col gap-5 lg:col-span-4 lg:row-start-1 lg:self-end">
          <p className="font-sans text-meta uppercase tracking-[0.2em] text-ochre">
            {devCopy.eyebrow}
          </p>
          <h2 id="dev-title" className="font-display text-h2 max-md:text-center">
            {devCopy.title.map((l) => (
              <span key={l} className="block">
                {l}
              </span>
            ))}
          </h2>
          <p className="measure text-lead">{devCopy.lead}</p>
        </div>

        {/* Stage: laptop in the middle, tablet leaning in from the left, phone in front on the right. */}
        <div
          ref={stage}
          role="img"
          aria-label={devCopy.devicesLabel(site.name)}
          className="relative lg:col-span-8 lg:col-start-5 lg:row-span-2 lg:row-start-1 lg:self-center"
        >
          <div className="relative mx-auto aspect-[16/11] w-full max-w-[1000px]">
            <div
              aria-hidden="true"
              className="absolute right-[-2%] top-[-8%] w-[46%] rotate-[8deg]"
            >
              <PuzzlePiece
                fluid
                tone="ochre"
                edges={{
                  top: "flat",
                  right: "tab",
                  bottom: "blank",
                  left: "tab",
                }}
                shadow={false}
              />
            </div>
            <motion.div
              className="absolute left-[11%] top-[2%] w-[80%]"
              initial={reduce ? false : { y: 40, opacity: 0 }}
              whileInView={{ y: 0, opacity: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, ease: EASE }}
            >
              <Screen
                device="desktop"
                id={site.id}
                play={play}
                onProgress={setProgress}
                onEnded={() => pick((active + 1) % devSites.length)}
              />
            </motion.div>
            <motion.div
              className="absolute bottom-0 left-0 w-[25%] -rotate-[4deg]"
              initial={reduce ? false : { x: -40, opacity: 0 }}
              whileInView={{ x: 0, opacity: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, ease: EASE, delay: 0.15 }}
            >
              <Screen device="tablet" id={site.id} play={play} still />
            </motion.div>
            <motion.div
              className="absolute bottom-[-2%] right-[3%] w-[15.5%] rotate-[5deg]"
              initial={reduce ? false : { y: 60, opacity: 0 }}
              whileInView={{ y: 0, opacity: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, ease: EASE, delay: 0.3 }}
            >
              <Screen device="phone" id={site.id} play={play} still />
            </motion.div>
          </div>
        </div>

        <div className="flex flex-col gap-8 lg:col-span-4 lg:row-start-2 lg:self-start">
          <ol
            aria-label={devCopy.listLabel}
            className="flex flex-col border-t border-line"
          >
            {devSites.map((s, i) => {
              const on = i === active;
              return (
                <li key={s.id} className="relative border-b border-line">
                  <button
                    type="button"
                    onClick={() => pick(i)}
                    aria-pressed={on}
                    className={clsx(
                      "group flex min-h-14 w-full items-center gap-4 py-3 text-left transition-colors duration-[var(--dur-ui)]",
                      on ? "text-ochre" : "text-ink hover:text-ochre",
                    )}
                  >
                    <span className="font-sans text-meta tabular text-ink-muted">
                      ({pad(i)})
                    </span>
                    <span className="flex min-w-0 flex-1 flex-col">
                      <span className="truncate font-display text-body font-semibold md:text-piece">
                        {s.name}
                      </span>
                      <span className="truncate font-sans text-small text-ink-muted">
                        {s.kind}
                      </span>
                    </span>
                    <span
                      aria-hidden="true"
                      className={clsx(
                        "transition-transform duration-[var(--dur-ui)]",
                        on
                          ? "translate-x-0"
                          : "-translate-x-1 opacity-0 group-hover:translate-x-0 group-hover:opacity-100",
                      )}
                    >
                      →
                    </span>
                  </button>
                  {/* Time left on this site: the laptop recording, as an ochre line. */}
                  {on ? (
                    <span
                      aria-hidden="true"
                      className="absolute bottom-[-1px] left-0 h-0.5 bg-ochre"
                      style={{ width: `${(reduce ? 1 : progress) * 100}%` }}
                    />
                  ) : null}
                </li>
              );
            })}
          </ol>

          <a
            href={site.url}
            target="_blank"
            rel="noreferrer"
            className="inline-flex min-h-11 items-center gap-2 self-start font-display text-body font-semibold underline decoration-ochre decoration-2 underline-offset-8 hover:decoration-4"
          >
            {devCopy.visit} : {site.domain}
            <ArrowUpRightIcon size={12} />
          </a>
        </div>
      </div>
    </div>
  );
}
