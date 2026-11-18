// @vitest-environment jsdom
import { readFileSync } from "node:fs";

import {
  act,
  cleanup,
  fireEvent,
  render,
  screen,
} from "@testing-library/react";
import { renderToStaticMarkup } from "react-dom/server";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

import type { Modus } from "@/lib/kontrakt/status";
import { OktProvider } from "@/lib/okt/OktProvider";
import { startTilstand, type OktTilstand } from "@/lib/okt/tilstand";

import { AnalyserKnapp, DEMO_VARSEL_ID } from "./AnalyserKnapp";
import { ANALYSER_ID, CvPanel } from "./CvPanel";

const VARSEL =
  "Full analyse av din egen CV krever en API-nøkkel. Prøv eksempelet for å se hvordan resultatet ser ut.";
const FJERNET = "[fødselsnummer fjernet]";
const DEMO_CV = readFileSync("testdata/par-1-butikk-bank/cv.txt", "utf8");
const DEMO_ANNONSE = readFileSync(
  "testdata/par-1-butikk-bank/annonse.txt",
  "utf8",
);

function vis(tilstand: OktTilstand) {
  return renderToStaticMarkup(
    <OktProvider startTilstand={tilstand}>
      <AnalyserKnapp />
    </OktProvider>,
  );
}

const KLAR: OktTilstand = {
  okt: { ...startTilstand.okt, bekreftetPersonvern: true },
  innhold: {
    utkast: { cvTekst: "CV-tekst", annonse: "a".repeat(200) },
    cvFil: null,
    demoVarsel: null,
  },
  kunngjoring: null,
};

describe("AnalyserKnapp", () => {
  it("FR-4: uten vilkår er knappen aria-disabled, men kan få fokus", () => {
    const html = vis(startTilstand);

    expect(html).toContain('aria-disabled="true"');
    expect(html).toContain('aria-describedby="analyser-arsaker"');
    expect(html).not.toMatch(/\sdisabled(=|>|\s)/);
    expect(html).not.toContain('tabindex="-1"');
  });

  it("FR-4: årsakene står i listen i riktig rekkefølge", () => {
    expect(vis(startTilstand)).toMatch(
      /<ul id="analyser-arsaker"[^>]*><li>Last opp eller lim inn CV-en din\.<\/li><li>Lim inn annonsen\.<\/li><li>Kryss av for personvern\.<\/li><\/ul>/,
    );
  });

  it("FR-4: årsaken om CV står alltid før annonse og avkrysning", () => {
    const html = vis({
      ...startTilstand,
      innhold: {
        utkast: { cvTekst: "", annonse: "a".repeat(8001) },
        cvFil: null,
        demoVarsel: null,
      },
    });

    expect(html).toContain(
      "<li>Last opp eller lim inn CV-en din.</li><li>Annonsen kan være maks 8 000 tegn.</li>",
    );
  });

  it("FR-4: med alle vilkår oppfylt er knappen aktiv uten årsaker", () => {
    const html = vis(KLAR);

    expect(html).not.toContain('aria-disabled="');
    expect(html).not.toContain("aria-describedby");
    expect(html).not.toContain("<ul");
  });

  it("UX-DR1: knappen har ikke redusert opasitet og beholder full tekstkontrast", () => {
    const html = vis(startTilstand);

    expect(html).not.toContain("opacity-");
    expect(html).toContain("aria-disabled:bg-primary/50");
    expect(html).toContain("aria-disabled:text-foreground");
  });

  it("FR-26: uten trykk vises ikke varselet", () => {
    expect(vis(KLAR)).not.toContain(DEMO_VARSEL_ID);
  });
});

describe("AnalyserKnapp i demomodus", () => {
  let fetchMock: ReturnType<typeof vi.fn>;
  let modus: Modus = "demo";

  beforeEach(() => {
    modus = "demo";
    fetchMock = vi.fn(async () =>
      Response.json({
        modus,
        leverandor: { navn: "Mistral AI", land: "Frankrike", tredjeland: false },
      }),
    );
    vi.stubGlobal("fetch", fetchMock);
  });

  afterEach(() => {
    cleanup();
    vi.unstubAllGlobals();
  });

  // Statusen hentes fra /api/status som i appen, så modus settes av den.
  async function monter(cvTekst: string, annonse = "a".repeat(200)) {
    const start: OktTilstand = {
      ...startTilstand,
      okt: { ...startTilstand.okt, bekreftetPersonvern: true },
      innhold: { ...startTilstand.innhold, utkast: { cvTekst, annonse } },
    };
    await act(async () => {
      render(
        <OktProvider startTilstand={start}>
          <CvPanel />
          <AnalyserKnapp />
        </OktProvider>,
      );
    });
    expect(fetchMock).toHaveBeenCalledWith("/api/status", expect.anything());
  }

  function analyser() {
    return document.getElementById(ANALYSER_ID) as HTMLButtonElement;
  }

  function varsel() {
    return document.getElementById(DEMO_VARSEL_ID);
  }

  function bareStatusKall() {
    for (const [url] of fetchMock.mock.calls) {
      expect(String(url)).not.toContain("/api/generer");
      expect(url).toBe("/api/status");
    }
  }

  it("FR-26: egen CV gir varselet over Analyser, fokus på varselet og ingen request", async () => {
    await monter("Kari Nordmann\nKundeservice i fem år.");
    analyser().focus();

    fireEvent.click(analyser());

    const alert = varsel();
    expect(alert?.textContent).toBe(VARSEL);
    expect(alert?.getAttribute("data-slot")).toBe("alert");
    // Fokus flyttes hit, så varselet skal ikke også være en live-region.
    expect(alert?.hasAttribute("role")).toBe(false);
    expect(alert?.getAttribute("tabindex")).toBe("-1");
    expect(document.activeElement).toBe(alert);
    // Varselet står rett over knappen.
    expect(alert?.nextElementSibling).toBe(analyser());
    expect(screen.getByLabelText("CV-tekst")).toBeTruthy();
    bareStatusKall();
  });

  it("UX-DR24: nytt trykk beholder varselet og flytter fokus dit igjen", async () => {
    await monter("Kari Nordmann");
    fireEvent.click(analyser());
    const forste = varsel();

    analyser().focus();
    expect(document.activeElement).toBe(analyser());
    fireEvent.click(analyser());

    expect(varsel()).toBe(forste);
    expect(document.activeElement).toBe(forste);
    bareStatusKall();
  });

  it("FR-26: varselet forsvinner når CV-teksten endres", async () => {
    await monter("Kari Nordmann");
    fireEvent.click(analyser());
    expect(varsel()).not.toBeNull();

    fireEvent.change(screen.getByLabelText("CV-tekst"), {
      target: { value: "Kari Nordmann, Molde" },
    });

    expect(varsel()).toBeNull();
  });

  it("FR-26: demoeksempelet gir ikke varselet", async () => {
    await monter(DEMO_CV.replace(/\n/g, "\r\n"), DEMO_ANNONSE);

    fireEvent.click(analyser());

    expect(varsel()).toBeNull();
    bareStatusKall();
  });

  it("FR-26: ekte modus gir ikke varselet", async () => {
    modus = "ekte";
    await monter("Kari Nordmann");

    fireEvent.click(analyser());

    expect(varsel()).toBeNull();
    bareStatusKall();
  });

  it("FR-6: nytt fødselsnummer maskeres først, og andre trykk gir varselet", async () => {
    await monter("Kari Nordmann 01019012345");
    const felt = screen.getByLabelText("CV-tekst") as HTMLTextAreaElement;

    fireEvent.click(analyser());
    expect(felt.value).toBe(`Kari Nordmann ${FJERNET}`);
    expect(varsel()).toBeNull();

    fireEvent.click(analyser());
    expect(varsel()?.textContent).toBe(VARSEL);
    bareStatusKall();
  });

  it("FR-4: deaktivert Analyser gir ikke varselet", async () => {
    await monter("Kari Nordmann", "for kort");

    expect(analyser().getAttribute("aria-disabled")).toBe("true");
    fireEvent.click(analyser());

    expect(varsel()).toBeNull();
  });
});
