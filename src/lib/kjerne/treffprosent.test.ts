import { readFileSync } from "node:fs";

import { describe, expect, it } from "vitest";

import { finnNokkelord, ord, treffprosent } from "./treffprosent";

function les(par: string, fil: string) {
  return readFileSync(`testdata/${par}/${fil}`, "utf8");
}

function fasit(par: string) {
  const tekst = les(par, "fasit.md");
  const liste = /## Forventede nøkkelord\s*\n([^\n]+)/.exec(tekst)![1];
  const prosent = /\*\*(\d+) %\*\*/.exec(tekst)![1];

  return {
    nokkelord: liste
      .split(",")
      .map((tekst) => ({ tekst: tekst.trim(), kravIndeks: null })),
    prosent: Number(prosent),
  };
}

describe("treffprosent", () => {
  it.each([
    ["par-1-butikk-bank", 22],
    ["par-2-it-support", 11],
    ["par-3-regnskap", 8],
    ["par-4-tokolonne-hotell", 33],
  ] as const)("FR-12: fasiten for %s gir %i %%", (par, forventet) => {
    const { nokkelord, prosent } = fasit(par);
    expect(prosent).toBe(forventet);

    expect(treffprosent(finnNokkelord(nokkelord, les(par, "cv.txt")))).toBe(
      forventet,
    );
  });

  it("FR-12: rundes med halve opp, og uten nøkkelord er den 0", () => {
    const funnet = (n: number, av: number) =>
      Array.from({ length: av }, (_, i) => ({ funnet: i < n }));

    expect(treffprosent(funnet(1, 8))).toBe(13);
    expect(treffprosent(funnet(1, 200))).toBe(1);
    expect(treffprosent(funnet(1, 3))).toBe(33);
    expect(treffprosent([])).toBe(0);
  });

  it("FR-12: tegnsetting og bindestrek blir mellomrom, og æøå beholdes", () => {
    expect(ord("IT-brukerstøtte, Microsoft 365 (Økonomi)")).toEqual([
      "it",
      "brukerstøtte",
      "microsoft",
      "365",
      "økonomi",
    ]);
  });

  it("FR-12: kjent svakhet: oppgjør gir ikke treff i dagsoppgjør", () => {
    const cv = les("par-4-tokolonne-hotell", "cv.txt");
    expect(cv).toContain("dagsoppgjør");

    const [oppgjor] = finnNokkelord([{ tekst: "oppgjør", kravIndeks: null }], cv);

    expect(oppgjor.funnet).toBe(false);
  });

  it("FR-12: kjent svakhet: av i «oppsett av PC» treffer avisbud alene, men nøkkelordet er ikke funnet", () => {
    const cv = les("par-2-it-support", "cv.txt");
    const [av, helhet] = finnNokkelord(
      [
        { tekst: "av", kravIndeks: null },
        { tekst: "oppsett av PC", kravIndeks: 0 },
      ],
      cv,
    );

    expect(av.funnet).toBe(true);
    expect(helhet).toEqual({
      tekst: "oppsett av PC",
      kravIndeks: 0,
      funnet: false,
    });
  });

  it("FR-12: et nøkkelord uten ord er ikke funnet", () => {
    const [tomt] = finnNokkelord([{ tekst: " – ", kravIndeks: null }], "noe");

    expect(tomt.funnet).toBe(false);
  });
});
