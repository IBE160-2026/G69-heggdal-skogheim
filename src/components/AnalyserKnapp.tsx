"use client";

import { ANALYSER_ID } from "@/components/CvPanel";
import { Button } from "@/components/ui/button";
import { useOkt } from "@/lib/okt/OktProvider";
import { arsakerTilAnalyse } from "@/lib/okt/tilstand";

const ARSAKER_ID = "analyser-arsaker";

export function AnalyserKnapp() {
  const { tilstand, dispatch } = useOkt();
  const arsaker = arsakerTilAnalyse(tilstand);
  const deaktivert = arsaker.length > 0;

  // Selve analysen kommer i story 1.6. Til da maskerer knappen bare CV-teksten (FR-6).
  return (
    <div className="flex flex-col gap-2 lg:items-end">
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
