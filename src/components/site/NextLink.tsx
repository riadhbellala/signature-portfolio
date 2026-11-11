import clsx from "clsx";
import { ArrowDownIcon } from "../ui/icons";

/**
 * The quiet hand-off at the end of a section: names the next section and points to it.
 * Ink text with the ochre underline, so it never competes with a primary button.
 */
export function NextLink({ href, label, className }: { href: string; label: string; className?: string }) {
  return (
    <a
      href={href}
      className={clsx(
        "mt-16 inline-flex min-h-12 items-center gap-3 font-display text-body font-semibold text-ink underline decoration-2 underline-offset-8 md:mt-24",
        className,
      )}
    >
      {label}
      <ArrowDownIcon />
    </a>
  );
}
