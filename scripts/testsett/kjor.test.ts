import { execFileSync } from "node:child_process";
import { mkdirSync, mkdtempSync, readdirSync, readFileSync, rmSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import path from "node:path";

import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

import { type GapInndata, lagEkteKlient, type LlmKlient } from "@/lib/llm/klient";
import { mockKlient } from "@/lib/llm/mock";
import { nullstill } from "@/lib/pipeline/grense";

import { genererEnv, kjentePar, kjorTestsett, lesGit, main, RAPPORTMAPPE, rapportNavn } from "../kjor-testsett";
import type { Valg } from "./argumenter";

// main får en falsk ekte klient, så ingen test når leverandøren.
vi.mock("@/lib/llm/klient", async (original) => ({
  ...(await original<typeof import("@/lib/llm/klient")>()),
  lagEkteKlient: vi.fn(),
}));

const VALG: Valg = {
  leverandor: "openai",
  modell: "gpt-5-mini",
  ganger: 3,
  par: null,
  mock: false,
  prisInn: 2,
  prisUt: 10,
};

const GIT = () => ({ commit: "c".repeat(40), endringer: false });
const ANNONSE_3 = readFileSync("testdata/par-3-regnskap/annonse.txt", "utf8");

// Ingen test når nettet.
const nettverk = vi.fn<typeof fetch>(async () => {
  throw new TypeError("fetch failed");
});

beforeEach(() => {
  vi.spyOn(console, "log").mockImplementation(() => {});
  vi.stubGlobal("fetch", nettverk);
  nullstill();
});

afterEach(() => {
  vi.restoreAllMocks();
  vi.unstubAllGlobals();
  nettverk.mockClear();
});

// En falsk klient: demosvaret med 1000 inn og 400 ut. Par 3 kaster på andre kall.
function falskKlient() {
  const kall: GapInndata[] = [];
  let par3 = 0;
  const klient: LlmKlient = {
    analyseGap: vi.fn(async (inndata: GapInndata) => {
      kall.push(inndata);
      if (inndata.annonse === ANNONSE_3 && ++par3 === 2) {
        throw new Error("nettverk nede");
      }
      const { svar } = await mockKlient.analyseGap(inndata);
      return { svar, inputTokens: 1000, outputTokens: 400, modellversjon: "gpt-5-mini-2025-08-07" };
    }),
  };
  return { klient, kall };
}

describe("kjorTestsett", () => {
  it("AD-11: kjører alle fire parene tre ganger, 12 kall til den injiserte klienten", async () => {
    const { klient, kall } = falskKlient();
    const { rapport, data } = await kjorTestsett(VALG, klient, { git: GIT });

    expect(kall).toHaveLength(12);
    expect(nettverk).not.toHaveBeenCalled();
    expect(data.par.map((p) => p.navn)).toEqual(kjentePar());
    expect(data.par.every((p) => p.kjoringer.length === 3)).toBe(true);
    expect(rapport).toContain("## par-1-butikk-bank");
    expect(rapport).toContain("## par-4-tokolonne-hotell");
    expect(rapport).toContain("- **Kjøringer:** 12, **feil:** 1");
    expect(rapport).toContain(`\`${"c".repeat(40)}\``);
  });

  it("AD-11: par 1 (demoeksempelet) går til den ekte klienten, ikke mock", async () => {
    const { klient } = falskKlient();
    const { data } = await kjorTestsett({ ...VALG, par: "par-1-butikk-bank" }, klient, { git: GIT });

    expect(klient.analyseGap).toHaveBeenCalledTimes(3);
    const [forste] = data.par[0].kjoringer;
    expect(forste.inputTokens).toBe(1000);
    expect(forste.outputTokens).toBe(400);
    expect(forste.analyse?.treffprosent).toBe(22);
    expect(forste.modellversjon).toBe("gpt-5-mini-2025-08-07");
  });

  it("AD-11: en kjøring som feiler, står med feilkode, og de andre fortsetter", async () => {
    const { klient } = falskKlient();
    const { data, rapport } = await kjorTestsett({ ...VALG, par: "par-3-regnskap" }, klient, { git: GIT });

    const [en, to, tre] = data.par[0].kjoringer;
    expect(en.feilkode).toBeNull();
    expect(to).toMatchObject({
      status: 502,
      feilkode: "llm_feil",
      inputTokens: null,
      modellversjon: null,
      analyse: null,
    });
    expect(en.modellversjon).toBe("gpt-5-mini-2025-08-07");
    expect(rapport).toContain("- **Status:** 502 (llm_feil)\n- **Modellversjon:** ukjent");
    expect(tre.feilkode).toBeNull();
    expect(rapport).toContain("- **Status:** 502 (llm_feil)");
    expect(rapport).toContain("- **Kjøringer:** 3, **feil:** 1 (kjøring 2: llm_feil)");
  });

  it("AD-4: ugyldig svar gir ugyldig_svar med tokens", async () => {
    const klient: LlmKlient = {
      analyseGap: async () => ({
        svar: undefined,
        inputTokens: 900,
        outputTokens: 8000,
        modellversjon: "mistral-medium-2508",
      }),
    };
    const { data } = await kjorTestsett({ ...VALG, par: "par-2-it-support", ganger: 1 }, klient, {
      git: GIT,
    });

    expect(data.par[0].kjoringer[0]).toMatchObject({
      status: 502,
      feilkode: "ugyldig_svar",
      inputTokens: 900,
      outputTokens: 8000,
      modellversjon: "mistral-medium-2508",
    });
  });

  it("AD-9: rate-limiten stopper ikke 12 kall, og appens grenser er uendret", async () => {
    const { klient } = falskKlient();
    const { data } = await kjorTestsett({ ...VALG, ganger: 5 }, klient, { git: GIT });

    const koder = data.par.flatMap((p) => p.kjoringer.map((k) => k.feilkode));
    expect(koder).not.toContain("grense_naadd");
    expect(Number(genererEnv(VALG).GRENSE_PER_MINUTT)).toBeGreaterThan(20);
  });

  it("SM-8: kostnaden regnes fra tokens og prisene", async () => {
    const { klient } = falskKlient();
    const { rapport } = await kjorTestsett({ ...VALG, par: "par-2-it-support", ganger: 1 }, klient, {
      git: GIT,
    });

    // 1000 × 2 / 1e6 + 400 × 10 / 1e6 = 0,006
    expect(rapport).toContain("- **Kostnad:** 0,0060 kr");
  });

  it("--mock: mockKlient gir 12 kjøringer uten feil og uten nettverk", async () => {
    const { data, rapport } = await kjorTestsett({ ...VALG, mock: true, prisInn: 0, prisUt: 0 }, mockKlient, {
      git: GIT,
    });

    expect(data.par.flatMap((p) => p.kjoringer)).toHaveLength(12);
    expect(rapport).toContain("- **Kjøringer:** 12, **feil:** 0");
    expect(rapport).toContain("(tørrkjøring med mock)");
    expect(data.par.flatMap((p) => p.kjoringer).every((k) => k.modellversjon === "mock")).toBe(true);
    expect(rapport).toContain("- **Modellversjon fra leverandøren:** mock (12 kjøringer)");
    expect(nettverk).not.toHaveBeenCalled();
  });

  it("NFR-10: --mock med en kjøring uten svar gir ukjent versjon, ikke mock", async () => {
    const klient: LlmKlient = {
      analyseGap: async () => {
        throw new Error("nettverk nede");
      },
    };
    const { data } = await kjorTestsett(
      { ...VALG, mock: true, prisInn: 0, prisUt: 0, par: "par-2-it-support", ganger: 1 },
      klient,
      { git: GIT },
    );

    expect(data.par[0].kjoringer[0]).toMatchObject({ feilkode: "llm_feil", modellversjon: null });
  });

  it("AD-11: en fasit som ikke kan leses, stopper før første kall", async () => {
    const mappe = mkdtempSync(path.join(tmpdir(), "testsett-"));
    try {
      mkdirSync(path.join(mappe, "par-x"));
      writeFileSync(path.join(mappe, "par-x", "cv.txt"), "CV");
      writeFileSync(path.join(mappe, "par-x", "annonse.txt"), "Annonse");
      writeFileSync(path.join(mappe, "par-x", "fasit.md"), "# Uten seksjoner");
      writeFileSync(path.join(mappe, "sjekkliste.md"), readFileSync("testdata/sjekkliste.md", "utf8"));
      const { klient } = falskKlient();

      await expect(kjorTestsett(VALG, klient, { testdata: mappe, git: GIT })).rejects.toThrow(
        "Forventet gap-analyse",
      );
      expect(klient.analyseGap).not.toHaveBeenCalled();
    } finally {
      rmSync(mappe, { recursive: true, force: true });
    }
  });

  it("NFR-10: feiler git, blir commit «ukjent» og kjøringene beholdes", async () => {
    const { klient } = falskKlient();
    const { data, rapport } = await kjorTestsett({ ...VALG, par: "par-2-it-support", ganger: 1 }, klient, {
      git: () => {
        throw new Error("ikke et git-repo");
      },
    });

    expect(data.meta).toMatchObject({ commit: "ukjent", endringer: true });
    expect(data.par[0].kjoringer).toHaveLength(1);
    expect(rapport).toContain("- **Commit:** `ukjent`");
  });
});

describe("main", () => {
  let mappe: string;

  beforeEach(() => {
    mappe = mkdtempSync(path.join(tmpdir(), "testsett-rapporter-"));
    vi.mocked(lagEkteKlient).mockReset();
  });

  afterEach(() => {
    rmSync(mappe, { recursive: true, force: true });
  });

  it("AD-11: bare --leverandor mistral uten nøkkel gir nøkkelmeldingen, ikke prismeldingen", async () => {
    const feil = vi.spyOn(console, "error").mockImplementation(() => {});

    expect(await main(["--leverandor", "mistral"], {}, { rapportmappe: mappe })).toBe(1);
    expect(feil).toHaveBeenCalledWith(expect.stringContaining("Mangler MISTRAL_API_KEY"));
    expect(feil).not.toHaveBeenCalledWith(expect.stringContaining("--pris-inn"));
    expect(lagEkteKlient).not.toHaveBeenCalled();
    expect(readdirSync(mappe)).toEqual([]);
  });

  it("--mock: gir 0 og skriver en -mock-rapport med 12 kjøringer uten nettverk", async () => {
    expect(await main(["--leverandor", "mistral", "--mock"], {}, { rapportmappe: mappe })).toBe(0);

    const filer = readdirSync(mappe);
    expect(filer).toHaveLength(1);
    expect(filer[0]).toMatch(/-mistral-mistral-medium-latest-mock\.md$/);
    const tekst = readFileSync(path.join(mappe, filer[0]), "utf8");
    expect(tekst).toContain("- **Kjøringer:** 12, **feil:** 0");
    expect(tekst).toContain("- **Modell (bedt om):** mistral-medium-latest");
    expect(tekst).toContain("- **Modellversjon fra leverandøren:** mock (12 kjøringer)");
    expect(lagEkteKlient).not.toHaveBeenCalled();
    expect(nettverk).not.toHaveBeenCalled();
  });

  it("NFR-10: med nøkkel havner nøkkelen verken i rapporten eller i konsollen", async () => {
    const NOKKEL = "sk-falsk-hemmelig-nokkel-456";
    const { klient } = falskKlient();
    vi.mocked(lagEkteKlient).mockReturnValue(klient);
    const feil = vi.spyOn(console, "error").mockImplementation(() => {});

    const kode = await main(
      ["--leverandor", "mistral", "--pris-inn", "4", "--pris-ut", "20", "--par", "par-2-it-support", "--ganger", "1"],
      { MISTRAL_API_KEY: NOKKEL, ANNEN_HEMMELIGHET: "skal-ikke-med" },
      { rapportmappe: mappe },
    );

    expect(kode).toBe(0);
    expect(lagEkteKlient).toHaveBeenCalledWith({
      LLM_LEVERANDOR: "mistral",
      LLM_MODELL: "mistral-medium-latest",
      MISTRAL_API_KEY: NOKKEL,
    });
    expect(klient.analyseGap).toHaveBeenCalledTimes(1);
    const [fil] = readdirSync(mappe);
    const rapport = readFileSync(path.join(mappe, fil), "utf8");
    expect(rapport).toContain("- **Kostnad:** 0,0120 kr");
    expect(rapport).not.toContain(NOKKEL);
    expect(rapport).not.toContain("skal-ikke-med");
    const konsoll = [...vi.mocked(console.log).mock.calls, ...feil.mock.calls].flat().map(String).join("\n");
    expect(konsoll).not.toContain(NOKKEL);
    expect(nettverk).not.toHaveBeenCalled();
  });
  it("AD-11: mangler nøkkelen, gir det norsk melding, utgangskode 1 og ingen kall", async () => {
    const feil = vi.spyOn(console, "error").mockImplementation(() => {});

    const kode = await main(["--leverandor", "mistral", "--pris-inn", "1", "--pris-ut", "1"], {});

    expect(kode).toBe(1);
    expect(feil).toHaveBeenCalledWith(expect.stringContaining("Mangler MISTRAL_API_KEY"));
    expect(nettverk).not.toHaveBeenCalled();
  });

  it("AD-11: ugyldig flagg gir melding om bruk og utgangskode 1", async () => {
    const feil = vi.spyOn(console, "error").mockImplementation(() => {});

    expect(await main(["--leverandor", "foo"], {})).toBe(1);
    expect(feil).toHaveBeenCalledWith(expect.stringContaining("Bruk: npm run testsett"));
    expect(nettverk).not.toHaveBeenCalled();
  });
});

describe("lesGit", () => {
  it("NFR-10: en rapport som ikke er committet, regnes ikke som en endring, men annet gjør", () => {
    const mappe = mkdtempSync(path.join(tmpdir(), "testsett-git-"));
    const git = (...args: string[]) => execFileSync("git", args, { cwd: mappe, encoding: "utf8" });
    try {
      git("init", "-q");
      writeFileSync(path.join(mappe, "a.txt"), "a");
      git("add", ".");
      git("-c", "user.name=Test", "-c", "user.email=test@example.invalid", "commit", "-q", "-m", "a");

      mkdirSync(path.join(mappe, RAPPORTMAPPE));
      writeFileSync(path.join(mappe, RAPPORTMAPPE, "rapport.md"), "rapport");
      const ren = lesGit(mappe);
      expect(ren.commit).toMatch(/^[0-9a-f]{40}$/);
      expect(ren.endringer).toBe(false);

      writeFileSync(path.join(mappe, "a.txt"), "endret");
      expect(lesGit(mappe).endringer).toBe(true);
    } finally {
      rmSync(mappe, { recursive: true, force: true });
    }
  });
});

describe("rapportNavn", () => {
  it("dato, leverandør og modell, og -mock for tørrkjøringer", () => {
    const dato = new Date(2026, 10, 19, 9, 5);
    expect(rapportNavn(VALG, dato)).toBe("2026-11-19-0905-openai-gpt-5-mini.md");
    expect(rapportNavn({ ...VALG, modell: "Org/Modell:1", mock: true }, dato)).toBe(
      "2026-11-19-0905-openai-org-modell-1-mock.md",
    );
  });
});
