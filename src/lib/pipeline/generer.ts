import "server-only";

import { kontrollerKrav } from "@/lib/kjerne/belegg";
import { erDemoeksempel } from "@/lib/kjerne/demo";
import { annonseStatus, cvStatus } from "@/lib/kjerne/grenser";
import { masker } from "@/lib/kjerne/masker";
import { finnNokkelord, treffprosent } from "@/lib/kjerne/treffprosent";
import { FEIL_STATUS, type Feilkode, type FeilSvar } from "@/lib/kontrakt/feil";
import { type GapAnalyse, gapSvar } from "@/lib/kontrakt/gap";
import { genererBody, resultatdel as resultatdelSkjema } from "@/lib/kontrakt/generer";
import type { Resultatdel } from "@/lib/kontrakt/generer";
import { ekteKlient, type LlmKlient } from "@/lib/llm/klient";
import { mockKlient } from "@/lib/llm/mock";

import { lagStatus } from "./status";

export type Klienter = { mock: LlmKlient; ekte: LlmKlient };

export type GenererSvar = { status: number; json: GapAnalyse | FeilSvar };

type Env = Record<string, string | undefined>;

const STANDARD_KLIENTER: Klienter = { mock: mockKlient, ekte: ekteKlient };

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

// AD-4: én pipeline i fast rekkefølge. Alt etter `masker` bruker den kanoniske
// CV-teksten. Hver generering gir én logglinje med bare metadata (AD-10).
export async function generer(
  resultatdel: string,
  body: unknown,
  env: Env,
  klienter: Klienter = STANDARD_KLIENTER,
): Promise<GenererSvar> {
  const start = performance.now();
  const modus = lagStatus(env).modus;
  const del = resultatdelSkjema.safeParse(resultatdel);
  const tokens = { inputTokens: null as number | null, outputTokens: null as number | null };

  let svar: GenererSvar;
  let feilkode: Feilkode | null = null;
  try {
    if (!del.success) throw new GenereringsFeil("ugyldig_inndata");
    svar = { status: 200, json: await kjor(del.data, body, modus, klienter, tokens) };
  } catch (feil) {
    feilkode =
      feil instanceof GenereringsFeil
        ? feil.kode
        : erTidsavbrudd(feil)
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

async function kjor(
  resultatdel: Resultatdel,
  body: unknown,
  modus: "demo" | "ekte",
  klienter: Klienter,
  tokens: { inputTokens: number | null; outputTokens: number | null },
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
    // Rate-limit kommer i story 2.3.
    klient = klienter.ekte;
  }

  // 4. Adapteren.
  const radt = await klient.analyseGap({ cvTekst: kanonisk, annonse });
  tokens.inputTokens = radt.inputTokens;
  tokens.outputTokens = radt.outputTokens;

  // 5. Svarskjemaet.
  const parsed = gapSvar.safeParse(radt.svar);
  if (!parsed.success) throw new GenereringsFeil("ugyldig_svar");
  const gap = parsed.data;

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
