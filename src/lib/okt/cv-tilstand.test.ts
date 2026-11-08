import { describe, expect, it } from "vitest";

import {
  antallFjernet,
  arsakerTilAnalyse,
  cvFeil,
  cvVurdering,
  fjernetTekst,
  reducer,
  startTilstand,
  type OktTilstand,
} from "./tilstand";

const FJERNET = "[fødselsnummer fjernet]";
const EN_FJERNET = "1 fødselsnummer er fjernet fra CV-teksten.";
const CV_FOR_LANG = "CV-teksten er for lang. Maks 15\u00a0000 tegn.";
const ANNONSE_FOR_LANG = "Annonsen er for lang. Maks 8\u00a0000 tegn.";

function medCv(cvTekst: string): OktTilstand {
  return {
    ...startTilstand,
    innhold: { utkast: { ...startTilstand.innhold.utkast, cvTekst } },
  };
}

describe("CV-handlingene", () => {
  it("FR-6: cvEndret maskerer ikke mens brukeren skriver", () => {
    const neste = reducer(startTilstand, {
      type: "cvEndret",
      cvTekst: "Nr 01019012345",
    });

    expect(neste.innhold.utkast.cvTekst).toBe("Nr 01019012345");
    expect(neste.kunngjoring).toBeNull();
  });

  it("FR-6: cvLimtInn maskerer og melder antallet", () => {
    const neste = reducer(startTilstand, {
      type: "cvLimtInn",
      cvTekst: "01019012345 og 010190 12345",
    });

    expect(neste.innhold.utkast.cvTekst).toBe(`${FJERNET} og ${FJERNET}`);
    expect(neste.kunngjoring).toEqual({
      tekst: "2 fødselsnumre er fjernet fra CV-teksten.",
      nr: 1,
    });
  });

  it("FR-6: cvLimtInn uten fødselsnummer gir ingen melding", () => {
    const neste = reducer(startTilstand, { type: "cvLimtInn", cvTekst: "Ola" });

    expect(neste.innhold.utkast.cvTekst).toBe("Ola");
    expect(neste.kunngjoring).toBeNull();
  });

  it("FR-6: cvForlatt maskerer det som ble skrevet inn", () => {
    const neste = reducer(medCv("Nr 01019012345"), { type: "cvForlatt" });

    expect(neste.innhold.utkast.cvTekst).toBe(`Nr ${FJERNET}`);
    expect(neste.kunngjoring).toEqual({ tekst: EN_FJERNET, nr: 1 });
  });

  it("FR-6: analyserTrykket maskerer et nytt nummer og gjør ikke noe annet", () => {
    const klar: OktTilstand = {
      ...medCv("Nr 01019012345"),
      okt: { ...startTilstand.okt, bekreftetPersonvern: true },
    };
    const neste = reducer(klar, { type: "analyserTrykket" });

    expect(neste.innhold.utkast.cvTekst).toBe(`Nr ${FJERNET}`);
    expect(neste.kunngjoring).toEqual({ tekst: EN_FJERNET, nr: 1 });
    expect(neste.okt).toEqual(klar.okt);
    expect(neste.innhold.utkast.annonse).toBe(klar.innhold.utkast.annonse);
  });

  it("FR-6: uten noe å maskere er tilstanden den samme", () => {
    const tilstand = medCv(`Nr ${FJERNET}`);

    expect(reducer(tilstand, { type: "cvForlatt" })).toBe(tilstand);
    expect(reducer(tilstand, { type: "analyserTrykket" })).toBe(tilstand);
  });

  it("UX-DR23: samme melding to ganger får nytt nr", () => {
    const forste = reducer(medCv("01019012345"), { type: "cvForlatt" });
    const skrevet = reducer(forste, {
      type: "cvEndret",
      cvTekst: `${forste.innhold.utkast.cvTekst} 01019012345`,
    });
    const andre = reducer(skrevet, { type: "cvForlatt" });

    expect(skrevet.kunngjoring).toEqual(forste.kunngjoring);
    expect(andre.kunngjoring).toEqual({ tekst: EN_FJERNET, nr: 2 });
  });

  it("AD-6: endrer ikke den gamle tilstanden", () => {
    const tilstand = medCv("01019012345");
    reducer(tilstand, { type: "cvForlatt" });

    expect(tilstand.innhold.utkast.cvTekst).toBe("01019012345");
    expect(tilstand.kunngjoring).toBeNull();
  });
});

describe("grense passert", () => {
  it("FR-4: CV-teksten over 15 000 tegn meldes én gang og kuttes ikke", () => {
    const lang = "a".repeat(15001);
    const over = reducer(medCv("a".repeat(15000)), {
      type: "cvEndret",
      cvTekst: lang,
    });
    const fortsatt = reducer(over, { type: "cvEndret", cvTekst: `${lang}b` });

    expect(over.innhold.utkast.cvTekst).toBe(lang);
    expect(over.kunngjoring).toEqual({ tekst: CV_FOR_LANG, nr: 1 });
    expect(fortsatt.kunngjoring).toEqual(over.kunngjoring);
  });

  it("FR-4: under og over grensen igjen meldes på nytt", () => {
    const over = reducer(startTilstand, {
      type: "cvEndret",
      cvTekst: "a".repeat(15001),
    });
    const under = reducer(over, { type: "cvEndret", cvTekst: "a" });
    const igjen = reducer(under, {
      type: "cvEndret",
      cvTekst: "a".repeat(15001),
    });

    expect(igjen.kunngjoring).toEqual({ tekst: CV_FOR_LANG, nr: 2 });
  });

  it("FR-4: innliming med fødselsnummer over grensen gir begge meldingene", () => {
    const neste = reducer(startTilstand, {
      type: "cvLimtInn",
      cvTekst: `01019012345 ${"a".repeat(15001)}`,
    });

    expect(neste.kunngjoring?.tekst).toBe(`${EN_FJERNET} ${CV_FOR_LANG}`);
  });

  it("UX-DR23: annonsen over 8 000 tegn meldes én gang", () => {
    const over = reducer(startTilstand, {
      type: "annonseEndret",
      annonse: "a".repeat(8001),
    });
    const fortsatt = reducer(over, {
      type: "annonseEndret",
      annonse: "a".repeat(8002),
    });

    expect(over.kunngjoring).toEqual({ tekst: ANNONSE_FOR_LANG, nr: 1 });
    expect(fortsatt.kunngjoring).toEqual(over.kunngjoring);
  });
});

describe("cvVurdering", () => {
  it.each([
    [0, "tom", false],
    [1, "ok", true],
    [299, "ok", true],
    [300, "ok", false],
    [15001, "for_lang", false],
  ] as const)("FR-3: %i tegn gir status %s og erKort=%s", (lengde, status, erKort) => {
    expect(cvVurdering("a".repeat(lengde))).toEqual({
      status,
      antall: lengde,
      erKort,
    });
  });

  it("FR-3: bare mellomrom gir ikke varsel", () => {
    expect(cvVurdering("   \n").erKort).toBe(false);
  });
});

describe("cvFeil", () => {
  it.each([
    ["tom", null],
    ["ok", null],
    ["for_lang", CV_FOR_LANG],
  ] as const)("FR-4: %s", (status, forventet) => {
    expect(cvFeil(status)).toBe(forventet);
  });
});

describe("antallFjernet og fjernetTekst", () => {
  it("FR-6: teller plassholderne i feltet", () => {
    expect(antallFjernet("")).toBe(0);
    expect(antallFjernet(`${FJERNET} x ${FJERNET}`)).toBe(2);
  });

  it("FR-6: entall og flertall", () => {
    expect(fjernetTekst(1)).toBe(EN_FJERNET);
    expect(fjernetTekst(3)).toBe("3 fødselsnumre er fjernet fra CV-teksten.");
  });
});

describe("arsakerTilAnalyse med CV-grensen", () => {
  it("FR-4: CV-tekst over 15 000 tegn gir årsaken først", () => {
    expect(arsakerTilAnalyse(medCv("a".repeat(15001)))[0]).toBe(
      "CV-teksten kan være maks 15\u00a0000 tegn.",
    );
  });

  it("FR-4: CV-tekst på 15 000 tegn gir ingen CV-årsak", () => {
    expect(arsakerTilAnalyse(medCv("a".repeat(15000)))).toEqual([
      "Lim inn annonsen.",
      "Kryss av for personvern.",
    ]);
  });
});
