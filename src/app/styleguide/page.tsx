import type { Metadata } from "next";
import { Logo } from "@/components/brand/Logo";
import { DashedLoop } from "@/components/devices/DashedLoop";
import { ScriptTrace } from "@/components/devices/ScriptTrace";
import { Container, Section } from "@/components/layout/Section";
import { MotionRoot, Reveal, RevealItem } from "@/components/motion/Reveal";
import type { Edge } from "@/components/puzzle/geometry";
import { HeroSnap } from "@/components/puzzle/HeroSnap";
import { PuzzlePiece } from "@/components/puzzle/PuzzlePiece";
import { DisplayTitle } from "@/components/type/DisplayTitle";
import { BulletList, IndexLabel, MetaLabel, SectionLabel } from "@/components/type/Labels";
import { Button } from "@/components/ui/Button";
import { CONTRAST, FOUNDATION, SPACING, TONAL } from "@/design/tokens";

export const metadata: Metadata = {
  title: "Système graphique",
  robots: { index: false },
};

const EDGE_VALUES: Edge[] = ["flat", "tab", "blank"];
const EDGE_CODE: Record<Edge, string> = { flat: "p", tab: "t", blank: "c" };
const COMBOS = EDGE_VALUES.flatMap((top) =>
  EDGE_VALUES.flatMap((right) =>
    EDGE_VALUES.flatMap((bottom) => EDGE_VALUES.map((left) => ({ top, right, bottom, left }))),
  ),
);

const NAV = [
  ["Couleurs", "#couleurs"],
  ["Typographie", "#typo"],
  ["Espacement", "#espacement"],
  ["Motifs", "#motifs"],
  ["Boutons", "#boutons"],
  ["Puzzle", "#puzzle"],
] as const;

function H2({ id, children }: { id: string; children: React.ReactNode }) {
  return (
    <h2 id={id} className="max-w-[14ch] text-h2">
      {children}
    </h2>
  );
}

function Lead({ children }: { children: React.ReactNode }) {
  return <p className="measure mt-6 text-lead">{children}</p>;
}

export default function StyleguidePage() {
  return (
    <MotionRoot>
      <main>
        {/* ---------- Sample hero ---------- */}
        <Section trace="right" spacing="none" className="pb-24 pt-8 md:pb-32 md:pt-10" aria-labelledby="hero-title">
          <Container>
            <header className="flex items-center justify-between gap-6">
              <Logo width={156} />
              <nav aria-label="Sections du système" className="hidden lg:block">
                <ul className="flex gap-8 font-display text-body font-semibold">
                  {NAV.map(([label, href]) => (
                    <li key={href}>
                      <a href={href} className="no-underline hover:underline">
                        {label}
                      </a>
                    </li>
                  ))}
                </ul>
              </nav>
            </header>

            <div className="relative mt-16 grid grid-cols-1 gap-12 md:mt-24 lg:grid-cols-12 lg:gap-6">
              <div className="lg:col-span-7">
                <DisplayTitle id="hero-title" lines={["On", "construit."]} className="max-w-[10ch]" />
                <p className="measure mt-8 text-lead md:mt-10">
                  Agence 360° à Oran. Sites web, identités, murs, tableaux, façades, stands et réseaux sociaux : chaque pièce de votre image, assemblée par la même équipe.
                </p>
                <div className="mt-10 flex flex-wrap items-center gap-x-6 gap-y-3">
                  <Button href="#puzzle" arrow>
                    Voir nos réalisations
                  </Button>
                  <Button href="#boutons" variant="secondary">
                    Nous contacter
                  </Button>
                </div>
              </div>
              <div className="relative flex items-end lg:col-span-5 lg:justify-end lg:pb-4">
                <DashedLoop className="absolute -top-16 right-0 hidden h-auto w-[220px] lg:block" />
                <HeroSnap a="votre marque" b="nos solutions" groupLabel="Votre marque, plus nos solutions" />
              </div>
            </div>
          </Container>
        </Section>

        {/* ---------- Colour ---------- */}
        <Section tone="teal" id="couleurs" aria-labelledby="couleurs-title" joint={{ at: "calc(var(--page-edge) + 120px)" }}>
          <Container>
            <H2 id="couleurs-title">Trois couleurs, 60 · 30 · 10</H2>
            <Lead>
              Les trois couleurs du logo et des posts, rien d’autre. La crème est le papier, le teal la marque, l’ocre le petit détail chaud, comme « creative co. » sous la signature.
            </Lead>

            <div className="mt-16 flex h-24 w-full md:h-32" role="img" aria-label="Proportions : crème 60 %, teal 30 %, ocre 10 %">
              <div className="bg-cream" style={{ flexBasis: "60%" }} />
              <div className="bg-teal" style={{ flexBasis: "30%" }} />
              <div className="bg-ochre" style={{ flexBasis: "10%" }} />
            </div>

            <Reveal as="ul" className="mt-12 grid gap-12 md:grid-cols-3 md:gap-6">
              {FOUNDATION.map((c) => (
                <RevealItem as="li" key={c.token} className="flex flex-col gap-4">
                  <div className="flex items-baseline justify-between gap-4">
                    <span className="font-display text-h3">{c.name}</span>
                    <span className="font-display text-h3 text-ochre tabular">{c.share} %</span>
                  </div>
                  <MetaLabel>
                    {c.token} · {c.hex}
                  </MetaLabel>
                  <p className="text-body text-cream-muted">{c.role}</p>
                </RevealItem>
              ))}
            </Reveal>
          </Container>
        </Section>

        {/* ---------- Tonal steps + contrast ---------- */}
        <Section aria-labelledby="tons-title">
          <Container>
            <div className="grid gap-16 lg:grid-cols-12 lg:gap-6">
              <div className="lg:col-span-5">
                <H2 id="tons-title">Tons, pas de nouvelles teintes</H2>
                <Lead>Les mêmes trois couleurs à une autre intensité. Aucune quatrième teinte, ni pour le survol, ni pour les erreurs, ni pour les liens.</Lead>
              </div>
              <Reveal as="ul" className="grid grid-cols-2 gap-x-6 gap-y-10 sm:grid-cols-3 lg:col-span-7">
                {TONAL.map((t) => (
                  <RevealItem as="li" key={t.token} className="flex flex-col gap-3">
                    <div className={`${t.swatch} aspect-[4/3] w-full`} />
                    <MetaLabel>{t.token.replace("--color-", "")}</MetaLabel>
                    <span className="font-display text-body font-semibold tabular">{t.hex}</span>
                    <span className="text-small text-ink-muted">{t.from}. {t.use}.</span>
                  </RevealItem>
                ))}
              </Reveal>
            </div>

            <h3 className="mt-24 text-h3">Contrastes</h3>
            <div className="mt-6">
              <table className="w-full border-collapse text-left text-small md:text-body">
                <thead>
                  <tr className="border-b-2 border-teal">
                    <th scope="col" className="py-3 pr-4 font-sans text-meta uppercase">Texte</th>
                    <th scope="col" className="py-3 pr-4 font-sans text-meta uppercase">Fond</th>
                    <th scope="col" className="py-3 pr-4 font-sans text-meta uppercase">Ratio</th>
                    <th scope="col" className="py-3 pr-4 font-sans text-meta uppercase">WCAG</th>
                    <th scope="col" className="hidden py-3 font-sans text-meta uppercase md:table-cell">Usage</th>
                  </tr>
                </thead>
                <tbody>
                  {CONTRAST.map((r) => (
                    <tr key={r.fg + r.bg} className="border-b border-rule">
                      <td className="py-3 pr-4 font-semibold">{r.fg}</td>
                      <td className="py-3 pr-4">{r.bg}</td>
                      <td className="py-3 pr-4 tabular">{r.ratio.toFixed(2)} : 1</td>
                      <td className="py-3 pr-4 font-semibold">{r.pass}</td>
                      <td className="hidden py-3 text-ink-muted md:table-cell">{r.use}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </Container>
        </Section>

        {/* ---------- Type on cream ---------- */}
        <Section id="typo" aria-labelledby="typo-title" tone="sand" trace="left">
          <Container>
            <H2 id="typo-title">Typographie</H2>
            <Lead>
              Poppins, lourde et serrée, comme sur l’affiche. Inter Tight pour la lecture longue, parce que Poppins est trop large au-delà de deux lignes. Le logo n’est jamais recomposé avec une police.
            </Lead>
            <TypeScale />
          </Container>
        </Section>

        {/* ---------- Type on teal ---------- */}
        <Section tone="teal" aria-labelledby="typo-teal-title" trace="right">
          <Container>
            <h2 id="typo-teal-title" className="text-h2">
              Sur teal
            </h2>
            <TypeScale onTeal />
          </Container>
        </Section>

        {/* ---------- Spacing + radius ---------- */}
        <Section id="espacement" aria-labelledby="espacement-title">
          <Container>
            <div className="grid gap-16 lg:grid-cols-12 lg:gap-6">
              <div className="lg:col-span-6">
                <H2 id="espacement-title">Espacement</H2>
                <Lead>Base 4px. Onze valeurs, aucune autre. Sections de 128 à 160px sur grand écran, 72 à 96px sur téléphone. Une idée par écran.</Lead>
                <ul className="mt-12 flex flex-col gap-3">
                  {SPACING.map((s) => (
                    <li key={s} className="grid grid-cols-[48px_1fr] items-center gap-4">
                      <span className="text-small text-ink-muted tabular">{s}</span>
                      <span className="block h-3 bg-teal" style={{ width: s }} />
                    </li>
                  ))}
                </ul>
              </div>
              <div className="lg:col-span-5 lg:col-start-8">
                <h3 className="text-h3">Angles</h3>
                <p className="measure mt-4 text-body">
                  Tout est à angle droit : boutons, images, champs, tuiles. Le seul vrai cercle du site est le tenon du puzzle, avec les puces. Il se lit donc comme la marque, pas comme une interface arrondie.
                </p>
                <dl className="mt-10 grid grid-cols-3 gap-6">
                  <div className="flex flex-col gap-3">
                    <dt className="order-2 text-small text-ink-muted">0 · partout</dt>
                    <dd className="order-1 aspect-square w-full bg-teal" />
                  </div>
                  <div className="flex flex-col gap-3">
                    <dt className="order-2 text-small text-ink-muted">2px · champs</dt>
                    <dd className="order-1 aspect-square w-full rounded-xs border-2 border-teal" />
                  </div>
                  <div className="flex flex-col gap-3">
                    <dt className="order-2 text-small text-ink-muted">50 % · tenon, puce</dt>
                    <dd className="order-1 flex aspect-square w-full items-center justify-center">
                      <span className="size-3/5 rounded-full bg-ochre" />
                    </dd>
                  </div>
                </dl>
              </div>
            </div>
          </Container>
        </Section>

        {/* ---------- Devices ---------- */}
        <Section id="motifs" aria-labelledby="motifs-title" tone="sand">
          <Container>
            <H2 id="motifs-title">Les motifs des posts</H2>
            <Lead>Repris tels quels des publications Signature. Chacun a une règle d’usage, pour qu’il reste fort.</Lead>

            <Reveal className="mt-20 grid gap-24 lg:grid-cols-2 lg:gap-x-6">
              <Device n={1} title="Contour ocre décalé" rule="Titre du hero, et au plus un autre titre par page. Trait 2px, décalé de 0,04em, sans flou.">
                <DisplayTitle as="p" size="h1" lines={["On", "Recrute!"]} />
              </Device>

              <Device n={2} title="Ligne pointillée en boucle" rule="Une boucle. Trait 2px, tirets 8 / 8, bouts ronds. Au plus deux par page. Se dessine une fois au défilement.">
                <DashedLoop className="h-auto w-full max-w-[320px]" />
              </Device>

              <Device n={3} title="Filet ocre sous un libellé" rule="Filet 2px qui part du bord gauche de l’écran. Nomme le bloc qui suit, jamais au-dessus d’un titre plus grand.">
                <SectionLabel as="p">Signature cherche :</SectionLabel>
              </Device>

              <Device n={4} title="Puces ocre" rule="Point de 8px à la place des icônes. Listes en Poppins 600.">
                <BulletList items={["Community manager", "Chef de projet", "Designer senior", "Commercial confirmé"]} />
              </Device>

              <Device n={5} title="Index et méta" rule="(01), (02) en style méta, chiffres tabulaires. Pour les sections, tuiles et étapes uniquement.">
                <div className="flex flex-col gap-3">
                  <div className="flex items-baseline gap-4">
                    <IndexLabel n={1} />
                    <span className="font-display text-h3">Site web</span>
                  </div>
                  <div className="flex items-baseline gap-4">
                    <IndexLabel n={2} />
                    <span className="font-display text-h3">Identité & logo</span>
                  </div>
                  <MetaLabel>Oran · 2026</MetaLabel>
                </div>
              </Device>

              <Device n={6} title="Tracé script en fond" rule="Un seul trait fin, géant, coupé par le cadre, un ton au-dessus du fond. Sable sur crème, crème 10 % sur teal. Une section sur deux au plus.">
                <div className="flex gap-6">
                  <div className="tone-cream relative h-56 flex-1 overflow-hidden">
                    <ScriptTrace className="-right-6 -top-6 h-[140%] w-auto" />
                  </div>
                  <div className="tone-teal relative h-56 flex-1 overflow-hidden">
                    <ScriptTrace flip className="-left-6 -top-6 h-[140%] w-auto" />
                  </div>
                </div>
              </Device>
            </Reveal>
          </Container>
        </Section>

        {/* ---------- Buttons on cream ---------- */}
        <Section id="boutons" aria-labelledby="boutons-title">
          <Container>
            <H2 id="boutons-title">Boutons</H2>
            <Lead>
              Rectangulaires, 48px de haut, 20px de marge. Principal : fond ocre, texte teal. Secondaire : texte et filet ocre de 2px. Le survol ne fait que tracer ou épaissir un trait ; l’appui réduit à 0,97.
            </Lead>
            <ButtonMatrix />
          </Container>
        </Section>

        {/* ---------- Buttons on teal ---------- */}
        <Section tone="teal" aria-labelledby="boutons-teal-title" joint={{ at: "calc(100% - var(--page-edge) - 120px)" }}>
          <Container>
            <h2 id="boutons-teal-title" className="text-h2">
              Sur teal
            </h2>
            <ButtonMatrix />
          </Container>
        </Section>

        {/* ---------- Puzzle ---------- */}
        <Section id="puzzle" aria-labelledby="puzzle-title" trace="left">
          <Container>
            <H2 id="puzzle-title">Le puzzle</H2>
            <Lead>
              Repris de la campagne « We just build ». Une pièce teal, une pièce ocre, un seul tracé SVG. Le tenon est celui des pièces fournies par Signature : il occupe le tiers central du bord et dépasse de 0,3. Face en couleur exacte, biseau léger, tranche plus sombre, ombre douce. Un tenon et une encoche s’emboîtent sans jour.
            </Lead>

            <div className="mt-24">
              <SectionLabel id="tons">Trois tons</SectionLabel>
              <p className="measure mt-6 text-body text-ink-muted">Teal avec texte crème, ocre et crème avec texte teal. La pièce crème ne se pose que sur une section teal.</p>
              <ul className="mt-16 flex flex-wrap gap-x-24 gap-y-24">
                {(["teal", "ochre"] as const).map((tone, i) => (
                  <li key={tone}>
                    <PuzzlePiece size={200} tone={tone} edges={{ top: "flat", right: "tab", bottom: i ? "tab" : "flat", left: "flat" }}>
                      <IndexLabel n={i + 1} />
                      <span className="font-display text-piece">{tone}</span>
                    </PuzzlePiece>
                  </li>
                ))}
              </ul>
            </div>
          </Container>
        </Section>

        <Section aria-labelledby="matrice-title" tone="sand">
          <Container>
            <h2 id="matrice-title" className="text-h2">
              Les 81 combinaisons
            </h2>
            <p className="measure mt-6 text-body">
              Haut, droite, bas, gauche : p = plat, t = tenon, c = encoche. Dans les deux tons.
            </p>
            <ul className="mt-12 grid grid-cols-[repeat(auto-fill,minmax(72px,1fr))] gap-x-4 gap-y-10">
              {COMBOS.map((e, i) => {
                const code = [e.top, e.right, e.bottom, e.left].map((x) => EDGE_CODE[x]).join("");
                return (
                  <li key={code} className="flex flex-col items-center gap-5 pt-4">
                    <PuzzlePiece size={40} shadow={false} edges={e} tone={i % 9 === 4 ? "ochre" : "teal"} label={`Pièce ${code}`} />
                    <span className="text-meta text-ink-muted tabular">{code}</span>
                  </li>
                );
              })}
            </ul>
          </Container>
        </Section>

        <Section tone="teal" aria-labelledby="fin-title">
          <Container>
            <h2 id="fin-title" className="max-w-[14ch] text-h2">
              Système à valider avant les pages.
            </h2>
            <p className="measure mt-6 text-lead text-cream-muted">
              Source unique : DESIGN.md. Analyse des posts : docs/brand-analysis.md.
            </p>
          </Container>
        </Section>
      </main>
    </MotionRoot>
  );
}

function Device({ n, title, rule, children }: { n: number; title: string; rule: string; children: React.ReactNode }) {
  return (
    <RevealItem className="flex flex-col gap-8">
      <div className="flex flex-col gap-3">
        <div className="flex items-baseline gap-4">
          <IndexLabel n={n} />
          <h3 className="text-h3">{title}</h3>
        </div>
        <p className="measure text-body text-ink-muted">{rule}</p>
      </div>
      <div>{children}</div>
    </RevealItem>
  );
}

function TypeScale({ onTeal }: { onTeal?: boolean }) {
  const rows = [
    { name: "Display", spec: "Poppins 800 · clamp(56, 9vw, 140) · 0.9 · −0.045em", el: <p className="font-display text-display">{onTeal ? "Nos murs." : "On construit."}</p> },
    { name: "H1", spec: "Poppins 700 · clamp(40, 5.5vw, 76) · 0.95 · −0.035em", el: <p className="font-display text-h1">Façade & enseigne</p> },
    { name: "H2", spec: "Poppins 700 · clamp(32, 4vw, 56) · 1 · −0.03em", el: <p className="font-display text-h2">Stands & événements</p> },
    { name: "H3", spec: "Poppins 700 · 24 · 1.15 · −0.02em", el: <p className="font-display text-h3">Identité & logo</p> },
    { name: "Liste", spec: "Poppins 600 · 20–24 · 1.3", el: <p className="font-display text-list">Community manager</p> },
    {
      name: "Lead",
      spec: "Inter Tight 400 · 18 · 1.55 · 60ch",
      el: <p className="measure text-lead">Un seul interlocuteur pour le site, le logo, la façade et les publications. Les pièces sont pensées ensemble.</p>,
    },
    {
      name: "Texte",
      spec: "Inter Tight 400 · 16 · 1.55 · 60ch",
      el: (
        <p className="measure text-body">
          Le texte courant reste en encre pleine. La version atténuée sert aux notes secondaires, jamais au corps de texte. Chiffres tabulaires pour les index et les dates : <span className="tabular">17.03 · 23.03 · 2026</span>.
        </p>
      ),
    },
    { name: "Méta", spec: "Inter Tight 500 · 12 · capitales · +0.06em", el: <MetaLabel>Oran · Algérie · (07)</MetaLabel> },
  ];
  return (
    <dl className="mt-16 flex flex-col">
      {rows.map((r) => (
        <div key={r.name} className="grid gap-3 py-6 md:grid-cols-12 md:gap-6 md:py-8">
          <dt className="order-2 flex flex-col gap-1 md:order-1 md:col-span-3">
            <span className="font-display text-body font-semibold">{r.name}</span>
            <span className="text-small text-ink-muted tabular">{r.spec}</span>
          </dt>
          <dd className="order-1 min-w-0 md:order-2 md:col-span-9">{r.el}</dd>
        </div>
      ))}
    </dl>
  );
}

function ButtonMatrix() {
  const states = [
    { label: "Repos", props: {} },
    { label: "Survol", props: { state: "hover" as const } },
    { label: "Appui", props: { state: "press" as const } },
    { label: "Focus", props: { state: "focus" as const } },
    { label: "Désactivé", props: { disabled: true } },
  ];
  return (
    <div className="mt-12 flex flex-col gap-12">
      {(["primary", "secondary"] as const).map((v) => (
        <div key={v} className="flex flex-col gap-6">
          <h3 className="font-display text-body font-semibold">{v === "primary" ? "Principal" : "Secondaire"}</h3>
          <ul className="flex flex-wrap gap-x-10 gap-y-8">
            {states.map((s) => (
              <li key={s.label} className="flex flex-col items-start gap-3">
                <span className="text-small text-ink-muted">{s.label}</span>
                <Button variant={v} arrow={v === "primary"} {...s.props}>
                  Devis
                </Button>
              </li>
            ))}
          </ul>
        </div>
      ))}
    </div>
  );
}
