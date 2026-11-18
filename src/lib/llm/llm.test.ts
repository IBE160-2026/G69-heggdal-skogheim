import { readFileSync } from "node:fs";

import { describe, expect, it } from "vitest";

import { normaliser } from "@/lib/kjerne/demo";
import { gapSvar } from "@/lib/kontrakt/gap";

import gapJson from "./demo-svar/gap.json";
import { mockKlient } from "./mock";

const PAR_1 = "testdata/par-1-butikk-bank";
const CV = readFileSync(`${PAR_1}/cv.txt`, "utf8");
const FASIT = readFileSync(`${PAR_1}/fasit.md`, "utf8");

const KATEGORI: Record<string, string> = {
  Oppfylt: "oppfylt",
  "Delvis oppfylt": "delvis",
  Mangler: "mangler",
};

function fasitKategorier() {
  const tabell = FASIT.split("## Forventet gap-analyse")[1].split("##")[0];

  return tabell
    .split("\n")
    .filter((linje) => linje.startsWith("|"))
    .slice(2)
    .map((linje) => KATEGORI[linje.split("|")[2].trim()]);
}

describe("demosvaret for gap", () => {
  const svar = gapSvar.parse(gapJson);

  it("AD-3: gap.json passer skjemaet for det rå svaret", () => {
    expect(gapSvar.safeParse(gapJson).success).toBe(true);
  });

  it("FR-9: hvert belegg står i CV-en i par 1", () => {
    const cv = normaliser(CV);
    const belegg = svar.krav.flatMap((krav) => krav.belegg);

    expect(belegg.length).toBeGreaterThan(0);
    for (const b of belegg) {
      expect(normaliser(b).length, b).toBeGreaterThan(0);
      expect(cv.includes(normaliser(b)), b).toBe(true);
    }
  });

  it("FR-8: de seks kravene har kategoriene i fasiten, i annonsens rekkefølge", () => {
    expect(svar.krav).toHaveLength(6);
    expect(svar.krav.map((krav) => krav.kategori)).toEqual(fasitKategorier());
  });

  it("FR-8: krav med belegg, forklaring for delvis og råd for mangler", () => {
    for (const krav of svar.krav) {
      if (krav.kategori === "mangler") {
        expect(krav.belegg).toEqual([]);
        expect(krav.raad).toBeTruthy();
      } else {
        expect(krav.belegg.length).toBeGreaterThan(0);
      }
      if (krav.kategori === "delvis") expect(krav.forklaring).toBeTruthy();
    }
  });

  it("FR-12: nøkkelordene er fasitens, og hver kravIndeks peker på et krav", () => {
    const liste = /## Forventede nøkkelord\s*\n([^\n]+)/.exec(FASIT)![1];

    expect(svar.nokkelord.map((n) => n.tekst)).toEqual(
      liste.split(",").map((tekst) => tekst.trim()),
    );
    for (const { kravIndeks } of svar.nokkelord) {
      expect(kravIndeks).not.toBeNull();
      expect(kravIndeks).toBeLessThan(svar.krav.length);
    }
  });

  it("FR-27: demosvaret har ingen tall som ikke står i CV-en", () => {
    const tekster = [
      svar.stilling,
      svar.arbeidsgiver,
      ...svar.krav.flatMap((krav) => [
        krav.tekst,
        ...krav.belegg,
        krav.forklaring ?? "",
        krav.raad ?? "",
      ]),
      ...svar.nokkelord.map((n) => n.tekst),
    ];
    const tall = tekster.join("\n").match(/\d+/g) ?? [];

    expect(tall.filter((t) => !CV.includes(t))).toEqual([]);
  });
});

describe("klientene", () => {
  it("AD-3: mock-klienten gir en kopi av demosvaret", async () => {
    const inndata = { cvTekst: CV, annonse: "", signal: new AbortController().signal };
    const forste = await mockKlient.analyseGap(inndata);
    const andre = await mockKlient.analyseGap(inndata);

    expect(forste.svar).toEqual(gapJson);
    expect(forste.svar).not.toBe(andre.svar);
    expect(forste).toMatchObject({ inputTokens: 0, outputTokens: 0 });
  });
});
