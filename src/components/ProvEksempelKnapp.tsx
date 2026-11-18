"use client";

import { useRef, useState } from "react";

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { useOkt } from "@/lib/okt/OktProvider";

// *Prøv med eksempel* (FR-25, UX-DR18). Har feltene tekst, eller finnes en kjøring,
// spør dialogen først. Fokus står på *Avbryt* når den åpnes, og går tilbake til
// knappen når den lukkes uten valg.
export function ProvEksempelKnapp({ className }: { className?: string }) {
  const { tilstand, dispatch } = useOkt();
  const [apen, setApen] = useState(false);
  const valgt = useRef(false);
  const { utkast, kjoring, cvFil } = tilstand.innhold;
  // En valgt fil (også en som leses) regnes som innhold.
  const harInnhold =
    utkast.cvTekst.trim() !== "" ||
    utkast.annonse.trim() !== "" ||
    cvFil !== null ||
    !!kjoring;

  function brukEksempelet() {
    valgt.current = true;
    dispatch({ type: "eksempelValgt" });
  }

  return (
    <AlertDialog
      open={apen}
      onOpenChange={(ny) => {
        if (ny) valgt.current = false;
        setApen(ny);
      }}
    >
      <AlertDialogTrigger asChild>
        <Button
          type="button"
          variant="outline"
          size="lg"
          className={cn("h-11 px-4 lg:h-9", className)}
          onClick={(hendelse) => {
            if (harInnhold) return;
            // Uten innhold åpnes ikke dialogen.
            hendelse.preventDefault();
            brukEksempelet();
          }}
        >
          Prøv med eksempel
        </Button>
      </AlertDialogTrigger>
      <AlertDialogContent
        onCloseAutoFocus={(hendelse) => {
          // Resultatet tar fokus når eksempelet er valgt.
          if (valgt.current) hendelse.preventDefault();
        }}
      >
        <AlertDialogHeader>
          <AlertDialogTitle>
            Erstatte teksten din med eksempelet?
          </AlertDialogTitle>
          <AlertDialogDescription>
            CV-teksten, annonsen og eventuelle resultater erstattes.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel className="h-11 lg:h-8">Avbryt</AlertDialogCancel>
          <AlertDialogAction className="h-11 lg:h-8" onClick={brukEksempelet}>
            Bruk eksempelet
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
