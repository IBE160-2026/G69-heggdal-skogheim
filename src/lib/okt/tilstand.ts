import { annonseStatus, tegnAntall } from "@/lib/kjerne/grenser";
import type { AnnonseStatus } from "@/lib/kjerne/grenser";
import type {
  LeverandorInfo,
  Modus,
  StatusSvar,
} from "@/lib/kontrakt/status";

export type OktTilstand = {
  okt: {
    bekreftetPersonvern: boolean;
    modus: Modus | null;
    leverandor: LeverandorInfo | null;
  };
  innhold: {
    utkast: { cvTekst: string; annonse: string };
  };
};

export type OktHandling =
  | { type: "statusHentet"; status: StatusSvar | null }
  | { type: "personvernBekreftet" }
  | { type: "annonseEndret"; annonse: string };

export const startTilstand: OktTilstand = {
  okt: { bekreftetPersonvern: false, modus: null, leverandor: null },
  innhold: { utkast: { cvTekst: "", annonse: "" } },
};

export function reducer(
  tilstand: OktTilstand,
  handling: OktHandling,
): OktTilstand {
  switch (handling.type) {
    case "statusHentet":
      if (!handling.status) return tilstand;
      return {
        ...tilstand,
        okt: {
          ...tilstand.okt,
          modus: handling.status.modus,
          leverandor: handling.status.leverandor,
        },
      };
    case "personvernBekreftet":
      return {
        ...tilstand,
        okt: { ...tilstand.okt, bekreftetPersonvern: true },
      };
    case "annonseEndret":
      return {
        ...tilstand,
        innhold: {
          ...tilstand.innhold,
          utkast: { ...tilstand.innhold.utkast, annonse: handling.annonse },
        },
      };
  }
}

export function annonseVurdering(annonse: string): {
  status: AnnonseStatus;
  antall: number;
} {
  return { status: annonseStatus(annonse), antall: tegnAntall(annonse) };
}

// «For lang» vises med en gang, «for kort» først når feltet er forlatt.
export function annonseFeil(
  status: AnnonseStatus,
  forlatt: boolean,
): string | null {
  if (status === "for_lang") return "Annonsen er for lang. Maks 8\u00a0000 tegn.";
  if (status === "for_kort" && forlatt) {
    return "Annonsen er for kort. Minst 200 tegn.";
  }
  return null;
}

const ANNONSE_ARSAK: Record<AnnonseStatus, string | null> = {
  tom: "Lim inn annonsen.",
  for_kort: "Annonsen må være minst 200 tegn.",
  for_lang: "Annonsen kan være maks 8\u00a0000 tegn.",
  ok: null,
};

export function arsakerTilAnalyse(tilstand: OktTilstand): string[] {
  const { cvTekst, annonse } = tilstand.innhold.utkast;

  return [
    tegnAntall(cvTekst) === 0 ? "Last opp eller lim inn CV-en din." : null,
    ANNONSE_ARSAK[annonseStatus(annonse)],
    tilstand.okt.bekreftetPersonvern ? null : "Kryss av for personvern.",
  ].filter((arsak) => arsak !== null);
}
