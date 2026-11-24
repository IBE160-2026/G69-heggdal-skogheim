"use client";

import { ChevronDown, Loader2 } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { flushSync } from "react-dom";

import { CV_FELT_ID, VELG_CV_ID } from "@/components/CvPanel";
import { INNHOLD } from "@/components/Forberedelse";
import { GapAnalyseFane } from "@/components/GapAnalyseFane";
import { FANENAVN_GAP, GapVerktoylinje } from "@/components/GapVerktoylinje";
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
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";
import { useOkt } from "@/lib/okt/OktProvider";

export const RESULTAT_ID = "resultat-overskrift";

const KNAPP = "h-11 px-4 lg:h-9";
const MENYVALG = "min-h-11 px-3 text-base";

// Resultatsiden (UX-DR9, UX-DR10). Bare gap-fanen er bygget. Toppfeltet har *Endre
// CV-tekst* og *Ny analyse* (FR-3, FR-21), under 640 px i menyen «Valg».
export function Resultat() {
  const { tilstand, dispatch } = useOkt();
  const overskrift = useRef<HTMLHeadingElement>(null);
  const valgKnapp = useRef<HTMLButtonElement>(null);
  // Knappen som åpnet «Tømme alt?», så fokus kan gå tilbake dit (UX-DR18).
  const apner = useRef<HTMLElement | null>(null);
  const tomt = useRef(false);
  // Et valg i menyen flytter fokus selv, så menyen skal ikke gi fokus til «Valg».
  const valgtIMeny = useRef(false);
  const [tomApen, setTomApen] = useState(false);
  const gap = tilstand.innhold.resultatdeler.gap;
  const genererer = !gap || gap.status === "venter" || gap.status === "genererer";
  // FR-19: under en ny generering ligger den forrige analysen bare i tilstanden.
  const analyse = genererer ? null : (gap.redigert ?? gap.generert);
  const redigert = !genererer && gap.redigert !== null;

  // Fokus til «Resultat» når siden åpnes (UX-DR24).
  useEffect(() => {
    overskrift.current?.focus();
  }, []);

  // FR-3: forberedelsen med teksten beholdt. Den må stå i DOM-en før fokus kan flyttes
  // til CV-feltet (UX-DR24). Ingenting avbrytes.
  function endreCv() {
    flushSync(() => dispatch({ type: "endreCvTrykket" }));
    document.getElementById(CV_FELT_ID)?.focus();
  }

  function apneTom(fra: HTMLElement | null) {
    apner.current = fra;
    tomt.current = false;
    setTomApen(true);
  }

  // FR-21: alt tømmes, og fokus går til *Velg CV-fil* (UX-DR24).
  function tomAlt() {
    tomt.current = true;
    flushSync(() => dispatch({ type: "nyAnalyseBekreftet" }));
    document.getElementById(VELG_CV_ID)?.focus();
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
        <div className="hidden shrink-0 gap-2 sm:flex">
          <Button
            type="button"
            variant="outline"
            size="lg"
            className={KNAPP}
            onClick={endreCv}
          >
            Endre CV-tekst
          </Button>
          <Button
            type="button"
            variant="outline"
            size="lg"
            className={KNAPP}
            onClick={(hendelse) => apneTom(hendelse.currentTarget)}
          >
            Ny analyse
          </Button>
        </div>
        {/* Under 640 px (UX-DR9). Menyen er ikke modal, så dialogen kan åpnes fra den
            uten at siden blir stående låst. */}
        <DropdownMenu modal={false}>
          <DropdownMenuTrigger asChild>
            <Button
              ref={valgKnapp}
              type="button"
              variant="outline"
              size="lg"
              className={`${KNAPP} shrink-0 sm:hidden`}
            >
              Valg
              <ChevronDown aria-hidden="true" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent
            align="end"
            className="w-auto"
            onCloseAutoFocus={(hendelse) => {
              if (!valgtIMeny.current) return;
              valgtIMeny.current = false;
              hendelse.preventDefault();
            }}
          >
            <DropdownMenuItem
              className={MENYVALG}
              onSelect={() => {
                valgtIMeny.current = true;
                endreCv();
              }}
            >
              Endre CV-tekst
            </DropdownMenuItem>
            <DropdownMenuItem
              className={MENYVALG}
              onSelect={() => {
                valgtIMeny.current = true;
                apneTom(valgKnapp.current);
              }}
            >
              Ny analyse
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </header>
      {/* Én dialog utenfor menyen, så den står når menyen lukkes. */}
      <AlertDialog open={tomApen} onOpenChange={setTomApen}>
        <AlertDialogContent
          onCloseAutoFocus={(hendelse) => {
            hendelse.preventDefault();
            // Etter *Tøm alt* har *Velg CV-fil* fått fokus.
            if (!tomt.current) apner.current?.focus();
          }}
        >
          <AlertDialogHeader>
            <AlertDialogTitle>Tømme alt?</AlertDialogTitle>
            <AlertDialogDescription>
              CV-teksten, annonsen og alle resultatdelene fjernes.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel className="h-11 lg:h-8">Avbryt</AlertDialogCancel>
            <AlertDialogAction className="h-11 lg:h-8" onClick={tomAlt}>
              Tøm alt
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
      <main className={`${INNHOLD} flex flex-1 flex-col pt-5 pb-8`}>
        <Tabs defaultValue="gap" activationMode="manual">
          <TabsList variant="line" className="h-auto w-full justify-start border-b">
            <TabsTrigger value="gap" className="h-11 flex-none px-3 lg:h-9">
              {FANENAVN_GAP}
              {/* UX-DR10: synlig og lest opp som en del av fanenavnet. */}
              {redigert ? " · redigert" : null}
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
                ny generering. Ved feil uten en forrige analyse har varselet *Prøv igjen*
                i stedet. */}
            {gap?.status === "feil" && !analyse ? null : <GapVerktoylinje />}
            <GapAnalyseFane />
          </TabsContent>
        </Tabs>
      </main>
    </>
  );
}
