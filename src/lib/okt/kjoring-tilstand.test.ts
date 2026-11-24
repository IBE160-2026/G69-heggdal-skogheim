import { beforeAll, describe, expect, it } from "vitest";

import { DEMO_ANNONSE, DEMO_CV } from "@/lib/kontrakt/demo";
import type { GapAnalyse } from "@/lib/kontrakt/gap";
import { demoSvar } from "@/testhjelp/gap";

import {
  ANALYSERER,
  analyserStarterKjoring,
  erUendret,
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

  it("AD-6: svar etter Ny analyse forkastes", () => {
    const tilstand = reducer(
      startet(reducer(startTilstand, { type: "eksempelValgt" })),
      { type: "nyAnalyseBekreftet" },
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

  it("AD-6: svar etter Endre CV-tekst tas imot", () => {
    const tilstand = reducer(
      startet(reducer(startTilstand, { type: "eksempelValgt" })),
      { type: "endreCvTrykket" },
    );

    const neste = reducer(tilstand, {
      type: "genereringFerdig",
      resultatdel: "gap",
      kjoringId: 1,
      gapVersjon: 1,
      data: svar,
    });

    expect(neste.innhold.resultatdeler.gap?.status).toBe("ferdig");
    expect(neste.visning).toBe("forberedelse");
  });
});

// En kjøring for demoeksempelet med avkrysning og en ferdig gap-analyse.
function ferdigAnalyse(): OktTilstand {
  const tilstand = startet(
    reducer(
      med(
        { cvTekst: DEMO_CV, annonse: DEMO_ANNONSE },
        { bekreftetPersonvern: true, modus: "demo" },
      ),
      { type: "analyserTrykket" },
    ),
  );
  return reducer(tilstand, {
    type: "genereringFerdig",
    resultatdel: "gap",
    kjoringId: tilstand.innhold.kjoring!.id,
    gapVersjon: tilstand.innhold.gapVersjon,
    data: svar,
  });
}

describe("visning", () => {
  it("FR-3: starter med forberedelsen, og en ny kjøring viser resultatet", () => {
    expect(startTilstand.visning).toBe("forberedelse");
    expect(reducer(startTilstand, { type: "eksempelValgt" }).visning).toBe(
      "resultat",
    );
  });
});

describe("endreCvTrykket", () => {
  it("FR-3: viser forberedelsen og beholder tekst, kjøring, resultatdeler og avkrysning", () => {
    const tilstand = ferdigAnalyse();

    const neste = reducer(tilstand, { type: "endreCvTrykket" });

    expect(neste.visning).toBe("forberedelse");
    expect(neste.innhold).toBe(tilstand.innhold);
    expect(neste.okt.bekreftetPersonvern).toBe(true);
  });

  it("UX-DR23: live-meldingen står", () => {
    const tilstand = startet(reducer(startTilstand, { type: "eksempelValgt" }));
    expect(tilstand.kunngjoring?.tekst).toBe(ANALYSERER);

    expect(reducer(tilstand, { type: "endreCvTrykket" }).kunngjoring).toBe(
      tilstand.kunngjoring,
    );
  });

  it("FR-3: uten kjøring endres ingenting", () => {
    expect(reducer(startTilstand, { type: "endreCvTrykket" })).toBe(
      startTilstand,
    );
  });
});

describe("tilbakeTilResultatet", () => {
  it("FR-3: uendret tekst viser resultatet uten ny kjøring, og live-meldingen står", () => {
    const tilstand = reducer(ferdigAnalyse(), { type: "endreCvTrykket" });

    const neste = reducer(tilstand, { type: "tilbakeTilResultatet" });

    expect(neste.visning).toBe("resultat");
    expect(neste.innhold).toBe(tilstand.innhold);
    expect(neste.kunngjoring).toBe(tilstand.kunngjoring);
  });

  it("FR-3: under generering går den tilbake, og genereringen fortsetter", () => {
    const tilstand = reducer(
      startet(reducer(startTilstand, { type: "eksempelValgt" })),
      { type: "endreCvTrykket" },
    );

    const neste = reducer(tilstand, { type: "tilbakeTilResultatet" });

    expect(neste.visning).toBe("resultat");
    expect(neste.innhold.resultatdeler.gap?.status).toBe("genererer");
  });

  it.each([
    ["CV-teksten", { type: "cvEndret", cvTekst: "Kari" } as const],
    ["annonsen", { type: "annonseEndret", annonse: "Ny annonse" } as const],
  ])("FR-3: endret %s gjør ingenting", (_navn, endring) => {
    const tilstand = reducer(
      reducer(ferdigAnalyse(), { type: "endreCvTrykket" }),
      endring,
    );

    expect(reducer(tilstand, { type: "tilbakeTilResultatet" })).toBe(tilstand);
  });
});

describe("erUendret", () => {
  it("FR-3: lik kjøringen er uendret, og uten kjøring er den ikke det", () => {
    expect(erUendret(startTilstand)).toBe(false);
    expect(erUendret(ferdigAnalyse())).toBe(true);
  });

  it("FR-3: endret tekst er ikke uendret, men satt tilbake er den det igjen", () => {
    const tilstand = reducer(ferdigAnalyse(), { type: "endreCvTrykket" });

    const endret = reducer(tilstand, {
      type: "cvEndret",
      cvTekst: `${DEMO_CV} Ny erfaring`,
    });
    expect(erUendret(endret)).toBe(false);

    const tilbake = reducer(endret, { type: "cvEndret", cvTekst: DEMO_CV });
    expect(erUendret(tilbake)).toBe(true);

    const annonse = reducer(tilbake, {
      type: "annonseEndret",
      annonse: `${DEMO_ANNONSE}!`,
    });
    expect(erUendret(annonse)).toBe(false);
    expect(
      erUendret(
        reducer(annonse, { type: "annonseEndret", annonse: DEMO_ANNONSE }),
      ),
    ).toBe(true);
  });

  it("FR-3: en CV-fil som leses, regnes som endret tekst", () => {
    const tilstand = reducer(
      reducer(ferdigAnalyse(), { type: "endreCvTrykket" }),
      { type: "cvFilLeses", navn: "cv.pdf" },
    );

    expect(tilstand.innhold.utkast.cvTekst).toBe(DEMO_CV);
    expect(erUendret(tilstand)).toBe(false);
    expect(reducer(tilstand, { type: "tilbakeTilResultatet" })).toBe(tilstand);
  });
});

describe("nyAnalyseBekreftet", () => {
  it("FR-21: tømmer innholdet og viser forberedelsen", () => {
    const tilstand: OktTilstand = {
      ...ferdigAnalyse(),
      innhold: {
        ...ferdigAnalyse().innhold,
        cvFil: { navn: "cv.pdf", tilstand: "lest" },
        demoVarsel: { nr: 1 },
      },
    };

    const neste = reducer(tilstand, { type: "nyAnalyseBekreftet" });

    expect(neste.innhold).toEqual({ ...startTilstand.innhold, gapVersjon: 1 });
    expect(neste.visning).toBe("forberedelse");
  });

  it("FR-21: beholder avkrysningen, modus og gapVersjon", () => {
    const tilstand = ferdigAnalyse();

    const neste = reducer(tilstand, { type: "nyAnalyseBekreftet" });

    expect(neste.okt).toBe(tilstand.okt);
    expect(neste.okt.bekreftetPersonvern).toBe(true);
    expect(neste.innhold.gapVersjon).toBe(tilstand.innhold.gapVersjon);
  });

  it("UX-DR23: fjerner live-meldingen", () => {
    const tilstand = ferdigAnalyse();
    expect(tilstand.kunngjoring).not.toBeNull();

    expect(
      reducer(tilstand, { type: "nyAnalyseBekreftet" }).kunngjoring,
    ).toBeNull();
  });

  it("AD-6: neste kjøring får en ny id", () => {
    const forste = startet(reducer(startTilstand, { type: "eksempelValgt" }));
    const tom = reducer(forste, { type: "nyAnalyseBekreftet" });

    const andre = reducer(tom, { type: "eksempelValgt" });

    expect(andre.innhold.kjoring?.id).toBe(2);
    expect(andre.innhold.kjoring?.id).not.toBe(forste.innhold.kjoring?.id);
  });

  it("AD-6: et sent leseresultat etter Ny analyse ignoreres", () => {
    const leser = reducer(
      reducer(ferdigAnalyse(), { type: "endreCvTrykket" }),
      { type: "cvFilLeses", navn: "cv.pdf" },
    );
    const tom = reducer(leser, { type: "nyAnalyseBekreftet" });
    expect(tom.innhold.cvFil).toBeNull();

    expect(reducer(tom, { type: "cvFilLest", cvTekst: "Sen tekst" })).toBe(tom);
    expect(reducer(tom, { type: "cvFilFeilet" })).toBe(tom);
  });
});

describe("analyserStarterKjoring", () => {
  it.each(["demo", "ekte", null] as const)(
    "FR-3: demoeksempelet med avkrysning starter en kjøring i modus %s",
    (modus) => {
      const tilstand = med(
        { cvTekst: DEMO_CV, annonse: DEMO_ANNONSE },
        { bekreftetPersonvern: true, modus },
      );

      expect(analyserStarterKjoring(tilstand)).toBe(true);
    },
  );

  it("FR-7: egen tekst i ekte modus starter en kjøring", () => {
    const tilstand = med(
      { cvTekst: "Kari Nordmann", annonse: "a".repeat(200) },
      { bekreftetPersonvern: true, modus: "ekte" },
    );

    expect(analyserStarterKjoring(tilstand)).toBe(true);
  });

  it.each(["demo", null] as const)(
    "FR-26: egen tekst i modus %s starter ingen kjøring",
    (modus) => {
      const tilstand = med(
        { cvTekst: "Kari Nordmann", annonse: "a".repeat(200) },
        { bekreftetPersonvern: true, modus },
      );

      expect(analyserStarterKjoring(tilstand)).toBe(false);
    },
  );

  it("FR-6: et nytt fødselsnummer starter ingen kjøring", () => {
    const tilstand = med(
      { cvTekst: "Kari Nordmann 01019012345", annonse: "a".repeat(200) },
      { bekreftetPersonvern: true, modus: "ekte" },
    );

    expect(analyserStarterKjoring(tilstand)).toBe(false);
  });

  it("FR-4: årsaker til at knappen er deaktivert, starter ingen kjøring", () => {
    const tilstand = med(
      { cvTekst: "Kari Nordmann", annonse: "for kort" },
      { bekreftetPersonvern: true, modus: "ekte" },
    );

    expect(analyserStarterKjoring(tilstand)).toBe(false);
  });

  it("FR-3: etter Endre CV-tekst starter uendret tekst en ny kjøring", () => {
    const tilstand = reducer(ferdigAnalyse(), { type: "endreCvTrykket" });

    expect(analyserStarterKjoring(tilstand)).toBe(true);
  });
});
