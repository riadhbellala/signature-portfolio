import clsx from "clsx";
import Image from "next/image";
import Link from "next/link";
import { agency, type Client } from "@/content/agency";
import { home } from "@/content/site";
import { Container, Section, SectionHead } from "../layout/Section";
import { gridEdges } from "../puzzle/geometry";
import { PieceIndex, PieceText } from "../puzzle/PieceLabel";
import { PuzzlePiece } from "../puzzle/PuzzlePiece";
import { NextLink } from "../site/NextLink";
import { ArrowIcon } from "../ui/icons";

const LAYOUTS = [
  { cols: 2, className: "grid grid-cols-2 md:hidden" },
  { cols: 4, className: "hidden md:grid md:grid-cols-4" },
];

function ClientPiece({ client, n }: { client: Client; n: number }) {
  const t = home.clients;
  if (client.logo) {
    return (
      <>
        <PieceIndex n={n} />
        <Image src={client.logo} alt={client.name} width={240} height={96} className="h-auto max-h-[40%] w-4/5 object-contain object-left" />
      </>
    );
  }
  return (
    <>
      <PieceIndex n={n} />
      <span className="flex min-w-0 flex-col gap-1">
        <PieceText oneLine>{client.name}</PieceText>
        <span className="font-sans text-meta uppercase text-ink-muted max-md:hidden">{t.logoPending}</span>
      </span>
    </>
  );
}

/**
 * Clients as a puzzle wall on teal: one cream piece per client, locked together, and a last
 * ochre piece left for the visitor ("Votre marque ici ?"). The wall is the proof and the
 * invitation at once. Hidden while there are no clients.
 */
export function Clients() {
  const list = agency.clients;
  if (list.length === 0) return null;
  const t = home.clients;
  const total = list.length + 1;
  return (
    <Section id="clients" tone="teal" aria-labelledby="clients-title" joint={{ at: "calc(var(--page-edge) + 110px)" }}>
      <Container>
        <SectionHead id="clients-title" title={t.title} lead={t.lead} />
        {LAYOUTS.map(({ cols, className }) => {
          const rows = Math.ceil(total / cols);
          const lastCols = total - (rows - 1) * cols;
          return (
            <ul key={cols} className={clsx(className, "mt-12 md:mt-16")}>
              {Array.from({ length: total }, (_, i) => {
                const edges = gridEdges(Math.floor(i / cols), i % cols, rows, cols, { row: rows - 1, cols: lastCols });
                const invite = i === total - 1;
                return (
                  <li key={i}>
                    {invite ? (
                      <Link href={t.invite.href} aria-label={`${t.invite.label} ${t.invite.action}`} className="group block no-underline outline-offset-[-8px]">
                        <PuzzlePiece fluid tone="ochre" edges={edges}>
                          <PieceIndex n={i + 1} />
                          <span className="flex flex-col gap-2">
                            <PieceText>{t.invite.label}</PieceText>
                            <span className="inline-flex items-center gap-2 font-display text-small font-semibold">
                              <span className="underline decoration-2 underline-offset-4 group-hover:decoration-4 max-md:hidden">{t.invite.action}</span>
                              <ArrowIcon size={14} />
                            </span>
                          </span>
                        </PuzzlePiece>
                      </Link>
                    ) : (
                      <PuzzlePiece fluid tone="cream" edges={edges}>
                        <ClientPiece client={list[i]} n={i + 1} />
                      </PuzzlePiece>
                    )}
                  </li>
                );
              })}
            </ul>
          );
        })}
        <NextLink {...t.next} />
      </Container>
    </Section>
  );
}
