import type { ReactNode } from "react";

/** The two lines every piece carries: a small index top-left, the label at the bottom. */
export function PieceIndex({ n }: { n: number }) {
  return <span className="font-sans text-meta text-ink-muted tabular">({String(n).padStart(2, "0")})</span>;
}

export function PieceText({ children, oneLine }: { children: ReactNode; oneLine?: boolean }) {
  return <span className={oneLine ? "truncate font-display text-piece" : "font-display text-piece"}>{children}</span>;
}
