import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it } from "vitest";

import { OktProvider } from "@/lib/okt/OktProvider";
import { startTilstand } from "@/lib/okt/tilstand";
import type { LeverandorInfo } from "@/lib/kontrakt/status";

import { Personvernboks } from "./Personvernboks";

function vis(leverandor: LeverandorInfo | null) {
  return renderToStaticMarkup(
    <OktProvider
      startTilstand={{
        ...startTilstand,
        okt: { ...startTilstand.okt, leverandor },
      }}
    >
      <Personvernboks />
    </OktProvider>,
  );
}

const EOS = "Det betyr at opplysningene overføres ut av EØS.";

describe("Personvernboks", () => {
  it("FR-5: har overskrift, ikon og de tre punktene", () => {
    const html = vis({ navn: "Mistral AI", land: "Frankrike", tredjeland: false });

    expect(html).toContain(">Om personvern</h2>");
    expect(html).toContain("lucide-shield-check");
    expect(html.match(/<li>/g)).toHaveLength(3);
    expect(html).toContain("<li>CV-teksten sendes til Mistral AI i Frankrike.</li>");
    expect(html).toContain(
      "<li>Ingenting lagres. Alt er borte når du lukker fanen.</li>",
    );
    expect(html).toContain(
      "<li>Du bør fjerne fødselsnummer, adresse, bilde og helseopplysninger før du analyserer.</li>",
    );
  });

  it("FR-5: EU-leverandør gir ingen setning om EØS", () => {
    expect(
      vis({ navn: "Mistral AI", land: "Frankrike", tredjeland: false }),
    ).not.toContain(EOS);
  });

  it("FR-5: tredjeland gir setningen om EØS", () => {
    expect(vis({ navn: "Leverandør", land: "USA", tredjeland: true })).toContain(
      `CV-teksten sendes til Leverandør i USA. ${EOS}`,
    );
  });

  it("FR-5: uten status står den generelle teksten", () => {
    expect(vis(null)).toContain(
      "<li>CV-teksten sendes til en ekstern språkmodell.</li>",
    );
  });

  it("FR-5: kan ikke lukkes og er ikke et varsel", () => {
    const html = vis(null);

    expect(html).not.toContain("<button");
    expect(html).not.toContain('role="alert"');
    expect(html).toContain('data-slot="alert"');
  });
});
