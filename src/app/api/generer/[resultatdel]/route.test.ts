import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

import { DEMO_ANNONSE, DEMO_CV } from "@/lib/kontrakt/demo";

import { dynamic, maxDuration, POST } from "./route";

beforeEach(() => {
  vi.stubEnv("LLM_LEVERANDOR", "");
  vi.stubEnv("MISTRAL_API_KEY", "");
  vi.stubEnv("OPENAI_API_KEY", "");
  vi.spyOn(console, "log").mockImplementation(() => {});
});

afterEach(() => {
  vi.unstubAllEnvs();
  vi.restoreAllMocks();
});

function post(resultatdel: string, body: string) {
  return POST(
    new Request(`http://localhost/api/generer/${resultatdel}`, {
      method: "POST",
      headers: { "content-type": "application/json" },
      body,
    }),
    { params: Promise.resolve({ resultatdel }) },
  );
}

describe("POST /api/generer/[resultatdel]", () => {
  it("AD-5: ruten er dynamisk og har maxDuration 60", () => {
    expect(dynamic).toBe("force-dynamic");
    expect(maxDuration).toBe(60);
  });

  it("FR-26: demoeksempelet gir 200 og gap-analysen med treffprosent 22", async () => {
    const svar = await post(
      "gap",
      JSON.stringify({ cvTekst: DEMO_CV, annonse: DEMO_ANNONSE }),
    );

    expect(svar.status).toBe(200);
    const json = await svar.json();
    expect(json.krav).toHaveLength(6);
    expect(json.treffprosent).toBe(22);
  });

  it("FR-24: egen CV uten nøkkel gir 403 demo_krever_nokkel", async () => {
    const svar = await post(
      "gap",
      JSON.stringify({ cvTekst: "Min egen CV", annonse: DEMO_ANNONSE }),
    );

    expect(svar.status).toBe(403);
    await expect(svar.json()).resolves.toEqual({
      feil: { kode: "demo_krever_nokkel" },
    });
  });

  it("AD-8: body som ikke er JSON, gir 400 ugyldig_inndata", async () => {
    const svar = await post("gap", "{ikke json");

    expect(svar.status).toBe(400);
    await expect(svar.json()).resolves.toEqual({
      feil: { kode: "ugyldig_inndata" },
    });
  });

  it("AD-5: brev gir 400 ugyldig_inndata", async () => {
    const svar = await post(
      "brev",
      JSON.stringify({ cvTekst: DEMO_CV, annonse: DEMO_ANNONSE }),
    );

    expect(svar.status).toBe(400);
    await expect(svar.json()).resolves.toEqual({
      feil: { kode: "ugyldig_inndata" },
    });
  });
});
