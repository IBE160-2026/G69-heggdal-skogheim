"use client";

import {
  Check,
  Circle,
  CircleAlert,
  CircleCheck,
  CircleDashed,
  Info,
  type LucideIcon,
} from "lucide-react";
import { useRef, type MouseEvent, type ReactNode } from "react";

import { FEILMELDINGER } from "@/components/feilmeldinger";
import { ProvEksempelKnapp } from "@/components/ProvEksempelKnapp";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import type { Feilkode } from "@/lib/kontrakt/feil";
import type { GapAnalyse, Kategori, Krav } from "@/lib/kontrakt/gap";
import { cn } from "@/lib/utils";
import { useOkt } from "@/lib/okt/OktProvider";

// All tekst fra API-et vises som ren tekst (NFR-9): bare som barn i JSX, aldri som HTML.

const KATEGORIER: {
  kategori: Kategori;
  navn: string;
  ikon: LucideIcon;
  merke: string;
  kant: string;
}[] = [
  {
    kategori: "oppfylt",
    navn: "Oppfylt",
    ikon: CircleCheck,
    merke: "bg-oppfylt-bg text-oppfylt",
    kant: "border-l-oppfylt",
  },
  {
    kategori: "delvis",
    navn: "Delvis oppfylt",
    ikon: CircleDashed,
    merke: "bg-delvis-bg text-delvis",
    kant: "border-l-delvis",
  },
  {
    kategori: "mangler",
    navn: "Mangler",
    ikon: Circle,
    merke: "bg-mangler-bg text-mangler",
    kant: "border-l-mangler",
  },
];

const GRUPPE_ID: Record<Kategori, string> = {
  oppfylt: "gruppe-oppfylt",
  delvis: "gruppe-delvis",
  mangler: "gruppe-mangler",
};

const LASTER = "Leser annonsen og sammenligner med CV-en …";

// FR-10, UX-DR13: det faste rådet for et nedgradert krav. Konstant i komponenten.
function FastRaad() {
  return (
    <>
      Fant ikke belegg for dette i CV-teksten. Har du denne erfaringen, trykk{" "}
      <em>Endre CV-tekst</em> og legg den inn.
    </>
  );
}

// FR-22, AD-8: feilen fra tabellen i en Alert med role="alert", aldri som toast.
// Live-regionen gjentar den ikke.
function Feil({ feilkode }: { feilkode: Feilkode }) {
  const { startGenerering } = useOkt();
  const varsel = useRef<HTMLDivElement>(null);
  const { tekst, provIgjen, provEksempel } = FEILMELDINGER[feilkode];

  function provPaaNytt() {
    // Fanepanelet (`tabIndex={-1}`) får fokus, siden knappen forsvinner med feilen
    // (UX-DR24). Samme kjøring sendes på nytt, og teksten i feltene berøres ikke.
    const panel = varsel.current?.closest<HTMLElement>("[role=tabpanel]");
    startGenerering("gap");
    panel?.focus();
  }

  return (
    <Alert ref={varsel} variant="destructive">
      <CircleAlert aria-hidden="true" />
      <AlertDescription>{tekst}</AlertDescription>
      {provIgjen ? (
        <Button
          type="button"
          variant="outline"
          size="lg"
          className="col-start-2 mt-2 h-11 justify-self-start px-4 text-foreground lg:h-9"
          onClick={provPaaNytt}
        >
          Prøv igjen
        </Button>
      ) : null}
      {provEksempel ? (
        <ProvEksempelKnapp className="col-start-2 mt-2 justify-self-start text-foreground" />
      ) : null}
    </Alert>
  );
}

function Kategorimerke({
  kategori,
  children,
  className,
}: {
  kategori: Kategori;
  children?: ReactNode;
  className?: string;
}) {
  const { navn, ikon: Ikon, merke } = KATEGORIER.find(
    (k) => k.kategori === kategori,
  )!;

  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5 text-label font-semibold",
        merke,
        className,
      )}
    >
      <Ikon aria-hidden="true" className="size-4 shrink-0" />
      {navn}
      {children}
    </span>
  );
}

function Laster() {
  return (
    <div className="flex flex-col gap-4">
      <p>{LASTER}</p>
      <div aria-hidden="true" className="flex flex-col gap-3">
        <Skeleton className="h-16 w-full" />
        {[0, 1, 2].map((nr) => (
          <div key={nr} className="flex flex-col gap-2 rounded-lg border bg-card p-4">
            <Skeleton className="h-5 w-2/3" />
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-5/6" />
          </div>
        ))}
      </div>
    </div>
  );
}

function tilGruppe(hendelse: MouseEvent<HTMLAnchorElement>, kategori: Kategori) {
  hendelse.preventDefault();
  document.getElementById(GRUPPE_ID[kategori])?.focus();
}

function Oppsummering({ krav }: { krav: Krav[] }) {
  const antall = (kategori: Kategori) =>
    krav.filter((k) => k.kategori === kategori).length;

  return (
    <div className="flex flex-col gap-3 rounded-lg border bg-card p-4 sm:flex-row sm:flex-wrap sm:items-center sm:justify-between">
      <p className="text-base">
        Du dekker{" "}
        <strong>
          {antall("oppfylt")} av {krav.length} krav
        </strong>
        . {antall("delvis")} er delvis oppfylt.
      </p>
      <ul className="flex flex-wrap gap-2">
        {KATEGORIER.map(({ kategori }) => {
          const n = antall(kategori);
          const merke = (
            <Kategorimerke kategori={kategori}>
              {" "}
              {n}
            </Kategorimerke>
          );
          return (
            <li key={kategori}>
              {n > 0 ? (
                <a
                  href={`#${GRUPPE_ID[kategori]}`}
                  onClick={(hendelse) => tilGruppe(hendelse, kategori)}
                  className="inline-flex min-h-6 items-center rounded-full underline-offset-2 hover:underline"
                >
                  {merke}
                </a>
              ) : (
                merke
              )}
            </li>
          );
        })}
      </ul>
    </div>
  );
}

function Belegg({ belegg }: { belegg: string[] }) {
  return (
    <figure className="mt-3">
      <figcaption className="mb-1 text-label text-muted-foreground">
        Fra CV-en
      </figcaption>
      <div className="flex flex-col gap-1.5">
        {belegg.map((sitat, nr) => (
          <blockquote
            key={nr}
            className="rounded-r-sm border-l-[3px] border-l-primary bg-belegg-bg px-2.5 py-1.5 text-sm text-belegg"
          >
            «{sitat}»
          </blockquote>
        ))}
      </div>
    </figure>
  );
}

function Tekstdel({ etikett, children }: { etikett: string; children: ReactNode }) {
  return (
    <div className="mt-3">
      <p className="mb-1 text-label text-muted-foreground">{etikett}</p>
      <p className="text-sm">{children}</p>
    </div>
  );
}

function Kravkort({ krav, kant }: { krav: Krav; kant: string }) {
  const visBelegg = !krav.nedgradert && krav.belegg.length > 0;

  return (
    <li className={cn("rounded-lg border border-l-4 bg-card px-4 py-3.5", kant)}>
      <div className="flex flex-wrap items-start justify-between gap-x-3 gap-y-1.5">
        <p className="font-semibold">{krav.tekst}</p>
        <Kategorimerke kategori={krav.kategori} />
      </div>
      {krav.nedgradert ? (
        <p className="mt-2 inline-flex items-center gap-1.5 text-label text-muted-foreground">
          <Info aria-hidden="true" className="size-4 shrink-0" />
          Nedgradert: fant ikke belegg i CV-en
        </p>
      ) : null}
      {visBelegg ? <Belegg belegg={krav.belegg} /> : null}
      {krav.kategori === "delvis" && krav.forklaring ? (
        <Tekstdel etikett="Hvorfor delvis">{krav.forklaring}</Tekstdel>
      ) : null}
      {krav.kategori === "mangler" ? (
        krav.nedgradert ? (
          <Tekstdel etikett="Råd">
            <FastRaad />
          </Tekstdel>
        ) : krav.raad ? (
          <Tekstdel etikett="Råd">{krav.raad}</Tekstdel>
        ) : null
      ) : null}
    </li>
  );
}

function Kravgrupper({ krav }: { krav: Krav[] }) {
  return (
    <>
      {KATEGORIER.map(({ kategori, kant }) => {
        // Annonsens rekkefølge innen gruppen. Tomme grupper vises ikke.
        const gruppe = krav.filter((k) => k.kategori === kategori);
        if (gruppe.length === 0) return null;

        return (
          <section key={kategori} aria-labelledby={GRUPPE_ID[kategori]}>
            <h3
              id={GRUPPE_ID[kategori]}
              tabIndex={-1}
              className="mt-6 mb-2.5 text-section-title"
            >
              <Kategorimerke kategori={kategori} className="text-section-title" />
            </h3>
            <ul className="flex flex-col gap-2.5">
              {gruppe.map((k, nr) => (
                <Kravkort key={nr} krav={k} kant={kant} />
              ))}
            </ul>
          </section>
        );
      })}
    </>
  );
}

function Nokkelordliste({
  id,
  etikett,
  ord,
  funnet,
}: {
  id: string;
  etikett: string;
  ord: string[];
  funnet: boolean;
}) {
  if (ord.length === 0) return null;

  return (
    <div className="mt-3">
      <p id={id} className="mb-1.5 text-label text-muted-foreground">
        {etikett}
      </p>
      <ul aria-labelledby={id} className="flex flex-wrap gap-1.5">
        {ord.map((tekst, nr) => (
          <li
            key={nr}
            className={cn(
              "inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-label",
              funnet
                ? "bg-primary-soft text-primary"
                : "border border-dashed border-input text-muted-foreground",
            )}
          >
            {funnet ? (
              <Check aria-hidden="true" className="size-3.5 shrink-0" />
            ) : null}
            {tekst}
          </li>
        ))}
      </ul>
    </div>
  );
}

function Treffmaler({ analyse }: { analyse: GapAnalyse }) {
  const funnet = analyse.nokkelord.filter((n) => n.funnet).map((n) => n.tekst);
  const ikkeFunnet = analyse.nokkelord
    .filter((n) => !n.funnet)
    .map((n) => n.tekst);

  return (
    <section aria-label="Treff på nøkkelord" className="mt-7 rounded-lg border bg-card p-4">
      <p className="flex flex-wrap items-baseline gap-x-2">
        <span className="text-hit-rate">{analyse.treffprosent}&nbsp;%</span>
        <span className="text-sm text-muted-foreground">
          veiledende treff, ikke en ATS-score
        </span>
      </p>
      <div
        aria-hidden="true"
        className="my-3 h-2 overflow-hidden rounded-full border border-input bg-belegg-bg"
      >
        <div
          className="h-full bg-primary"
          style={{ width: `${analyse.treffprosent}%` }}
        />
      </div>
      <p className="text-label text-muted-foreground">
        {funnet.length} av {analyse.nokkelord.length} nøkkelord fra annonsen
        finnes i CV-teksten. Legg bare til nøkkelord som CV-en har dekning for.
      </p>
      <Nokkelordliste
        id="nokkelord-funnet"
        etikett="Funnet i CV-en"
        ord={funnet}
        funnet
      />
      <Nokkelordliste
        id="nokkelord-ikke-funnet"
        etikett="Ikke funnet"
        ord={ikkeFunnet}
        funnet={false}
      />
    </section>
  );
}

// Fanen *Gap-analyse og nøkkelord* (FR-7, FR-8, FR-10–FR-13). Ingenting kan redigeres
// ennå (story 2.6).
export function GapAnalyseFane() {
  const gap = useOkt().tilstand.innhold.resultatdeler.gap;

  if (!gap || gap.status === "venter" || gap.status === "genererer") {
    return <Laster />;
  }

  if (gap.status === "feil") {
    return <Feil feilkode={gap.feilkode ?? "llm_feil"} />;
  }

  const analyse = gap.redigert ?? gap.generert;
  if (!analyse) return null;

  return (
    <div>
      <Oppsummering krav={analyse.krav} />
      <Kravgrupper krav={analyse.krav} />
      <Treffmaler analyse={analyse} />
    </div>
  );
}
