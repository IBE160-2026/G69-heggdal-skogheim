import { beforeAll, describe, expect, it } from "vitest";

import { DEMO_ANNONSE, DEMO_CV } from "@/lib/kontrakt/demo";
import type { GapAnalyse } from "@/lib/kontrakt/gap";
import { demoSvar } from "@/testhjelp/gap";

import {
  ANALYSERER,
  reducer,
  startTilstand,
  type OktTilstand,
} from "./tilstand";

let svar: GapAnalyse;

beforeAll(async () => {
  svar = await demoSvar();
});

function med(
  utkast: { cvTekst: string; annonse: string },
  okt: Partial<OktTilstand["okt"]> = {},
): OktTilstand {
  return {
    ...startTilstand,
    okt: { ...startTilstand.okt, ...okt },
    innhold: { ...startTilstand.innhold, utkast },
  };
}

function startet(tilstand: OktTilstand): OktTilstand {
  const kjoring = tilstand.innhold.kjoring!;
  return reducer(tilstand, {
    type: "genereringStartet",
    resultatdel: "gap",
    kjoringId: kjoring.id,
    gapVersjon: tilstand.innhold.gapVersjon + 1,
  });
}

describe("eksempelValgt", () => {
  it("FR-25: fyller inn demoeksempelet og setter kjøringen uten avkrysning", () => {
    const neste = reducer(startTilstand, { type: "eksempelValgt" });

    expect(neste.innhold.utkast).toEqual({
      cvTekst: DEMO_CV,
      annonse: DEMO_ANNONSE,
    });
    expect(neste.innhold.kjoring).toEqual({
      id: 1,
      cvTekst: DEMO_CV,
      annonse: DEMO_ANNONSE,
      erEksempel: true,
    });
    expect(neste.innhold.resultatdeler.gap?.status).toBe("venter");
    expect(neste.okt.bekreftetPersonvern).toBe(false);
  });

  it.each(["demo", "ekte", null] as const)(
    "FR-25: fungerer i modus %s",
    (modus) => {
      const neste = reducer(med({ cvTekst: "", annonse: "" }, { modus }), {
        type: "eksempelValgt",
      });

      expect(neste.innhold.kjoring?.erEksempel).toBe(true);
    },
  );

  it("FR-25: erstatter tekst, fil og demovarsel", () => {
    const tilstand: OktTilstand = {
      ...med({ cvTekst: "Kari", annonse: "Annonse" }),
      innhold: {
        ...med({ cvTekst: "Kari", annonse: "Annonse" }).innhold,
        cvFil: { navn: "cv.pdf", tilstand: "lest" },
        demoVarsel: { nr: 2 },
      },
    };

    const neste = reducer(tilstand, { type: "eksempelValgt" });

    expect(neste.innhold.utkast.cvTekst).toBe(DEMO_CV);
    expect(neste.innhold.cvFil).toBeNull();
    expect(neste.innhold.demoVarsel).toBeNull();
  });
});

describe("analyserTrykket", () => {
  it.each(["demo", "ekte", null] as const)(
    "FR-24: demoeksempelet med avkrysning i modus %s gir kjøring uten varsel",
    (modus) => {
      const tilstand = med(
        { cvTekst: DEMO_CV.replace(/\n/g, "\r\n"), annonse: DEMO_ANNONSE },
        { bekreftetPersonvern: true, modus },
      );

      const neste = reducer(tilstand, { type: "analyserTrykket" });

      expect(neste.innhold.kjoring).toMatchObject({ erEksempel: true });
      expect(neste.innhold.demoVarsel).toBeNull();
      expect(neste.innhold.resultatdeler.gap?.status).toBe("venter");
    },
  );

  it("FR-7: egen CV i ekte modus starter en kjøring med maskert CV-tekst", () => {
    const tilstand = med(
      { cvTekst: "Kari Nordmann", annonse: "a".repeat(200) },
      { bekreftetPersonvern: true, modus: "ekte" },
    );

    const neste = reducer(tilstand, { type: "analyserTrykket" });

    expect(neste.innhold.kjoring).toEqual({
      id: 1,
      cvTekst: "Kari Nordmann",
      annonse: "a".repeat(200),
      erEksempel: false,
    });
    expect(neste.innhold.demoVarsel).toBeNull();
    expect(neste.innhold.resultatdeler.gap?.status).toBe("venter");
  });

  it("FR-6: et nytt fødselsnummer i ekte modus maskeres først, og kjøringen bruker maskert tekst", () => {
    const tilstand = med(
      { cvTekst: "Kari Nordmann 01019012345", annonse: "a".repeat(200) },
      { bekreftetPersonvern: true, modus: "ekte" },
    );

    const forste = reducer(tilstand, { type: "analyserTrykket" });
    expect(forste.innhold.kjoring).toBeNull();

    const andre = reducer(forste, { type: "analyserTrykket" });
    expect(andre.innhold.kjoring).toMatchObject({
      cvTekst: "Kari Nordmann [fødselsnummer fjernet]",
      erEksempel: false,
    });
  });

  it("FR-4: egen CV i ekte modus uten avkrysning gir ingen kjøring", () => {
    const tilstand = med(
      { cvTekst: "Kari Nordmann", annonse: "a".repeat(200) },
      { modus: "ekte" },
    );

    expect(
      reducer(tilstand, { type: "analyserTrykket" }).innhold.kjoring,
    ).toBeNull();
  });

  it("FR-4: uten avkrysning gir demoeksempelet ingen kjøring", () => {
    const tilstand = med({ cvTekst: DEMO_CV, annonse: DEMO_ANNONSE });

    expect(
      reducer(tilstand, { type: "analyserTrykket" }).innhold.kjoring,
    ).toBeNull();
  });
});

describe("genereringer", () => {
  it("AD-6: genereringStartet øker gapVersjon og melder at analysen starter", () => {
    const neste = startet(reducer(startTilstand, { type: "eksempelValgt" }));

    expect(neste.innhold.gapVersjon).toBe(1);
    expect(neste.innhold.resultatdeler.gap).toEqual({
      status: "genererer",
      feilkode: null,
      generert: null,
      redigert: null,
      gapVersjon: 1,
    });
    expect(neste.kunngjoring?.tekst).toBe(ANALYSERER);
  });

  it("FR-7: genereringFerdig lagrer svaret og melder at det er klart", () => {
    const tilstand = startet(reducer(startTilstand, { type: "eksempelValgt" }));

    const neste = reducer(tilstand, {
      type: "genereringFerdig",
      resultatdel: "gap",
      kjoringId: 1,
      gapVersjon: 1,
      data: svar,
    });

    expect(neste.innhold.resultatdeler.gap).toMatchObject({
      status: "ferdig",
      generert: svar,
      redigert: null,
    });
    expect(neste.kunngjoring?.tekst).toBe(
      "Gap-analysen er klar. 3 av 6 krav er oppfylt.",
    );
  });

  it("AD-8: genereringFeilet lagrer feilkoden", () => {
    const tilstand = startet(reducer(startTilstand, { type: "eksempelValgt" }));

    const neste = reducer(tilstand, {
      type: "genereringFeilet",
      resultatdel: "gap",
      kjoringId: 1,
      gapVersjon: 1,
      feilkode: "llm_tidsavbrudd",
    });

    expect(neste.innhold.resultatdeler.gap).toMatchObject({
      status: "feil",
      feilkode: "llm_tidsavbrudd",
      generert: null,
    });
  });

  it("UX-DR23: genereringFeilet fjerner meldingen om at analysen pågår", () => {
    const tilstand = startet(reducer(startTilstand, { type: "eksempelValgt" }));

    const neste = reducer(tilstand, {
      type: "genereringFeilet",
      resultatdel: "gap",
      kjoringId: 1,
      gapVersjon: 1,
      feilkode: "llm_feil",
    });

    expect(neste.kunngjoring).toBeNull();
  });

  it.each([
    ["gammel kjoring.id", { kjoringId: 0, gapVersjon: 1 }],
    ["gammel gapVersjon", { kjoringId: 1, gapVersjon: 0 }],
  ])("AD-6: svar for %s forkastes", (_navn, merke) => {
    const tilstand = startet(reducer(startTilstand, { type: "eksempelValgt" }));

    expect(
      reducer(tilstand, {
        type: "genereringFerdig",
        resultatdel: "gap",
        ...merke,
        data: svar,
      }),
    ).toBe(tilstand);
    expect(
      reducer(tilstand, {
        type: "genereringFeilet",
        resultatdel: "gap",
        ...merke,
        feilkode: "llm_feil",
      }),
    ).toBe(tilstand);
  });

  it("AD-6: genereringStartet for en gammel kjøring endrer ingenting", () => {
    const tilstand = reducer(startTilstand, { type: "eksempelValgt" });

    expect(
      reducer(tilstand, {
        type: "genereringStartet",
        resultatdel: "gap",
        kjoringId: 7,
        gapVersjon: 1,
      }),
    ).toBe(tilstand);
  });

  it("AD-6: svar etter Tilbake forkastes", () => {
    const tilstand = reducer(
      startet(reducer(startTilstand, { type: "eksempelValgt" })),
      { type: "tilbakeTrykket" },
    );

    expect(
      reducer(tilstand, {
        type: "genereringFerdig",
        resultatdel: "gap",
        kjoringId: 1,
        gapVersjon: 1,
        data: svar,
      }),
    ).toBe(tilstand);
  });

  it("AD-6: ny kjøring etter Tilbake får ny id", () => {
    const forste = startet(reducer(startTilstand, { type: "eksempelValgt" }));
    const tilbake = reducer(forste, { type: "tilbakeTrykket" });

    const andre = reducer(tilbake, { type: "eksempelValgt" });

    expect(andre.innhold.kjoring?.id).toBe(2);
  });
});

describe("tilbakeTrykket", () => {
  it("UX-DR23: fjerner meldingen om at analysen pågår", () => {
    const tilstand = startet(reducer(startTilstand, { type: "eksempelValgt" }));
    expect(tilstand.kunngjoring?.tekst).toBe(ANALYSERER);

    expect(reducer(tilstand, { type: "tilbakeTrykket" }).kunngjoring).toBeNull();
  });

  it("UX-DR24: tømmer kjøring og resultatdeler og beholder teksten", () => {
    const tilstand = startet(reducer(startTilstand, { type: "eksempelValgt" }));

    const neste = reducer(tilstand, { type: "tilbakeTrykket" });

    expect(neste.innhold.kjoring).toBeNull();
    expect(neste.innhold.resultatdeler).toEqual({ gap: null });
    expect(neste.innhold.utkast).toEqual(tilstand.innhold.utkast);
    expect(neste.innhold.gapVersjon).toBe(1);
  });
});
