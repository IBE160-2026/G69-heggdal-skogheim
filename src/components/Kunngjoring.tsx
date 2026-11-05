"use client";

import { useOkt } from "@/lib/okt/OktProvider";

// Den ene live-regionen i appen (UX-DR23). Regionen står alltid i DOM-en, så skjermleseren
// følger den fra start. `key={nr}` lager et nytt element, så samme tekst leses opp igjen.
export function Kunngjoring() {
  const { kunngjoring } = useOkt().tilstand;

  return (
    <div aria-live="polite" aria-atomic="true" className="sr-only">
      {kunngjoring ? <span key={kunngjoring.nr}>{kunngjoring.tekst}</span> : null}
    </div>
  );
}
