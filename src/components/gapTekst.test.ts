import { beforeAll, describe, expect, it } from "vitest";

import type { GapAnalyse } from "@/lib/kontrakt/gap";
import { demoSvar } from "@/testhjelp/gap";

import { FAST_RAAD, gapSomTekst } from "./gapTekst";

let svar: GapAnalyse;

beforeAll(async () => {
  svar = await demoSvar();
});

const LITEN: GapAnalyse = {
  stilling: "Vikar",
  arbeidsgiver: "Testvik",
  krav: [
    {
      tekst: "Kundeorientert",
      kategori: "oppfylt",
      belegg: ["Hjalp kunder"],
      nedgradert: false,
    },
    {
      tekst: "Digitale ferdigheter",
      kategori: "delvis",
      belegg: ["Office"],
      forklaring: "Du bruker Office.",
      nedgradert: false,
    },
    {
      tekst: "AFR",
      kategori: "mangler",
      belegg: [],
      raad: "Vis vilje til å lære.",
      nedgradert: false,
    },
    {
      tekst: "Førerkort",
      kategori: "mangler",
      belegg: ["Har førerkort"],
      raad: "Påstå det.",
      nedgradert: true,
    },
  ],
  nokkelord: [
    { tekst: "pålitelig", kravIndeks: null, funnet: true },
    { tekst: "økonomi", kravIndeks: null, funnet: true },
    { tekst: "kundeorientert", kravIndeks: 0, funnet: false },
  ],
  treffprosent: 22,
  fjernetBelegg: 0,
};

describe("gapSomTekst", () => {
  it("FR-20: kravene i annonsens rekkefølge, en tom linje mellom, og treff til slutt", () => {
    expect(gapSomTekst(LITEN)).toBe(
      [
        "Kundeorientert — Oppfylt",
        "Fra CV-en: «Hjalp kunder»",
        "",
        "Digitale ferdigheter — Delvis oppfylt",
        "Fra CV-en: «Office»",
        "Hvorfor delvis: Du bruker Office.",
        "",
        "AFR — Mangler",
        "Råd: Vis vilje til å lære.",
        "",
        "Førerkort — Mangler",
        `Råd: ${FAST_RAAD}`,
        "",
        "Treff: 22 % (veiledende)",
        "Funnet i CV-en: pålitelig, økonomi",
        "Ikke funnet: kundeorientert",
      ].join("\n"),
    );
  });

  it("FR-9: nedgradert krav har det faste rådet som ren tekst, uten belegg og modellens råd", () => {
    const tekst = gapSomTekst(LITEN);

    expect(FAST_RAAD).toBe(
      "Fant ikke belegg for dette i CV-teksten. Har du denne erfaringen, trykk Endre CV-tekst og legg den inn.",
    );
    expect(tekst).not.toContain("Har førerkort");
    expect(tekst).not.toContain("Påstå");
  });

  it("FR-20: tom forklaring, tomt råd og tomme nøkkelordlister tas ikke med", () => {
    const tekst = gapSomTekst({
      ...LITEN,
      krav: [
        { ...LITEN.krav[1], forklaring: "  " },
        { ...LITEN.krav[2], raad: "" },
      ],
      nokkelord: [],
    });

    expect(tekst).toBe(
      [
        "Digitale ferdigheter — Delvis oppfylt",
        "Fra CV-en: «Office»",
        "",
        "AFR — Mangler",
        "",
        "Treff: 22 % (veiledende)",
      ].join("\n"),
    );
  });

  it("FR-20: mellomrom og linjeskift rundt redigerte tekster tas bort", () => {
    const tekst = gapSomTekst({
      ...LITEN,
      krav: [
        { ...LITEN.krav[1], tekst: "  Digitale ferdigheter\n", forklaring: "\n Du bruker Office.  " },
        { ...LITEN.krav[2], tekst: " AFR ", raad: "  Vis vilje til å lære.\n" },
      ],
      nokkelord: [],
    });

    expect(tekst).toBe(
      [
        "Digitale ferdigheter — Delvis oppfylt",
        "Fra CV-en: «Office»",
        "Hvorfor delvis: Du bruker Office.",
        "",
        "AFR — Mangler",
        "Råd: Vis vilje til å lære.",
        "",
        "Treff: 22 % (veiledende)",
      ].join("\n"),
    );
  });

  it("FR-20: demosvaret starter med første krav og har treffprosenten", () => {
    const tekst = gapSomTekst(svar);

    expect(tekst.startsWith(`${svar.krav[0].tekst} — Oppfylt\n`)).toBe(true);
    expect(tekst).toContain(`Treff: ${svar.treffprosent} % (veiledende)`);
    expect(tekst.split("\n\n")).toHaveLength(svar.krav.length + 1);
  });
});
