// @vitest-environment jsdom
import { cleanup, fireEvent, render, screen } from "@testing-library/react";
import { renderToStaticMarkup } from "react-dom/server";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

import { OktProvider } from "@/lib/okt/OktProvider";
import { startTilstand, type OktTilstand } from "@/lib/okt/tilstand";

import { AnalyserKnapp } from "./AnalyserKnapp";
import { Personvernbekreftelse } from "./Personvernbekreftelse";

const LEVERANDOR = { navn: "Mistral AI", land: "Frankrike", tredjeland: false };
const BEKREFTET =
  "Du har bekreftet at du har lest informasjonen om personvern.";
const VENTER =
  "Avkrysningen vises når informasjonen om språkmodellen er hentet. Last siden på nytt hvis den ikke kommer.";
const KRYSS_ARSAK = "Kryss av for personvern.";

function tilstand(okt: Partial<OktTilstand["okt"]>): OktTilstand {
  return { ...startTilstand, okt: { ...startTilstand.okt, ...okt } };
}

function innhold(start: OktTilstand) {
  return (
    <OktProvider startTilstand={start}>
      <Personvernbekreftelse />
      <AnalyserKnapp />
    </OktProvider>
  );
}

beforeEach(() => {
  // Status holdes ventende, så tilstanden i testen ikke endres underveis.
  vi.stubGlobal("fetch", vi.fn(() => new Promise(() => {})));
});

afterEach(() => {
  cleanup();
  vi.unstubAllGlobals();
});

describe("Personvernbekreftelse, markup", () => {
  it("FR-5: med kjent leverandør står avkrysningen med etikett", () => {
    const html = renderToStaticMarkup(
      innhold(tilstand({ leverandor: LEVERANDOR })),
    );

    expect(html).toContain('role="checkbox"');
    expect(html).toContain('id="personvern"');
    expect(html).toMatch(
      /<label[^>]*for="personvern"[^>]*>Jeg har lest informasjonen om personvern\.<\/label>/,
    );
    expect(html).not.toContain(VENTER);
  });

  it("FR-5: uten leverandør står ventelinjen, uten avkrysning, og årsaken består", () => {
    const html = renderToStaticMarkup(innhold(startTilstand));

    expect(html).not.toContain('role="checkbox"');
    expect(html).toContain(VENTER);
    expect(html).toContain("text-muted-foreground");
    expect(html).toContain(`<li>${KRYSS_ARSAK}</li>`);
  });

  it.each([LEVERANDOR, null])(
    "UX-DR7: etter avkrysning står teksten med ikon (leverandør %j)",
    (leverandor) => {
      const html = renderToStaticMarkup(
        innhold(tilstand({ bekreftetPersonvern: true, leverandor })),
      );

      expect(html).not.toContain('role="checkbox"');
      expect(html).not.toContain("Jeg har lest");
      expect(html).not.toContain(VENTER);
      expect(html).toContain('tabindex="-1"');
      expect(html).toContain("lucide-shield-check");
      expect(html).toContain(BEKREFTET);
    },
  );
});

describe("Personvernbekreftelse, handlinger", () => {
  it("FR-5: avkrysning flytter fokus til teksten og fjerner boksen og årsaken", () => {
    render(innhold(tilstand({ leverandor: LEVERANDOR })));

    expect(screen.getByText(KRYSS_ARSAK)).toBeTruthy();

    fireEvent.click(screen.getByRole("checkbox"));

    expect(document.activeElement).toBe(screen.getByText(BEKREFTET));
    expect(screen.queryByRole("checkbox")).toBeNull();
    expect(screen.queryByText(KRYSS_ARSAK)).toBeNull();
  });

  it("FR-5: montering med samtykke allerede gitt flytter ikke fokus", () => {
    render(
      innhold(tilstand({ bekreftetPersonvern: true, leverandor: LEVERANDOR })),
    );

    expect(screen.getByText(BEKREFTET)).toBeTruthy();
    expect(document.activeElement).toBe(document.body);
  });
});
