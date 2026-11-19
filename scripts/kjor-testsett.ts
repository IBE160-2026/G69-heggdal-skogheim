// Story 2.4, AD-11: kjører testsettet mot én leverandør og skriver en rapport til
// `testsett-rapporter/`. Kjøres med `npm run testsett -- --leverandor mistral|openai`.
// Krever nøkkel uten `--mock`, og kjøres ikke i CI.
import { execFileSync } from "node:child_process";
import { mkdirSync, readdirSync, readFileSync, writeFileSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

import type { GapAnalyse } from "@/lib/kontrakt/gap";
import { lagEkteKlient, type LlmKlient } from "@/lib/llm/klient";
import { NOKKEL_VARIABEL, nokkel } from "@/lib/llm/leverandor";
import { mockKlient } from "@/lib/llm/mock";
import { generer } from "@/lib/pipeline/generer";

import { lesArgumenter, manglerNokkel, type Valg } from "./testsett/argumenter";
import { lesFasit, lesSjekkliste } from "./testsett/fasit";
import { type Kjoring, lagRapport, type ParResultat, type RapportData } from "./testsett/rapport";

export const TESTDATA = "testdata";
export const RAPPORTMAPPE = "testsett-rapporter";

// Høye grenser bare for skriptet, så rate-limiten (AD-9) ikke stopper målingen.
const HOY_GRENSE = "1000000";

// Modellversjonen i rapporten ved `--mock`.
export const MOCK_VERSJON = "mock";

export type GitInfo = { commit: string; endringer: boolean };

export type Opsjoner = {
  testdata?: string;
  git?: () => GitInfo;
  na?: () => Date;
};

export function kjentePar(testdata: string = TESTDATA): string[] {
  return readdirSync(testdata, { withFileTypes: true })
    .filter((d) => d.isDirectory() && d.name.startsWith("par-"))
    .map((d) => d.name)
    .sort();
}

// NFR-10: full commit-hash og om arbeidstreet har endringer.
export function lesGit(cwd?: string): GitInfo {
  const git = (...args: string[]) => execFileSync("git", args, { encoding: "utf8", cwd }).trim();
  // Rapportene fra tidligere kjøringer regnes ikke som endringer i koden.
  return {
    commit: git("rev-parse", "HEAD"),
    endringer: git("status", "--porcelain", "--", ":/", `:(top,exclude)${RAPPORTMAPPE}`) !== "",
  };
}

// Miljøet til `generer`. Det inneholder ingen ekte nøkkel: nøkkelen ligger bare i
// den injiserte klienten. Plassholderen gjør at `lagStatus` gir ekte modus, så
// par 2–4 når adapteren.
export function genererEnv(valg: Valg): Record<string, string> {
  return {
    LLM_LEVERANDOR: valg.leverandor,
    LLM_MODELL: valg.modell,
    [NOKKEL_VARIABEL[valg.leverandor]]: "testsett",
    GRENSE_PER_MINUTT: HOY_GRENSE,
    GRENSE_PER_DOGN: HOY_GRENSE,
  };
}

type Tokens = { inputTokens: number; outputTokens: number; modellversjon: string | null };

// Lagrer tokens og modellversjonen for siste kall, siden svaret fra `generer`
// ikke har dem (NFR-10).
function medTokens(klient: LlmKlient) {
  let siste: Tokens | null = null;

  return {
    klient: {
      async analyseGap(inndata) {
        const svar = await klient.analyseGap(inndata);
        siste = {
          inputTokens: svar.inputTokens,
          outputTokens: svar.outputTokens,
          modellversjon: svar.modellversjon ?? null,
        };
        return svar;
      },
    } satisfies LlmKlient,
    taSiste(): Tokens | null {
      const tokens = siste;
      siste = null;
      return tokens;
    },
  };
}

const to = (n: number) => String(n).padStart(2, "0");

// `<ÅÅÅÅ-MM-DD-TTMMSS>-<leverandor>-<modell>[-mock].md`, med lokal tid. Sekundene
// skiller kjøringer som starter i samme minutt (en kontroll og en full måling).
export function rapportNavn(valg: Valg, dato: Date): string {
  const tid = `${dato.getFullYear()}-${to(dato.getMonth() + 1)}-${to(dato.getDate())}-${to(dato.getHours())}${to(dato.getMinutes())}${to(dato.getSeconds())}`;
  const modell = valg.modell.toLowerCase().replace(/[^a-z0-9.-]+/g, "-");
  return `${tid}-${valg.leverandor}-${modell}${valg.mock ? "-mock" : ""}.md`;
}

// Skriver rapporten uten å overskrive en som finnes. Er navnet tatt (samme sekund),
// får fila et løpenummer før `-mock.md` eller `.md` (`-nr2`, `-nr3` …), så tørrkjøringer
// fortsatt slutter på `-mock.md` og ignoreres av git. `nr` skiller tallet fra et modellnavn
// som slutter på et siffer. Andre skrivefeil kastes videre, og etter 1000 tatte navn gis det opp.
// Gir stien som ble skrevet.
export function skrivNyRapport(mappe: string, navn: string, tekst: string): string {
  const slutt = navn.match(/(-mock)?\.md$/)?.[0] ?? "";
  const grunn = navn.slice(0, navn.length - slutt.length);
  for (let nummer = 1; nummer <= MAKS_LOPENUMMER; nummer++) {
    const fil = path.join(mappe, nummer === 1 ? navn : `${grunn}-nr${nummer}${slutt}`);
    try {
      writeFileSync(fil, tekst, { encoding: "utf8", flag: "wx" });
      return fil;
    } catch (feil) {
      if ((feil as NodeJS.ErrnoException).code !== "EEXIST") throw feil;
    }
  }
  throw new Error(`Fant ikke et ledig filnavn for ${navn} i ${mappe} etter ${MAKS_LOPENUMMER} forsøk.`);
}

const MAKS_LOPENUMMER = 1000;

// Kjører hvert par `valg.ganger` ganger gjennom den ekte pipelinen. Klienten
// brukes som både mock og ekte, så også par 1 (demoeksempelet) går til modellen.
// En kjøring som feiler, står i rapporten og stopper ikke resten.
export async function kjorTestsett(
  valg: Valg,
  klient: LlmKlient,
  { testdata = TESTDATA, git = lesGit, na = () => new Date() }: Opsjoner = {},
): Promise<{ rapport: string; data: RapportData }> {
  const env = genererEnv(valg);
  const maaler = medTokens(klient);
  const klienter = { mock: maaler.klient, ekte: maaler.klient };
  const parListe = valg.par ? [valg.par] : kjentePar(testdata);
  const les = (...deler: string[]) => readFileSync(path.join(testdata, ...deler), "utf8");

  // Alt som kan feile, leses før første betalte kall, så ingen kjøringer går tapt.
  const inndata = parListe.map((navn) => ({
    navn,
    body: { cvTekst: les(navn, "cv.txt"), annonse: les(navn, "annonse.txt") },
    fasit: lesFasit(les(navn, "fasit.md")),
  }));
  const sjekkliste = lesSjekkliste(les("sjekkliste.md"));
  let gitInfo: GitInfo;
  try {
    gitInfo = git();
  } catch {
    gitInfo = { commit: "ukjent", endringer: true };
  }

  const par: ParResultat[] = [];
  for (const { navn, body, fasit } of inndata) {
    const kjoringer: Kjoring[] = [];

    for (let nr = 1; nr <= valg.ganger; nr++) {
      maaler.taSiste();
      const start = performance.now();
      const svar = await generer("gap", body, env, { klienter });
      const varighetMs = Math.round(performance.now() - start);
      const tokens = maaler.taSiste();
      const feilkode = "feil" in svar.json ? svar.json.feil.kode : null;

      kjoringer.push({
        nr,
        status: svar.status,
        feilkode,
        inputTokens: tokens?.inputTokens ?? null,
        outputTokens: tokens?.outputTokens ?? null,
        // Mock-adapteren oppgir ingen versjon. Uten svar er versjonen ukjent (null).
        modellversjon: valg.mock && tokens ? MOCK_VERSJON : (tokens?.modellversjon ?? null),
        varighetMs,
        analyse: feilkode === null ? (svar.json as GapAnalyse) : null,
      });
      console.log(`${navn} kjøring ${nr}/${valg.ganger}: ${svar.status}${feilkode ? ` ${feilkode}` : ""}`);
    }

    par.push({ navn, fasit, kjoringer });
  }

  const { commit, endringer } = gitInfo;
  const data: RapportData = {
    meta: {
      commit,
      endringer,
      leverandor: valg.leverandor,
      modell: valg.modell,
      dato: na().toISOString(),
      prisInn: valg.prisInn,
      prisUt: valg.prisUt,
      ganger: valg.ganger,
      mock: valg.mock,
    },
    sjekkliste,
    par,
  };

  return { rapport: lagRapport(data), data };
}

// Gir utgangskoden. `argv` og `env` er parametere, så testene kan sjekke at
// manglende nøkkel eller ugyldige flagg stopper før noe kall.
export async function main(
  argv: readonly string[] = process.argv.slice(2),
  env: Record<string, string | undefined> = process.env,
  {
    rapportmappe = RAPPORTMAPPE,
    na = () => new Date(),
  }: { rapportmappe?: string; na?: () => Date } = {},
): Promise<number> {
  const tolket = lesArgumenter(argv, kjentePar(), (l) => nokkel(env, l) !== "");
  if (!tolket.ok) {
    console.error(tolket.melding);
    return 1;
  }
  const { valg } = tolket;

  let klient: LlmKlient = mockKlient;
  if (!valg.mock) {
    const variabel = NOKKEL_VARIABEL[valg.leverandor];
    const verdi = nokkel(env, valg.leverandor);
    if (!verdi) {
      console.error(manglerNokkel(valg.leverandor));
      return 1;
    }
    // Bare de tre variablene, aldri hele `process.env`.
    klient = lagEkteKlient({
      LLM_LEVERANDOR: valg.leverandor,
      LLM_MODELL: valg.modell,
      [variabel]: verdi,
    });
  }

  const dato = na();
  const { rapport, data } = await kjorTestsett(valg, klient, { na: () => dato });
  mkdirSync(rapportmappe, { recursive: true });
  const fil = skrivNyRapport(rapportmappe, rapportNavn(valg, dato), rapport);

  const alle = data.par.flatMap((p) => p.kjoringer);
  const feil = alle.filter((k) => k.feilkode !== null).length;
  console.log(`Rapporten er skrevet til ${fil} (${alle.length} kjøringer, ${feil} feil).`);

  // En måling der alle kjøringene feilet, er mislykket og gir utgangskode 1. Rapporten
  // skrives likevel, så feilkodene kan leses (Sondre, PR #14).
  if (alle.length > 0 && feil === alle.length) {
    console.error("Alle kjøringene feilet. Målingen er mislykket. Se feilkodene i rapporten.");
    return 1;
  }
  return 0;
}

// Kjøres bare som skript, ikke når testene importerer filen.
// På Windows kan stasjonsbokstaven ha ulik størrelse (for eksempel `c:` fra Git Bash).
const sti = (s: string) => (process.platform === "win32" ? s.toLowerCase() : s);
if (process.argv[1] && sti(path.resolve(process.argv[1])) === sti(fileURLToPath(import.meta.url))) {
  main().then(
    (kode) => {
      process.exitCode = kode;
    },
    (feil: unknown) => {
      console.error("Testsettet stoppet:", feil instanceof Error ? feil.message : feil);
      process.exitCode = 1;
    },
  );
}
