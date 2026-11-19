import { describe, expect, it, vi } from "vitest";

// AD-8: sjekker at AI SDK faktisk sender `reasoning_effort` i forespørselen til
// Mistral. `fetch` er falsk, så ingen test når nettet.
const kropper: Record<string, unknown>[] = [];

vi.mock("@ai-sdk/mistral", async (original) => {
  const ekte = await original<typeof import("@ai-sdk/mistral")>();
  return {
    ...ekte,
    createMistral: (valg: Parameters<typeof ekte.createMistral>[0]) =>
      ekte.createMistral({
        ...valg,
        fetch: async (_url, init) => {
          kropper.push(JSON.parse(String(init?.body)));
          return new Response(
            JSON.stringify({
              id: "1",
              object: "chat.completion",
              created: 0,
              model: "mistral-large-4-0",
              choices: [
                {
                  index: 0,
                  message: {
                    role: "assistant",
                    content: JSON.stringify({ stilling: "", arbeidsgiver: "", krav: [], nokkelord: [] }),
                  },
                  finish_reason: "stop",
                },
              ],
              usage: { prompt_tokens: 10, completion_tokens: 5, total_tokens: 15 },
            }),
            { status: 200, headers: { "content-type": "application/json" } },
          );
        },
      }),
  };
});

const { lagMistralKlient, RESONNERING_MODELLER, resonnering } = await import("./mistral");

describe("forespørselen til Mistral", () => {
  it.each(RESONNERING_MODELLER.map((m) => [m, resonnering(m)]))("AD-8: %s sender reasoning_effort %s", async (modell, innsats) => {
    kropper.length = 0;
    await lagMistralKlient("x", modell).analyseGap({
      cvTekst: "CV",
      annonse: "Annonse",
      signal: new AbortController().signal,
    });

    expect(kropper).toHaveLength(1);
    expect(kropper[0]).toMatchObject({ model: modell, reasoning_effort: innsats });
  });

  it.each(["mistral-small-latest", "mistral-large-latest"])("AD-8: %s sender ingen reasoning_effort", async (modell) => {
    kropper.length = 0;
    await lagMistralKlient("x", modell).analyseGap({
      cvTekst: "CV",
      annonse: "Annonse",
      signal: new AbortController().signal,
    });

    expect(kropper).toHaveLength(1);
    expect(kropper[0]).not.toHaveProperty("reasoning_effort");
  });
});
