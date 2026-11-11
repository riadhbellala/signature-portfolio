import clsx from "clsx";

/**
 * The Signature creative co. lock-up. The real file is not in /public/brand yet, so this
 * renders a clearly labelled placeholder. Never redraw the script with a font and never
 * recolour the file: when it arrives, swap this for <Image src="/brand/signature.svg" />.
 */
export function Logo({ width = 180, className }: { width?: number; className?: string }) {
  return (
    <div
      role="img"
      aria-label="Logo Signature creative co. (fichier à fournir)"
      className={clsx(
        "flex aspect-[2.4/1] flex-col items-start justify-center gap-1 border border-dashed border-ink-muted px-3 text-ink-muted",
        className,
      )}
      style={{ width }}
    >
      {width < 140 ? (
        <span className="font-sans text-meta uppercase">[Logo]</span>
      ) : (
        <>
          <span className="font-display text-body font-semibold">Logo Signature</span>
          <span className="font-sans text-meta uppercase">Fichier à fournir · public/brand</span>
        </>
      )}
    </div>
  );
}
