"use client";

import { Info } from "lucide-react";
import { useEffect, useRef } from "react";

import { ANALYSER_ID } from "@/components/CvPanel";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { useOkt } from "@/lib/okt/OktProvider";
import { arsakerTilAnalyse } from "@/lib/okt/tilstand";

const ARSAKER_ID = "analyser-arsaker";
export const DEMO_VARSEL_ID = "demo-varsel";

export function AnalyserKnapp() {
  const { tilstand, dispatch } = useOkt();
  const arsaker = arsakerTilAnalyse(tilstand);
  const deaktivert = arsaker.length > 0;
  const { demoVarsel } = tilstand.innhold;
  const varsel = useRef<HTMLDivElement>(null);
  const varselNr = demoVarsel?.nr;

  // Fokus flyttes til varselet for hvert trykk på *Analyser* (FR-26, UX-DR24).
  useEffect(() => {
    if (varselNr !== undefined) varsel.current?.focus();
  }, [varselNr]);

  // Analysen kommer i Epic 2. Til da maskerer knappen, og i demomodus med egen CV
  // vises varselet. Ingenting sendes.
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
            Full analyse av din egen CV krever en API-nøkkel. Prøv eksempelet
            for å se hvordan resultatet ser ut.
          </AlertDescription>
        </Alert>
      ) : null}
      <Button
        id={ANALYSER_ID}
        type="button"
        size="lg"
        className="h-11 self-start px-6 lg:h-9 lg:self-end"
        aria-disabled={deaktivert ? true : undefined}
        aria-describedby={deaktivert ? ARSAKER_ID : undefined}
        onClick={() => {
          if (!deaktivert) dispatch({ type: "analyserTrykket" });
        }}
        // CV-feltet lar *Analyser* maskere når fokus går hit. Kommer det ikke noe trykk
        // (musen dras bort), maskeres det når knappen mister fokus.
        onBlur={() => dispatch({ type: "cvForlatt" })}
      >
        Analyser
      </Button>
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
    </div>
  );
}
