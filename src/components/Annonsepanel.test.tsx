// @vitest-environment jsdom
import { cleanup, fireEvent, render, screen } from "@testing-library/react";
import { renderToStaticMarkup } from "react-dom/server";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

import { OktProvider } from "@/lib/okt/OktProvider";
import { startTilstand } from "@/lib/okt/tilstand";

import { AnalyserKnapp } from "./AnalyserKnapp";
import { Annonsepanel } from "./Annonsepanel";

const NBSP = " ";
const KORT = "Annonsen er for kort. Minst 200 tegn.";
const LANG = `Annonsen er for lang. Maks 8${NBSP}000 tegn.`;
const BESKRIVELSE = "annonse-hjelp annonse-teller";

function vis(annonse: string) {
  return renderToStaticMarkup(
    <OktProvider
      startTilstand={{
        ...startTilstand,
        innhold: { utkast: { cvTekst: "", annonse } },
      }}
    >
      <Annonsepanel />
    </OktProvider>,
  );
}

function monter() {
  render(
    <OktProvider>
      <Annonsepanel />
      <AnalyserKnapp />
    </OktProvider>,
  );

  return screen.getByLabelText("Annonse");
}

function skriv(felt: HTMLElement, tekst: string) {
  fireEvent.change(felt, { target: { value: tekst } });
}

function arsaker() {
  return screen.getAllByRole("listitem").map((li) => li.textContent);
}

beforeEach(() => {
  // Status holdes ventende, så bare handlingene i testen endrer tilstanden.
  vi.stubGlobal("fetch", vi.fn(() => new Promise(() => {})));
});

afterEach(() => {
  cleanup();
  vi.unstubAllGlobals();
});

describe("Annonsepanel, markup", () => {
  it("FR-4: har overskrift, etikett, hjelpetekst og teller", () => {
    const html = vis("");

    expect(html).toContain(">Stillingsannonse</h2>");
    expect(html).toMatch(/<label[^>]*for="annonse"[^>]*>Annonse<\/label>/);
    expect(html).toContain("Lim inn hele annonsen");
    expect(html).toContain(`0 tegn (200–8${NBSP}000)`);
  });

  it("UX-DR1: text-label erstatter skriftstørrelsen på etiketten", () => {
    const etikett = vis("").match(/<label[^>]*class="([^"]*)"/)?.[1];

    expect(etikett).toContain("text-label");
    expect(etikett).not.toContain("text-sm");
    expect(etikett).not.toContain("leading-none");
  });

  it("FR-4: telleren er knyttet til feltet, men er ikke live-region", () => {
    const html = vis("a".repeat(50));

    expect(html).toContain(`aria-describedby="${BESKRIVELSE}"`);
    expect(html).toContain('id="annonse-teller"');
    expect(html).not.toContain("aria-live");
  });

  it("FR-4: feltet har autoComplete av", () => {
    expect(vis("")).toContain('autoComplete="off"');
  });

  it("NFR-1: feltet har stavekontroll av", () => {
    expect(monter().getAttribute("spellcheck")).toBe("false");
  });

  it("FR-4: telleren måler etter trim og skiller tusen med hardt mellomrom", () => {
    expect(vis(`  ${"a".repeat(50)}  `)).toContain(`50 tegn (200–8${NBSP}000)`);
    expect(vis("a".repeat(8001))).toContain(`8${NBSP}001 tegn (200–8${NBSP}000)`);
  });

  it("FR-4: tomt felt viser ingen feil", () => {
    const html = vis("   ");

    expect(html).not.toContain('aria-invalid="');
    expect(html).not.toContain(KORT);
    expect(html).toContain(`aria-describedby="${BESKRIVELSE}"`);
  });

  it("FR-4: for lang tekst er ugyldig med en gang og kuttes ikke", () => {
    const tekst = "a".repeat(8001);
    const html = vis(tekst);

    expect(html).toContain('aria-invalid="true"');
    expect(html).toContain(`aria-describedby="${BESKRIVELSE} annonse-feil"`);
    expect(html).toContain(LANG);
    expect(html).toMatch(new RegExp(`text-destructive">8${NBSP}001 tegn`));
    expect(html).toContain(`>${tekst}</textarea>`);
  });

  it.each([200, 8000])("FR-4: %i tegn er gyldig", (lengde) => {
    const html = vis("a".repeat(lengde));

    expect(html).not.toContain('aria-invalid="');
    expect(html).not.toContain("annonse-feil");
  });
});

describe("Annonsepanel, handlinger", () => {
  it("FR-4: skriving oppdaterer felt, teller og årsaker", () => {
    const felt = monter();

    expect(arsaker()).toContain("Lim inn annonsen.");

    skriv(felt, "a".repeat(50));

    expect(felt).toHaveProperty("value", "a".repeat(50));
    expect(document.getElementById("annonse-teller")?.textContent).toBe(
      `50 tegn (200–8${NBSP}000)`,
    );
    expect(arsaker()).toContain("Annonsen må være minst 200 tegn.");
    expect(arsaker()).not.toContain("Lim inn annonsen.");

    skriv(felt, "a".repeat(200));

    expect(arsaker()).toEqual([
      "Last opp eller lim inn CV-en din.",
      "Kryss av for personvern.",
    ]);
  });

  it("FR-4: kort tekst viser ingen feil før feltet forlates", () => {
    const felt = monter();

    skriv(felt, "a".repeat(50));

    expect(felt.getAttribute("aria-invalid")).toBeNull();
    expect(screen.queryByText(KORT)).toBeNull();

    fireEvent.blur(felt);

    expect(felt.getAttribute("aria-invalid")).toBe("true");
    expect(felt.getAttribute("aria-describedby")).toBe(
      `${BESKRIVELSE} annonse-feil`,
    );
    expect(screen.getByText(KORT).className).toContain("text-destructive");
  });

  it("FR-4: tømt felt og ny kort tekst fjerner feilen til neste gang feltet forlates", () => {
    const felt = monter();

    skriv(felt, "a".repeat(50));
    fireEvent.blur(felt);
    expect(screen.getByText(KORT)).toBeTruthy();

    skriv(felt, "");
    expect(screen.queryByText(KORT)).toBeNull();

    skriv(felt, "b".repeat(20));
    expect(screen.queryByText(KORT)).toBeNull();
    expect(felt.getAttribute("aria-invalid")).toBeNull();

    fireEvent.blur(felt);
    expect(screen.getByText(KORT)).toBeTruthy();
  });

  it("FR-4: blur med gyldig tekst gir ingen feil når teksten så blir kort", () => {
    const felt = monter();

    skriv(felt, "a".repeat(200));
    fireEvent.blur(felt);
    skriv(felt, "a".repeat(199));

    expect(screen.queryByText(KORT)).toBeNull();
    expect(felt.getAttribute("aria-invalid")).toBeNull();
  });

  it("FR-4: tomt felt som forlates gir ingen feil", () => {
    const felt = monter();

    fireEvent.blur(felt);

    expect(felt.getAttribute("aria-invalid")).toBeNull();
    expect(screen.queryByText(KORT)).toBeNull();
  });
});
