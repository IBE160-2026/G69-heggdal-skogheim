"use client";

import { TriangleAlert } from "lucide-react";
import { useEffect, useRef, useState } from "react";

import { Alert, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
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

  const { cvTekst } = tilstand.innhold.utkast;
  // Tilstand 2 når brukeren har valgt å lime inn, eller når det finnes tekst.
  const kontroll = valgtInnliming || cvTekst !== "";

  useEffect(() => {
    if (kontroll && skalFokusere.current) {
      skalFokusere.current = false;
      felt.current?.focus();
    }
  }, [kontroll]);

  if (!kontroll) {
    return (
      <section
        aria-labelledby="cv-tittel"
        className="min-w-0 rounded-lg border bg-card p-4"
      >
        <h2 id="cv-tittel" className="text-section-title">
          CV
        </h2>
        <p className="mt-2 text-sm text-muted-foreground">
          Opplasting av CV-fil kommer snart.
        </p>
        <Button
          type="button"
          variant="outline"
          className="mt-3 h-11 px-4 lg:h-9"
          onClick={() => {
            skalFokusere.current = true;
            setValgtInnliming(true);
          }}
        >
          Lim inn CV-teksten
        </Button>
      </section>
    );
  }

  const { status, antall, erKort } = cvVurdering(cvTekst);
  const feil = cvFeil(status);
  const fjernet = antallFjernet(cvTekst);
  const beskrivelse = [
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
        // Utvidet stavekontroll i nettleseren kan sende teksten til en skytjeneste.
        spellCheck={false}
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
