import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it } from "vitest";

import { OktProvider } from "@/lib/okt/OktProvider";
import { startTilstand } from "@/lib/okt/tilstand";

import { Demomodus } from "./Demomodus";
import { Forberedelse } from "./Forberedelse";

const html = renderToStaticMarkup(
  <OktProvider
    startTilstand={{
      ...startTilstand,
      okt: {
        ...startTilstand.okt,
        modus: "demo",
        leverandor: { navn: "Mistral AI", land: "Frankrike", tredjeland: false },
      },
    }}
  >
    <Demomodus />
    <Forberedelse />
  </OktProvider>,
);

describe("Forberedelse", () => {
  it("NFR-8: rekkefølgen i DOM-en er lik den visuelle", () => {
    const rekkefolge = [
      "Demomodus:",
      "<header",
      "<h1",
      "Se hva CV-en din dekker i en stillingsannonse",
      "Last opp CV-en og lim inn annonsen. Du ser krav for krav hva du dekker, og får et utkast til søknadsbrev.",
      "<main",
      "Om personvern",
      ">CV</h2>",
      ">Stillingsannonse</h2>",
      "Jeg har lest informasjonen om personvern.",
      ">Analyser</button>",
      "Last opp eller lim inn CV-en din.",
    ].map((tekst) => html.indexOf(tekst));

    expect(rekkefolge).not.toContain(-1);
    expect(rekkefolge).toEqual([...rekkefolge].sort((a, b) => a - b));
  });

  it("NFR-8: har én h1, header og main, og tre h2", () => {
    expect(html.match(/<h1/g)).toHaveLength(1);
    expect(html.match(/<header/g)).toHaveLength(1);
    expect(html.match(/<main/g)).toHaveLength(1);
    expect(html.match(/<h2/g)).toHaveLength(3);
  });

  it("NFR-8: panelene står side om side fra 1024 px", () => {
    expect(html).toContain("lg:grid-cols-2");
  });

  it("UX-DR1: innholdet har maks bredde fra tokenet", () => {
    expect(html).toContain("max-w-content-max");
  });

  it("FR-1: Prøv med eksempel er ikke bygget ennå", () => {
    expect(html).not.toContain("Prøv med eksempel");
  });
});
