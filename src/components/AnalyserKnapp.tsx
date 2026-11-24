"use client";

import { Info } from "lucide-react";
import { useEffect, useRef, useState } from "react";

import { ANALYSER_ID } from "@/components/CvPanel";
import { FEILMELDINGER } from "@/components/feilmeldinger";
import { ProvEksempelKnapp } from "@/components/ProvEksempelKnapp";
import { Alert, AlertDescription } from "@/components/ui/alert";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { useOkt } from "@/lib/okt/OktProvider";
import {
  analyserStarterKjoring,
  arsakerTilAnalyse,
  erUendret,
  redigerteFaner,
} from "@/lib/okt/tilstand";

const ARSAKER_ID = "analyser-arsaker";
// Linjen om endret tekst beskriver *Analyser*, så skjermlesere får vite hvorfor
// *Tilbake til resultatet* er borte.
const ENDRET_ID = "analyser-endret";
export const DEMO_VARSEL_ID = "demo-varsel";
export const ENDRET_TEKST =
  "Du har endret teksten. Trykk Analyser for en ny analyse.";

function somListe(navn: string[]): string {
  if (navn.length < 2) return navn.join("");
  return `${navn.slice(0, -1).join(", ")} og ${navn[navn.length - 1]}`;
}

export function AnalyserKnapp() {
  const { tilstand, dispatch } = useOkt();
  const arsaker = arsakerTilAnalyse(tilstand);
  const deaktivert = arsaker.length > 0;
  const { demoVarsel, kjoring } = tilstand.innhold;
  const varsel = useRef<HTMLDivElement>(null);
  const knapp = useRef<HTMLButtonElement>(null);
  const bekreftet = useRef(false);
  const [apen, setApen] = useState(false);
  const varselNr = demoVarsel?.nr;
  const faner = redigerteFaner(tilstand);
  // FR-3: tilbake uten ny kjøring, også under generering og etter en feil.
  const kanGaaTilbake = erUendret(tilstand);

  // Fokus flyttes til varselet for hvert trykk på *Analyser* (FR-26, UX-DR24).
  useEffect(() => {
    if (varselNr !== undefined) varsel.current?.focus();
  }, [varselNr]);

  // «Resultat» tar fokus når resultatsiden vises (UX-DR24).
  function analyser() {
    bekreftet.current = true;
    dispatch({ type: "analyserTrykket" });
  }

  // Knappen maskerer først. Demoeksempelet starter en kjøring, og i demomodus med egen
  // CV vises varselet. Starter trykket en ny kjøring og er en fane redigert, spør
  // dialogen først (UX-DR18).
  return (
    <div className="flex flex-col gap-2 lg:items-end">
      {demoVarsel ? (
        // Fokus flyttes hit, så varselet leses opp uten role="alert".
        <Alert
          id={DEMO_VARSEL_ID}
          ref={varsel}
          role={undefined}
          tabIndex={-1}
          className="lg:max-w-md"
        >
          <Info aria-hidden="true" />
          <AlertDescription className="text-foreground">
            {FEILMELDINGER.demo_krever_nokkel.tekst}
          </AlertDescription>
          <ProvEksempelKnapp className="col-start-2 mt-2 justify-self-start" />
        </Alert>
      ) : null}
      <Button
        ref={knapp}
        id={ANALYSER_ID}
        type="button"
        size="lg"
        className="h-11 self-start px-6 lg:h-9 lg:self-end"
        aria-disabled={deaktivert ? true : undefined}
        aria-describedby={
          [
            deaktivert ? ARSAKER_ID : null,
            kjoring && !kanGaaTilbake ? ENDRET_ID : null,
          ]
            .filter((id) => id !== null)
            .join(" ") || undefined
        }
        onClick={() => {
          if (deaktivert) return;
          if (faner.length > 0 && analyserStarterKjoring(tilstand)) {
            bekreftet.current = false;
            setApen(true);
            return;
          }
          dispatch({ type: "analyserTrykket" });
        }}
        // CV-feltet lar *Analyser* maskere når fokus går hit. Kommer det ikke noe trykk
        // (musen dras bort), maskeres det når knappen mister fokus.
        onBlur={() => dispatch({ type: "cvForlatt" })}
      >
        Analyser
      </Button>
      {kjoring && kanGaaTilbake ? (
        <Button
          type="button"
          variant="outline"
          size="lg"
          className="h-11 self-start px-4 lg:h-9 lg:self-end"
          onClick={() => dispatch({ type: "tilbakeTilResultatet" })}
        >
          Tilbake til resultatet
        </Button>
      ) : null}
      {kjoring && !kanGaaTilbake ? (
        <p id={ENDRET_ID} className="text-sm lg:text-right">
          {ENDRET_TEKST}
        </p>
      ) : null}
      {deaktivert ? (
        <ul
          id={ARSAKER_ID}
          className="text-label text-muted-foreground lg:text-right"
        >
          {arsaker.map((arsak) => (
            <li key={arsak}>{arsak}</li>
          ))}
        </ul>
      ) : null}
      <AlertDialog open={apen} onOpenChange={setApen}>
        <AlertDialogContent
          onCloseAutoFocus={(hendelse) => {
            hendelse.preventDefault();
            // Etter bekreftelsen tar «Resultat» fokus.
            if (!bekreftet.current) knapp.current?.focus();
          }}
        >
          <AlertDialogHeader>
            <AlertDialogTitle>Starte en ny analyse?</AlertDialogTitle>
            <AlertDialogDescription>
              Alle resultatdelene erstattes. Redigeringene dine i{" "}
              {somListe(faner)} blir overskrevet.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel className="h-11 lg:h-8">Avbryt</AlertDialogCancel>
            <AlertDialogAction className="h-11 lg:h-8" onClick={analyser}>
              Analyser på nytt
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
