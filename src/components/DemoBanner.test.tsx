import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it } from "vitest";

import { DemoBanner } from "./DemoBanner";

describe("DemoBanner", () => {
  const html = renderToStaticMarkup(<DemoBanner />);

  it("FR-23: viser teksten ordrett", () => {
    expect(html.replace(/<[^>]+>/g, "")).toBe(
      "Demomodus: appen kjører uten API-nøkkel. Du kan prøve eksempelet og kontrollsteget med din egen CV.",
    );
  });

  it("FR-23: har Info-ikon og full bredde med bannerfargene", () => {
    expect(html).toContain("lucide-info");
    expect(html).toContain("w-full");
    expect(html).toContain("bg-primary-soft");
    expect(html).toContain("text-primary");
  });

  it("FR-23: kan ikke lukkes", () => {
    expect(html).not.toContain("<button");
  });
});
