"use client";

import { Button } from "@/components/ui/button";
import { useOkt } from "@/lib/okt/OktProvider";
import { arsakerTilAnalyse } from "@/lib/okt/tilstand";

const ARSAKER_ID = "analyser-arsaker";

export function AnalyserKnapp() {
  const { tilstand } = useOkt();
  const arsaker = arsakerTilAnalyse(tilstand);
  const deaktivert = arsaker.length > 0;

  // Selve analysen kommer i en senere story, så knappen har ingen handling ennå.
  return (
    <div className="flex flex-col gap-2 lg:items-end">
      <Button
        type="button"
        size="lg"
        className="h-11 self-start px-6 lg:h-9 lg:self-end"
        aria-disabled={deaktivert ? true : undefined}
        aria-describedby={deaktivert ? ARSAKER_ID : undefined}
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
