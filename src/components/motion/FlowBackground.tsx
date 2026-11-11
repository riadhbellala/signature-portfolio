"use client";

import { useEffect } from "react";

const COLOR: Record<string, string> = {
  cream: "var(--color-cream)",
  sand: "var(--color-sand)",
  teal: "var(--color-teal)",
};

/**
 * One page, no cuts: once this runs, sections stop painting their own background and the page
 * colour fades (700ms) to the tone of the section crossing the middle of the screen.
 * Without script, every section keeps its own background, so nothing is ever unreadable.
 */
export function FlowBackground({ target = "contenu" }: { target?: string }) {
  useEffect(() => {
    const main = document.getElementById(target);
    if (!main) return;
    const sections = Array.from(main.querySelectorAll<HTMLElement>("[data-flow]"));
    if (!sections.length) return;
    main.classList.add("flow-on");
    const set = (tone: string) => {
      main.style.backgroundColor = COLOR[tone] ?? COLOR.cream;
      document.documentElement.dataset.flow = tone;
    };
    set(sections[0].dataset.flow ?? "cream");
    const io = new IntersectionObserver(
      (entries) => {
        for (const e of entries) if (e.isIntersecting) set((e.target as HTMLElement).dataset.flow ?? "cream");
      },
      { rootMargin: "-50% 0px -50% 0px" },
    );
    sections.forEach((s) => io.observe(s));
    return () => {
      io.disconnect();
      main.classList.remove("flow-on");
      main.style.backgroundColor = "";
    };
  }, [target]);
  return null;
}
