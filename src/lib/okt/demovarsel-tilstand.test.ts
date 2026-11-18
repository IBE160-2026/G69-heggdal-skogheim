import { readFileSync } from "node:fs";

import { describe, expect, it } from "vitest";

import { lesDocx } from "@/lib/innlesing/docx";
import { DEMO_ANNONSE, DEMO_CV } from "@/lib/kontrakt/demo";
import type { Modus } from "@/lib/kontrakt/status";

import { reducer, startTilstand, type OktTilstand } from "./tilstand";

const FJERNET = "[fødselsnummer fjernet]";
const EGEN_CV = "Kari Nordmann\nKundeservice i fem år.";
const ANNONSE = "a".repeat(200);

// Vilkårene for *Analyser* er oppfylt.
function klar(
  cvTekst = EGEN_CV,
  annonse = ANNONSE,
  modus: Modus | null = "demo",
): OktTilstand {
  return {
    ...startTilstand,
    okt: { ...startTilstand.okt, bekreftetPersonvern: true, modus },
    innhold: { ...startTilstand.innhold, utkast: { cvTekst, annonse } },
  };
}

function trykk(tilstand: OktTilstand): OktTilstand {
  return reducer(tilstand, { type: "analyserTrykket" });
}

describe("analyserTrykket i demomodus", () => {
  it("AD-6: starter uten varsel", () => {
    expect(startTilstand.innhold.demoVarsel).toBeNull();
  });

  it("FR-26: egen CV i demomodus gir varselet og endrer ellers ingenting", () => {
    const for_ = klar();
    const neste = trykk(for_);

    expect(neste.innhold.demoVarsel).toEqual({ nr: 1 });
    expect(neste.innhold.utkast).toEqual(for_.innhold.utkast);
    expect(neste.okt).toEqual(for_.okt);
    expect(neste.kunngjoring).toBe(for_.kunngjoring);
  });

  it("FR-26: ukjent modus regnes som demo", () => {
    expect(trykk(klar(EGEN_CV, ANNONSE, null)).innhold.demoVarsel).toEqual({
      nr: 1,
    });
  });

  it("FR-26: varsel gitt med ukjent modus forsvinner når statusen sier ekte", () => {
    const medVarsel = trykk(klar(EGEN_CV, ANNONSE, null));
    expect(medVarsel.innhold.demoVarsel).toEqual({ nr: 1 });

    const neste = reducer(medVarsel, {
      type: "statusHentet",
      status: {
        modus: "ekte",
        leverandor: { navn: "Mistral AI", land: "Frankrike", tredjeland: false },
      },
    });

    expect(neste.okt.modus).toBe("ekte");
    expect(neste.innhold.demoVarsel).toBeNull();
  });

  it("FR-26: ekte modus gir ikke varselet", () => {
    expect(trykk(klar(EGEN_CV, ANNONSE, "ekte")).innhold.demoVarsel).toBeNull();
  });

  it("FR-26: demoeksempelet gir ikke varselet", () => {
    expect(trykk(klar(DEMO_CV, DEMO_ANNONSE)).innhold.demoVarsel).toBeNull();
  });

  it("FR-9: demoeksempelet med CRLF og ekstra mellomrom gir ikke varselet", () => {
    const cv = DEMO_CV.replace(/\n/g, "\r\n").replace(/ /g, "  ");

    expect(trykk(klar(cv, `${DEMO_ANNONSE}\r\n\r\n`)).innhold.demoVarsel).toBeNull();
  });

  it("FR-9: demo-CV-en lest fra cv.docx gir ikke varselet", async () => {
    const bytes = readFileSync("testdata/par-1-butikk-bank/cv.docx");
    const cv = await lesDocx(
      bytes.buffer.slice(bytes.byteOffset, bytes.byteOffset + bytes.byteLength),
    );

    expect(trykk(klar(cv, DEMO_ANNONSE)).innhold.demoVarsel).toBeNull();
  });

  it("FR-26: demo-CV-en med ett ord endret gir varselet", () => {
    const cv = DEMO_CV.replace("Butikkmedarbeider", "Lagermedarbeider");

    expect(trykk(klar(cv, DEMO_ANNONSE)).innhold.demoVarsel).toEqual({ nr: 1 });
  });

  it("FR-26: demo-CV-en med en annen annonse gir varselet", () => {
    expect(trykk(klar(DEMO_CV, ANNONSE)).innhold.demoVarsel).toEqual({ nr: 1 });
  });

  it("FR-6: nytt fødselsnummer maskeres først, og andre trykk gir varselet", () => {
    const forste = trykk(klar(`${EGEN_CV}\n01019012345`));

    expect(forste.innhold.utkast.cvTekst).toBe(`${EGEN_CV}\n${FJERNET}`);
    expect(forste.innhold.demoVarsel).toBeNull();
    expect(trykk(forste).innhold.demoVarsel).toEqual({ nr: 1 });
  });

  it("FR-4: deaktivert Analyser gir ikke varselet", () => {
    const utenAvkrysning: OktTilstand = {
      ...klar(),
      okt: { ...klar().okt, bekreftetPersonvern: false },
    };

    expect(trykk(utenAvkrysning).innhold.demoVarsel).toBeNull();
    expect(trykk(klar(EGEN_CV, "kort")).innhold.demoVarsel).toBeNull();
    expect(trykk(klar("")).innhold.demoVarsel).toBeNull();
  });

  it("UX-DR24: nytt trykk beholder varselet og øker nr", () => {
    const andre = trykk(trykk(klar()));

    expect(andre.innhold.demoVarsel).toEqual({ nr: 2 });
  });

  it("FR-26: varselet blir stående når CV-feltet forlates uten endring", () => {
    const neste = reducer(trykk(klar()), { type: "cvForlatt" });

    expect(neste.innhold.demoVarsel).toEqual({ nr: 1 });
  });
});

describe("varselet forsvinner når teksten endres", () => {
  const medVarsel = trykk(klar());

  it.each([
    { type: "cvEndret", cvTekst: "Ny tekst" },
    { type: "cvLimtInn", cvTekst: "Ny tekst" },
    { type: "annonseEndret", annonse: "b".repeat(200) },
    { type: "cvFilLeses", navn: "cv.docx" },
    { type: "cvFilByttet" },
  ] as const)("FR-26: $type fjerner varselet", (handling) => {
    expect(reducer(medVarsel, handling).innhold.demoVarsel).toBeNull();
  });

  it.each(["cvFilLest", "cvFilFeilet"] as const)(
    "FR-26: %s fjerner varselet",
    (type) => {
      const leser: OktTilstand = {
        ...medVarsel,
        innhold: {
          ...medVarsel.innhold,
          cvFil: { navn: "cv.docx", tilstand: "leser" },
        },
      };
      const handling =
        type === "cvFilLest"
          ? ({ type, cvTekst: "Ny tekst" } as const)
          : ({ type } as const);

      expect(leser.innhold.demoVarsel).toEqual({ nr: 1 });
      expect(reducer(leser, handling).innhold.demoVarsel).toBeNull();
    },
  );

  it("FR-26: et nytt trykk etter endringen viser varselet igjen", () => {
    const endret = reducer(medVarsel, { type: "cvEndret", cvTekst: EGEN_CV });

    expect(trykk(endret).innhold.demoVarsel).not.toBeNull();
  });
});
