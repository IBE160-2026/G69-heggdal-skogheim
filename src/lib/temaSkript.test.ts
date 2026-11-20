// @vitest-environment jsdom
import { afterEach, describe, expect, it, vi } from "vitest";

import { TEMA_SKRIPT } from "./temaSkript";

afterEach(() => {
  vi.unstubAllGlobals();
  document.documentElement.classList.remove("dark");
});

describe("TEMA_SKRIPT", () => {
  it.each([
    [true, true],
    [false, false],
  ])("NFR-1: maskin i mørk = %s gir klassen dark = %s", (mork, forventet) => {
    vi.stubGlobal("matchMedia", vi.fn(() => ({ matches: mork })));

    new Function(TEMA_SKRIPT)();

    expect(document.documentElement.classList.contains("dark")).toBe(forventet);
  });
});
