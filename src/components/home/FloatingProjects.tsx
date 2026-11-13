"use client";

import { AnimatePresence, motion } from "motion/react";
import Link from "next/link";
import { useEffect, useState } from "react";
import { ArrowUpRightIcon } from "../ui/icons";

/**
 * The hurry-up shortcut, always within reach: once the hero (where it first appears) has left
 * the screen, a pill rises bottom-right and stays, until the contact section takes over.
 */
export function FloatingProjects({ href, label, count }: { href: string; label: string; count: number }) {
  const [show, setShow] = useState(false);
  useEffect(() => {
    const hero = document.querySelector('[aria-labelledby="hero-title"]');
    const contact = document.getElementById("contact");
    if (!hero) return;
    let pastHero = false;
    let atContact = false;
    const update = () => setShow(pastHero && !atContact);
    const a = new IntersectionObserver(([e]) => {
      pastHero = !e.isIntersecting && e.boundingClientRect.top < 0;
      update();
    });
    const b = new IntersectionObserver(([e]) => {
      atContact = e.isIntersecting;
      update();
    });
    a.observe(hero);
    if (contact) b.observe(contact);
    return () => {
      a.disconnect();
      b.disconnect();
    };
  }, []);
  return (
    <AnimatePresence>
      {show ? (
        <motion.div
          className="fixed bottom-4 right-4 z-40 md:bottom-6 md:right-6"
          initial={{ opacity: 0, y: 24, scale: 0.92 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 16, scale: 0.96, transition: { duration: 0.18 } }}
          transition={{ type: "spring", stiffness: 420, damping: 30 }}
        >
          <Link
            href={href}
            className="group flex h-14 items-center gap-3 rounded-full bg-teal pl-5 pr-1.5 font-display text-small font-semibold text-cream no-underline shadow-[0_16px_40px_-12px_color-mix(in_oklab,var(--color-teal-deep)_70%,transparent)] transition-transform duration-[var(--dur-press)] ease-[var(--ease-out-quint)] active:scale-95"
          >
            {label}
            <span className="font-sans font-normal text-cream-muted tabular">{count}</span>
            <span className="flex size-11 items-center justify-center rounded-full bg-ochre text-teal transition-transform duration-[var(--dur-ui)] ease-[var(--ease-out-quint)] group-hover:rotate-45">
              <ArrowUpRightIcon size={16} />
            </span>
          </Link>
        </motion.div>
      ) : null}
    </AnimatePresence>
  );
}
