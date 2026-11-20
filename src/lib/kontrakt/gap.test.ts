import { describe, expect, it } from "vitest";

import { gapAnalyse, gapSvar } from "./gap";

const ETT_KRAV = {
  tekst: "Erfaring med kontanthåndtering",
  kategori: "mangler",
  belegg: [],
  raad: "Råd",
} as const;

describe("gapSvar", () => {
  it("B4 del 2, NFR-9: en tom kravliste fra modellen avvises", () => {
    const svar = gapSvar.safeParse({ stilling: "", arbeidsgiver: "", krav: [], nokkelord: [] });

    expect(svar.success).toBe(false);
  });

  it("godtar ett krav", () => {
    const svar = gapSvar.safeParse({ stilling: "", arbeidsgiver: "", krav: [ETT_KRAV], nokkelord: [] });

    expect(svar.success).toBe(true);
  });
});

describe("gapAnalyse", () => {
  // Minstegrensen gjelder bare modellsvaret. Skjemaet for svaret fra API-et er uendret.
  it("er uendret: en tom kravliste passer fortsatt skjemaet for svaret fra API-et", () => {
    const svar = gapAnalyse.safeParse({
      stilling: "",
      arbeidsgiver: "",
      krav: [],
      nokkelord: [],
      treffprosent: 0,
      fjernetBelegg: 0,
    });

    expect(svar.success).toBe(true);
  });
});
