/** The few icons the site needs, drawn inline: 1.5px stroke, square caps, mitred joins. */

interface IconProps {
  size?: number;
  className?: string;
}

const base = {
  fill: "none",
  stroke: "currentColor",
  strokeWidth: 1.5,
  strokeLinecap: "square" as const,
  strokeLinejoin: "miter" as const,
  "aria-hidden": true,
  focusable: false,
};

export function ArrowIcon({ size = 16, className }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 16 16" className={className} {...base}>
      <path d="M2 8h11M9 3.5 13.5 8 9 12.5" />
    </svg>
  );
}

export function ArrowDownIcon({ size = 16, className }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 16 16" className={className} {...base}>
      <path d="M8 2v11M3.5 9 8 13.5 12.5 9" />
    </svg>
  );
}
