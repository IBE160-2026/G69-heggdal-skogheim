import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it } from "vitest";

import { OktProvider } from "@/lib/okt/OktProvider";
import { startTilstand, type OktTilstand } from "@/lib/okt/tilstand";

import { AnalyserKnapp } from "./AnalyserKnapp";

function vis(tilstand: OktTilstand) {
  return renderToStaticMarkup(
    <OktProvider startTilstand={tilstand}>
      <AnalyserKnapp />
    </OktProvider>,
  );
}

const KLAR: OktTilstand = {
  okt: { ...startTilstand.okt, bekreftetPersonvern: true },
  innhold: { utkast: { cvTekst: "CV-tekst", annonse: "a".repeat(200) } },
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
      innhold: { utkast: { cvTekst: "", annonse: "a".repeat(8001) } },
    });

    expect(html).toContain(
      "<li>Last opp eller lim inn CV-en din.</li><li>Annonsen kan være maks 8\u00a0000 tegn.</li>",
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
});
