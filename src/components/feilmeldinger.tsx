import type { ReactNode } from "react";

import type { Feilkode } from "@/lib/kontrakt/feil";
import { ANNONSE_MAKS, ANNONSE_MIN, CV_MAKS } from "@/lib/kontrakt/grenser";

// Tall med hardt mellomrom som tusenskille, som i lengdemeldingene: 15 000.
export function tall(verdi: number): string {
  return String(verdi).replace(/\B(?=(\d{3})+$)/g, " ");
}

// Feil ved innlesing av CV-filen. `lib/okt` gir bare utfallet, og teksten står her.
export type Filfeil = "fil_avvist" | "fil_kan_ikke_leses" | "nesten_ingen_tekst";

export type Feilmelding = {
  // Hva som skjedde, så hva brukeren kan gjøre.
  tekst: ReactNode;
  // *Prøv igjen* hjelper bare når språkmodellen feilet (AD-8).
  provIgjen: boolean;
  // Viser til *Prøv med eksempel*, som virker uten nøkkel og uten kall til
  // språkmodellen (NFR-3).
  provEksempel: boolean;
};

// *Prøv igjen* beholdes for feil som går over. *Prøv med eksempel* er lagt til
// fordi oppbrukt kreditt hos leverandøren også kommer hit som `llm_feil`.
const SPRAAKMODELLEN_SVARTE_IKKE: Feilmelding = {
  tekst: (
    <>
      Språkmodellen svarte ikke. Teksten din er tatt vare på. Prøv igjen, eller
      bruk <em>Prøv med eksempel</em>.
    </>
  ),
  provIgjen: true,
  provEksempel: true,
};

// AD-8, FR-22: den ene tabellen over feilmeldinger i UI-et. Mikroteksten følger
// EXPERIENCE.md.
export const FEILMELDINGER: Record<Feilkode | Filfeil, Feilmelding> = {
  llm_feil: SPRAAKMODELLEN_SVARTE_IKKE,
  llm_tidsavbrudd: SPRAAKMODELLEN_SVARTE_IKKE,
  ugyldig_svar: {
    tekst: "Svaret fra språkmodellen kunne ikke brukes. Prøv igjen.",
    provIgjen: true,
    provEksempel: false,
  },
  grense_naadd: {
    tekst: (
      <>
        Appen har nådd grensen for bruk akkurat nå. Prøv igjen senere, eller
        bruk <em>Prøv med eksempel</em>.
      </>
    ),
    provIgjen: false,
    provEksempel: true,
  },
  demo_krever_nokkel: {
    tekst:
      "Full analyse av din egen CV krever en API-nøkkel. Prøv eksempelet for å se hvordan resultatet ser ut.",
    provIgjen: false,
    provEksempel: true,
  },
  for_lang_tekst: {
    tekst: `Teksten er for lang til å analyseres. CV-en kan være maks ${tall(CV_MAKS)} tegn og annonsen maks ${tall(ANNONSE_MAKS)}. Gå tilbake og kort ned teksten.`,
    provIgjen: false,
    provEksempel: false,
  },
  for_kort_tekst: {
    tekst: `Teksten er for kort til å analyseres. Annonsen må være minst ${tall(ANNONSE_MIN)} tegn. Gå tilbake og legg til mer.`,
    provIgjen: false,
    provEksempel: false,
  },
  ugyldig_inndata: {
    tekst: (
      <>
        Teksten kunne ikke sendes til analyse. Gå tilbake og trykk{" "}
        <em>Analyser</em> på nytt.
      </>
    ),
    provIgjen: false,
    provEksempel: false,
  },
  fil_avvist: {
    tekst:
      "Filen kan ikke brukes. Velg en PDF-, DOCX- eller TXT-fil på maks 5 MB.",
    provIgjen: false,
    provEksempel: false,
  },
  fil_kan_ikke_leses: {
    tekst: "Klarte ikke å lese filen. Lim inn CV-teksten i stedet.",
    provIgjen: false,
    provEksempel: false,
  },
  nesten_ingen_tekst: {
    tekst:
      "Fant nesten ikke tekst i filen. Den kan være skannet eller tom. Lim inn teksten selv i feltet under.",
    provIgjen: false,
    provEksempel: false,
  },
};
