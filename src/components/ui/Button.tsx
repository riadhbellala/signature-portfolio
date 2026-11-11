import clsx from "clsx";
import Link from "next/link";
import type { ComponentPropsWithoutRef, ReactNode } from "react";
import { ArrowIcon } from "./icons";

type Variant = "primary" | "secondary";
/** Forces a visual state; only for /styleguide. */
type ForcedState = "hover" | "press" | "focus";

interface Common {
  variant?: Variant;
  arrow?: boolean;
  state?: ForcedState;
  className?: string;
  children: ReactNode;
}

type AsButton = Common & Omit<ComponentPropsWithoutRef<"button">, keyof Common> & { href?: undefined };
type AsLink = Common & Omit<ComponentPropsWithoutRef<typeof Link>, keyof Common> & { href: string };

/**
 * Rectangular, 0 radius, 48px tall, 20px horizontal padding. Colours follow the
 * surrounding Section tone. Pass `href` for a link, otherwise it renders a <button>.
 */
export function Button(props: AsButton | AsLink) {
  const { variant = "primary", arrow, state, className, children, ...rest } = props;
  const classes = clsx("btn", variant === "primary" ? "btn-primary" : "btn-secondary", className);
  const inner = (
    <>
      <span className="btn-label">{children}</span>
      {arrow ? <ArrowIcon /> : null}
    </>
  );
  if (typeof props.href === "string") {
    return (
      <Link className={classes} data-state={state} {...(rest as Omit<AsLink, keyof Common>)}>
        {inner}
      </Link>
    );
  }
  const { type = "button", ...buttonRest } = rest as Omit<AsButton, keyof Common>;
  return (
    <button type={type} className={classes} data-state={state} {...buttonRest}>
      {inner}
    </button>
  );
}
