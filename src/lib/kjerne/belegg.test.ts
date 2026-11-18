import { readFileSync } from "node:fs";

import { describe, expect, it } from "vitest";

import type { KravSvar } from "@/lib/kontrakt/gap";

import { kontrollerKrav } from "./belegg";

const PAR_1 = readFileSync("testdata/par-1-butikk-bank/cv.txt", "utf8");
const PAR_4 = readFileSync("testdata/par-4-tokolonne-hotell/cv.txt", "utf8");
const BELEGG = "Hjalp kunder med å finne varer og svarte på spørsmål";

function godtatt(belegg: string, cvTekst: string) {
  const { krav } = kontrollerKrav(
    [{ tekst: "Krav", kategori: "oppfylt", belegg: [belegg] }],
    cvTekst,
  );

  return krav[0].belegg.length === 1;
}

describe("kontrollerKrav", () => {
  it("FR-9: ordrett belegg godtas", () => {
    expect(godtatt(BELEGG, PAR_1)).toBe(true);
  });

  it.each([
    ["linjeskift", "Hjalp kunder med å finne\r\nvarer og svarte på spørsmål"],
    ["store og små bokstaver", "HJALP KUNDER med å finne varer og svarte på spørsmål"],
    ["orddeling med bindestrek", "Hjalp kun-\nder med å finne varer og svarte på spørsmål"],
    ["anførselstegn", `«${BELEGG}»`],
    ["listetegn", `• ${BELEGG}`],
  ])("FR-9: belegg som bare skiller seg i %s, godtas", (_navn, belegg) => {
    expect(godtatt(belegg, PAR_1)).toBe(true);
  });

  it("FR-9: et litt omskrevet belegg avvises", () => {
    expect(godtatt("Hjalp kundene med å finne varer og svarte på spørsmål", PAR_1)).toBe(false);
    expect(godtatt(`${BELEGG} om bank`, PAR_1)).toBe(false);
  });

  it("FR-9: «Kassasystem og dagsoppgjør» godtas mot par 4, og med ett ord byttet avvises det", () => {
    expect(PAR_4).toContain("- Kassasystem og dagsoppgjør");
    expect(godtatt("Kassasystem og dagsoppgjør", PAR_4)).toBe(true);
    expect(godtatt("Kassasystem og kveldsoppgjør", PAR_4)).toBe(false);
  });

  it("FR-9: et belegg som er tomt etter normalisering, er ugyldig", () => {
    expect(godtatt(" - « » ", PAR_1)).toBe(false);
    expect(godtatt("", PAR_1)).toBe(false);
  });

  it("FR-9: et belegg under fire tegn avvises selv om det står i CV-en", () => {
    expect(PAR_1).toMatch(/\bog\b/);
    expect(godtatt("og", PAR_1)).toBe(false);
    expect(godtatt("med", PAR_1)).toBe(false);
  });

  it("FR-9: et belegg må begynne og slutte på en ordgrense", () => {
    // «oppgjør» står bare inne i «dagsoppgjør», og «Kassasystem og dags» slutter midt i et ord.
    expect(godtatt("oppgjør", PAR_4)).toBe(false);
    expect(godtatt("Kassasystem og dags", PAR_4)).toBe(false);
    expect(godtatt("asystem og dagsoppgjør", PAR_4)).toBe(false);
    expect(godtatt("hjalp kunder", "Vi hjalp kunder")).toBe(true);
  });

  it("FR-9: et kort belegg som er et helt ord, godtas", () => {
    // «Excel» står mellom komma i «(Word, Excel, PowerPoint)».
    expect(godtatt("Excel", PAR_1)).toBe(true);
    expect(godtatt("Kasserer", PAR_1)).toBe(true);
  });

  it("FR-9: en bindestrek i CV-en er en ordgrense", () => {
    expect(godtatt("brukerstøtte", "Erfaring med IT-brukerstøtte")).toBe(true);
    expect(godtatt("IT-bruker-\nstøtte", "Erfaring med IT-brukerstøtte")).toBe(true);
  });

  it.each(["oppfylt", "delvis"] as const)(
    "FR-9: %s uten gyldig belegg blir mangler med nedgradert og uten forklaring",
    (kategori) => {
      const resultat = kontrollerKrav(
        [
          {
            tekst: "Kundeservice",
            kategori,
            belegg: ["Jobbet tre år i bank", "Ledet et team på ti"],
            forklaring: "Hvorfor delvis",
          },
        ],
        PAR_1,
      );

      expect(resultat.krav).toEqual([
        { tekst: "Kundeservice", kategori: "mangler", belegg: [], nedgradert: true },
      ]);
      expect(resultat.fjernetBelegg).toBe(2);
    },
  );

  it("FR-9: oppfylt med tom beleggliste blir mangler med nedgradert", () => {
    const resultat = kontrollerKrav(
      [{ tekst: "Krav", kategori: "oppfylt", belegg: [] }],
      PAR_1,
    );

    expect(resultat.krav[0]).toEqual({
      tekst: "Krav",
      kategori: "mangler",
      belegg: [],
      nedgradert: true,
    });
    expect(resultat.fjernetBelegg).toBe(0);
  });

  it("FR-9: et krav som mangler, får ingen belegg, og de telles ikke som fjernet", () => {
    const resultat = kontrollerKrav(
      [{ tekst: "AFR", kategori: "mangler", belegg: [BELEGG, "Finnes ikke"] }],
      PAR_1,
    );

    expect(resultat.krav).toEqual([
      { tekst: "AFR", kategori: "mangler", belegg: [], nedgradert: false },
    ]);
    expect(resultat.fjernetBelegg).toBe(0);
  });

  it("FR-9: belegg uten treff fjernes og telles, og gyldige blir stående", () => {
    const krav: KravSvar[] = [
      {
        tekst: "Kontanthåndtering",
        kategori: "delvis",
        belegg: ["Talte opp kontanter etter kiosksalg på kampdager", "Sjef for kassen"],
        forklaring: "Kasse i butikk",
      },
      { tekst: "AFR", kategori: "mangler", belegg: [], raad: "Lær mer" },
    ];
    const resultat = kontrollerKrav(krav, PAR_1);

    expect(resultat.krav).toEqual([
      {
        tekst: "Kontanthåndtering",
        kategori: "delvis",
        belegg: ["Talte opp kontanter etter kiosksalg på kampdager"],
        forklaring: "Kasse i butikk",
        nedgradert: false,
      },
      { tekst: "AFR", kategori: "mangler", belegg: [], raad: "Lær mer", nedgradert: false },
    ]);
    expect(resultat.fjernetBelegg).toBe(1);
  });
});
