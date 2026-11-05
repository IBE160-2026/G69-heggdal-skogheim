import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it, vi } from "vitest";

// Skriftene lastes ikke i testene. Bare klassenavnet trengs.
vi.mock("next/font/google", () => ({
  Geist: () => ({ variable: "geist-sans" }),
  Geist_Mono: () => ({ variable: "geist-mono" }),
}));

const { default: RootLayout } = await import("./layout");

describe("RootLayout", () => {
  it("UX-DR23: har nøyaktig én live-region, inne i OktProvider", () => {
    const html = renderToStaticMarkup(
      <RootLayout>
        <main>Innhold</main>
      </RootLayout>,
    );

    expect(html.match(/aria-live=/g)).toHaveLength(1);
    expect(html).toContain('aria-live="polite"');
    // Kunngjoring bruker useOkt og ville kastet en feil utenfor OktProvider.
    expect(html.indexOf("<main>Innhold</main>")).toBeLessThan(
      html.indexOf('aria-live="polite"'),
    );
  });
});
