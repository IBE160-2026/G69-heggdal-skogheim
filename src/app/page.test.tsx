import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it } from "vitest";

import { OktProvider } from "@/lib/okt/OktProvider";
import { startTilstand, type OktTilstand, type Visning } from "@/lib/okt/tilstand";

import Home from "./page";

function vis(kjoring: boolean, visning: Visning) {
  const tilstand: OktTilstand = {
    ...startTilstand,
    innhold: {
      ...startTilstand.innhold,
      utkast: { cvTekst: "Kari", annonse: "Annonse" },
      kjoring: kjoring
        ? { id: 1, cvTekst: "Kari", annonse: "Annonse", erEksempel: false }
        : null,
    },
    visning,
  };

  return renderToStaticMarkup(
    <OktProvider startTilstand={tilstand}>
      <Home />
    </OktProvider>,
  );
}

const RESULTAT = ">Resultat</h1>";
const FORBEREDELSE = "Se hva CV-en din dekker i en stillingsannonse";

describe("Home", () => {
  it("FR-3: en kjøring og visningen «resultat» gir resultatet", () => {
    const html = vis(true, "resultat");

    expect(html).toContain(RESULTAT);
    expect(html).not.toContain(FORBEREDELSE);
  });

  it("FR-3: en kjøring og visningen «forberedelse» gir forberedelsen", () => {
    const html = vis(true, "forberedelse");

    expect(html).toContain(FORBEREDELSE);
    expect(html).not.toContain(RESULTAT);
  });

  it("FR-3: uten kjøring gir visningen «resultat» forberedelsen", () => {
    const html = vis(false, "resultat");

    expect(html).toContain(FORBEREDELSE);
    expect(html).not.toContain(RESULTAT);
  });
});
