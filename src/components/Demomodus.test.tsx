import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it } from "vitest";

import { OktProvider } from "@/lib/okt/OktProvider";
import { startTilstand } from "@/lib/okt/tilstand";
import type { Modus } from "@/lib/kontrakt/status";

import { Demomodus } from "./Demomodus";

function vis(modus: Modus | null) {
  return renderToStaticMarkup(
    <OktProvider
      startTilstand={{ ...startTilstand, okt: { ...startTilstand.okt, modus } }}
    >
      <Demomodus />
    </OktProvider>,
  );
}

describe("Demomodus", () => {
  it("FR-23: demomodus viser banneret", () => {
    expect(vis("demo")).toContain("Demomodus:");
  });

  it.each(["ekte", null] as const)("FR-23: %s viser ikke banneret", (modus) => {
    expect(vis(modus)).toBe("");
  });
});
