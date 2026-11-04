// @vitest-environment jsdom
import { act, cleanup, render, screen } from "@testing-library/react";
import { afterEach, describe, expect, it, vi } from "vitest";

import { Demomodus } from "@/components/Demomodus";
import { Personvernbekreftelse } from "@/components/Personvernbekreftelse";
import { Personvernboks } from "@/components/Personvernboks";

import { OktProvider } from "./OktProvider";

const DEMO = {
  modus: "demo",
  leverandor: { navn: "Mistral AI", land: "Frankrike", tredjeland: false },
};

async function monter(svar: () => Promise<Response>) {
  vi.stubGlobal("fetch", vi.fn(svar));

  render(
    <OktProvider>
      <Demomodus />
      <Personvernboks />
      <Personvernbekreftelse />
    </OktProvider>,
  );

  // Lar hentingen og tilstandsendringen bli ferdig.
  await act(async () => {
    await new Promise((ferdig) => setTimeout(ferdig));
  });
}

afterEach(() => {
  cleanup();
  vi.unstubAllGlobals();
});

describe("OktProvider", () => {
  it("FR-23: montert provider kaller fetch én gang", async () => {
    await monter(async () => Response.json(DEMO));

    expect(fetch).toHaveBeenCalledTimes(1);
    expect(fetch).toHaveBeenCalledWith("/api/status", { cache: "no-store" });
  });

  it("FR-23: demosvar viser banneret, leverandør og land", async () => {
    await monter(async () => Response.json(DEMO));

    expect(screen.getByText(/^Demomodus:/)).toBeTruthy();
    expect(
      screen.getByText("CV-teksten sendes til Mistral AI i Frankrike."),
    ).toBeTruthy();
    expect(screen.getByRole("checkbox")).toBeTruthy();
  });

  it.each([
    ["feilstatus", async () => Response.json(DEMO, { status: 500 })],
    [
      "nettverksfeil",
      async () => {
        throw new TypeError("Failed to fetch");
      },
    ],
  ])(
    "FR-23: %s gir ingen banner, generell tekst og ingen avkrysning",
    async (_navn, svar) => {
      await monter(svar);

      expect(screen.queryByText(/^Demomodus:/)).toBeNull();
      expect(
        screen.getByText("CV-teksten sendes til en ekstern språkmodell."),
      ).toBeTruthy();
      expect(screen.queryByRole("checkbox")).toBeNull();
    },
  );
});
