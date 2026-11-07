import { describe, expect, it } from "vitest";

import {
  cvVurdering,
  reducer,
  startTilstand,
  type OktTilstand,
} from "./tilstand";

const FJERNET = "[fødselsnummer fjernet]";
const EN_FJERNET = "1 fødselsnummer er fjernet fra CV-teksten.";
const CV_FOR_LANG = "CV-teksten er for lang. Maks 15 000 tegn.";
const LESER = "Leser CV-en …";

function leser(navn = "cv.docx"): OktTilstand {
  return reducer(startTilstand, { type: "cvFilLeses", navn });
}

describe("CV-filhandlingene", () => {
  it("AD-6: starter uten fil", () => {
    expect(startTilstand.innhold.cvFil).toBeNull();
  });

  it("FR-1: cvFilLeses setter filnavnet og melder at CV-en leses", () => {
    const neste = leser();

    expect(neste.innhold.cvFil).toEqual({ navn: "cv.docx", tilstand: "leser" });
    expect(neste.kunngjoring).toEqual({ tekst: LESER, nr: 1 });
    expect(neste.innhold.utkast.cvTekst).toBe("");
  });

  it("FR-1: cvFilLest setter teksten og filstatusen", () => {
    const neste = reducer(leser(), { type: "cvFilLest", cvTekst: "Ola Nordmann" });

    expect(neste.innhold.utkast.cvTekst).toBe("Ola Nordmann");
    expect(neste.innhold.cvFil).toEqual({ navn: "cv.docx", tilstand: "lest" });
  });

  it("FR-6: cvFilLest maskerer og melder antallet", () => {
    const neste = reducer(leser("cv.txt"), {
      type: "cvFilLest",
      cvTekst: "Nr 01019012345",
    });

    expect(neste.innhold.utkast.cvTekst).toBe(`Nr ${FJERNET}`);
    expect(neste.kunngjoring).toEqual({ tekst: EN_FJERNET, nr: 2 });
  });

  it("FR-4: over 15 000 tegn kuttes ikke og meldes én gang", () => {
    const lang = "a".repeat(15001);
    const neste = reducer(leser("cv.txt"), { type: "cvFilLest", cvTekst: lang });

    expect(neste.innhold.utkast.cvTekst).toBe(lang);
    expect(neste.kunngjoring?.tekst).toBe(CV_FOR_LANG);
    expect(cvVurdering(lang).status).toBe("for_lang");
  });

  it("FR-22: cvFilFeilet gir tomt felt og filstatusen feilet", () => {
    const neste = reducer(leser(), { type: "cvFilFeilet" });

    expect(neste.innhold.utkast.cvTekst).toBe("");
    expect(neste.innhold.cvFil).toEqual({ navn: "cv.docx", tilstand: "feilet" });
  });

  it("FR-1: cvFilByttet tømmer tekst og filnavn", () => {
    const lest = reducer(leser(), { type: "cvFilLest", cvTekst: "Ola" });
    const neste = reducer(lest, { type: "cvFilByttet" });

    expect(neste.innhold.utkast.cvTekst).toBe("");
    expect(neste.innhold.cvFil).toBeNull();
  });

  it("FR-1: et svar etter cvFilByttet endrer ingenting", () => {
    const byttet = reducer(leser(), { type: "cvFilByttet" });

    expect(reducer(byttet, { type: "cvFilLest", cvTekst: "Ola" })).toBe(byttet);
    expect(reducer(byttet, { type: "cvFilFeilet" })).toBe(byttet);
  });

  it("AD-6: endrer ikke den gamle tilstanden", () => {
    const start = leser();
    reducer(start, { type: "cvFilLest", cvTekst: "Ola" });

    expect(start.innhold.cvFil?.tilstand).toBe("leser");
    expect(start.innhold.utkast.cvTekst).toBe("");
  });
});

describe("cvVurdering med fil", () => {
  it("FR-3: en lest fil med 0 tegn gir varsel", () => {
    const tom = reducer(leser("cv.txt"), { type: "cvFilLest", cvTekst: "  \n" });

    expect(cvVurdering(tom.innhold.utkast.cvTekst, tom.innhold.cvFil).erKort).toBe(
      true,
    );
  });

  it("FR-3: en lest PDF uten tekst gir varsel", () => {
    const tom = reducer(leser("cv.pdf"), { type: "cvFilLest", cvTekst: "" });

    expect(tom.innhold.cvFil).toEqual({ navn: "cv.pdf", tilstand: "lest" });
    expect(cvVurdering(tom.innhold.utkast.cvTekst, tom.innhold.cvFil).erKort).toBe(
      true,
    );
  });

  it.each([
    ["uten fil", null],
    ["med feilet fil", { navn: "cv.txt", tilstand: "feilet" } as const],
  ])("FR-3: 0 tegn %s gir ikke varsel", (_, cvFil) => {
    expect(cvVurdering("", cvFil).erKort).toBe(false);
  });

  it.each([
    [299, true],
    [300, false],
  ])("FR-3: lest fil med %i tegn gir varsel=%s", (lengde, varsel) => {
    expect(
      cvVurdering("a".repeat(lengde), { navn: "cv.txt", tilstand: "lest" }).erKort,
    ).toBe(varsel);
  });
});
