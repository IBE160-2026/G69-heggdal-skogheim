import { afterEach, describe, expect, it, vi } from "vitest";

import { erDemomodus, hentStatus } from "./status";

const DEMO = {
  modus: "demo",
  leverandor: { navn: "Mistral AI", land: "Frankrike", tredjeland: false },
};

function stubFetch(svar: () => Promise<Response>) {
  vi.stubGlobal("fetch", vi.fn(svar));
}

afterEach(() => {
  vi.unstubAllGlobals();
});

describe("hentStatus", () => {
  it.each(["demo", "ekte"])("FR-23: gir svaret når modus er %s", async (modus) => {
    const forventet = { ...DEMO, modus };
    stubFetch(async () => Response.json(forventet));

    await expect(hentStatus()).resolves.toEqual(forventet);
    expect(fetch).toHaveBeenCalledWith("/api/status", { cache: "no-store" });
  });

  it("FR-23: nettverksfeil gir null", async () => {
    stubFetch(async () => {
      throw new TypeError("Failed to fetch");
    });

    await expect(hentStatus()).resolves.toBeNull();
  });

  it("FR-23: ugyldig JSON gir null", async () => {
    stubFetch(async () => new Response("<html>"));

    await expect(hentStatus()).resolves.toBeNull();
  });

  it("FR-23: svar med feil form gir null", async () => {
    stubFetch(async () => Response.json({ modus: "ukjent" }));

    await expect(hentStatus()).resolves.toBeNull();
  });

  it("FR-23: feilstatus gir null selv med gyldig innhold", async () => {
    stubFetch(async () => Response.json(DEMO, { status: 500 }));

    await expect(hentStatus()).resolves.toBeNull();
  });
});

describe("erDemomodus", () => {
  it("FR-23: demo viser banneret", () => {
    expect(erDemomodus({ modus: "demo" })).toBe(true);
  });

  it("FR-23: ekte viser ikke banneret", () => {
    expect(erDemomodus({ modus: "ekte" })).toBe(false);
  });

  it("FR-23: manglende status viser ikke banneret", () => {
    expect(erDemomodus(null)).toBe(false);
  });
});
