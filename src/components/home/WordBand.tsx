/**
 * A band of giant words sliding past (from the reference): the services, as type. A pause between
 * two blocks of work; decoration only, so hidden from screen readers. Stops with reduced motion.
 */
export function WordBand({ words }: { words: string[] }) {
  const line = words.map((w) => `${w} · `).join("");
  return (
    <div aria-hidden="true" className="overflow-hidden border-y border-line py-4 md:py-6">
      <div className="dev-marquee flex w-max whitespace-nowrap font-display text-[clamp(3rem,9vw,8.5rem)] font-bold leading-none tracking-[-0.04em]">
        <span className="pr-[0.25em]">{line}</span>
        <span className="pr-[0.25em]">{line}</span>
      </div>
    </div>
  );
}
