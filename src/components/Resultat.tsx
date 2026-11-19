"use client";

import { Loader2 } from "lucide-react";
import { useEffect, useRef } from "react";
import { flushSync } from "react-dom";

import { ANALYSER_ID } from "@/components/CvPanel";
import { INNHOLD } from "@/components/Forberedelse";
import { GapAnalyseFane } from "@/components/GapAnalyseFane";
import { FANENAVN_GAP, GapVerktoylinje } from "@/components/GapVerktoylinje";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";
import { useOkt } from "@/lib/okt/OktProvider";

export const RESULTAT_ID = "resultat-overskrift";

// Resultatsiden (UX-DR9, UX-DR10). Bare gap-fanen er bygget. Knappen «Tilbake» er
// midlertidig til story 2.7, som erstatter den med *Endre CV-tekst* og *Ny analyse*.
export function Resultat() {
  const { tilstand, dispatch } = useOkt();
  const overskrift = useRef<HTMLHeadingElement>(null);
  const gap = tilstand.innhold.resultatdeler.gap;
  const analyse = gap ? (gap.redigert ?? gap.generert) : null;
  const genererer = !gap || gap.status === "venter" || gap.status === "genererer";

  // Fokus til «Resultat» når siden åpnes (UX-DR24).
  useEffect(() => {
    overskrift.current?.focus();
  }, []);

  function tilbake() {
    // Forberedelsen må stå i DOM-en før fokus kan flyttes til *Analyser*.
    flushSync(() => dispatch({ type: "tilbakeTrykket" }));
    document.getElementById(ANALYSER_ID)?.focus();
  }

  return (
    <>
      <header
        className={`${INNHOLD} flex items-start justify-between gap-4 pt-6`}
      >
        <div className="min-w-0">
          <h1
            id={RESULTAT_ID}
            ref={overskrift}
            tabIndex={-1}
            className="text-label font-semibold tracking-wide text-muted-foreground uppercase"
          >
            Resultat
          </h1>
          {analyse ? (
            <>
              <h2 className="mt-1 text-page-title">{analyse.stilling}</h2>
              <p className="mt-1 text-muted-foreground">
                {analyse.arbeidsgiver}
              </p>
            </>
          ) : gap?.status === "feil" ? null : (
            <div aria-hidden="true" className="mt-2 flex flex-col gap-2">
              <Skeleton className="h-7 w-64 max-w-full" />
              <Skeleton className="h-5 w-40 max-w-full" />
            </div>
          )}
        </div>
        <Button
          type="button"
          variant="outline"
          size="lg"
          className="h-11 px-4 lg:h-9"
          onClick={tilbake}
        >
          Tilbake
        </Button>
      </header>
      <main className={`${INNHOLD} flex flex-1 flex-col pt-5 pb-8`}>
        <Tabs defaultValue="gap" activationMode="manual">
          <TabsList variant="line" className="h-auto w-full justify-start border-b">
            <TabsTrigger value="gap" className="h-11 flex-none px-3 lg:h-9">
              {FANENAVN_GAP}
              {/* UX-DR10: synlig og lest opp som en del av fanenavnet. */}
              {gap?.redigert ? " · redigert" : null}
              {genererer ? (
                <>
                  <Loader2
                    aria-hidden="true"
                    className="animate-spin motion-reduce:animate-none"
                  />
                  <span className="sr-only">, genereres</span>
                </>
              ) : null}
            </TabsTrigger>
          </TabsList>
          <TabsContent
            value="gap"
            // *Prøv igjen* gir fokus til panelet (UX-DR24). Id-en står Radix for, så
            // fanen beholder aria-controls.
            tabIndex={-1}
            aria-busy={genererer ? true : undefined}
            className="pt-4 text-base"
          >
            {/* Verktøylinjen står fast over innholdet, så knappen beholder fokus under
                ny generering. Ved feil har varselet *Prøv igjen* i stedet. */}
            {gap?.status === "feil" ? null : <GapVerktoylinje />}
            <GapAnalyseFane />
          </TabsContent>
        </Tabs>
      </main>
    </>
  );
}
