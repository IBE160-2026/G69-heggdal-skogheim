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

    // Den ene live-regionen i appen. Toasten fra sonner har sin egen region (UX-DR11).
    expect(html.match(/<div aria-live=/g)).toHaveLength(1);
    expect(html.match(/aria-live=/g)).toHaveLength(2);
    expect(html).toContain('<section aria-label="Varsler"');
    expect(html).toContain('aria-live="polite"');
    // Kunngjoring bruker useOkt og ville kastet en feil utenfor OktProvider.
    expect(html.indexOf("<main>Innhold</main>")).toBeLessThan(
      html.indexOf('aria-live="polite"'),
    );
  });

  it("NFR-1: skriptet for mørk modus står i <head> og lagrer ingenting", () => {
    const html = renderToStaticMarkup(
      <RootLayout>
        <main>Innhold</main>
      </RootLayout>,
    );
    const head = html.slice(html.indexOf("<head>"), html.indexOf("</head>"));

    expect(head).toContain("prefers-color-scheme: dark");
    expect(head).toContain('classList.add("dark")');
    // Ordene skrives ikke ut her, ellers slår vakten NFR-1 i repo-regler.test.ts ut.
    expect(head).not.toMatch(/Storage|indexed|cookie/);
    // Uten JavaScript er temaet lyst: klassen står ikke i markeringen fra serveren.
    expect(html).not.toMatch(/<html[^>]*class="[^"]*\bdark\b/);
  });

  it("NFR-1: bryteren står i en rad før innholdet, uten egen live-region", () => {
    const html = renderToStaticMarkup(
      <RootLayout>
        <main>Innhold</main>
      </RootLayout>,
    );

    expect(html).toContain('aria-pressed="false"');
    expect(html).toContain("Mørk modus");
    expect(html.indexOf("Mørk modus")).toBeLessThan(
      html.indexOf("<main>Innhold</main>"),
    );
    // Raden med bryteren: alt i <body> før innholdet.
    const rad = html.slice(
      html.indexOf("<body"),
      html.indexOf("<main>Innhold</main>"),
    );
    expect(rad).toContain("Mørk modus");
    expect(rad).not.toContain("aria-live");
  });
});
