"use client";

import { ShieldCheck } from "lucide-react";

import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { useOkt } from "@/lib/okt/OktProvider";
import { overforingstekst } from "@/lib/okt/personvern";

export function Personvernboks() {
  const { tilstand } = useOkt();

  // Boksen er fast innhold, ikke et varsel, så den skal ikke ha role="alert".
  return (
    <Alert role="region" aria-labelledby="personvern-tittel" className="p-4">
      <ShieldCheck aria-hidden="true" />
      <AlertTitle>
        <h2 id="personvern-tittel" className="text-section-title">
          Om personvern
        </h2>
      </AlertTitle>
      <AlertDescription className="mt-1 text-foreground">
        <ul className="list-disc space-y-1 pl-4">
          <li>{overforingstekst(tilstand.okt.leverandor)}</li>
          <li>Ingenting lagres. Alt er borte når du lukker fanen.</li>
          <li>
            Du bør fjerne fødselsnummer, adresse, bilde og helseopplysninger før
            du analyserer.
          </li>
        </ul>
      </AlertDescription>
    </Alert>
  );
}
