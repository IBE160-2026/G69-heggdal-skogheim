import { feilSvar, type Feilkode } from "@/lib/kontrakt/feil";
import { gapAnalyse, type GapAnalyse } from "@/lib/kontrakt/gap";
import type { GenererBody } from "@/lib/kontrakt/generer";

import type { GenerertResultatdel } from "./tilstand";

export type GenereringSvar =
  | { ok: true; data: GapAnalyse }
  | { ok: false; feilkode: Feilkode };

const SKJEMA = { gap: gapAnalyse } as const;

function erAvbrudd(feil: unknown, signal: AbortSignal): boolean {
  return (
    signal.aborted ||
    (feil instanceof Error && feil.name === "AbortError")
  );
}

// AD-8: den eneste fetch-innpakningen for genereringer. `{ feil: { kode } }` gir koden,
// 504 gir `llm_tidsavbrudd`, og nettverksfeil og svar som ikke er JSON gir `llm_feil`.
// Et svar som ikke passer skjemaet, gir `ugyldig_svar`. Et avbrudd gir `null`, så
// svaret forkastes.
export async function hentGenerering(
  resultatdel: GenerertResultatdel,
  body: GenererBody,
  signal: AbortSignal,
): Promise<GenereringSvar | null> {
  let svar: Response;
  let json: unknown;
  try {
    svar = await fetch(`/api/generer/${resultatdel}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
      cache: "no-store",
      signal,
    });
  } catch (feil) {
    if (erAvbrudd(feil, signal)) return null;
    return { ok: false, feilkode: "llm_feil" };
  }

  try {
    json = await svar.json();
  } catch (feil) {
    if (erAvbrudd(feil, signal)) return null;
    json = undefined;
  }
  if (signal.aborted) return null;

  const feil = feilSvar.safeParse(json);
  if (feil.success) return { ok: false, feilkode: feil.data.feil.kode };
  if (svar.status === 504) return { ok: false, feilkode: "llm_tidsavbrudd" };
  if (!svar.ok || json === undefined) return { ok: false, feilkode: "llm_feil" };

  const data = SKJEMA[resultatdel].safeParse(json);
  return data.success
    ? { ok: true, data: data.data }
    : { ok: false, feilkode: "ugyldig_svar" };
}
