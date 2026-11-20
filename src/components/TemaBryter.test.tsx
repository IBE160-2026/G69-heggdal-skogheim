// @vitest-environment jsdom
import { act, cleanup, fireEvent, render, screen } from "@testing-library/react";
import { afterEach, describe, expect, it, vi } from "vitest";

import { TemaBryter } from "./TemaBryter";

type Lytter = (hendelse: MediaQueryListEvent) => void;

// Falsk matchMedia som lar testen endre maskinens innstilling.
function maskin(mork: boolean) {
  const lyttere = new Set<Lytter>();
  vi.stubGlobal(
    "matchMedia",
    vi.fn(() => ({
      matches: mork,
      addEventListener: (_: string, lytter: Lytter) => lyttere.add(lytter),
      removeEventListener: (_: string, lytter: Lytter) => lyttere.delete(lytter),
    })),
  );

  return {
    endre(nyMork: boolean) {
      act(() => {
        for (const lytter of lyttere) {
          lytter({ matches: nyMork } as MediaQueryListEvent);
        }
      });
    },
  };
}

// Det som skriptet i <head> gjør før React tar over.
function forsteTegning(mork: boolean) {
  document.documentElement.classList.toggle("dark", mork);
}

function bryter() {
  return screen.getByRole("button", { name: "Mørk modus" });
}

async function klikk() {
  await act(async () => {
    fireEvent.click(bryter());
  });
}

const erMork = () => document.documentElement.classList.contains("dark");

afterEach(() => {
  cleanup();
  vi.unstubAllGlobals();
  document.documentElement.classList.remove("dark");
});

describe("TemaBryter", () => {
  it("NFR-1: maskin i mørk gir mørk modus og aria-pressed sann", () => {
    maskin(true);
    forsteTegning(true);
    render(<TemaBryter />);

    expect(bryter().getAttribute("aria-pressed")).toBe("true");
    expect(erMork()).toBe(true);
  });

  it("NFR-1: maskin i lys gir lyst tema og aria-pressed usann", () => {
    maskin(false);
    forsteTegning(false);
    render(<TemaBryter />);

    expect(bryter().getAttribute("aria-pressed")).toBe("false");
    expect(erMork()).toBe(false);
  });

  it("NFR-1: bryteren bytter tema, og fokus blir på bryteren", async () => {
    maskin(false);
    render(<TemaBryter />);
    bryter().focus();

    await klikk();
    expect(erMork()).toBe(true);
    expect(bryter().getAttribute("aria-pressed")).toBe("true");
    expect(document.activeElement).toBe(bryter());

    await klikk();
    expect(erMork()).toBe(false);
    expect(bryter().getAttribute("aria-pressed")).toBe("false");
  });

  it("NFR-1: uten valg følger appen maskinen når den endres", async () => {
    const m = maskin(false);
    render(<TemaBryter />);

    m.endre(true);
    expect(erMork()).toBe(true);
    m.endre(false);
    expect(erMork()).toBe(false);
  });

  it("NFR-1: etter et valg beholdes valget når maskinen endres", async () => {
    const m = maskin(false);
    render(<TemaBryter />);

    await klikk();
    m.endre(false);
    expect(erMork()).toBe(true);
  });

  it("NFR-1: valget huskes ikke ved ny lasting", async () => {
    maskin(false);
    const { unmount } = render(<TemaBryter />);
    await klikk();
    unmount();

    // Ny lasting: siden starter på nytt, og skriptet følger maskinen.
    forsteTegning(false);
    const m = maskin(false);
    render(<TemaBryter />);
    m.endre(true);
    expect(erMork()).toBe(true);
  });

  it("UX-DR: ikonet er skjult for skjermleser, og bryteren er 44 px under 1024 px", () => {
    maskin(false);
    render(<TemaBryter />);

    const ikoner = [...bryter().querySelectorAll("svg")];
    expect(ikoner).toHaveLength(2);
    for (const ikon of ikoner) {
      expect(ikon.getAttribute("aria-hidden")).toBe("true");
    }
    expect(bryter().getAttribute("title")).toBe("Mørk modus");
    expect(bryter().className).toContain("size-11");
    expect(bryter().className).toContain("lg:size-8");
    expect(bryter().hasAttribute("aria-live")).toBe(false);
  });
});
