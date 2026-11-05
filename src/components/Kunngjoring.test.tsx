// @vitest-environment jsdom
import { cleanup, fireEvent, render, screen } from "@testing-library/react";
import { renderToStaticMarkup } from "react-dom/server";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

import { OktProvider, useOkt } from "@/lib/okt/OktProvider";
import { startTilstand, type OktHandling } from "@/lib/okt/tilstand";

import { Kunngjoring } from "./Kunngjoring";

// Sender handlinger gjennom knapper, så testen bruker økt-tilstanden slik appen gjør.
function Sender({ handlinger }: { handlinger: OktHandling[] }) {
  const { dispatch } = useOkt();

  return (
    <>
      {handlinger.map((handling, nr) => (
        <button key={nr} type="button" onClick={() => dispatch(handling)}>
          {`handling ${nr}`}
        </button>
      ))}
    </>
  );
}

const HANDLINGER: OktHandling[] = [
  { type: "cvLimtInn", cvTekst: "01019012345" },
  { type: "cvEndret", cvTekst: "01019012345" },
  { type: "cvForlatt" },
];

function vis() {
  return render(
    <OktProvider>
      <Sender handlinger={HANDLINGER} />
      <Kunngjoring />
    </OktProvider>,
  );
}

function trykk(nr: number) {
  fireEvent.click(screen.getByText(`handling ${nr}`));
}

beforeEach(() => {
  vi.stubGlobal(
    "fetch",
    vi.fn(() => new Promise<Response>(() => {})),
  );
});

afterEach(() => {
  cleanup();
  vi.unstubAllGlobals();
});

describe("Kunngjoring", () => {
  it("UX-DR23: regionen er polite og står i DOM-en også uten melding", () => {
    const html = renderToStaticMarkup(
      <OktProvider startTilstand={startTilstand}>
        <Kunngjoring />
      </OktProvider>,
    );

    expect(html).toBe(
      '<div aria-live="polite" aria-atomic="true" class="sr-only"></div>',
    );
  });

  it("FR-6: viser meldingen om maskering", () => {
    const { container } = vis();

    trykk(0);

    expect(container.querySelector("[aria-live]")?.textContent).toBe(
      "1 fødselsnummer er fjernet fra CV-teksten.",
    );
  });

  it("UX-DR23: samme melding to ganger gir et nytt element", () => {
    const { container } = vis();

    trykk(0);
    const forste = container.querySelector("[aria-live] span");
    trykk(1);
    trykk(2);
    const andre = container.querySelector("[aria-live] span");

    expect(andre?.textContent).toBe(forste?.textContent);
    expect(andre).not.toBe(forste);
  });

  it("UX-DR23: det finnes bare én live-region", () => {
    const { container } = vis();

    expect(container.querySelectorAll("[aria-live]")).toHaveLength(1);
  });
});
