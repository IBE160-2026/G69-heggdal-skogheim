import { beforeAll, describe, expect, it } from "vitest";

import type { GapAnalyse } from "@/lib/kontrakt/gap";
import { demoSvar } from "@/testhjelp/gap";

import {
  KOPIERT,
  redigerteFaner,
  reducer,
  startTilstand,
  type OktHandling,
  type OktTilstand,
} from "./tilstand";

let svar: GapAnalyse;

beforeAll(async () => {
  svar = await demoSvar();
});

// En ferdig gap-analyse for demoeksempelet.
function ferdig(analyse: GapAnalyse = svar): OktTilstand {
  const valgt = reducer(startTilstand, { type: "eksempelValgt" });
  const merke = {
    resultatdel: "gap" as const,
    kjoringId: valgt.innhold.kjoring!.id,
    gapVersjon: 1,
  };
  const startet = reducer(valgt, { type: "genereringStartet", ...merke });
  return reducer(startet, { type: "genereringFerdig", ...merke, data: analyse });
}

function rediger(
  tilstand: OktTilstand,
  indeks: number,
  felt: "tekst" | "forklaring" | "raad",
  verdi: string,
): OktTilstand {
  const handling: OktHandling = { type: "kravRedigert", indeks, felt, verdi };
  return reducer(tilstand, handling);
}

describe("kravRedigert", () => {
  it("AD-6: første endring lager redigert som kopi av generert med bare endringen", () => {
    const tilstand = ferdig();
    const neste = rediger(tilstand, 3, "tekst", "Ny kravtekst");
    const gap = neste.innhold.resultatdeler.gap!;

    expect(gap.generert).toBe(svar);
    expect(gap.redigert).toEqual({
      ...svar,
      krav: svar.krav.map((k, nr) =>
        nr === 3 ? { ...k, tekst: "Ny kravtekst" } : k,
      ),
    });
    expect(gap.status).toBe("ferdig");
    expect(gap.gapVersjon).toBe(1);
  });

  it("AD-6: neste endring bygger på redigert", () => {
    const en = rediger(ferdig(), 0, "tekst", "Første");
    const to = rediger(en, 1, "forklaring", "Andre");
    const redigert = to.innhold.resultatdeler.gap!.redigert!;

    expect(redigert.krav[0].tekst).toBe("Første");
    expect(redigert.krav[1].forklaring).toBe("Andre");
    expect(to.innhold.resultatdeler.gap!.generert).toBe(svar);
  });

  it("FR-18: kategori, belegg, nedgradert, treffprosent og nøkkelord er låst", () => {
    let neste = ferdig();
    svar.krav.forEach((_, nr) => {
      neste = rediger(neste, nr, "tekst", `Krav ${nr}`);
      neste = rediger(neste, nr, "forklaring", `Forklaring ${nr}`);
      neste = rediger(neste, nr, "raad", `Råd ${nr}`);
    });
    const redigert = neste.innhold.resultatdeler.gap!.redigert!;

    expect(redigert.treffprosent).toBe(svar.treffprosent);
    expect(redigert.nokkelord).toEqual(svar.nokkelord);
    expect(redigert.stilling).toBe(svar.stilling);
    expect(redigert.arbeidsgiver).toBe(svar.arbeidsgiver);
    expect(redigert.fjernetBelegg).toBe(svar.fjernetBelegg);
    expect(
      redigert.krav.map(({ kategori, belegg, nedgradert }) => ({
        kategori,
        belegg,
        nedgradert,
      })),
    ).toEqual(
      svar.krav.map(({ kategori, belegg, nedgradert }) => ({
        kategori,
        belegg,
        nedgradert,
      })),
    );
  });

  it("FR-18: rådet i et nedgradert krav kan ikke redigeres", () => {
    const analyse: GapAnalyse = {
      ...svar,
      krav: [
        {
          tekst: "Førerkort klasse B",
          kategori: "mangler",
          belegg: [],
          raad: "Modellens råd",
          nedgradert: true,
        },
      ],
    };
    const tilstand = ferdig(analyse);

    expect(rediger(tilstand, 0, "raad", "Påstå det")).toBe(tilstand);
  });

  it("AD-6: lik verdi, ukjent indeks eller ingen ferdig analyse endrer ingenting", () => {
    const tilstand = ferdig();

    expect(rediger(tilstand, 0, "tekst", svar.krav[0].tekst)).toBe(tilstand);
    expect(rediger(tilstand, 99, "tekst", "x")).toBe(tilstand);
    expect(rediger(startTilstand, 0, "tekst", "x")).toBe(startTilstand);
  });

  it("FR-19: en ny generering beholder forrige analyse og redigeringer til svaret kommer", () => {
    const redigert = rediger(ferdig(), 0, "tekst", "Endret");
    const forrige = redigert.innhold.resultatdeler.gap!;
    const merke = {
      resultatdel: "gap" as const,
      kjoringId: redigert.innhold.kjoring!.id,
      gapVersjon: 2,
    };
    const startet = reducer(redigert, { type: "genereringStartet", ...merke });
    const gap = startet.innhold.resultatdeler.gap!;

    expect(gap.status).toBe("genererer");
    expect(gap.generert).toBe(forrige.generert);
    expect(gap.redigert).toBe(forrige.redigert);
    expect(startet.innhold.gapVersjon).toBe(2);
  });

  it("FR-19: en mislykket ny generering beholder forrige analyse og redigeringer", () => {
    const redigert = rediger(ferdig(), 0, "tekst", "Endret");
    const forrige = redigert.innhold.resultatdeler.gap!;
    const merke = {
      resultatdel: "gap" as const,
      kjoringId: redigert.innhold.kjoring!.id,
      gapVersjon: 2,
    };
    const startet = reducer(redigert, { type: "genereringStartet", ...merke });
    const feilet = reducer(startet, {
      type: "genereringFeilet",
      ...merke,
      feilkode: "llm_feil",
    });
    const gap = feilet.innhold.resultatdeler.gap!;

    expect(gap.status).toBe("feil");
    expect(gap.feilkode).toBe("llm_feil");
    expect(gap.generert).toBe(forrige.generert);
    expect(gap.redigert).toBe(forrige.redigert);
    expect(feilet.kunngjoring).toBeNull();
  });

  it("FR-19: etter en mislykket ny generering kan analysen fortsatt redigeres", () => {
    const redigert = rediger(ferdig(), 0, "tekst", "Endret");
    const merke = {
      resultatdel: "gap" as const,
      kjoringId: redigert.innhold.kjoring!.id,
      gapVersjon: 2,
    };
    const startet = reducer(redigert, { type: "genereringStartet", ...merke });
    const feilet = reducer(startet, {
      type: "genereringFeilet",
      ...merke,
      feilkode: "llm_feil",
    });
    const neste = rediger(feilet, 1, "tekst", "Etter feilen");
    const gap = neste.innhold.resultatdeler.gap!;

    expect(gap.status).toBe("feil");
    expect(gap.redigert!.krav[0].tekst).toBe("Endret");
    expect(gap.redigert!.krav[1].tekst).toBe("Etter feilen");
    // Under genereringen kan ingenting redigeres.
    expect(rediger(startet, 1, "tekst", "Under")).toBe(startet);
  });

  it("FR-19: en vellykket ny generering erstatter analysen og nullstiller redigeringene", () => {
    const redigert = rediger(ferdig(), 0, "tekst", "Endret");
    const merke = {
      resultatdel: "gap" as const,
      kjoringId: redigert.innhold.kjoring!.id,
      gapVersjon: 2,
    };
    const startet = reducer(redigert, { type: "genereringStartet", ...merke });
    const nytt: GapAnalyse = { ...svar, stilling: "Ny stilling" };
    const ferdigIgjen = reducer(startet, {
      type: "genereringFerdig",
      ...merke,
      data: nytt,
    });
    const gap = ferdigIgjen.innhold.resultatdeler.gap!;

    expect(gap.status).toBe("ferdig");
    expect(gap.generert).toBe(nytt);
    expect(gap.redigert).toBeNull();
  });

  it("FR-19: et svar for en eldre gap-versjon endrer ikke den beholdte analysen", () => {
    const redigert = rediger(ferdig(), 0, "tekst", "Endret");
    const kjoringId = redigert.innhold.kjoring!.id;
    const startet = reducer(redigert, {
      type: "genereringStartet",
      resultatdel: "gap",
      kjoringId,
      gapVersjon: 2,
    });

    expect(
      reducer(startet, {
        type: "genereringFeilet",
        resultatdel: "gap",
        kjoringId,
        gapVersjon: 1,
        feilkode: "llm_feil",
      }),
    ).toBe(startet);
  });

  it("FR-19: et sent genereringFerdig for en eldre gap-versjon endrer ikke den beholdte analysen", () => {
    const redigert = rediger(ferdig(), 0, "tekst", "Endret");
    const forrige = redigert.innhold.resultatdeler.gap!;
    const kjoringId = redigert.innhold.kjoring!.id;
    const startet = reducer(redigert, {
      type: "genereringStartet",
      resultatdel: "gap",
      kjoringId,
      gapVersjon: 2,
    });
    const neste = reducer(startet, {
      type: "genereringFerdig",
      resultatdel: "gap",
      kjoringId,
      gapVersjon: 1,
      data: { ...svar, stilling: "Sent svar" },
    });
    const gap = neste.innhold.resultatdeler.gap!;

    expect(neste).toBe(startet);
    expect(gap.generert).toBe(forrige.generert);
    expect(gap.redigert).toBe(forrige.redigert);
  });

  // Story 2.7 (godkjent av Kevin): *Tilbake* fra PR #41 er erstattet. *Endre CV-tekst*
  // og *Tilbake til resultatet* beholder analysen, og bare *Ny analyse* fjerner den.
  function feiletEtterRedigering(): OktTilstand {
    const redigert = rediger(ferdig(), 0, "tekst", "Endret");
    const merke = {
      resultatdel: "gap" as const,
      kjoringId: redigert.innhold.kjoring!.id,
      gapVersjon: 2,
    };
    const startet = reducer(redigert, { type: "genereringStartet", ...merke });
    const feilet = reducer(startet, {
      type: "genereringFeilet",
      ...merke,
      feilkode: "llm_feil",
    });
    expect(feilet.innhold.resultatdeler.gap!.redigert).not.toBeNull();
    return feilet;
  }

  it("FR-19: Endre CV-tekst og Tilbake til resultatet etter en mislykket ny generering beholder analysen og redigeringene", () => {
    const feilet = feiletEtterRedigering();
    const forrige = feilet.innhold.resultatdeler.gap!;

    const endre = reducer(feilet, { type: "endreCvTrykket" });
    const tilbake = reducer(endre, { type: "tilbakeTilResultatet" });
    const gap = tilbake.innhold.resultatdeler.gap!;

    expect(tilbake.visning).toBe("resultat");
    expect(gap.generert).toBe(forrige.generert);
    expect(gap.redigert).toBe(forrige.redigert);
    expect(gap.status).toBe("feil");
  });

  it("FR-21: Ny analyse etter en mislykket ny generering fjerner den beholdte analysen", () => {
    const tom = reducer(feiletEtterRedigering(), { type: "nyAnalyseBekreftet" });

    expect(tom.innhold.resultatdeler.gap).toBeNull();
  });

  it("UX-DR23: redigering endrer ikke live-regionen", () => {
    const tilstand = ferdig();

    expect(rediger(tilstand, 0, "tekst", "Endret").kunngjoring).toBe(
      tilstand.kunngjoring,
    );
  });
});

describe("kopiert", () => {
  it("UX-DR23: live-regionen sier «Kopiert.», også ved neste kopiering", () => {
    const en = reducer(ferdig(), { type: "kopiert" });
    const to = reducer(en, { type: "kopiert" });

    expect(KOPIERT).toBe("Kopiert.");
    expect(en.kunngjoring?.tekst).toBe("Kopiert.");
    expect(to.kunngjoring?.tekst).toBe("Kopiert.");
    expect(to.kunngjoring!.nr).toBe(en.kunngjoring!.nr + 1);
  });
});

describe("redigerteFaner", () => {
  function startetPaaNytt(tilstand: OktTilstand): OktTilstand {
    return reducer(tilstand, {
      type: "genereringStartet",
      resultatdel: "gap",
      kjoringId: tilstand.innhold.kjoring!.id,
      gapVersjon: tilstand.innhold.gapVersjon + 1,
    });
  }

  it("UX-DR18: uten redigering er listen tom", () => {
    expect(redigerteFaner(ferdig())).toEqual([]);
    expect(redigerteFaner(startTilstand)).toEqual([]);
  });

  it("UX-DR18: en redigert fane står i listen", () => {
    expect(redigerteFaner(rediger(ferdig(), 0, "tekst", "Endret"))).toEqual([
      "Gap-analyse og nøkkelord",
    ]);
  });

  it("UX-DR18: under en ny generering står fanen i listen, selv om redigeringen er skjult", () => {
    const startet = startetPaaNytt(rediger(ferdig(), 0, "tekst", "Endret"));
    expect(startet.innhold.resultatdeler.gap!.status).toBe("genererer");

    expect(redigerteFaner(startet)).toEqual(["Gap-analyse og nøkkelord"]);
  });

  it("UX-DR18: etter en mislykket ny generering står fanen i listen", () => {
    const startet = startetPaaNytt(rediger(ferdig(), 0, "tekst", "Endret"));
    const feilet = reducer(startet, {
      type: "genereringFeilet",
      resultatdel: "gap",
      kjoringId: startet.innhold.kjoring!.id,
      gapVersjon: startet.innhold.gapVersjon,
      feilkode: "llm_feil",
    });
    expect(feilet.innhold.resultatdeler.gap!.status).toBe("feil");

    expect(redigerteFaner(feilet)).toEqual(["Gap-analyse og nøkkelord"]);
  });
});
