import { readFileSync } from "node:fs";

import { describe, expect, it } from "vitest";

import { dekningTekst, lesFasit, lesSjekkliste, nokkelordDekning } from "./fasit";

const PAR = [
  ["par-1-butikk-bank", 9, 6],
  ["par-2-it-support", 9, 5],
  ["par-3-regnskap", 13, 5],
  ["par-4-tokolonne-hotell", 12, 5],
] as const;

const les = (fil: string) => readFileSync(`testdata/${fil}`, "utf8");

describe("lesFasit", () => {
  it.each(PAR)("leser tabellen, nøkkelordene og de forbudte påstandene for %s", (navn, nokkelord, forbudte) => {
    const fasit = lesFasit(les(`${navn}/fasit.md`));

    expect(fasit.tabell).toHaveLength(6);
    expect(fasit.nokkelord).toHaveLength(nokkelord);
    expect(fasit.forbudte).toHaveLength(forbudte);
  });

  it("leser radene i par 2", () => {
    const fasit = lesFasit(les("par-2-it-support/fasit.md"));

    expect(fasit.tabell[0]).toEqual({
      krav: "Pågående IT-utdanning",
      kategori: "Oppfylt",
      grunnlag: "Bachelor i IT og digitalisering",
    });
    expect(fasit.tabell[5]).toEqual({ krav: "Kjennskap til ITIL", kategori: "Mangler", grunnlag: "–" });
    expect(fasit.nokkelord).toContain("Microsoft 365");
    expect(fasit.forbudte[0]).toBe("At Jonas har førerkort");
  });

  it("mangler en seksjon, kastes en feil", () => {
    expect(() => lesFasit("# Tom")).toThrow("Forventet gap-analyse");
  });
});

describe("lesSjekkliste", () => {
  it("leser punktene for «Gjennomgående» og «Gap-analyse»", () => {
    const { gjennomgaende, gap } = lesSjekkliste(les("sjekkliste.md"));

    expect(gjennomgaende).toHaveLength(3);
    expect(gjennomgaende[0]).toContain("forbudte påstandene");
    expect(gap).toHaveLength(5);
    expect(gap[0]).toBe("Alle krav fra annonsen er med.");
  });
});

describe("nokkelordDekning", () => {
  const forventede = lesFasit(les("par-2-it-support/fasit.md")).nokkelord;

  it("par 2: 7 av 9 forventede nøkkelord gir 78 %", () => {
    const modellens = [
      "Brukerstøtte",
      "førstelinje",
      "windows",
      "Microsoft-365",
      "saksbehandlingssystem",
      "kommunikasjon",
      "ITIL",
      "Active Directory",
    ];
    const dekning = nokkelordDekning(forventede, modellens);

    expect(dekning.funnet).toHaveLength(7);
    expect(dekning.ikkeFunnet).toEqual(["oppsett av PC", "førerkort"]);
    expect(dekning.prosent).toBe(78);
    expect(dekningTekst(dekning)).toBe("7 av 9 forventede nøkkelord (78 %), hjelp, ikke vurdering");
  });

  it("bøyninger og synonymer gir ikke treff (eksakt match etter ord())", () => {
    const dekning = nokkelordDekning(["førerkort", "kommunikasjon"], ["førerkortet", "kommunikasjonsevner"]);

    expect(dekning.funnet).toEqual([]);
    expect(dekning.prosent).toBe(0);
  });

  it("uten forventede nøkkelord er dekningen 0 %", () => {
    expect(nokkelordDekning([], ["x"]).prosent).toBe(0);
  });
});
