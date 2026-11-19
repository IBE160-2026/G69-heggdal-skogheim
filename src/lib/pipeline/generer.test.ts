import { readFileSync } from "node:fs";

import { afterEach, beforeEach, describe, expect, it, vi, type MockInstance } from "vitest";

import { normaliser } from "@/lib/kjerne/demo";
import { DEMO_ANNONSE, DEMO_CV } from "@/lib/kontrakt/demo";
import { gapAnalyse } from "@/lib/kontrakt/gap";
import type { LlmKlient } from "@/lib/llm/klient";
import { mockKlient } from "@/lib/llm/mock";

import { generer, type Klienter, LISTETEGN_FORST, LLM_TIDSGRENSE_MS } from "./generer";
import { nullstill } from "./grense";

const DEMO_ENV = {};
const EKTE_ENV = { MISTRAL_API_KEY: "x" };
const EGEN_CV = readFileSync("testdata/par-2-it-support/cv.txt", "utf8");
const ANNONSE_2 = readFileSync("testdata/par-2-it-support/annonse.txt", "utf8");
const FORVENTEDE_KATEGORIER = ["oppfylt", "delvis", "oppfylt", "delvis", "oppfylt", "mangler"];

let logg: MockInstance<typeof console.log>;

// Ingen test når nettet. Et kall til den ekte adapteren uten injisert klient
// stopper her.
const nettverk = vi.fn<typeof fetch>(async () => {
  throw new TypeError("fetch failed");
});

beforeEach(() => {
  logg = vi.spyOn(console, "log").mockImplementation(() => {});
  vi.stubGlobal("fetch", nettverk);
  nullstill();
});

afterEach(() => {
  vi.restoreAllMocks();
  vi.unstubAllGlobals();
  nettverk.mockClear();
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
    const svar = await generer("gap", { cvTekst: DEMO_CV, annonse: DEMO_ANNONSE }, env, { klienter: k });

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
      { klienter: k },
    );

    expect(svar.status).toBe(200);
    expect(k.mock.analyseGap).toHaveBeenCalled();
    expect(k.ekte.analyseGap).not.toHaveBeenCalled();
  });

  it("FR-24: egen CV i demomodus gir demo_krever_nokkel uten mock-svar", async () => {
    const k = klienter();
    const svar = await generer("gap", { cvTekst: EGEN_CV, annonse: ANNONSE_2 }, DEMO_ENV, { klienter: k });

    expect(svar).toEqual({ status: 403, json: { feil: { kode: "demo_krever_nokkel" } } });
    expect(k.mock.analyseGap).not.toHaveBeenCalled();
  });

  it("FR-26: demo: true med egen CV i ekte modus gir ugyldig_inndata", async () => {
    const k = klienter();
    const svar = await generer(
      "gap",
      { cvTekst: EGEN_CV, annonse: ANNONSE_2, demo: true },
      EKTE_ENV,
      { klienter: k },
    );

    expect(svar).toEqual({ status: 400, json: { feil: { kode: "ugyldig_inndata" } } });
    expect(k.mock.analyseGap).not.toHaveBeenCalled();
    expect(k.ekte.analyseGap).not.toHaveBeenCalled();
  });

  it("AD-3: uten injiserte klienter går egen CV i ekte modus til den ekte adapteren", async () => {
    const svar = await generer("gap", { cvTekst: EGEN_CV, annonse: ANNONSE_2 }, EKTE_ENV);

    // fetch er stubbet og feiler, så adapteren gir llm_feil uten nettverkskall.
    expect(nettverk).toHaveBeenCalledTimes(1);
    expect(String(nettverk.mock.calls[0]?.[0] ?? "")).toContain("mistral");
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
      { klienter: klienter(ekte) },
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
      { klienter: klienter(klientMed({ krav: "ikke en liste" })) },
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
      { klienter: klienter(klientMed(null, feil)) },
    );

    expect(svar).toEqual({ status: 504, json: { feil: { kode: "llm_tidsavbrudd" } } });
  });

  it.each([
    ["CV over 15 000 tegn", { cvTekst: "a".repeat(15_001), annonse: ANNONSE_2 }],
    ["annonse over 8 000 tegn", { cvTekst: EGEN_CV, annonse: "a".repeat(8_001) }],
  ])("FR-4: %s gir for_lang_tekst", async (_navn, body) => {
    const k = klienter();
    const svar = await generer("gap", body, EKTE_ENV, { klienter: k });

    expect(svar).toEqual({ status: 413, json: { feil: { kode: "for_lang_tekst" } } });
    expect(k.ekte.analyseGap).not.toHaveBeenCalled();
  });

  it.each([
    ["annonse under 200 tegn", { cvTekst: EGEN_CV, annonse: "a".repeat(199) }],
    ["tom annonse", { cvTekst: EGEN_CV, annonse: "  " }],
    ["tom CV", { cvTekst: " \n ", annonse: ANNONSE_2 }],
  ])("FR-4: %s gir for_kort_tekst", async (_navn, body) => {
    const svar = await generer("gap", body, EKTE_ENV, { klienter: klienter() });

    expect(svar).toEqual({ status: 400, json: { feil: { kode: "for_kort_tekst" } } });
  });

  it.each([
    ["ingen body", undefined],
    ["feil typer", { cvTekst: 1, annonse: ANNONSE_2 }],
    ["manglende annonse", { cvTekst: EGEN_CV }],
    ["demo som tekst", { cvTekst: DEMO_CV, annonse: DEMO_ANNONSE, demo: "ja" }],
  ])("NFR-9: %s gir ugyldig_inndata", async (_navn, body) => {
    const svar = await generer("gap", body, DEMO_ENV, { klienter: klienter() });

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
        { klienter: klienter() },
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

const GYLDIG_SVAR = {
  stilling: "IT-brukerstøtte",
  arbeidsgiver: "Testvik kommune",
  krav: [{ tekst: "Windows", kategori: "oppfylt", belegg: ["Windows og Linux"] }],
  nokkelord: [{ tekst: "Windows", kravIndeks: 0 }],
};

function egenCv(env: Record<string, string> = EKTE_ENV, valg = {}) {
  return generer("gap", { cvTekst: EGEN_CV, annonse: ANNONSE_2 }, env, valg);
}

describe("rate-limit (steg D)", () => {
  it("AD-9: 11. ekte generering samme minutt gir 429 grense_naadd før adapteren", async () => {
    const ekte = klientMed(GYLDIG_SVAR);
    const k = klienter(ekte);

    for (let i = 0; i < 10; i++) {
      expect((await egenCv(EKTE_ENV, { klienter: k })).status).toBe(200);
    }
    const svar = await egenCv(EKTE_ENV, { klienter: k });

    expect(svar).toEqual({ status: 429, json: { feil: { kode: "grense_naadd" } } });
    expect(ekte.analyseGap).toHaveBeenCalledTimes(10);
    expect(logglinjer().at(-1)).toMatchObject({ status: 429, feilkode: "grense_naadd" });
  });

  it("AD-9: en generering som feiler, telles også", async () => {
    const env = { ...EKTE_ENV, GRENSE_PER_MINUTT: "2" };
    const k = klienter(klientMed({ krav: "ikke en liste" }));

    expect((await egenCv(env, { klienter: k })).status).toBe(502);
    expect((await egenCv(env, { klienter: k })).status).toBe(502);
    expect((await egenCv(env, { klienter: k })).status).toBe(429);
  });

  it("AD-9: demoeksempelet telles ikke og stoppes ikke av grensen", async () => {
    const env = { ...EKTE_ENV, GRENSE_PER_MINUTT: "1" };
    const k = klienter(klientMed(GYLDIG_SVAR));

    for (let i = 0; i < 3; i++) {
      const svar = await generer("gap", { cvTekst: DEMO_CV, annonse: DEMO_ANNONSE }, env, {
        klienter: k,
      });
      expect(svar.status).toBe(200);
    }
    expect((await egenCv(env, { klienter: k })).status).toBe(200);
    expect((await egenCv(env, { klienter: k })).status).toBe(429);
    expect(
      (await generer("gap", { cvTekst: DEMO_CV, annonse: DEMO_ANNONSE }, env, { klienter: k }))
        .status,
    ).toBe(200);
  });

  it("AD-9: egen CV i demomodus telles ikke", async () => {
    const env = { GRENSE_PER_MINUTT: "1" };
    await egenCv(env, { klienter: klienter() });
    await egenCv(env, { klienter: klienter() });

    expect(
      (await egenCv({ ...EKTE_ENV, GRENSE_PER_MINUTT: "1" }, { klienter: klienter(klientMed(GYLDIG_SVAR)) }))
        .status,
    ).toBe(200);
  });
});

describe("signal og tidsavbrudd", () => {
  it("AD-8: adapteren får et signal med tidsgrensen på 45 s", async () => {
    const timeout = vi.spyOn(AbortSignal, "timeout");
    const ekte = klientMed(GYLDIG_SVAR);
    await egenCv(EKTE_ENV, { klienter: klienter(ekte) });

    expect(LLM_TIDSGRENSE_MS).toBe(45_000);
    expect(timeout).toHaveBeenCalledWith(45_000);
    const { signal } = vi.mocked(ekte.analyseGap).mock.calls[0][0];
    expect(signal).toBeInstanceOf(AbortSignal);
    expect(signal.aborted).toBe(false);
  });

  it("AD-8: når tidsgrensen går ut, gir det 504 llm_tidsavbrudd", async () => {
    const tidsgrense = new AbortController();
    vi.spyOn(AbortSignal, "timeout").mockReturnValue(tidsgrense.signal);
    const ekte: LlmKlient = {
      analyseGap: vi.fn<LlmKlient["analyseGap"]>(
        ({ signal }) =>
          new Promise((_, avvis) => {
            // Adapteren pakker inn feilen, men signalet avgjør.
            signal.addEventListener("abort", () => avvis(new Error("innpakket")));
          }),
      ),
    };

    const svar = egenCv(EKTE_ENV, { klienter: klienter(ekte) });
    tidsgrense.abort(new DOMException("tidsavbrudd", "TimeoutError"));

    expect(await svar).toEqual({ status: 504, json: { feil: { kode: "llm_tidsavbrudd" } } });
  });

  it("AD-9: en request som allerede er avbrutt, gir llm_tidsavbrudd uten å telles", async () => {
    const env = { ...EKTE_ENV, GRENSE_PER_MINUTT: "1" };
    const ekte = klientMed(GYLDIG_SVAR);
    const request = new AbortController();
    request.abort();

    const avbrutt = await egenCv(env, { klienter: klienter(ekte), signal: request.signal });

    expect(avbrutt).toEqual({ status: 504, json: { feil: { kode: "llm_tidsavbrudd" } } });
    expect(ekte.analyseGap).not.toHaveBeenCalled();
    expect((await egenCv(env, { klienter: klienter(ekte) })).status).toBe(200);
  });

  it("AD-8: avbrutt request.signal når adapteren og gir llm_tidsavbrudd", async () => {
    const request = new AbortController();
    const ekte: LlmKlient = {
      analyseGap: vi.fn<LlmKlient["analyseGap"]>(
        ({ signal }) =>
          new Promise((_, avvis) => {
            signal.addEventListener("abort", () => avvis(signal.reason));
          }),
      ),
    };

    const svar = egenCv(EKTE_ENV, { klienter: klienter(ekte), signal: request.signal });
    request.abort();

    expect(await svar).toEqual({ status: 504, json: { feil: { kode: "llm_tidsavbrudd" } } });
  });
});

describe("grenser på svaret", () => {
  const krav = (n: number, belegg: string[] = []) =>
    Array.from({ length: n }, (_, i) => ({
      tekst: `Krav ${i}`,
      kategori: "mangler",
      belegg,
      raad: "Råd",
    }));
  const nokkelord = (n: number) =>
    Array.from({ length: n }, (_, i) => ({ tekst: `ord${i}`, kravIndeks: null }));

  it.each([
    ["31 krav", { krav: krav(31), nokkelord: [] }],
    ["11 belegg på ett krav", { krav: krav(1, Array(11).fill("Windows")), nokkelord: [] }],
    ["41 nøkkelord", { krav: krav(1), nokkelord: nokkelord(41) }],
    ["krav over 300 tegn", { krav: [{ ...krav(1)[0], tekst: "a".repeat(301) }], nokkelord: [] }],
    ["belegg over 500 tegn", { krav: krav(1, ["a".repeat(501)]), nokkelord: [] }],
    [
      "nøkkelord over 100 tegn",
      { krav: krav(1), nokkelord: [{ tekst: "a".repeat(101), kravIndeks: null }] },
    ],
  ])("AD-4: %s gir 502 ugyldig_svar", async (_navn, del) => {
    const svar = await egenCv(EKTE_ENV, {
      klienter: klienter(klientMed({ stilling: "", arbeidsgiver: "", ...del })),
    });

    expect(svar).toEqual({ status: 502, json: { feil: { kode: "ugyldig_svar" } } });
  });

  it("FR-12: grensen på 40 nøkkelord gjelder etter dedupliseringen", async () => {
    const svar = await egenCv(EKTE_ENV, {
      klienter: klienter(
        klientMed({
          stilling: "",
          arbeidsgiver: "",
          krav: krav(1),
          nokkelord: [...nokkelord(40), { tekst: "ORD0", kravIndeks: null }],
        }),
      ),
    });

    expect(svar.status).toBe(200);
    expect(gapAnalyse.parse(svar.json).nokkelord).toHaveLength(40);
  });

  it("AD-4: svar akkurat på grensene godtas", async () => {
    const svar = await egenCv(EKTE_ENV, {
      klienter: klienter(
        klientMed({
          stilling: "",
          arbeidsgiver: "",
          krav: krav(30, Array(10).fill("Windows")),
          nokkelord: nokkelord(40),
        }),
      ),
    });

    expect(svar.status).toBe(200);
  });
});

describe("duplikate nøkkelord", () => {
  it("FR-12: like nøkkelord telles én gang, og tomme fjernes", async () => {
    const svar = await egenCv(EKTE_ENV, {
      klienter: klienter(
        klientMed({
          ...GYLDIG_SVAR,
          nokkelord: [
            { tekst: "Windows", kravIndeks: 0 },
            { tekst: "windows", kravIndeks: null },
            { tekst: "Første-linje", kravIndeks: null },
            { tekst: "første linje", kravIndeks: 0 },
            { tekst: "ITIL", kravIndeks: null },
            { tekst: "  ", kravIndeks: null },
            { tekst: "–", kravIndeks: null },
          ],
        }),
      ),
    });

    const analyse = gapAnalyse.parse(svar.json);
    expect(analyse.nokkelord.map((n) => [n.tekst, n.kravIndeks])).toEqual([
      ["Windows", 0],
      ["Første-linje", null],
      ["ITIL", null],
    ]);
    expect(analyse.treffprosent).toBe(
      Math.round((100 * analyse.nokkelord.filter((n) => n.funnet).length) / 3),
    );
  });
});

describe("logglinjen for ekte generering", () => {
  it("AD-10: har tokenene fra adapteren og verken nøkkel eller tekst", async () => {
    const nokkel = "hemmelig-nokkel-4711";
    await egenCv({ MISTRAL_API_KEY: nokkel }, { klienter: klienter(klientMed(GYLDIG_SVAR)) });

    const [linje] = logglinjer();
    expect(linje).toMatchObject({ modus: "ekte", status: 200, inputTokens: 120, outputTokens: 80 });
    const logget = logg.mock.calls.flat().join("\n");
    expect(logget).not.toContain(nokkel);
    for (const tekst of ["Windows og Linux", "Testvik kommune", "IT-brukerstøtte"]) {
      expect(logget).not.toContain(tekst);
    }
  });
});

describe("listetegn først i belegg", () => {
  const CV_MED_LISTE = `${EGEN_CV}\n- Betjente kassasystem i butikk\n• Kasse\n  * Tok dagsoppgjør hver kveld\nIT-utdanning 2024–nå\n`;

  function medBelegg(belegg: string[][]) {
    return generer(
      "gap",
      { cvTekst: CV_MED_LISTE, annonse: ANNONSE_2 },
      EKTE_ENV,
      {
        klienter: klienter(
          klientMed({
            stilling: "",
            arbeidsgiver: "",
            krav: belegg.map((b, i) => ({ tekst: `Krav ${i}`, kategori: "oppfylt", belegg: b })),
            nokkelord: [],
          }),
        ),
      },
    );
  }

  it.each([
    ["- Betjente kassasystem", "Betjente kassasystem"],
    ["• Kasse", "Kasse"],
    ["  * Tok dagsoppgjør", "Tok dagsoppgjør"],
    ["– Kasse", "Kasse"],
    ["— Kasse", "Kasse"],
    ["‐ Kasse", "Kasse"],
    ["▪ Kasse", "Kasse"],
    ["‣ Kasse", "Kasse"],
    ["◦ Kasse", "Kasse"],
    ["Kasse  \n", "Kasse"],
    ["IT-utdanning", "IT-utdanning"],
    ["2024–nå", "2024–nå"],
  ])("FR-9: belegget %j vises og lagres som %j", async (belegg, forventet) => {
    const svar = await medBelegg([[belegg]]);

    expect(svar.status).toBe(200);
    const analyse = gapAnalyse.parse(svar.json);
    expect(analyse.krav[0]).toMatchObject({
      kategori: "oppfylt",
      belegg: [forventet],
      nedgradert: false,
    });
    expect(analyse.fjernetBelegg).toBe(0);
  });

  it("FR-9: belegg med listetegn gir samme kategorier som uten", async () => {
    const med = gapAnalyse.parse(
      (await medBelegg([["- Betjente kassasystem"], ["• Kasse"], ["  * Tok dagsoppgjør"], ["- Finnes ikke i CV-en"]])).json,
    );
    const uten = gapAnalyse.parse(
      (await medBelegg([["Betjente kassasystem"], ["Kasse"], ["Tok dagsoppgjør"], ["Finnes ikke i CV-en"]])).json,
    );

    expect(med).toEqual(uten);
    expect(med.krav.map((k) => k.kategori)).toEqual(["oppfylt", "oppfylt", "oppfylt", "mangler"]);
  });

  it("FR-9: like belegg i samme krav etter at listetegnene er fjernet, står én gang", async () => {
    const svar = await medBelegg([["- Kasse", "Kasse", "• Kasse ", "Tok dagsoppgjør"]]);

    const analyse = gapAnalyse.parse(svar.json);
    expect(analyse.krav[0].belegg).toEqual(["Kasse", "Tok dagsoppgjør"]);
    expect(analyse.fjernetBelegg).toBe(0);
  });

  it("FR-9: to like ugyldige belegg telles begge i fjernetBelegg", async () => {
    const svar = await medBelegg([["Finnes ikke", "- Finnes ikke"]]);

    const analyse = gapAnalyse.parse(svar.json);
    expect(analyse.krav[0]).toMatchObject({ kategori: "mangler", belegg: [], nedgradert: true });
    expect(analyse.fjernetBelegg).toBe(2);
  });

  it("FR-9: alle listetegnene som fjernes først, fjernes også av normaliseringen", () => {
    // Alle tegn i BMP som regelen fjerner, utenom mellomrom.
    const tegn = Array.from({ length: 0xd800 }, (_, i) => String.fromCodePoint(i)).filter(
      (t) => LISTETEGN_FORST.test(t) && !/\s/u.test(t),
    );

    expect(tegn).toEqual(["*", "-", "‐", "–", "—", "•", "‣", "▪", "◦"]);
    for (const t of tegn) expect(normaliser(`a${t}b`)).toBe("ab");
  });

  it("FR-9: et belegg som bare er listetegn, fjernes og kravet nedgraderes", async () => {
    const svar = await medBelegg([["- "]]);

    const analyse = gapAnalyse.parse(svar.json);
    expect(analyse.krav[0]).toMatchObject({ kategori: "mangler", belegg: [], nedgradert: true });
    expect(analyse.fjernetBelegg).toBe(1);
  });
});
