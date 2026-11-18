import { afterEach, beforeAll, describe, expect, it, vi } from "vitest";

import type { GapAnalyse } from "@/lib/kontrakt/gap";
import { demoSvar } from "@/testhjelp/gap";

import { hentGenerering } from "./generer";

const BODY = { cvTekst: "CV", annonse: "Annonse", demo: true };

let svar: GapAnalyse;

beforeAll(async () => {
  svar = await demoSvar();
});

afterEach(() => {
  vi.unstubAllGlobals();
});

function medFetch(svar: () => Promise<Response>) {
  const mock = vi.fn(svar);
  vi.stubGlobal("fetch", mock);
  return mock;
}

function hent(signal = new AbortController().signal) {
  return hentGenerering("gap", BODY, signal);
}

describe("hentGenerering", () => {
  it("AD-8: sender POST med JSON-body til ruten for resultatdelen", async () => {
    const mock = medFetch(async () => Response.json(svar));

    await hent();

    const [url, init] = mock.mock.calls[0] as unknown as [string, RequestInit];
    expect(url).toBe("/api/generer/gap");
    expect(init.method).toBe("POST");
    expect(JSON.parse(String(init.body))).toEqual(BODY);
    expect(init.signal).toBeInstanceOf(AbortSignal);
  });

  it("AD-8: gyldig svar gir data", async () => {
    medFetch(async () => Response.json(svar));

    expect(await hent()).toEqual({ ok: true, data: svar });
  });

  it.each([
    ["grense_naadd", 429],
    ["demo_krever_nokkel", 403],
    ["llm_tidsavbrudd", 504],
    ["ugyldig_svar", 502],
  ] as const)("AD-8: { feil: { kode: %s } } gir koden", async (kode, status) => {
    medFetch(async () => Response.json({ feil: { kode } }, { status }));

    expect(await hent()).toEqual({ ok: false, feilkode: kode });
  });

  it("AD-8: 504 uten JSON gir llm_tidsavbrudd", async () => {
    medFetch(async () => new Response("<html>Gateway Timeout</html>", { status: 504 }));

    expect(await hent()).toEqual({ ok: false, feilkode: "llm_tidsavbrudd" });
  });

  it("AD-8: nettverksfeil gir llm_feil", async () => {
    medFetch(async () => {
      throw new TypeError("Failed to fetch");
    });

    expect(await hent()).toEqual({ ok: false, feilkode: "llm_feil" });
  });

  it("AD-8: svar som ikke er JSON, gir llm_feil", async () => {
    medFetch(async () => new Response("ikke json", { status: 200 }));

    expect(await hent()).toEqual({ ok: false, feilkode: "llm_feil" });
  });

  it("AD-8: feilstatus uten feilformat gir llm_feil", async () => {
    medFetch(async () => Response.json({ melding: "x" }, { status: 500 }));

    expect(await hent()).toEqual({ ok: false, feilkode: "llm_feil" });
  });

  it("AD-8: ukjent feilkode gir llm_feil", async () => {
    medFetch(async () =>
      Response.json({ feil: { kode: "ukjent" } }, { status: 500 }),
    );

    expect(await hent()).toEqual({ ok: false, feilkode: "llm_feil" });
  });

  it("AD-8: svar som ikke passer gapAnalyse, gir ugyldig_svar", async () => {
    medFetch(async () => Response.json({ ...svar, treffprosent: "22" }));

    expect(await hent()).toEqual({ ok: false, feilkode: "ugyldig_svar" });
  });

  it("AD-6: avbrudd før svaret gir null", async () => {
    medFetch(async () => {
      throw new DOMException("Avbrutt", "AbortError");
    });
    const kontroller = new AbortController();
    kontroller.abort();

    expect(await hent(kontroller.signal)).toBeNull();
  });

  it("AD-6: avbrudd mens svaret leses, gir null", async () => {
    const kontroller = new AbortController();
    medFetch(async () => {
      kontroller.abort();
      return Response.json(svar);
    });

    expect(await hent(kontroller.signal)).toBeNull();
  });
});
