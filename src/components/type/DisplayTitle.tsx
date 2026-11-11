import clsx from "clsx";
import type { ElementType } from "react";

export interface DisplayTitleProps {
  /** One string per line, set stacked like "On / Recrute!". */
  lines: string[];
  as?: ElementType;
  /** Display size by default; h1 for a page title that also carries the outline. */
  size?: "display" | "h1";
  className?: string;
  id?: string;
}

/**
 * The "On Recrute!" headline: heavy Poppins in the section ink, with the same text
 * behind it as a 2px ochre outline shifted 0.04em right and down, like a print
 * misregistration. No blur. Use on the hero title and at most one other title per page.
 */
export function DisplayTitle({ lines, as: Tag = "h1", size = "display", className, id }: DisplayTitleProps) {
  const text = lines.map((line, i) => (
    <span key={i} className="block">
      {line}
      {i < lines.length - 1 ? " " : null}
    </span>
  ));
  return (
    <Tag
      id={id}
      className={clsx(
        "relative isolate font-display",
        size === "display" ? "text-display" : "text-h1",
        className,
      )}
    >
      <span
        aria-hidden="true"
        className="absolute inset-0 -z-10 translate-x-[0.04em] translate-y-[0.04em] select-none text-transparent [-webkit-text-stroke:2px_var(--color-ochre)]"
      >
        {text}
      </span>
      <span className="text-ink">{text}</span>
    </Tag>
  );
}
