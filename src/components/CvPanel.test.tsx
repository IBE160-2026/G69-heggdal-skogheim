import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it } from "vitest";

import { CvPanel } from "./CvPanel";

describe("CvPanel", () => {
  it("FR-1: har overskrift og plassholderlinje", () => {
    const html = renderToStaticMarkup(<CvPanel />);

    expect(html).toContain(">CV</h2>");
    expect(html).toContain("Opplasting og innliming av CV-en kommer snart.");
  });
});
