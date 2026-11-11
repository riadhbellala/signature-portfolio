import clsx from "clsx";
import type { ElementType, ReactNode } from "react";
import { ScriptTrace } from "../devices/ScriptTrace";
import { PuzzleJoint, type PuzzleJointProps } from "../puzzle/PuzzleJoint";

export interface SectionProps {
  /** cream (default ground), sand (inset band, second paper tone) or teal (full field). */
  tone?: "cream" | "sand" | "teal";
  as?: ElementType;
  id?: string;
  /** Draw the hairline script trace behind this section, like the posts. */
  trace?: "left" | "right";
  /** Section padding: full (128–160 desktop, 72–96 mobile) or none for custom bands. */
  spacing?: "full" | "none";
  /** Teal sections only: the single knob pushing into the neighbouring cream section. */
  joint?: PuzzleJointProps;
  className?: string;
  children: ReactNode;
  "aria-labelledby"?: string;
}

/**
 * Sets background, ink, muted ink, rule, trace and focus tokens for everything inside.
 * Never put two teal sections in a row.
 */
export function Section({ tone = "cream", as: Tag = "section", id, trace, spacing = "full", joint, className, children, ...rest }: SectionProps) {
  return (
    <Tag
      id={id}
      className={clsx(
        `tone-${tone}`,
        "relative [overflow-x:clip]",
        spacing === "full" && "py-20 md:py-32 lg:py-40",
        className,
      )}
      {...rest}
    >
      {trace ? (
        <div aria-hidden="true" className="pointer-events-none absolute inset-0 overflow-hidden">
          <ScriptTrace
            flip={trace === "left"}
            className={clsx("top-[-10%] h-[130%] w-auto", trace === "right" ? "right-[-8%]" : "left-[-8%]")}
          />
        </div>
      ) : null}
      <div className="relative">{children}</div>
      {joint && tone === "teal" ? <PuzzleJoint {...joint} /> : null}
    </Tag>
  );
}

/** The 1280px container with the 20 / 40 / 56px gutters. */
export function Container({ className, children }: { className?: string; children: ReactNode }) {
  return <div className={clsx("mx-auto w-full max-w-[1280px] px-[var(--gutter)]", className)}>{children}</div>;
}

/** 12-column grid, 24px gap. */
export function Grid({ className, children }: { className?: string; children: ReactNode }) {
  return <div className={clsx("grid grid-cols-4 gap-x-6 md:grid-cols-12", className)}>{children}</div>;
}

/**
 * The one way a section opens: title on the left of the grid, an optional single sentence on
 * the right, sharing a baseline. Every section uses it, so heads line up down the page.
 */
export function SectionHead({ id, title, lead, className }: { id: string; title: string; lead?: string; className?: string }) {
  return (
    <div className={clsx("grid gap-6 lg:grid-cols-12 lg:items-end", className)}>
      <h2 id={id} className="text-h2 lg:col-span-7">
        {title}
      </h2>
      {lead ? <p className="measure text-lead lg:col-span-4 lg:col-start-9">{lead}</p> : null}
    </div>
  );
}
