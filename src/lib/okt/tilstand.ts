import { annonseStatus, cvStatus, tegnAntall } from "@/lib/kjerne/grenser";
import type { AnnonseStatus, CvStatus } from "@/lib/kjerne/grenser";
import { FODSELSNUMMER_FJERNET, maskerMedAntall } from "@/lib/kjerne/masker";
import { CV_KORT } from "@/lib/kontrakt/grenser";
import type {
  LeverandorInfo,
  Modus,
  StatusSvar,
} from "@/lib/kontrakt/status";

// Meldingen til live-regionen. `nr` øker for hver ny melding, så samme tekst leses opp igjen.
export type Kunngjoring = { tekst: string; nr: number };

export type OktTilstand = {
  okt: {
    bekreftetPersonvern: boolean;
    modus: Modus | null;
    leverandor: LeverandorInfo | null;
  };
  innhold: {
    utkast: { cvTekst: string; annonse: string };
  };
  kunngjoring: Kunngjoring | null;
};

export type OktHandling =
  | { type: "statusHentet"; status: StatusSvar | null }
  | { type: "personvernBekreftet" }
  | { type: "annonseEndret"; annonse: string }
  | { type: "cvEndret"; cvTekst: string }
  | { type: "cvLimtInn"; cvTekst: string }
  | { type: "cvForlatt" }
  | { type: "analyserTrykket" };

export const startTilstand: OktTilstand = {
  okt: { bekreftetPersonvern: false, modus: null, leverandor: null },
  innhold: { utkast: { cvTekst: "", annonse: "" } },
  kunngjoring: null,
};

const ANNONSE_FOR_LANG = "Annonsen er for lang. Maks 8\u00a0000 tegn.";
const CV_FOR_LANG = "CV-teksten er for lang. Maks 15\u00a0000 tegn.";

export function fjernetTekst(antall: number): string {
  return antall === 1
    ? "1 fødselsnummer er fjernet fra CV-teksten."
    : `${antall} fødselsnumre er fjernet fra CV-teksten.`;
}

// Ny melding bare når det finnes noe å si; ellers står forrige melding uendret.
function kunngjor(
  forrige: Kunngjoring | null,
  tekster: (string | null)[],
): Kunngjoring | null {
  const tekst = tekster.filter((del) => del !== null).join(" ");
  if (!tekst) return forrige;

  return { tekst, nr: (forrige?.nr ?? 0) + 1 };
}

// En grense meldes én gang, når teksten går fra innenfor til over grensen.
function passertGrense(forFor: boolean, forNa: boolean, melding: string) {
  return !forFor && forNa ? melding : null;
}

function medCvTekst(
  tilstand: OktTilstand,
  cvTekst: string,
  tekster: (string | null)[],
): OktTilstand {
  const grense = passertGrense(
    cvStatus(tilstand.innhold.utkast.cvTekst) === "for_lang",
    cvStatus(cvTekst) === "for_lang",
    CV_FOR_LANG,
  );

  return {
    ...tilstand,
    innhold: {
      ...tilstand.innhold,
      utkast: { ...tilstand.innhold.utkast, cvTekst },
    },
    kunngjoring: kunngjor(tilstand.kunngjoring, [...tekster, grense]),
  };
}

// Maskerer CV-teksten (FR-6, AD-13) og melder hvor mange som ble fjernet.
function maskerCv(tilstand: OktTilstand, cvTekst: string): OktTilstand {
  const { tekst, antall } = maskerMedAntall(cvTekst);
  if (tekst === tilstand.innhold.utkast.cvTekst && antall === 0) return tilstand;

  return medCvTekst(tilstand, tekst, [antall > 0 ? fjernetTekst(antall) : null]);
}

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
        kunngjoring: kunngjor(tilstand.kunngjoring, [
          passertGrense(
            annonseStatus(tilstand.innhold.utkast.annonse) === "for_lang",
            annonseStatus(handling.annonse) === "for_lang",
            ANNONSE_FOR_LANG,
          ),
        ]),
      };
    // Mens brukeren skriver, maskeres ingenting.
    case "cvEndret":
      return medCvTekst(tilstand, handling.cvTekst, []);
    case "cvLimtInn":
      return maskerCv(tilstand, handling.cvTekst);
    case "cvForlatt":
    case "analyserTrykket":
      // Analysen kommer i story 1.6. Til da maskerer *Analyser* bare.
      return maskerCv(tilstand, tilstand.innhold.utkast.cvTekst);
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
  if (status === "for_lang") return ANNONSE_FOR_LANG;
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

export function cvVurdering(cvTekst: string): {
  status: CvStatus;
  antall: number;
  erKort: boolean;
} {
  const antall = tegnAntall(cvTekst);

  // Varselet om kort tekst gjelder 1–299 tegn, ikke et tomt felt (FR-3).
  return { status: cvStatus(cvTekst), antall, erKort: antall > 0 && antall < CV_KORT };
}

// «For lang» vises med en gang. CV-teksten har ingen nedre grense.
export function cvFeil(status: CvStatus): string | null {
  return status === "for_lang" ? CV_FOR_LANG : null;
}

export function antallFjernet(cvTekst: string): number {
  return cvTekst.split(FODSELSNUMMER_FJERNET).length - 1;
}

const CV_ARSAK: Record<CvStatus, string | null> = {
  tom: "Last opp eller lim inn CV-en din.",
  for_lang: "CV-teksten kan være maks 15\u00a0000 tegn.",
  ok: null,
};

export function arsakerTilAnalyse(tilstand: OktTilstand): string[] {
  const { cvTekst, annonse } = tilstand.innhold.utkast;

  return [
    CV_ARSAK[cvStatus(cvTekst)],
    ANNONSE_ARSAK[annonseStatus(annonse)],
    tilstand.okt.bekreftetPersonvern ? null : "Kryss av for personvern.",
  ].filter((arsak) => arsak !== null);
}
