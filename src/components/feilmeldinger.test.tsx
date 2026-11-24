// @vitest-environment jsdom
import { cleanup, render } from "@testing-library/react";
import { afterEach, describe, expect, it } from "vitest";

import { feilkode } from "@/lib/kontrakt/feil";
import { ANNONSE_MAKS, ANNONSE_MIN, CV_MAKS } from "@/lib/kontrakt/grenser";

import { FEILMELDINGER, tall, type Filfeil } from "./feilmeldinger";

afterEach(cleanup);

function tekst(nokkel: keyof typeof FEILMELDINGER): string {
  return render(<p>{FEILMELDINGER[nokkel].tekst}</p>).container.textContent ?? "";
}

const SVARTE_IKKE =
  "Språkmodellen svarte ikke. Teksten din er tatt vare på. Prøv igjen, eller bruk Prøv med eksempel.";

const FORVENTET: [keyof typeof FEILMELDINGER, string, boolean, boolean][] = [
  ["llm_feil", SVARTE_IKKE, true, true],
  ["llm_tidsavbrudd", SVARTE_IKKE, true, true],
  ["ugyldig_svar", "Svaret fra språkmodellen kunne ikke brukes. Prøv igjen.", true, false],
  [
    "grense_naadd",
    "Appen har nådd grensen for bruk akkurat nå. Prøv igjen senere, eller bruk Prøv med eksempel.",
    false,
    true,
  ],
  [
    "demo_krever_nokkel",
    "Full analyse av din egen CV krever en API-nøkkel. Prøv eksempelet for å se hvordan resultatet ser ut.",
    false,
    true,
  ],
  [
    "for_lang_tekst",
    `Teksten er for lang til å analyseres. CV-en kan være maks ${tall(CV_MAKS)} tegn og annonsen maks ${tall(ANNONSE_MAKS)}. Gå tilbake og kort ned teksten.`,
    false,
    false,
  ],
  [
    "for_kort_tekst",
    `Teksten er for kort til å analyseres. Annonsen må være minst ${tall(ANNONSE_MIN)} tegn. Gå tilbake og legg til mer.`,
    false,
    false,
  ],
  [
    "ugyldig_inndata",
    "Teksten kunne ikke sendes til analyse. Gå tilbake og trykk Analyser på nytt.",
    false,
    false,
  ],
  [
    "fil_avvist",
    "Filen kan ikke brukes. Velg en PDF-, DOCX- eller TXT-fil på maks 5 MB.",
    false,
    false,
  ],
  [
    "fil_kan_ikke_leses",
    "Klarte ikke å lese filen. Lim inn CV-teksten i stedet.",
    false,
    false,
  ],
  [
    "nesten_ingen_tekst",
    "Fant nesten ikke tekst i filen. Den kan være skannet eller tom. Lim inn teksten selv i feltet under.",
    false,
    false,
  ],
];

describe("FEILMELDINGER", () => {
  it("AD-8: tabellen har alle åtte API-kodene og de tre filfeilene", () => {
    const filfeil: Filfeil[] = ["fil_avvist", "fil_kan_ikke_leses", "nesten_ingen_tekst"];

    expect(Object.keys(FEILMELDINGER).sort()).toEqual(
      [...feilkode.options, ...filfeil].sort(),
    );
    expect(FORVENTET.map(([nokkel]) => nokkel).sort()).toEqual(
      Object.keys(FEILMELDINGER).sort(),
    );
  });

  it.each(FORVENTET)(
    "FR-22: %s gir riktig melding og knapper",
    (nokkel, melding, provIgjen, provEksempel) => {
      expect(tekst(nokkel)).toBe(melding);
      expect(FEILMELDINGER[nokkel].provIgjen).toBe(provIgjen);
      expect(FEILMELDINGER[nokkel].provEksempel).toBe(provEksempel);
    },
  );

  it("FR-22: tallene skrives med hardt mellomrom som tusenskille, som i lengdemeldingene", () => {
    expect(tall(15000)).toBe("15 000");
    expect(tall(8000)).toBe("8 000");
    expect(tall(200)).toBe("200");
  });

  it("AD-8: Prøv igjen bare for llm_feil, llm_tidsavbrudd og ugyldig_svar", () => {
    const medProvIgjen = Object.entries(FEILMELDINGER)
      .filter(([, m]) => m.provIgjen)
      .map(([nokkel]) => nokkel)
      .sort();

    expect(medProvIgjen).toEqual(["llm_feil", "llm_tidsavbrudd", "ugyldig_svar"]);
  });

  it("UX-DR26: ingen melding har utropstegn, «vi» eller «jeg»", () => {
    for (const nokkel of Object.keys(FEILMELDINGER) as (keyof typeof FEILMELDINGER)[]) {
      const t = tekst(nokkel);
      cleanup();
      expect(t).not.toMatch(/!|\bvi\b|\bjeg\b/i);
    }
  });
});
