"use client";

import clsx from "clsx";
import { useEffect, useRef, useState } from "react";
import { sound, useSound, vimeoCommand } from "@/lib/sound";
import { vimeoSrc } from "@/lib/vimeo";
import { SoundOff, SoundOn } from "../work/MediaPiece";

/**
 * The hero's media card: the showreel in a large rounded card. The poster paints first; the
 * Vimeo player loads once the page has loaded and the browser is idle. It plays once, then
 * stops on its last frame. Sound button top-right; `children` ride at the bottom (the shortcut).
 * The player is set to loop, so Vimeo's "more videos" end screen can
 * never appear: we pause it ourselves just before the end (clock + progress, whichever first). Top-right: a round sound button sitting in
 * a notch cut out of the card. `children` sit over the card's left edge (the shortcut column).
 */
export function HeroReel({
  vimeoId,
  poster,
  label,
  duration = 6,
  soundOn,
  soundOff,
  children,
}: {
  vimeoId: string | null;
  poster: string | null;
  label: string;
  duration?: number;
  soundOn: string;
  soundOff: string;
  children?: React.ReactNode;
}) {
  const frame = useRef<HTMLIFrameElement>(null);
  const box = useRef<HTMLDivElement>(null);
  const [boot, setBoot] = useState(false);
  const [live, setLive] = useState(false);
  const [ready, setReady] = useState(false);
  const stopped = useRef(false);
  const timer = useRef<number | undefined>(undefined);
  const { audible } = useSound("hero");

  useEffect(() => {
    const go = () => {
      const idle = (
        window as Window & {
          requestIdleCallback?: (
            f: () => void,
            o?: { timeout: number },
          ) => number;
        }
      ).requestIdleCallback;
      if (idle) idle(() => setBoot(true), { timeout: 1500 });
      else window.setTimeout(() => setBoot(true), 300);
    };
    if (document.readyState === "complete") go();
    else window.addEventListener("load", go, { once: true });
    return () => window.removeEventListener("load", go);
  }, []);

  useEffect(() => {
    if (!box.current) return;
    const io = new IntersectionObserver(
      ([e]) => sound.report("hero", e.intersectionRatio),
      { threshold: [0, 0.25, 0.5, 0.75, 1] },
    );
    io.observe(box.current);
    return () => {
      io.disconnect();
      sound.report("hero", 0);
    };
  }, []);

  useEffect(() => {
    if (!ready || stopped.current) return;
    vimeoCommand(frame.current, "setMuted", !audible);
    if (audible) vimeoCommand(frame.current, "setVolume", 1);
  }, [audible, ready]);

  const stop = () => {
    if (stopped.current) return;
    stopped.current = true;
    window.clearTimeout(timer.current);
    vimeoCommand(frame.current, "pause");
  };

  useEffect(() => {
    const onMsg = (e: MessageEvent) => {
      if (
        e.origin !== "https://player.vimeo.com" ||
        e.source !== frame.current?.contentWindow
      )
        return;
      try {
        const d = typeof e.data === "string" ? JSON.parse(e.data) : e.data;
        if (d?.event === "ready") {
          setReady(true);
          vimeoCommand(frame.current, "addEventListener", "play");
          vimeoCommand(frame.current, "addEventListener", "pause");
          vimeoCommand(frame.current, "addEventListener", "timeupdate");
        }
        if (d?.event === "play") {
          setLive(true);
          // Once only: stop just before the end, so the last frame stays.
          if (timer.current === undefined)
            timer.current = window.setTimeout(
              stop,
              Math.max(0, (duration - 0.4) * 1000),
            );
        }
        const t = d?.event === "timeupdate" ? d.data : null;
        if (
          t &&
          !stopped.current &&
          t.duration > 1 &&
          t.seconds >= t.duration - 0.45
        )
          stop();
        // Browser refused sound on open: play on muted; sound comes at the first tap.
        if (d?.event === "pause" && !stopped.current) {
          sound.blocked();
          vimeoCommand(frame.current, "setMuted", true);
          vimeoCommand(frame.current, "play");
        }
      } catch {}
    };
    window.addEventListener("message", onMsg);
    return () => window.removeEventListener("message", onMsg);
  }, [duration]);

  return (
    <div ref={box} className="relative">
      {/* Echo of the title: the same ochre outline, offset behind the card, so the reel reads as
          printed on the page; a long soft shadow lifts it off the ground. */}
      <div aria-hidden="true" className="hero-frame hero-frame-holes absolute inset-0 rounded-[var(--radius-xl)] border-2 border-ochre" />
      <div className="hero-holes relative aspect-[3/5] md:aspect-[4/5] overflow-hidden rounded-[var(--radius-xl)] bg-sand shadow-[0_40px_80px_-30px_color-mix(in_oklab,var(--color-teal-deep)_55%,transparent)]">
        {poster ? (
          // eslint-disable-next-line @next/next/no-img-element -- Vimeo poster, preloaded in <head>
          <img
            src={poster}
            alt=""
            fetchPriority="high"
            className="absolute inset-0 size-full object-cover"
          />
        ) : null}
        {vimeoId && boot ? (
          <iframe
            ref={frame}
            src={`${vimeoSrc(vimeoId, true)}&api=1`}
            title={label}
            allow="autoplay; fullscreen; picture-in-picture"
            tabIndex={-1}
            className={clsx(
              "pointer-events-none absolute left-0 top-1/2 w-full -translate-y-1/2 border-0 transition-opacity duration-700",
              live ? "opacity-100" : "opacity-0",
            )}
            style={{ aspectRatio: "9 / 16" }}
          />
        ) : null}
      </div>
      {/* Notch: a bite out of the top-right corner, holding the sound button. */}
      <div className="absolute -right-2 -top-2 rounded-full bg-cream p-2.5">
        <button
          type="button"
          onClick={() => sound.toggle("hero")}
          aria-label={audible ? soundOff : soundOn}
          aria-pressed={audible}
          className="flex size-14 items-center justify-center rounded-full bg-teal text-cream transition-transform duration-[var(--dur-press)] ease-[var(--ease-out-quint)] hover:scale-105 active:scale-90"
        >
          {audible ? <SoundOn /> : <SoundOff />}
        </button>
      </div>
      {children}
    </div>
  );
}
