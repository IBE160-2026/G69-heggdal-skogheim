"use client";

import { LoaderCircle, TriangleAlert } from "lucide-react";
import { useEffect, useRef, useState } from "react";

import { Alert, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { avvisCvFil, lesCvFil } from "@/lib/okt/cvFil";
import { useOkt } from "@/lib/okt/OktProvider";
import {
  antallFjernet,
  arsakerTilAnalyse,
  cvFeil,
  cvVurdering,
  fjernetTekst,
} from "@/lib/okt/tilstand";

const FELT_ID = "cv-tekst";
const FJERNET_ID = "cv-fjernet";
const VARSEL_ID = "cv-varsel";
const TELLER_ID = "cv-teller";
const FEIL_ID = "cv-feil";
const LESEFEIL_ID = "cv-lesefeil";
const HJELP_ID = "cv-fil-hjelp";
const AVVIST_ID = "cv-fil-avvist";

// Forlates feltet for å trykke en aktiv *Analyser*, maskerer *Analyser* selv (FR-6).
// En deaktivert *Analyser* gjør ingenting ved trykk, så da maskerer feltet. Mister
// *Analyser* fokus uten trykk, maskerer knappen ved blur (se AnalyserKnapp).
export const ANALYSER_ID = "analyser";

function medTusenskille(tall: number): string {
  return String(tall).replace(/\B(?=(\d{3})+$)/g, "\u00a0");
}

export function CvPanel() {
  const { tilstand, dispatch } = useOkt();
  const [valgtInnliming, setValgtInnliming] = useState(false);
  const skalFokusere = useRef(false);
  const limerInn = useRef(false);
  const felt = useRef<HTMLTextAreaElement>(null);

  // `nr` øker ved hver avvisning, så samme melding monteres på nytt og leses opp igjen.
  const [avvist, setAvvist] = useState<{ tekst: string; nr: number } | null>(
    null,
  );
  const [drar, setDrar] = useState(false);
  const skalFokusereVelg = useRef(false);
  const velgKnapp = useRef<HTMLButtonElement>(null);
  const filvelger = useRef<HTMLInputElement>(null);
  // Øker for hver ny fil og ved *Bytt fil*, så et svar som kommer for sent, ignoreres.
  const lesing = useRef(0);

  const { cvTekst } = tilstand.innhold.utkast;
  const { cvFil } = tilstand.innhold;
  const filFerdig = cvFil?.tilstand === "lest" || cvFil?.tilstand === "feilet";
  // Tilstand 2 når brukeren har valgt å lime inn, når det finnes tekst, eller når
  // en fil er lest eller feilet.
  const kontroll = valgtInnliming || cvTekst !== "" || filFerdig;

  useEffect(() => {
    if (kontroll && skalFokusere.current) {
      skalFokusere.current = false;
      felt.current?.focus();
    }
    if (!kontroll && skalFokusereVelg.current) {
      skalFokusereVelg.current = false;
      velgKnapp.current?.focus();
    }
  }, [kontroll]);

  // En fil som slippes utenfor feltet, skal ikke åpnes i fanen. Tekst som dras
  // inn i CV-feltet, berøres ikke.
  useEffect(() => {
    function hindreFil(hendelse: DragEvent) {
      if (hendelse.dataTransfer?.types.includes("Files")) {
        hendelse.preventDefault();
      }
    }
    window.addEventListener("dragover", hindreFil);
    window.addEventListener("drop", hindreFil);

    return () => {
      window.removeEventListener("dragover", hindreFil);
      window.removeEventListener("drop", hindreFil);
    };
  }, []);

  function avvis(tekst: string) {
    setAvvist((forrige) => ({ tekst, nr: (forrige?.nr ?? 0) + 1 }));
    velgKnapp.current?.focus();
  }

  // Filen leses bare i nettleseren og sendes aldri til serveren (FR-2).
  async function velgFil(fil: File) {
    const nr = ++lesing.current;
    const melding = avvisCvFil(fil);
    if (melding) {
      // En fil som leses nå, slippes, så «Leser CV-en …» ikke blir stående.
      if (cvFil) dispatch({ type: "cvFilByttet" });
      avvis(melding);
      return;
    }
    setAvvist(null);

    dispatch({ type: "cvFilLeses", navn: fil.name });
    const svar = await lesCvFil(fil);
    if (nr !== lesing.current) return;

    if (svar.type === "avvist") {
      dispatch({ type: "cvFilByttet" });
      avvis(svar.melding);
      return;
    }
    skalFokusere.current = true;
    if (svar.type === "lest") {
      dispatch({ type: "cvFilLest", cvTekst: svar.cvTekst });
    } else {
      dispatch({ type: "cvFilFeilet" });
    }
  }

  if (!kontroll) {
    const knappBeskrivelse = avvist ? `${HJELP_ID} ${AVVIST_ID}` : HJELP_ID;

    return (
      <section
        aria-labelledby="cv-tittel"
        className="min-w-0 rounded-lg border bg-card p-4"
      >
        <h2 id="cv-tittel" className="text-section-title">
          CV
        </h2>
        <div
          className={`mt-3 rounded-lg border-2 border-dashed px-4 py-6 text-center ${
            drar ? "border-primary bg-muted" : "border-input"
          }`}
          onDragOver={(hendelse) => {
            // Dra og slipp er et tillegg til knappen.
            hendelse.preventDefault();
            hendelse.dataTransfer.dropEffect = "copy";
            setDrar(true);
          }}
          onDragLeave={(hendelse) => {
            const til = hendelse.relatedTarget as Node | null;
            if (!til || !hendelse.currentTarget.contains(til)) setDrar(false);
          }}
          onDrop={(hendelse) => {
            hendelse.preventDefault();
            setDrar(false);
            const fil = hendelse.dataTransfer.files[0];
            if (fil) void velgFil(fil);
          }}
        >
          <Button
            ref={velgKnapp}
            type="button"
            variant="outline"
            className="h-11 px-4 lg:h-9"
            aria-describedby={knappBeskrivelse}
            onClick={() => filvelger.current?.click()}
          >
            Velg CV-fil
          </Button>
          <input
            ref={filvelger}
            type="file"
            accept=".pdf,.docx,.txt"
            hidden
            tabIndex={-1}
            onChange={(hendelse) => {
              const fil = hendelse.target.files?.[0];
              // Tømmes, så samme fil kan velges igjen.
              hendelse.target.value = "";
              if (fil) void velgFil(fil);
            }}
          />
          <p id={HJELP_ID} className="mt-2 text-sm text-muted-foreground">
            eller dra filen hit. PDF, DOCX eller TXT, maks 5 MB
          </p>
        </div>
        {avvist ? (
          <p
            key={avvist.nr}
            id={AVVIST_ID}
            role="alert"
            className="mt-2 text-sm text-destructive"
          >
            {avvist.tekst}
          </p>
        ) : null}
        {cvFil?.tilstand === "leser" ? (
          // Live-regionen melder det samme, så dette er bare den synlige statusen.
          <p className="mt-2 flex items-center gap-2 text-sm">
            <LoaderCircle
              aria-hidden="true"
              className="size-4 motion-safe:animate-spin"
            />
            Leser CV-en …
          </p>
        ) : null}
        <Button
          type="button"
          variant="link"
          className="mt-2 h-11 min-w-11 px-0 lg:h-9"
          onClick={() => {
            // En fil som leses nå, slippes.
            lesing.current++;
            if (cvFil) dispatch({ type: "cvFilByttet" });
            skalFokusere.current = true;
            setValgtInnliming(true);
          }}
        >
          Lim inn CV-teksten
        </Button>
      </section>
    );
  }

  const { status, antall, erKort } = cvVurdering(cvTekst, cvFil);
  const feil = cvFeil(status);
  const fjernet = antallFjernet(cvTekst);
  // Meldingen gjelder bare til brukeren har lagt inn tekst selv.
  const lesefeil = cvFil?.tilstand === "feilet" && cvTekst === "";
  const beskrivelse = [
    lesefeil ? LESEFEIL_ID : null,
    fjernet > 0 ? FJERNET_ID : null,
    erKort ? VARSEL_ID : null,
    TELLER_ID,
    feil ? FEIL_ID : null,
  ]
    .filter((id) => id !== null)
    .join(" ");

  return (
    <section
      aria-labelledby="cv-tittel"
      className="min-w-0 rounded-lg border bg-card p-4"
    >
      <h2 id="cv-tittel" className="text-section-title">
        Kontroller CV-teksten
      </h2>
      {cvFil && filFerdig ? (
        <div className="mt-1 flex flex-wrap items-center gap-x-3">
          <span className="min-w-0 text-sm break-all">{cvFil.navn}</span>
          <Button
            type="button"
            variant="link"
            className="h-11 min-w-11 px-0 lg:h-9"
            onClick={() => {
              lesing.current++;
              skalFokusereVelg.current = true;
              setValgtInnliming(false);
              setAvvist(null);
              dispatch({ type: "cvFilByttet" });
            }}
          >
            Bytt fil
          </Button>
        </div>
      ) : null}
      {lesefeil ? (
        <p id={LESEFEIL_ID} className="mt-2 text-sm text-destructive">
          Klarte ikke å lese filen. Lim inn CV-teksten i stedet.
        </p>
      ) : null}
      {fjernet > 0 ? (
        <p id={FJERNET_ID} className="mt-2 text-sm">
          {fjernetTekst(fjernet)}
        </p>
      ) : null}
      {erKort ? (
        // Fast varsel i panelet, ikke en melding, så det skal ikke ha role="alert".
        <Alert id={VARSEL_ID} role={undefined} className="mt-3">
          <TriangleAlert aria-hidden="true" />
          <AlertDescription className="text-foreground">
            Fant nesten ikke tekst i filen. Den kan være skannet eller tom. Lim
            inn teksten selv i feltet under.
          </AlertDescription>
        </Alert>
      ) : null}
      <Label htmlFor={FELT_ID} className="mt-3 block text-label">
        CV-tekst
      </Label>
      <Textarea
        ref={felt}
        id={FELT_ID}
        value={cvTekst}
        rows={16}
        autoComplete="off"
        className="mt-1 min-h-60 field-sizing-fixed"
        aria-invalid={feil ? true : undefined}
        aria-describedby={beskrivelse}
        onKeyDown={() => {
          limerInn.current = false;
        }}
        onPaste={() => {
          limerInn.current = true;
        }}
        onDrop={() => {
          // Tekst som dras inn, behandles som innliming.
          limerInn.current = true;
        }}
        onChange={(hendelse) => {
          const neste = hendelse.target.value;
          setValgtInnliming(true);
          if (limerInn.current) {
            limerInn.current = false;
            dispatch({ type: "cvLimtInn", cvTekst: neste });
          } else {
            dispatch({ type: "cvEndret", cvTekst: neste });
          }
        }}
        onBlur={(hendelse) => {
          const til = hendelse.relatedTarget as HTMLElement | null;
          // Om *Analyser* er aktiv, avgjøres av tilstanden, ikke av markupen.
          const analyserAktiv = arsakerTilAnalyse(tilstand).length === 0;
          if (til?.id === ANALYSER_ID && analyserAktiv) return;
          dispatch({ type: "cvForlatt" });
        }}
      />
      <p
        id={TELLER_ID}
        className={`mt-1 text-right text-label ${
          feil ? "text-destructive" : "text-muted-foreground"
        }`}
      >
        {`${medTusenskille(antall)} av maks 15\u00a0000 tegn`}
      </p>
      {feil ? (
        <p id={FEIL_ID} className="mt-1 text-sm text-destructive">
          {feil}
        </p>
      ) : null}
    </section>
  );
}
