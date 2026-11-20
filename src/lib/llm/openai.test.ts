import { afterEach, describe, expect, it, vi } from "vitest";

import { lagOpenAiKlient, OPENAI_VALG } from "./openai";

// Ingen test når nettet: `fetch` er byttet ut. Den fanger forespørselen og kaster
// en feil, så kallet stopper før noe svar må tolkes.
afterEach(() => {
  vi.unstubAllGlobals();
});

type Body = { model?: string; store?: boolean; text?: { format?: { strict?: boolean } } };

async function sendtForesporsel(): Promise<{ url: string; body: Body }> {
  let fanget: { url: string; body: Body } | undefined;
  const stoppet = vi.fn(async (url: string | URL | Request, init?: RequestInit) => {
    fanget = { url: String(url), body: JSON.parse(String(init?.body)) };
    throw new TypeError("stoppet i testen");
  });
  vi.stubGlobal("fetch", stoppet);

  await expect(
    lagOpenAiKlient("test-nokkel", "gpt-4.1-mini").analyseGap({
      cvTekst: "CV",
      annonse: "Annonse",
      signal: new AbortController().signal,
    }),
  ).rejects.toThrow("stoppet i testen");

  expect(stoppet).toHaveBeenCalledTimes(1);
  if (!fanget) throw new Error("Ingen forespørsel ble sendt.");
  return fanget;
}

describe("OpenAI-adapteren", () => {
  it("NFR-1: valgene har store: false og strikt JSON-skjema", () => {
    expect(OPENAI_VALG.openai).toMatchObject({ strictJsonSchema: true, store: false });
  });

  it("NFR-1 og AD-3: forespørselen til OpenAI sender store: false og et strikt skjema", async () => {
    const { url, body } = await sendtForesporsel();

    expect(url).toContain("/responses");
    expect(body.model).toBe("gpt-4.1-mini");
    expect(body.store).toBe(false);
    expect(body.text?.format?.strict).toBe(true);
  });
});
