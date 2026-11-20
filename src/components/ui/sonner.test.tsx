// @vitest-environment jsdom
import { act, cleanup, render, waitFor } from "@testing-library/react";
import { toast } from "sonner";
import { afterEach, describe, expect, it, vi } from "vitest";

import { Toaster } from "./sonner";

afterEach(() => {
  cleanup();
  vi.unstubAllGlobals();
  document.documentElement.classList.remove("dark");
});

describe("Toaster", () => {
  it("UX-DR11: toasten følger klassen dark på <html>", async () => {
    // sonner leser matchMedia selv, og jsdom har den ikke.
    vi.stubGlobal(
      "matchMedia",
      vi.fn(() => ({
        matches: false,
        addEventListener: () => {},
        removeEventListener: () => {},
        addListener: () => {},
        removeListener: () => {},
      })),
    );
    document.documentElement.classList.add("dark");
    render(<Toaster />);

    await act(async () => {
      toast("Kopiert");
    });
    const liste = () => document.querySelector("[data-sonner-theme]");
    await waitFor(() => expect(liste()?.getAttribute("data-sonner-theme")).toBe("dark"));

    await act(async () => {
      document.documentElement.classList.remove("dark");
    });
    await waitFor(() => expect(liste()?.getAttribute("data-sonner-theme")).toBe("light"));
  });
});
