"use client";

import { useEffect, useRef, useSyncExternalStore } from "react";
import { Moon, Sun } from "lucide-react";

import { INNHOLD } from "@/components/Forberedelse";
import { Button } from "@/components/ui/button";

const MORK = "(prefers-color-scheme: dark)";

function abonner(varsle: () => void) {
  const observator = new MutationObserver(varsle);
  observator.observe(document.documentElement, {
    attributes: true,
    attributeFilter: ["class"],
  });

  return () => observator.disconnect();
}

function erMork() {
  return document.documentElement.classList.contains("dark");
}

// Om klassen `dark` står på <html>. Brukes av bryteren og toasten.
export function useMorkModus() {
  return useSyncExternalStore(abonner, erMork, () => false);
}

// Bryter mellom lys og mørk for denne fanen. Uten valg følger appen maskinen, også
// når den endres. Etter et valg gjelder valget til fanen lukkes eller lastes på nytt.
// Ingenting lagres (NFR-1).
export function TemaBryter() {
  // Klassen `dark` på <html> er sannheten. Skriptet i <head> setter den først.
  const mork = useMorkModus();
  const valgt = useRef(false);

  useEffect(() => {
    const maskin = window.matchMedia?.(MORK);
    if (!maskin) return;

    function folgMaskinen(hendelse: MediaQueryListEvent) {
      if (!valgt.current) {
        document.documentElement.classList.toggle("dark", hendelse.matches);
      }
    }

    maskin.addEventListener("change", folgMaskinen);

    return () => maskin.removeEventListener("change", folgMaskinen);
  }, []);

  function bytt() {
    valgt.current = true;
    document.documentElement.classList.toggle("dark", !erMork());
  }

  return (
    <Button
      type="button"
      variant="ghost"
      size="icon"
      aria-pressed={mork}
      onClick={bytt}
      title="Mørk modus"
      className="size-11 lg:size-8"
    >
      {/* Ikonet styres av CSS, så det stemmer også før React tar over. */}
      <Moon aria-hidden="true" className="dark:hidden" />
      <Sun aria-hidden="true" className="hidden dark:block" />
      <span className="sr-only">Mørk modus</span>
    </Button>
  );
}

// Egen rad over innholdet, høyre side, på begge sidene. Rører ikke toppfeltene.
export function TemaRad() {
  return (
    <div className={`${INNHOLD} flex justify-end pt-2`}>
      <TemaBryter />
    </div>
  );
}
