"use client";

import { ShieldCheck } from "lucide-react";
import { useEffect, useRef } from "react";

import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { useOkt } from "@/lib/okt/OktProvider";

export function Personvernbekreftelse() {
  const { tilstand, dispatch } = useOkt();
  const { bekreftetPersonvern: bekreftet, leverandor } = tilstand.okt;
  const tekst = useRef<HTMLParagraphElement>(null);
  // Fokus flyttes bare etter selve avkrysningen, ikke når siden vises med bekreftelsen gitt.
  const skalFlytteFokus = useRef(false);

  useEffect(() => {
    if (bekreftet && skalFlytteFokus.current) {
      skalFlytteFokus.current = false;
      tekst.current?.focus();
    }
  }, [bekreftet]);

  if (bekreftet) {
    return (
      <p ref={tekst} tabIndex={-1} className="flex items-start gap-2 text-sm">
        <ShieldCheck
          className="mt-0.5 size-4 shrink-0 text-primary"
          aria-hidden="true"
        />
        Du har bekreftet at du har lest informasjonen om personvern.
      </p>
    );
  }

  // Samtykket skal gjelde teksten med leverandør og land, ikke den generelle.
  if (!leverandor) {
    return (
      <p className="text-sm text-muted-foreground">
        Avkrysningen vises når informasjonen om språkmodellen er hentet. Last
        siden på nytt hvis den ikke kommer.
      </p>
    );
  }

  return (
    <div className="flex items-center gap-3">
      <Checkbox
        id="personvern"
        className="after:-inset-4 lg:after:-inset-x-3 lg:after:-inset-y-2"
        onCheckedChange={() => {
          skalFlytteFokus.current = true;
          dispatch({ type: "personvernBekreftet" });
        }}
      />
      <Label
        htmlFor="personvern"
        className="min-h-11 leading-snug lg:min-h-6"
      >
        Jeg har lest informasjonen om personvern.
      </Label>
    </div>
  );
}
