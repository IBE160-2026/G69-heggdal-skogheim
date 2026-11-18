import "server-only";

import { kontrollerKrav } from "@/lib/kjerne/belegg";
import { erDemoeksempel } from "@/lib/kjerne/demo";
import { annonseStatus, cvStatus } from "@/lib/kjerne/grenser";
import { masker } from "@/lib/kjerne/masker";
import { finnNokkelord, ord, treffprosent } from "@/lib/kjerne/treffprosent";
import { FEIL_STATUS, type Feilkode, type FeilSvar } from "@/lib/kontrakt/feil";
import {
  type GapAnalyse,
  type GapSvar,
  gapSvar,
  GRUNNLAG_GRENSER,
  type NokkelordSvar,
} from "@/lib/kontrakt/gap";
import { genererBody, resultatdel as resultatdelSkjema } from "@/lib/kontrakt/generer";
import type { Resultatdel } from "@/lib/kontrakt/generer";
import { lagEkteKlient, type LlmKlient, type LlmSvar } from "@/lib/llm/klient";
import { mockKlient } from "@/lib/llm/mock";

import { taPlass } from "./grense";
import { lagStatus } from "./status";

export type Klienter = { mock: LlmKlient; ekte: LlmKlient };

export type GenererValg = {
  // `request.signal`. Kombineres med tidsgrensen for språkmodellen (AD-8).
  signal?: AbortSignal;
  // Tester injiserer klienter, så ingen nettverkskall skjer.
  klienter?: Klienter;
};

export type GenererSvar = { status: number; json: GapAnalyse | FeilSvar };

type Env = Record<string, string | undefined>;

// AD-8: adapteren får 45 s. Plattformen stopper funksjonen etter 60 s.
export const LLM_TIDSGRENSE_MS = 45_000;

class GenereringsFeil extends Error {
  constructor(readonly kode: Feilkode) {
    super(kode);
  }
}

function erTidsavbrudd(feil: unknown): boolean {
  return (
    feil instanceof Error &&
    (feil.name === "TimeoutError" || feil.name === "AbortError")
  );
}

type Tokens = {
  inputTokens: number | null;
  outputTokens: number | null;
  // Settes når signalet til adapteren er avbrutt, så feilen blir `llm_tidsavbrudd`
  // uansett hvordan adapteren pakker den inn.
  avbrutt: boolean;
};

// AD-4: én pipeline i fast rekkefølge. Alt etter `masker` bruker den kanoniske
// CV-teksten. Hver generering gir én logglinje med bare metadata (AD-10).
export async function generer(
  resultatdel: string,
  body: unknown,
  env: Env,
  { signal, klienter }: GenererValg = {},
): Promise<GenererSvar> {
  const start = performance.now();
  const modus = lagStatus(env).modus;
  const del = resultatdelSkjema.safeParse(resultatdel);
  const tokens: Tokens = { inputTokens: null, outputTokens: null, avbrutt: false };

  let svar: GenererSvar;
  let feilkode: Feilkode | null = null;
  try {
    if (!del.success) throw new GenereringsFeil("ugyldig_inndata");
    svar = {
      status: 200,
      json: await kjor(del.data, body, modus, {
        env,
        klienter: klienter ?? { mock: mockKlient, ekte: lagEkteKlient(env) },
        signal,
        tokens,
      }),
    };
  } catch (feil) {
    feilkode =
      feil instanceof GenereringsFeil
        ? feil.kode
        : tokens.avbrutt || erTidsavbrudd(feil)
          ? "llm_tidsavbrudd"
          : "llm_feil";
    svar = { status: FEIL_STATUS[feilkode], json: { feil: { kode: feilkode } } };
  }

  console.log(
    JSON.stringify({
      // En ukjent resultatdel kommer fra brukeren og logges ikke.
      resultatdel: del.success ? del.data : null,
      modus,
      status: svar.status,
      varighetMs: Math.round(performance.now() - start),
      inputTokens: tokens.inputTokens,
      outputTokens: tokens.outputTokens,
      feilkode,
    }),
  );

  return svar;
}

type Kontekst = {
  env: Env;
  klienter: Klienter;
  signal: AbortSignal | undefined;
  tokens: Tokens;
};

// FR-12: like nøkkelord (små og store bokstaver, bindestrek og tegnsetting) telles
// én gang, og den første beholdes. Nøkkelord uten ord fjernes.
function utenDuplikater(nokkelord: readonly NokkelordSvar[]): NokkelordSvar[] {
  const sett = new Set<string>();

  return nokkelord.filter(({ tekst }) => {
    const nokkel = ord(tekst).join(" ");
    if (!nokkel || sett.has(nokkel)) return false;
    sett.add(nokkel);
    return true;
  });
}

// Et svar over `GRUNNLAG_GRENSER` avvises i stedet for å kuttes, så ingen krav
// skjules for brukeren uten at det synes.
function innenforGrensene({ krav, nokkelord }: GapSvar): boolean {
  const g = GRUNNLAG_GRENSER;

  return (
    krav.length <= g.krav &&
    krav.every(
      (k) =>
        k.tekst.length <= g.kravTekst &&
        k.belegg.length <= g.belegg &&
        k.belegg.every((b) => b.length <= g.beleggTekst),
    ) &&
    nokkelord.length <= g.nokkelord &&
    nokkelord.every((n) => n.tekst.length <= g.nokkelordTekst)
  );
}

async function kjor(
  resultatdel: Resultatdel,
  body: unknown,
  modus: "demo" | "ekte",
  { env, klienter, signal, tokens }: Kontekst,
): Promise<GapAnalyse> {
  // Brev, CV og ATS bygges i epic 3 og 4.
  if (resultatdel !== "gap") throw new GenereringsFeil("ugyldig_inndata");

  // 1. Inndata og lengder (FR-4).
  const inndata = genererBody.safeParse(body);
  if (!inndata.success) throw new GenereringsFeil("ugyldig_inndata");
  const { cvTekst, annonse, demo } = inndata.data;
  const cv = cvStatus(cvTekst);
  const ann = annonseStatus(annonse);
  if (cv === "for_lang" || ann === "for_lang") {
    throw new GenereringsFeil("for_lang_tekst");
  }
  if (cv === "tom" || ann === "tom" || ann === "for_kort") {
    throw new GenereringsFeil("for_kort_tekst");
  }

  // 2. Den kanoniske CV-teksten (AD-13).
  const kanonisk = masker(cvTekst);

  // 3. Mock bare for demoeksempelet, i begge modi (AD-5).
  let klient: LlmKlient;
  if (erDemoeksempel(kanonisk, annonse)) {
    klient = klienter.mock;
  } else if (modus === "demo") {
    throw new GenereringsFeil("demo_krever_nokkel");
  } else if (demo) {
    throw new GenereringsFeil("ugyldig_inndata");
  } else {
    // D. Rate-limit (AD-9): hver ekte generering telles før adapteren, uansett
    // utfall. Demo telles ikke, og en avvist generering telles ikke.
    // En request som allerede er avbrutt, tar ingen plass.
    if (signal?.aborted) throw new GenereringsFeil("llm_tidsavbrudd");
    if (!taPlass(env)) throw new GenereringsFeil("grense_naadd");
    klient = klienter.ekte;
  }

  // 4. Adapteren, med request.signal og tidsgrensen (AD-8).
  const tidsgrense = AbortSignal.timeout(LLM_TIDSGRENSE_MS);
  const llmSignal = signal ? AbortSignal.any([signal, tidsgrense]) : tidsgrense;
  let radt: LlmSvar;
  try {
    radt = await klient.analyseGap({ cvTekst: kanonisk, annonse, signal: llmSignal });
  } catch (feil) {
    tokens.avbrutt = llmSignal.aborted;
    throw feil;
  }
  tokens.inputTokens = radt.inputTokens;
  tokens.outputTokens = radt.outputTokens;

  // 5. Svarskjemaet, nøkkelord uten duplikater og grensene (FR-12).
  const parsed = gapSvar.safeParse(radt.svar);
  if (!parsed.success) throw new GenereringsFeil("ugyldig_svar");
  const gap = { ...parsed.data, nokkelord: utenDuplikater(parsed.data.nokkelord) };
  if (!innenforGrensene(gap)) throw new GenereringsFeil("ugyldig_svar");

  // 6. Beleggkontroll (FR-9, AD-14).
  const { krav, fjernetBelegg } = kontrollerKrav(gap.krav, kanonisk);

  // 7. Treffprosent (FR-12). En kravIndeks utenfor kravene blir null.
  const nokkelord = finnNokkelord(
    gap.nokkelord.map(({ tekst, kravIndeks }) => ({
      tekst,
      kravIndeks:
        kravIndeks !== null &&
        Number.isInteger(kravIndeks) &&
        kravIndeks >= 0 &&
        kravIndeks < krav.length
          ? kravIndeks
          : null,
    })),
    kanonisk,
  );

  return {
    stilling: gap.stilling,
    arbeidsgiver: gap.arbeidsgiver,
    krav,
    nokkelord,
    treffprosent: treffprosent(nokkelord),
    fjernetBelegg,
  };
}
