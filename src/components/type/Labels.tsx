import clsx from "clsx";
import type { ElementType, ReactNode } from "react";

/** 12px, uppercase, 0.06em tracking, muted ink. For meta lines only, never above a heading. */
export function MetaLabel({ as: Tag = "span", className, children }: { as?: ElementType; className?: string; children: ReactNode }) {
  return <Tag className={clsx("font-sans text-meta uppercase text-ink-muted tabular", className)}>{children}</Tag>;
}

/** (01), (02)… in meta style, tabular figures. */
export function IndexLabel({ n, className }: { n: number; className?: string }) {
  return (
    <span className={clsx("font-sans text-meta text-ink-muted tabular", className)}>
      ({String(n).padStart(2, "0")})
    </span>
  );
}

/**
 * "Signature Cherche :" — a short list heading sitting on a 2px ochre rule that runs
 * out to the left edge of the screen. It names the block below it; it is not an
 * eyebrow above a bigger heading.
 */
export function SectionLabel({ as: Tag = "h2", id, className, children }: { as?: ElementType; id?: string; className?: string; children: ReactNode }) {
  return (
    <div className={clsx("relative w-fit pb-3", className)}>
      <Tag id={id} className="font-display text-list text-ink">
        {children}
      </Tag>
      <span aria-hidden="true" className="absolute bottom-0 right-[-24px] h-[2px] w-[100vw] bg-ochre" />
    </div>
  );
}

/** Lists with small ochre dots instead of icons, set like the poster's job list. */
export function BulletList({ items, className }: { items: ReactNode[]; className?: string }) {
  return (
    <ul className={clsx("flex flex-col gap-3", className)}>
      {items.map((item, i) => (
        <li key={i} className="flex items-baseline gap-4 font-display text-list text-ink">
          <span aria-hidden="true" className="size-2 shrink-0 -translate-y-[0.2em] rounded-full bg-ochre" />
          <span>{item}</span>
        </li>
      ))}
    </ul>
  );
}
