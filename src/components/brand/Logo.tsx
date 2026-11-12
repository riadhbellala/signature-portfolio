import clsx from "clsx";
import Image from "next/image";

/** The Signature creative co. lock-up (the agency's own file, never redrawn or recoloured). */
export function Logo({
  width = 180,
  className,
}: {
  width?: number;
  className?: string;
}) {
  return (
    <Image
      src="/brand/signature-logo.webp"
      alt="Signature creative co."
      width={954}
      height={483}
      priority
      className={clsx("h-auto", className)}
      style={{ width }}
    />
  );
}
