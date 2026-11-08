import { describe, expect, it } from "vitest";

import {
  annonseFeil,
  annonseVurdering,
  arsakerTilAnalyse,
  reducer,
  startTilstand,
  type OktTilstand,
} from "./tilstand";

const CV_ARSAK = "Last opp eller lim inn CV-en din.";
const KRYSS_ARSAK = "Kryss av for personvern.";

function medUtkast(annonse: string, cvTekst = "CV-tekst"): OktTilstand {
  return { ...startTilstand, innhold: { utkast: { cvTekst, annonse } } };
}

describe("reducer", () => {
  it("AD-6: starter uten bekreftelse, status og tekst", () => {
    expect(startTilstand).toEqual({
      okt: { bekreftetPersonvern: false, modus: null, leverandor: null },
      innhold: { utkast: { cvTekst: "", annonse: "" } },
      kunngjoring: null,
    });
  });

  it("FR-23: statusHentet setter modus og leverandor", () => {
    const leverandor = {
      navn: "Mistral AI",
      land: "Frankrike",
      tredjeland: false,
    };
    const neste = reducer(startTilstand, {
      type: "statusHentet",
      status: { modus: "demo", leverandor },
    });

    expect(neste.okt.modus).toBe("demo");
    expect(neste.okt.leverandor).toEqual(leverandor);
  });

  it("FR-23: status som feiler endrer ingenting", () => {
    expect(
      reducer(startTilstand, { type: "statusHentet", status: null }),
    ).toEqual(startTilstand);
  });

  it("FR-5: personvernBekreftet setter bekreftelsen og fjerner årsaken", () => {
    const neste = reducer(startTilstand, { type: "personvernBekreftet" });

    expect(neste.okt.bekreftetPersonvern).toBe(true);
    expect(arsakerTilAnalyse(neste)).not.toContain(KRYSS_ARSAK);
  });

  it("FR-5: bekreftelsen består når annonsen endres", () => {
    const bekreftet = reducer(startTilstand, { type: "personvernBekreftet" });
    const neste = reducer(bekreftet, { type: "annonseEndret", annonse: "x" });

    expect(neste.okt.bekreftetPersonvern).toBe(true);
  });

  it("FR-4: annonseEndret beholder teksten uendret", () => {
    const annonse = `  ${"a".repeat(8001)}\n`;
    const neste = reducer(startTilstand, { type: "annonseEndret", annonse });

    expect(neste.innhold.utkast.annonse).toBe(annonse);
    expect(neste.innhold.utkast.cvTekst).toBe("");
  });

  it("AD-6: endrer ikke den gamle tilstanden", () => {
    reducer(startTilstand, { type: "annonseEndret", annonse: "x" });
    reducer(startTilstand, { type: "personvernBekreftet" });

    expect(startTilstand.innhold.utkast.annonse).toBe("");
    expect(startTilstand.okt.bekreftetPersonvern).toBe(false);
  });
});

describe("arsakerTilAnalyse", () => {
  it("FR-4: alle årsakene står i rekkefølgen CV, annonse, avkrysning", () => {
    expect(arsakerTilAnalyse(startTilstand)).toEqual([
      CV_ARSAK,
      "Lim inn annonsen.",
      KRYSS_ARSAK,
    ]);
  });

  it.each([
    ["   ", "Lim inn annonsen."],
    ["a".repeat(199), "Annonsen må være minst 200 tegn."],
    ["a".repeat(8001), "Annonsen kan være maks 8\u00a0000 tegn."],
  ])("FR-4: annonse med feil lengde gir riktig årsak (%#)", (annonse, arsak) => {
    expect(arsakerTilAnalyse(medUtkast(annonse))).toEqual([arsak, KRYSS_ARSAK]);
  });

  it.each([200, 8000])("FR-4: %i tegn gir ingen annonseårsak", (lengde) => {
    expect(arsakerTilAnalyse(medUtkast("a".repeat(lengde)))).toEqual([
      KRYSS_ARSAK,
    ]);
  });

  it("FR-4: CV med bare mellomrom regnes som tom", () => {
    expect(arsakerTilAnalyse(medUtkast("a".repeat(200), "  \n"))).toEqual([
      CV_ARSAK,
      KRYSS_ARSAK,
    ]);
  });

  it("FR-4: ingen årsaker når alle vilkår er oppfylt", () => {
    const klar = reducer(medUtkast("a".repeat(200)), {
      type: "personvernBekreftet",
    });

    expect(arsakerTilAnalyse(klar)).toEqual([]);
  });
});

describe("annonseFeil", () => {
  it.each([
    ["tom", false, null],
    ["tom", true, null],
    ["ok", true, null],
    ["for_kort", false, null],
    ["for_kort", true, "Annonsen er for kort. Minst 200 tegn."],
    ["for_lang", false, "Annonsen er for lang. Maks 8\u00a0000 tegn."],
    ["for_lang", true, "Annonsen er for lang. Maks 8\u00a0000 tegn."],
  ] as const)("FR-4: %s med forlatt=%s", (status, forlatt, forventet) => {
    expect(annonseFeil(status, forlatt)).toBe(forventet);
  });
});

describe("annonseVurdering", () => {
  it("FR-4: gir status og antall etter trim", () => {
    expect(annonseVurdering(`  ${"a".repeat(50)}  `)).toEqual({
      status: "for_kort",
      antall: 50,
    });
  });
});
