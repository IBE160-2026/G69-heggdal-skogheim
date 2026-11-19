import { beforeAll, describe, expect, it } from "vitest";

import type { GapAnalyse } from "@/lib/kontrakt/gap";
import { demoSvar } from "@/testhjelp/gap";

import {
  KOPIERT,
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

  it("AD-6: en ny generering tømmer både generert og redigert", () => {
    const redigert = rediger(ferdig(), 0, "tekst", "Endret");
    const neste = reducer(redigert, {
      type: "genereringStartet",
      resultatdel: "gap",
      kjoringId: redigert.innhold.kjoring!.id,
      gapVersjon: 2,
    });
    const gap = neste.innhold.resultatdeler.gap!;

    expect(gap.generert).toBeNull();
    expect(gap.redigert).toBeNull();
    expect(neste.innhold.gapVersjon).toBe(2);
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
