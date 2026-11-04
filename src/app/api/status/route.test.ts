import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

import { dynamic, GET } from "./route";

beforeEach(() => {
  vi.stubEnv("LLM_LEVERANDOR", "");
  vi.stubEnv("MISTRAL_API_KEY", "");
  vi.stubEnv("OPENAI_API_KEY", "");
});

afterEach(() => {
  vi.unstubAllEnvs();
});

describe("GET /api/status", () => {
  it("FR-23: ruten er dynamisk, så modus ikke låses ved bygging", () => {
    expect(dynamic).toBe("force-dynamic");
  });

  it("FR-23: svarer demo uten nøkkel", async () => {
    const svar = GET();

    expect(svar.status).toBe(200);
    await expect(svar.json()).resolves.toEqual({
      modus: "demo",
      leverandor: { navn: "Mistral AI", land: "Frankrike", tredjeland: false },
    });
  });

  it("FR-23: leser miljøet ved hvert kall og svarer ekte med nøkkel", async () => {
    vi.stubEnv("MISTRAL_API_KEY", "x");

    await expect(GET().json()).resolves.toMatchObject({ modus: "ekte" });
  });
});
