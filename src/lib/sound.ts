"use client";

import { useSyncExternalStore } from "react";

/**
 * Page-wide video sound. Browsers only allow sound after the visitor's first click, tap or key;
 * from then on, the video most visible on screen plays with sound and every other one is muted.
 * The mute button on any video turns sound off (or back on) for the whole page.
 */
type State = { enabled: boolean; interacted: boolean; active: string | null };
let state: State = { enabled: true, interacted: false, active: null };
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

if (typeof window !== "undefined") {
  const first = () => {
    emit({ interacted: true });
    window.removeEventListener("pointerdown", first);
    window.removeEventListener("keydown", first);
  };
  window.addEventListener("pointerdown", first);
  window.addEventListener("keydown", first);
}

export const sound = {
  report(id: string, ratio: number) {
    if (ratio <= 0) ratios.delete(id);
    else ratios.set(id, ratio);
    pickActive();
  },
  toggle(id: string) {
    // Unmuting from a video's button also makes it the one that speaks.
    if (!state.enabled || state.active !== id) emit({ enabled: true, interacted: true, active: id });
    else emit({ enabled: false });
  },
};

const subscribe = (f: () => void) => {
  subs.add(f);
  return () => subs.delete(f);
};
const server: State = { enabled: true, interacted: false, active: null };

/** True when this video should currently play with sound. */
export function useSound(id: string) {
  const s = useSyncExternalStore(subscribe, () => state, () => server);
  return { audible: s.enabled && s.interacted && s.active === id, enabled: s.enabled && s.interacted };
}

/** Send a command to a Vimeo player iframe. */
export function vimeoCommand(frame: HTMLIFrameElement | null, method: string, value?: unknown) {
  frame?.contentWindow?.postMessage(JSON.stringify(value === undefined ? { method } : { method, value }), "https://player.vimeo.com");
}
