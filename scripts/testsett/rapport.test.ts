import { readFileSync } from "node:fs";

import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

import { MAKS_UTDATA_TOKENS, TEMPERATUR } from "@/lib/llm/felles";
import type { LlmKlient } from "@/lib/llm/klient";
import { nullstill } from "@/lib/pipeline/grense";

import { kjorTestsett } from "../kjor-testsett";
import type { Valg } from "./argumenter";
import { lesFasit, lesSjekkliste } from "./fasit";
import { lagRapport, type RapportData } from "./rapport";

const NOKKEL = "sk-falsk-hemmelig-nokkel-123";

const fasit = lesFasit(readFileSync("testdata/par-2-it-support/fasit.md", "utf8"));
const sjekkliste = lesSjekkliste(readFileSync("testdata/sjekkliste.md", "utf8"));

function data(): RapportData {
  return {
    meta: {
      commit: "a".repeat(40),
      endringer: true,
      leverandor: "openai",
      modell: "gpt-5-mini",
      dato: "2026-11-19T12:00:00.000Z",
      prisInn: 2.5,
      prisUt: 20,
      ganger: 2,
      mock: false,
    },
    sjekkliste,
    par: [
      {
        navn: "par-2-it-support",
        fasit,
        kjoringer: [
          {
            nr: 1,
            status: 200,
            feilkode: null,
            inputTokens: 2000,
            outputTokens: 500,
            varighetMs: 1234,
            analyse: {
              stilling: "IT-brukerstøtte",
              arbeidsgiver: "Testvik | kommune",
              krav: [
                { tekst: "IT-utdanning", kategori: "oppfylt", belegg: ["Bachelor i IT"], nedgradert: false },
                {
                  tekst: "Førerkort",
                  kategori: "mangler",
                  belegg: [],
                  raad: "Si at du\nkan ta det.",
                  nedgradert: true,
                },
              ],
              nokkelord: [
                { tekst: "Windows", kravIndeks: null, funnet: true },
                { tekst: "ITIL", kravIndeks: null, funnet: false },
              ],
              treffprosent: 50,
              fjernetBelegg: 1,
            },
          },
          {
            nr: 2,
            status: 504,
            feilkode: "llm_tidsavbrudd",
            inputTokens: null,
            outputTokens: null,
            varighetMs: 45001,
            analyse: null,
          },
        ],
      },
    ],
  };
}

describe("lagRapport", () => {
  const rapport = lagRapport(data());

  it("NFR-10: topptekst med commit, endringer, leverandør, modell, dato og priser", () => {
    expect(rapport).toContain(`- **Commit:** \`${"a".repeat(40)}\` (arbeidstreet har endringer`);
    expect(rapport).toContain("- **Leverandør:** openai");
    expect(rapport).toContain("- **Modell:** gpt-5-mini");
    expect(rapport).toContain("- **Dato:** 2026-11-19T12:00:00.000Z");
    expect(rapport).toContain("2,5 kr per million input-tokens, 20 kr per million output-tokens");
    expect(rapport).not.toContain("Tørrkjøring");
  });

  it("SM-2: fasittabell, forbudte påstander og sjekklistepunkter som avkryssingsbokser", () => {
    expect(rapport).toContain("| Kjennskap til ITIL | Mangler | – |");
    expect(rapport).toContain("### Forbudte påstander (SM-2)\n\n- At Jonas har førerkort");
    expect(rapport).toContain("- [ ] Alle krav fra annonsen er med.");
    expect(rapport).toContain("- [ ] Ingen av de **forbudte påstandene** i `fasit.md` forekommer.");
  });

  it("AC: kjøringen har kategori, belegg, nedgradering, nøkkelord, treffprosent, tokens, varighet og kostnad", () => {
    expect(rapport).toContain("| 1 | IT-utdanning | Oppfylt | «Bachelor i IT» | – |");
    expect(rapport).toContain("| 2 | Førerkort | Mangler (nedgradert) | – | Råd: Si at du kan ta det. |");
    expect(rapport).toContain("- **Nedgraderte krav:** Førerkort");
    expect(rapport).toContain("- **Nøkkelord funnet i CV-en:** Windows");
    expect(rapport).toContain("- **Nøkkelord ikke funnet:** ITIL");
    expect(rapport).toContain("- **Treffprosent:** 50 %");
    expect(rapport).toContain("- **Tokens:** 2000 inn, 500 ut");
    expect(rapport).toContain("- **Varighet:** 1234 ms");
    // 2000 × 2,5 / 1e6 + 500 × 20 / 1e6 = 0,015
    expect(rapport).toContain("- **Kostnad:** 0,0150 kr");
    expect(rapport).toContain("Testvik \\| kommune");
  });

  it("AC: nøkkelorddekningen er merket som en hjelp", () => {
    expect(rapport).toContain(
      "- Kjøring 1: 2 av 9 forventede nøkkelord (22 %), hjelp, ikke vurdering",
    );
    expect(rapport).toContain("- Kjøring 2: ingen analyse (llm_tidsavbrudd)");
  });

  it("AC: en feilet kjøring står med feilkode, og paret har snittkostnad og lengste varighet", () => {
    expect(rapport).toContain("- **Status:** 504 (llm_tidsavbrudd)");
    expect(rapport).toContain("- **Tokens:** – inn, – ut");
    expect(rapport).toContain("- **Kostnad:** ukjent");
    expect(rapport).toContain("- **Kjøringer:** 2, **feil:** 1 (kjøring 2: llm_tidsavbrudd)");
    expect(rapport).toContain(
      "- **Gjennomsnittlig kostnad:** minst 0,0150 kr (1 kjøring med ukjent kostnad)",
    );
    expect(rapport).toContain("- **Lengste varighet:** 45001 ms");
    expect(rapport).toContain("- **Høyeste output-tokens:** 500");
  });

  it("SM-8: Totalt viser samlet og gjennomsnittlig kostnad som nedre grenser med ukjente", () => {
    const totalt = rapport.slice(rapport.indexOf("## Totalt"));
    expect(totalt).toContain("- **Kjøringer:** 2, **feil:** 1");
    expect(totalt).toContain("- **Samlet kostnad:** minst 0,0150 kr (1 kjøring med ukjent kostnad)");
    expect(totalt).toContain(
      "- **Gjennomsnittlig kostnad per kjøring:** minst 0,0150 kr (1 kjøring med ukjent kostnad)",
    );
    expect(totalt).toContain(`- **Høyeste output-tokens:** 500 (taket er ${MAKS_UTDATA_TOKENS})`);
    expect(totalt).toContain(`- **Temperatur:** ${TEMPERATUR}`);
  });

  it("SM-8: uten ukjente kostnader er Totalt et eksakt beløp", () => {
    const d = data();
    d.par[0].kjoringer.pop();
    const totalt = lagRapport(d).slice(lagRapport(d).indexOf("## Totalt"));
    expect(totalt).toContain("- **Samlet kostnad:** 0,0150 kr");
    expect(totalt).toContain("- **Gjennomsnittlig kostnad per kjøring:** 0,0150 kr");
  });

  it("SM-8: 0 inn og 0 ut gir ukjent kostnad", () => {
    const d = data();
    Object.assign(d.par[0].kjoringer[1], { status: 502, feilkode: "ugyldig_svar", inputTokens: 0, outputTokens: 0 });
    const tekst = lagRapport(d);
    expect(tekst).toContain("- **Tokens:** 0 inn, 0 ut\n- **Varighet:** 45001 ms\n- **Kostnad:** ukjent");
    expect(tekst).toContain("- **Samlet kostnad:** minst 0,0150 kr (1 kjøring med ukjent kostnad)");
  });

  it("toppteksten viser temperatur og tak, og et svar på taket merkes", () => {
    expect(rapport).toContain(`- **Temperatur:** ${TEMPERATUR}`);
    expect(rapport).toContain(`- **Tak for output-tokens:** ${MAKS_UTDATA_TOKENS}`);
    expect(rapport).not.toContain("nådde taket");

    const d = data();
    Object.assign(d.par[0].kjoringer[1], {
      status: 502,
      feilkode: "ugyldig_svar",
      inputTokens: 900,
      outputTokens: MAKS_UTDATA_TOKENS,
    });
    expect(lagRapport(d)).toContain(
      `- **Tokens:** 900 inn, ${MAKS_UTDATA_TOKENS} ut (nådde taket for output-tokens)`,
    );
  });

  it("tørrkjøringen er merket", () => {
    const d = data();
    d.meta.mock = true;
    expect(lagRapport(d)).toContain("(tørrkjøring med mock)");
  });
});

describe("rapporten og hemmeligheter", () => {
  beforeEach(() => {
    vi.spyOn(console, "log").mockImplementation(() => {});
    vi.stubGlobal(
      "fetch",
      vi.fn(async () => {
        throw new TypeError("fetch failed");
      }),
    );
    vi.stubEnv("MISTRAL_API_KEY", NOKKEL);
    vi.stubEnv("OPENAI_API_KEY", NOKKEL);
    nullstill();
  });

  afterEach(() => {
    vi.restoreAllMocks();
    vi.unstubAllGlobals();
    vi.unstubAllEnvs();
  });

  it("NFR-10: en falsk nøkkel i env havner ikke i rapporten eller konsollen", async () => {
    const klient: LlmKlient = {
      analyseGap: async () => ({ svar: null, inputTokens: 10, outputTokens: 1 }),
    };
    const valg: Valg = {
      leverandor: "mistral",
      modell: "mistral-medium-latest",
      ganger: 1,
      par: "par-2-it-support",
      mock: false,
      prisInn: 1,
      prisUt: 1,
    };

    const { rapport } = await kjorTestsett(valg, klient, {
      git: () => ({ commit: "b".repeat(40), endringer: false }),
    });

    expect(process.env.MISTRAL_API_KEY).toBe(NOKKEL);
    expect(rapport).not.toContain(NOKKEL);
    expect(rapport).not.toContain("API_KEY");
    const konsoll = vi.mocked(console.log).mock.calls.flat().join("\n");
    expect(konsoll).not.toContain(NOKKEL);
  });
});
