"use client";

import { Copy, RefreshCw } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

import { gapSomTekst } from "@/components/gapTekst";
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
import { useOkt } from "@/lib/okt/OktProvider";

export const FANENAVN_GAP = "Gap-analyse og nøkkelord";
const KUNNE_IKKE_KOPIERE = "Kunne ikke kopiere. Merk teksten og kopier selv.";

const KNAPP = "h-11 w-full px-4 sm:w-auto lg:h-9";

// Verktøylinjen i gap-fanen (FR-19, FR-20, UX-DR11, UX-DR18). Under generering har
// begge knappene `aria-disabled` og beholder fokus. Under 640 px står de under hverandre.
export function GapVerktoylinje() {
  const { tilstand, dispatch, startGenerering } = useOkt();
  const [apen, setApen] = useState(false);
  const gap = tilstand.innhold.resultatdeler.gap;
  const analyse = gap ? (gap.redigert ?? gap.generert) : null;
  const opptatt = gap?.status !== "ferdig" || !analyse;
  const erRedigert = gap?.redigert != null;

  async function kopier() {
    if (opptatt || !analyse) return;
    try {
      // Mangler utklippstavlen, kaster kallet og gir samme melding som en avvisning.
      await navigator.clipboard.writeText(gapSomTekst(analyse));
    } catch {
      toast.error(KUNNE_IKKE_KOPIERE);
      return;
    }
    toast("Kopiert");
    dispatch({ type: "kopiert" });
  }

  return (
    <div className="mb-4 flex flex-col gap-2 sm:flex-row sm:flex-wrap">
      <Button
        type="button"
        size="lg"
        className={KNAPP}
        aria-disabled={opptatt ? true : undefined}
        onClick={() => void kopier()}
      >
        <Copy aria-hidden="true" />
        Kopier
      </Button>
      <AlertDialog open={apen} onOpenChange={setApen}>
        <AlertDialogTrigger asChild>
          <Button
            type="button"
            variant="outline"
            size="lg"
            className={KNAPP}
            aria-disabled={opptatt ? true : undefined}
            onClick={(hendelse) => {
              if (opptatt || !erRedigert) {
                // Uten redigering, eller under generering, åpnes ikke dialogen.
                hendelse.preventDefault();
                if (!opptatt) startGenerering("gap");
              }
            }}
          >
            <RefreshCw aria-hidden="true" />
            Generer på nytt
          </Button>
        </AlertDialogTrigger>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Lage ny gap-analyse?</AlertDialogTitle>
            <AlertDialogDescription>
              Redigeringene dine i {FANENAVN_GAP} blir overskrevet. Det nye bygger
              på CV-teksten og annonsen, ikke på endringene dine. Andre faner endres
              ikke.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel className="h-11 lg:h-8">Avbryt</AlertDialogCancel>
            <AlertDialogAction
              className="h-11 lg:h-8"
              onClick={() => startGenerering("gap")}
            >
              Lag ny
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
