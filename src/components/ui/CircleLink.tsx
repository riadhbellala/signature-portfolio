import clsx from "clsx";
import Link from "next/link";
import { ArrowUpRightIcon } from "./icons";

/** Round arrow button (the system's secondary affordance): a link that reads "go there". */
export function CircleLink({ href, label, size = 56, tone = "ink", className, external }: { href: string; label: string; size?: number; tone?: "ink" | "ochre" | "cream"; className?: string; external?: boolean }) {
  const colors = { ink: "bg-teal text-cream", ochre: "bg-ochre text-teal", cream: "bg-cream text-teal" }[tone];
  const cls = clsx("group inline-flex shrink-0 items-center justify-center rounded-full transition-transform duration-[var(--dur-ui)] ease-[var(--ease-out-quint)] hover:scale-105 active:scale-95", colors, className);
  const icon = <ArrowUpRightIcon size={Math.round(size * 0.32)} className="transition-transform duration-[var(--dur-ui)] group-hover:rotate-45" />;
  return external ? (
    <a href={href} target="_blank" rel="noreferrer" aria-label={label} className={cls} style={{ width: size, height: size }}>
      {icon}
    </a>
  ) : (
    <Link href={href} aria-label={label} className={cls} style={{ width: size, height: size }}>
      {icon}
    </Link>
  );
}
