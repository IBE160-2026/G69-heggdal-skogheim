import { readFileSync } from "node:fs";

import { afterEach, beforeEach, describe, expect, it, vi, type MockInstance } from "vitest";

import { DEMO_ANNONSE, DEMO_CV } from "@/lib/kontrakt/demo";
import { gapAnalyse } from "@/lib/kontrakt/gap";
import type { LlmKlient } from "@/lib/llm/klient";
import { mockKlient } from "@/lib/llm/mock";

import { generer, type Klienter } from "./generer";

const DEMO_ENV = {};
const EKTE_ENV = { MISTRAL_API_KEY: "x" };
const EGEN_CV = readFileSync("testdata/par-2-it-support/cv.txt", "utf8");
const ANNONSE_2 = readFileSync("testdata/par-2-it-support/annonse.txt", "utf8");
const FORVENTEDE_KATEGORIER = ["oppfylt", "delvis", "oppfylt", "delvis", "oppfylt", "mangler"];

let logg: MockInstance<typeof console.log>;

beforeEach(() => {
  logg = vi.spyOn(console, "log").mockImplementation(() => {});
});

afterEach(() => {
  vi.restoreAllMocks();
});

function klientMed(svar: unknown, kast?: Error): LlmKlient {
  return {
    analyseGap: vi.fn(async () => {
      if (kast) throw kast;
      return { svar, inputTokens: 120, outputTokens: 80 };
    }),
  };
}

function klienter(ekte: LlmKlient = klientMed(null)): Klienter {
  return { mock: { analyseGap: vi.fn(mockKlient.analyseGap) }, ekte };
}

function logglinjer() {
  return logg.mock.calls.map(([linje]) => JSON.parse(String(linje)));
}

describe("generer for gap", () => {
  it.each([
    ["demomodus", DEMO_ENV],
    ["ekte modus", EKTE_ENV],
  ])("FR-26: demoeksempelet i %s gir kontrollert gap-analyse med treffprosent 22", async (_navn, env) => {
    const k = klienter();
    const svar = await generer("gap", { cvTekst: DEMO_CV, annonse: DEMO_ANNONSE }, env, k);

    expect(svar.status).toBe(200);
    const analyse = gapAnalyse.parse(svar.json);
    expect(analyse.krav.map((krav) => krav.kategori)).toEqual(FORVENTEDE_KATEGORIER);
    expect(analyse.krav.every((krav) => !krav.nedgradert)).toBe(true);
    expect(analyse.nokkelord).toHaveLength(9);
    expect(analyse.treffprosent).toBe(22);
    expect(analyse.fjernetBelegg).toBe(0);
    expect(analyse.nokkelord.filter((n) => n.funnet).map((n) => n.tekst)).toEqual([
      "pålitelig",
      "økonomi",
    ]);
    expect(k.ekte.analyseGap).not.toHaveBeenCalled();
  });

  it("FR-26: demoeksempelet med CRLF og ekstra mellomrom gir samme svar", async () => {
    const vanlig = await generer("gap", { cvTekst: DEMO_CV, annonse: DEMO_ANNONSE }, DEMO_ENV);
    const endret = await generer(
      "gap",
      {
        cvTekst: `  ${DEMO_CV.replace(/\n/g, "\r\n").replace(/ /g, "  ")}\r\n`,
        annonse: DEMO_ANNONSE.replace(/\n/g, "\r\n"),
      },
      DEMO_ENV,
    );

    expect(endret).toEqual(vanlig);
  });

  it("FR-26: demoeksempelet med demo: true gir mock-svaret", async () => {
    const k = klienter();
    const svar = await generer(
      "gap",
      { cvTekst: DEMO_CV, annonse: DEMO_ANNONSE, demo: true },
      EKTE_ENV,
      k,
    );

    expect(svar.status).toBe(200);
    expect(k.mock.analyseGap).toHaveBeenCalled();
    expect(k.ekte.analyseGap).not.toHaveBeenCalled();
  });

  it("FR-24: egen CV i demomodus gir demo_krever_nokkel uten mock-svar", async () => {
    const k = klienter();
    const svar = await generer("gap", { cvTekst: EGEN_CV, annonse: ANNONSE_2 }, DEMO_ENV, k);

    expect(svar).toEqual({ status: 403, json: { feil: { kode: "demo_krever_nokkel" } } });
    expect(k.mock.analyseGap).not.toHaveBeenCalled();
  });

  it("FR-26: demo: true med egen CV i ekte modus gir ugyldig_inndata", async () => {
    const k = klienter();
    const svar = await generer(
      "gap",
      { cvTekst: EGEN_CV, annonse: ANNONSE_2, demo: true },
      EKTE_ENV,
      k,
    );

    expect(svar).toEqual({ status: 400, json: { feil: { kode: "ugyldig_inndata" } } });
    expect(k.mock.analyseGap).not.toHaveBeenCalled();
    expect(k.ekte.analyseGap).not.toHaveBeenCalled();
  });

  it("AD-3: egen CV i ekte modus gir llm_feil med plassholderen", async () => {
    const svar = await generer("gap", { cvTekst: EGEN_CV, annonse: ANNONSE_2 }, EKTE_ENV);

    expect(svar).toEqual({ status: 502, json: { feil: { kode: "llm_feil" } } });
  });

  it("AD-4: egen CV i ekte modus går til den ekte adapteren med maskert CV-tekst", async () => {
    const ekte = klientMed({
      stilling: "IT-brukerstøtte",
      arbeidsgiver: "Testvik kommune",
      krav: [
        { tekst: "Windows", kategori: "oppfylt", belegg: ["Windows og Linux"] },
        { tekst: "Førerkort", kategori: "oppfylt", belegg: ["Førerkort klasse B"] },
      ],
      nokkelord: [
        { tekst: "Windows", kravIndeks: 0 },
        { tekst: "førerkort", kravIndeks: 7 },
        { tekst: "ITIL", kravIndeks: -1 },
        { tekst: "Python", kravIndeks: 0.5 },
      ],
    });
    const svar = await generer(
      "gap",
      { cvTekst: `${EGEN_CV}\n01019012345`, annonse: ANNONSE_2 },
      EKTE_ENV,
      klienter(ekte),
    );

    expect(vi.mocked(ekte.analyseGap).mock.calls[0][0].cvTekst).toBe(
      `${EGEN_CV}\n[fødselsnummer fjernet]`,
    );
    expect(svar.status).toBe(200);
    const analyse = gapAnalyse.parse(svar.json);
    expect(analyse.krav[1]).toEqual({
      tekst: "Førerkort",
      kategori: "mangler",
      belegg: [],
      nedgradert: true,
    });
    expect(analyse.fjernetBelegg).toBe(1);
    expect(analyse.nokkelord.map((n) => n.kravIndeks)).toEqual([0, null, null, null]);
    expect(analyse.treffprosent).toBe(50);
    expect(logglinjer()[0]).toMatchObject({ inputTokens: 120, outputTokens: 80 });
  });

  it("AD-4: svar som ikke passer skjemaet, gir ugyldig_svar", async () => {
    const svar = await generer(
      "gap",
      { cvTekst: EGEN_CV, annonse: ANNONSE_2 },
      EKTE_ENV,
      klienter(klientMed({ krav: "ikke en liste" })),
    );

    expect(svar).toEqual({ status: 502, json: { feil: { kode: "ugyldig_svar" } } });
  });

  it.each(["TimeoutError", "AbortError"])("AD-8: %s fra adapteren gir llm_tidsavbrudd", async (navn) => {
    const feil = new Error("tidsavbrudd");
    feil.name = navn;
    const svar = await generer(
      "gap",
      { cvTekst: EGEN_CV, annonse: ANNONSE_2 },
      EKTE_ENV,
      klienter(klientMed(null, feil)),
    );

    expect(svar).toEqual({ status: 504, json: { feil: { kode: "llm_tidsavbrudd" } } });
  });

  it.each([
    ["CV over 15 000 tegn", { cvTekst: "a".repeat(15_001), annonse: ANNONSE_2 }],
    ["annonse over 8 000 tegn", { cvTekst: EGEN_CV, annonse: "a".repeat(8_001) }],
  ])("FR-4: %s gir for_lang_tekst", async (_navn, body) => {
    const k = klienter();
    const svar = await generer("gap", body, EKTE_ENV, k);

    expect(svar).toEqual({ status: 413, json: { feil: { kode: "for_lang_tekst" } } });
    expect(k.ekte.analyseGap).not.toHaveBeenCalled();
  });

  it.each([
    ["annonse under 200 tegn", { cvTekst: EGEN_CV, annonse: "a".repeat(199) }],
    ["tom annonse", { cvTekst: EGEN_CV, annonse: "  " }],
    ["tom CV", { cvTekst: " \n ", annonse: ANNONSE_2 }],
  ])("FR-4: %s gir for_kort_tekst", async (_navn, body) => {
    const svar = await generer("gap", body, EKTE_ENV, klienter());

    expect(svar).toEqual({ status: 400, json: { feil: { kode: "for_kort_tekst" } } });
  });

  it.each([
    ["ingen body", undefined],
    ["feil typer", { cvTekst: 1, annonse: ANNONSE_2 }],
    ["manglende annonse", { cvTekst: EGEN_CV }],
    ["demo som tekst", { cvTekst: DEMO_CV, annonse: DEMO_ANNONSE, demo: "ja" }],
  ])("NFR-9: %s gir ugyldig_inndata", async (_navn, body) => {
    const svar = await generer("gap", body, DEMO_ENV, klienter());

    expect(svar).toEqual({ status: 400, json: { feil: { kode: "ugyldig_inndata" } } });
  });
});

describe("generer for andre resultatdeler", () => {
  it.each(["brev", "cv", "ats", "ukjent"])(
    "AD-5: %s gir ugyldig_inndata",
    async (resultatdel) => {
      const svar = await generer(
        resultatdel,
        { cvTekst: DEMO_CV, annonse: DEMO_ANNONSE },
        DEMO_ENV,
        klienter(),
      );

      expect(svar).toEqual({ status: 400, json: { feil: { kode: "ugyldig_inndata" } } });
    },
  );
});

describe("logglinjen", () => {
  const FELTER = [
    "feilkode",
    "inputTokens",
    "modus",
    "outputTokens",
    "resultatdel",
    "status",
    "varighetMs",
  ];

  it("AD-10: én JSON-linje med bare de sju feltene", async () => {
    await generer("gap", { cvTekst: DEMO_CV, annonse: DEMO_ANNONSE }, DEMO_ENV);

    expect(logg).toHaveBeenCalledTimes(1);
    const [linje] = logglinjer();
    expect(Object.keys(linje).sort()).toEqual(FELTER);
    expect(linje).toMatchObject({
      resultatdel: "gap",
      modus: "demo",
      status: 200,
      inputTokens: 0,
      outputTokens: 0,
      feilkode: null,
    });
    expect(linje.varighetMs).toBeGreaterThanOrEqual(0);
  });

  it("AD-10: feil logges med feilkode, og en ukjent resultatdel logges ikke", async () => {
    await generer("<script>", { cvTekst: DEMO_CV, annonse: DEMO_ANNONSE }, EKTE_ENV);
    await generer("gap", { cvTekst: EGEN_CV, annonse: ANNONSE_2 }, DEMO_ENV);

    const linjer = logglinjer();
    expect(linjer).toHaveLength(2);
    expect(linjer[0]).toMatchObject({
      resultatdel: null,
      modus: "ekte",
      status: 400,
      feilkode: "ugyldig_inndata",
      inputTokens: null,
    });
    expect(linjer[1]).toMatchObject({ status: 403, feilkode: "demo_krever_nokkel" });
    for (const linje of linjer) expect(Object.keys(linje).sort()).toEqual(FELTER);
  });

  it("NFR-1: et søk etter tekst fra par 1 i loggen gir ingen treff", async () => {
    await generer("gap", { cvTekst: DEMO_CV, annonse: DEMO_ANNONSE }, DEMO_ENV);
    await generer("gap", { cvTekst: DEMO_CV, annonse: DEMO_ANNONSE }, EKTE_ENV);
    await generer("gap", { cvTekst: `${DEMO_CV}x`, annonse: DEMO_ANNONSE }, DEMO_ENV);

    const logget = logg.mock.calls.flat().join("\n").toLowerCase();
    const linjer = `${DEMO_CV}\n${DEMO_ANNONSE}`
      .split("\n")
      .map((linje) => linje.trim().toLowerCase())
      .filter((linje) => linje.length >= 5);

    expect(linjer.length).toBeGreaterThan(10);
    expect(linjer.filter((linje) => logget.includes(linje))).toEqual([]);
    for (const ord of ["ida", "testesen", "fjordkroken", "sparebanken", "kunde"]) {
      expect(logget).not.toContain(ord);
    }
  });
});
