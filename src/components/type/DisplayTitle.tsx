import clsx from "clsx";
import type { ElementType } from "react";

export interface DisplayTitleProps {
  /** One string per line, set stacked like "On / Recrute!". */
  lines: string[];
  as?: ElementType;
  /** Display size by default; h1 for a page title. */
  size?: "display" | "h1";
  className?: string;
  id?: string;
}

/**
 * The "On Recrute!" headline: Inter Tight 600 in the section ink, one line per string. Use on the hero title and at most one other title per page.
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
      <span className="text-ink">{text}</span>
    </Tag>
  );
}
