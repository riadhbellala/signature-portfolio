"use client";

import { useSyncExternalStore } from "react";

/**
 * Page-wide video sound. The page tries sound at once on open (the hero reel speaks). Browsers
 * may refuse sound before the visitor's first click, tap or key: a player that gets paused for
 * that reports `sound.blocked()`, plays on muted, and sound comes on at the first interaction.
 * The video most visible on screen plays with sound; every other one is muted.
 * The mute button on any video turns sound off (or back on) for the whole page.
 */
type State = { enabled: boolean; interacted: boolean; active: string | null };
let state: State = { enabled: true, interacted: true, active: null };
const ratios = new Map<string, number>();
const subs = new Set<() => void>();

function emit(next: Partial<State>) {
  state = { ...state, ...next };
  subs.forEach((f) => f());
}

function pickActive() {
  let best: string | null = null;
  let max = 0.5; // at least half on screen
  ratios.forEach((r, id) => {
    if (r >= max) {
      max = r;
      best = id;
    }
  });
  if (best !== state.active) emit({ active: best });
}

const EVENTS = ["pointerdown", "keydown", "touchend"] as const;
function first() {
  emit({ interacted: true });
  EVENTS.forEach((e) => window.removeEventListener(e, first));
}
function listen() {
  EVENTS.forEach((e) => window.addEventListener(e, first));
}
if (typeof window !== "undefined") listen();

export const sound = {
  report(id: string, ratio: number) {
    if (ratio <= 0) ratios.delete(id);
    else ratios.set(id, ratio);
    pickActive();
  },
  /** The browser refused sound before any interaction: wait for the first one. */
  blocked() {
    if (state.interacted) emit({ interacted: false });
    listen(); // the next click or tap, anywhere, turns sound on
  },
  /** The visitor asked for sound (this runs inside their click, so the browser allows it). */
  unlock() {
    emit({ enabled: true, interacted: true });
  },
  toggle(id: string) {
    // Unmuting from a video's button also makes it the one that speaks.
    if (!state.enabled || state.active !== id)
      emit({ enabled: true, interacted: true, active: id });
    else emit({ enabled: false });
  },
};

const subscribe = (f: () => void) => {
  subs.add(f);
  return () => subs.delete(f);
};
const server: State = { enabled: true, interacted: true, active: null };

/** Sound waits for the visitor's first interaction (the browser refused it on open). */
export function useSoundWaiting() {
  const s = useSyncExternalStore(
    subscribe,
    () => state,
    () => server,
  );
  return s.enabled && !s.interacted && s.active !== null;
}

/** True when this video should currently play with sound. */
export function useSound(id: string) {
  const s = useSyncExternalStore(
    subscribe,
    () => state,
    () => server,
  );
  return {
    audible: s.enabled && s.interacted && s.active === id,
    enabled: s.enabled && s.interacted,
    active: s.active === id,
  };
}

/** Send a command to a Vimeo player iframe. */
export function vimeoCommand(
  frame: HTMLIFrameElement | null,
  method: string,
  value?: unknown,
) {
  frame?.contentWindow?.postMessage(
    JSON.stringify(value === undefined ? { method } : { method, value }),
    "https://player.vimeo.com",
  );
}
