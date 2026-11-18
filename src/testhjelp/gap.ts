// Testhjelp for økt-tilstanden og resultatsiden: demosvaret fra den ekte pipelinen og
// en fetch-mock som svarer som API-et.
import { vi } from "vitest";

import { DEMO_ANNONSE, DEMO_CV } from "@/lib/kontrakt/demo";
import type { GapAnalyse } from "@/lib/kontrakt/gap";
import type { Modus } from "@/lib/kontrakt/status";
import { generer } from "@/lib/pipeline/generer";

// Svaret API-et gir for demoeksempelet: mock-adapteren, beleggkontrollen og treffprosenten.
export async function demoSvar(): Promise<GapAnalyse> {
  const logg = vi.spyOn(console, "log").mockImplementation(() => {});
  try {
    const { status, json } = await generer(
      "gap",
      { cvTekst: DEMO_CV, annonse: DEMO_ANNONSE, demo: true },
      {},
    );
    if (status !== 200 || "feil" in json) throw new Error("Demosvaret feilet.");
    return json;
  } finally {
    logg.mockRestore();
  }
}

type GapSvar = () => Promise<Response> | Response;

// `fetch` som svarer på /api/status og /api/generer/gap. `gap` bestemmer svaret.
export function apiMock(gap: GapSvar, modus: Modus = "demo") {
  return vi.fn(async (url: string | URL | Request, init?: RequestInit) => {
    if (String(url) === "/api/status") {
      return Response.json({
        modus,
        leverandor: { navn: "Mistral AI", land: "Frankrike", tredjeland: false },
      });
    }
    if (String(url) === "/api/generer/gap") {
      init?.signal?.throwIfAborted();
      return gap();
    }
    throw new Error(`Uventet URL: ${String(url)}`);
  });
}

export function gapKall(mock: ReturnType<typeof apiMock>) {
  return mock.mock.calls.filter(([url]) => String(url) === "/api/generer/gap");
}
