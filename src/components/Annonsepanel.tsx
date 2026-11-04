"use client";

import { useState } from "react";

import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useOkt } from "@/lib/okt/OktProvider";
import { annonseFeil, annonseVurdering } from "@/lib/okt/tilstand";

const HJELP_ID = "annonse-hjelp";
const TELLER_ID = "annonse-teller";
const FEIL_ID = "annonse-feil";

function medTusenskille(tall: number): string {
  return String(tall).replace(/\B(?=(\d{3})+$)/g, " ");
}

export function Annonsepanel() {
  const { tilstand, dispatch } = useOkt();
  const [forlatt, setForlatt] = useState(false);

  const { annonse } = tilstand.innhold.utkast;
  const { status, antall } = annonseVurdering(annonse);
  const feil = annonseFeil(status, forlatt);
  const beskrivelse = `${HJELP_ID} ${TELLER_ID}`;

  return (
    <section
      aria-labelledby="annonse-tittel"
      className="min-w-0 rounded-lg border bg-card p-4"
    >
      <h2 id="annonse-tittel" className="text-section-title">
        Stillingsannonse
      </h2>
      <Label htmlFor="annonse" className="mt-3 block text-label">
        Annonse
      </Label>
      <p id={HJELP_ID} className="mt-1 mb-2 text-label text-muted-foreground">
        Lim inn hele annonsen
      </p>
      <Textarea
        id="annonse"
        value={annonse}
        rows={12}
        autoComplete="off"
        className="min-h-60 field-sizing-fixed"
        aria-invalid={feil ? true : undefined}
        aria-describedby={feil ? `${beskrivelse} ${FEIL_ID}` : beskrivelse}
        onChange={(hendelse) => {
          const neste = hendelse.target.value;
          dispatch({ type: "annonseEndret", annonse: neste });
          // Ny kort tekst er ikke feil før feltet forlates med den.
          if (annonseVurdering(neste).status !== "for_kort") setForlatt(false);
        }}
        onBlur={() => {
          if (status === "for_kort") setForlatt(true);
        }}
      />
      <p
        id={TELLER_ID}
        className={`mt-1 text-right text-label ${
          feil ? "text-destructive" : "text-muted-foreground"
        }`}
      >
        {`${medTusenskille(antall)} tegn (200–8 000)`}
      </p>
      {feil ? (
        <p id={FEIL_ID} className="mt-1 text-sm text-destructive">
          {feil}
        </p>
      ) : null}
    </section>
  );
}
