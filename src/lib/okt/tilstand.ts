import { erDemoeksempel } from "@/lib/kjerne/demo";
import { annonseStatus, cvStatus, tegnAntall } from "@/lib/kjerne/grenser";
import type { AnnonseStatus, CvStatus } from "@/lib/kjerne/grenser";
import {
  FODSELSNUMMER_FJERNET,
  masker,
  maskerMedAntall,
} from "@/lib/kjerne/masker";
import { DEMO_ANNONSE, DEMO_CV } from "@/lib/kontrakt/demo";
import type { Feilkode } from "@/lib/kontrakt/feil";
import type { GapAnalyse } from "@/lib/kontrakt/gap";
import { CV_KORT } from "@/lib/kontrakt/grenser";
import type {
  LeverandorInfo,
  Modus,
  StatusSvar,
} from "@/lib/kontrakt/status";

// Meldingen til live-regionen. `nr` øker for hver ny melding, så samme tekst leses opp igjen.
export type Kunngjoring = { tekst: string; nr: number };

// CV-filen som er valgt. Teksten selv står i `utkast.cvTekst`.
export type CvFil = { navn: string; tilstand: "leser" | "lest" | "feilet" };

// Varselet når *Analyser* trykkes på egen CV i demomodus (FR-26). `nr` øker for hvert
// trykk, så fokus flyttes til varselet igjen.
export type DemoVarsel = { nr: number };

// AD-6: kjøringen settes av *Analyser* eller *Prøv med eksempel*. `cvTekst` er maskert.
export type Kjoring = {
  id: number;
  cvTekst: string;
  annonse: string;
  erEksempel: boolean;
};

export type GenereringStatus = "venter" | "genererer" | "feil" | "ferdig";

// AD-6: én resultatdel. `redigert` er `null` eller har samme form som `generert`.
export type ResultatdelTilstand<T> = {
  status: GenereringStatus;
  feilkode: Feilkode | null;
  generert: T | null;
  redigert: T | null;
  gapVersjon: number;
};

// Bare gap-analysen er bygget. Brev, CV og ATS kommer i epic 3 og 4.
export type Resultatdeler = { gap: ResultatdelTilstand<GapAnalyse> | null };
export type GenerertResultatdel = keyof Resultatdeler;

// Fanenavnene, også brukt i dialogen ved *Analyser* (UX-DR18).
export const FANENAVN: Record<GenerertResultatdel, string> = {
  gap: "Gap-analyse og nøkkelord",
};

// FR-3: hvilken side som vises. Den er ikke data, så den står utenfor `innhold`.
export type Visning = "forberedelse" | "resultat";

export type OktTilstand = {
  okt: {
    bekreftetPersonvern: boolean;
    modus: Modus | null;
    leverandor: LeverandorInfo | null;
  };
  innhold: {
    utkast: { cvTekst: string; annonse: string };
    cvFil: CvFil | null;
    demoVarsel: DemoVarsel | null;
    kjoring: Kjoring | null;
    resultatdeler: Resultatdeler;
    // Øker for hver gap-generering og nullstilles aldri, heller ikke av *Ny analyse*.
    gapVersjon: number;
  };
  visning: Visning;
  kunngjoring: Kunngjoring | null;
};

export type OktHandling =
  | { type: "statusHentet"; status: StatusSvar | null }
  | { type: "personvernBekreftet" }
  | { type: "annonseEndret"; annonse: string }
  | { type: "cvEndret"; cvTekst: string }
  | { type: "cvLimtInn"; cvTekst: string }
  | { type: "cvForlatt" }
  | { type: "analyserTrykket" }
  | { type: "cvFilLeses"; navn: string }
  | { type: "cvFilLest"; cvTekst: string }
  | { type: "cvFilFeilet" }
  | { type: "cvFilByttet" }
  | { type: "eksempelValgt" }
  | { type: "endreCvTrykket" }
  | { type: "tilbakeTilResultatet" }
  | { type: "nyAnalyseBekreftet" }
  | {
      type: "genereringStartet";
      resultatdel: GenerertResultatdel;
      kjoringId: number;
      gapVersjon: number;
    }
  | {
      type: "genereringFerdig";
      resultatdel: GenerertResultatdel;
      kjoringId: number;
      gapVersjon: number;
      data: GapAnalyse;
    }
  | {
      type: "genereringFeilet";
      resultatdel: GenerertResultatdel;
      kjoringId: number;
      gapVersjon: number;
      feilkode: Feilkode;
    }
  | {
      type: "kravRedigert";
      indeks: number;
      felt: RedigerbartFelt;
      verdi: string;
    }
  | { type: "kopiert" };

// FR-18: bare disse tekstene i et krav kan redigeres. Kategori, belegg og `nedgradert`
// er låst, og det samme er treffprosent og nøkkelord.
export type RedigerbartFelt = "tekst" | "forklaring" | "raad";

export const KOPIERT = "Kopiert.";

export const startTilstand: OktTilstand = {
  okt: { bekreftetPersonvern: false, modus: null, leverandor: null },
  innhold: {
    utkast: { cvTekst: "", annonse: "" },
    cvFil: null,
    demoVarsel: null,
    kjoring: null,
    resultatdeler: { gap: null },
    gapVersjon: 0,
  },
  visning: "forberedelse",
  kunngjoring: null,
};

export const ANALYSERER = "Analyserer. Dette tar inntil 30 sekunder.";

export function gapKlarTekst(gap: GapAnalyse): string {
  const oppfylt = gap.krav.filter((krav) => krav.kategori === "oppfylt").length;
  return `Gap-analysen er klar. ${oppfylt} av ${gap.krav.length} krav er oppfylt.`;
}

const ANNONSE_FOR_LANG = "Annonsen er for lang. Maks 8\u00a0000 tegn.";
const CV_FOR_LANG = "CV-teksten er for lang. Maks 15\u00a0000 tegn.";
const LESER_CV = "Leser CV-en \u2026";

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

// Varselet gjelder teksten da *Analyser* ble trykket. Endres teksten, forsvinner det.
function utenDemoVarsel(tilstand: OktTilstand): OktTilstand {
  if (!tilstand.innhold.demoVarsel) return tilstand;
  return { ...tilstand, innhold: { ...tilstand.innhold, demoVarsel: null } };
}

// AD-6: ny kjøring fra (maskert) tekst. Alle resultatdeler nullstilles, og gap venter
// på at `startGenerering` sender den. `gapVersjon` øker for hver kjøring som sendes og
// nullstilles aldri, så id-en er ny for hver kjøring som har sendt noe.
function medKjoring(
  tilstand: OktTilstand,
  cvTekst: string,
  annonse: string,
  erEksempel: boolean,
): OktTilstand {
  return {
    ...tilstand,
    visning: "resultat",
    innhold: {
      ...tilstand.innhold,
      demoVarsel: null,
      kjoring: {
        id: tilstand.innhold.gapVersjon + 1,
        cvTekst,
        annonse,
        erEksempel,
      },
      resultatdeler: {
        gap: {
          status: "venter",
          feilkode: null,
          generert: null,
          redigert: null,
          gapVersjon: tilstand.innhold.gapVersjon,
        },
      },
    },
  };
}

// *Prøv med eksempel* (FR-25): demoeksempelet fylles inn, og kjøringen starter uten
// avkrysning for personvern og i begge modi. Valgt fil og demovarsel fjernes.
function eksempel(tilstand: OktTilstand): OktTilstand {
  const cvTekst = masker(DEMO_CV);
  const utfylt: OktTilstand = {
    ...tilstand,
    innhold: {
      ...tilstand.innhold,
      utkast: { cvTekst, annonse: DEMO_ANNONSE },
      cvFil: null,
    },
  };

  return medKjoring(utfylt, cvTekst, DEMO_ANNONSE, true);
}

// *Analyser* maskerer først. Ble et nytt fødselsnummer maskert, eller er knappen
// deaktivert, skjer ingenting mer. Demoeksempelet starter en kjøring. Egen CV starter
// en kjøring i ekte modus (FR-7) og gir varselet i demomodus (FR-26). Ukjent modus
// regnes som demo.
function analyser(tilstand: OktTilstand): OktTilstand {
  const maskert = maskerCv(tilstand, tilstand.innhold.utkast.cvTekst);
  // Teksten endres bare når et nytt fødselsnummer ble maskert.
  const nyttNummer =
    maskert.innhold.utkast.cvTekst !== tilstand.innhold.utkast.cvTekst;
  if (nyttNummer || arsakerTilAnalyse(maskert).length > 0) return maskert;

  const { cvTekst, annonse } = maskert.innhold.utkast;
  if (erDemoeksempel(cvTekst, annonse)) {
    return medKjoring(maskert, cvTekst, annonse, true);
  }
  if (maskert.okt.modus === "ekte") {
    return medKjoring(maskert, cvTekst, annonse, false);
  }

  return {
    ...maskert,
    innhold: {
      ...maskert.innhold,
      demoVarsel: { nr: (maskert.innhold.demoVarsel?.nr ?? 0) + 1 },
    },
  };
}

// AD-6: svar for en kjøring eller gap-versjon som ikke lenger gjelder, forkastes.
function gjelder(
  tilstand: OktTilstand,
  handling: { kjoringId: number; gapVersjon: number },
): boolean {
  const { kjoring, resultatdeler } = tilstand.innhold;
  return (
    kjoring?.id === handling.kjoringId &&
    resultatdeler.gap?.status === "genererer" &&
    resultatdeler.gap.gapVersjon === handling.gapVersjon
  );
}

function medGap(
  tilstand: OktTilstand,
  gap: ResultatdelTilstand<GapAnalyse>,
  tekst: string | null,
): OktTilstand {
  return {
    ...tilstand,
    innhold: {
      ...tilstand.innhold,
      resultatdeler: { ...tilstand.innhold.resultatdeler, gap },
      gapVersjon: Math.max(tilstand.innhold.gapVersjon, gap.gapVersjon),
    },
    kunngjoring: kunngjor(tilstand.kunngjoring, [tekst]),
  };
}

// AD-6, FR-18: første endring lager `redigert` som en kopi av `generert`. Bare det ene
// feltet i det ene kravet endres. Det faste rådet for nedgraderte krav kan ikke redigeres.
function medRedigering(
  tilstand: OktTilstand,
  handling: { indeks: number; felt: RedigerbartFelt; verdi: string },
): OktTilstand {
  const gap = tilstand.innhold.resultatdeler.gap;
  // Etter en feil står den forrige analysen igjen og kan fortsatt redigeres.
  const analyse =
    gap?.status === "ferdig" || gap?.status === "feil"
      ? (gap.redigert ?? gap.generert)
      : null;
  const krav = analyse?.krav[handling.indeks];
  if (!gap || !analyse || !krav) return tilstand;
  if (handling.felt === "raad" && krav.nedgradert) return tilstand;
  if ((krav[handling.felt] ?? "") === handling.verdi) return tilstand;

  const redigert: GapAnalyse = {
    ...analyse,
    krav: analyse.krav.map((k, nr) =>
      nr === handling.indeks ? { ...k, [handling.felt]: handling.verdi } : k,
    ),
  };

  return {
    ...tilstand,
    innhold: {
      ...tilstand.innhold,
      resultatdeler: {
        ...tilstand.innhold.resultatdeler,
        gap: { ...gap, redigert },
      },
    },
  };
}

function medCvFil(tilstand: OktTilstand, cvFil: CvFil | null): OktTilstand {
  return { ...tilstand, innhold: { ...tilstand.innhold, cvFil } };
}

function erLeser(tilstand: OktTilstand): boolean {
  return tilstand.innhold.cvFil?.tilstand === "leser";
}

function ferdigLest(tilstand: OktTilstand, ny: "lest" | "feilet"): CvFil | null {
  const { cvFil } = tilstand.innhold;
  return cvFil ? { ...cvFil, tilstand: ny } : null;
}

export function reducer(
  tilstand: OktTilstand,
  handling: OktHandling,
): OktTilstand {
  switch (handling.type) {
    case "statusHentet":
      if (!handling.status) return tilstand;
      return {
        // Et varsel gitt mens modus var ukjent, gjelder ikke i ekte modus.
        ...(handling.status.modus === "ekte"
          ? utenDemoVarsel(tilstand)
          : tilstand),
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
          demoVarsel: null,
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
      return medCvTekst(utenDemoVarsel(tilstand), handling.cvTekst, []);
    case "cvLimtInn":
      return maskerCv(utenDemoVarsel(tilstand), handling.cvTekst);
    case "cvForlatt":
      return maskerCv(tilstand, tilstand.innhold.utkast.cvTekst);
    case "analyserTrykket":
      return analyser(tilstand);
    case "cvFilLeses":
      return {
        ...medCvFil(utenDemoVarsel(tilstand), {
          navn: handling.navn,
          tilstand: "leser",
        }),
        kunngjoring: kunngjor(tilstand.kunngjoring, [LESER_CV]),
      };
    // Innlest tekst maskeres som innliming (AD-13) og kuttes aldri. Et svar uten
    // en fil som leses (for eksempel etter *Bytt fil*), endrer ingenting.
    case "cvFilLest":
      if (!erLeser(tilstand)) return tilstand;
      return medCvFil(
        maskerCv(utenDemoVarsel(tilstand), handling.cvTekst),
        ferdigLest(tilstand, "lest"),
      );
    case "cvFilFeilet":
      if (!erLeser(tilstand)) return tilstand;
      return medCvFil(
        medCvTekst(utenDemoVarsel(tilstand), "", []),
        ferdigLest(tilstand, "feilet"),
      );
    // Tilbake til tilstand 1 uten tekst og filnavn.
    case "cvFilByttet":
      return medCvFil(medCvTekst(utenDemoVarsel(tilstand), "", []), null);
    case "eksempelValgt":
      return eksempel(tilstand);
    // FR-3: forberedelsen med teksten beholdt. Kjøringen, resultatdelene og
    // live-meldingen står, og ingenting avbrytes.
    case "endreCvTrykket":
      if (!tilstand.innhold.kjoring) return tilstand;
      return { ...tilstand, visning: "forberedelse" };
    // FR-3: tilbake uten ny kjøring, bare når teksten er uendret.
    case "tilbakeTilResultatet":
      if (!erUendret(tilstand)) return tilstand;
      return { ...tilstand, visning: "resultat" };
    // FR-21, AD-6: alt innhold tømmes, og requesten som går, avbrytes av OktProvider.
    // Avkrysningen gjelder resten av økten. `gapVersjon` beholdes, så id-ene til
    // kjøringene aldri gjentas (avvik fra AD-6, se deferred-work.md).
    case "nyAnalyseBekreftet":
      return {
        ...tilstand,
        innhold: {
          ...startTilstand.innhold,
          gapVersjon: tilstand.innhold.gapVersjon,
        },
        visning: "forberedelse",
        kunngjoring: null,
      };
    case "genereringStartet": {
      const { kjoring, resultatdeler } = tilstand.innhold;
      if (kjoring?.id !== handling.kjoringId || !resultatdeler.gap) {
        return tilstand;
      }
      // FR-19: den forrige analysen og redigeringene beholdes til et nytt svar kommer,
      // så en feil ikke tar dem med seg. Under genereringen vises de ikke.
      return medGap(
        tilstand,
        {
          ...resultatdeler.gap,
          status: "genererer",
          feilkode: null,
          gapVersjon: handling.gapVersjon,
        },
        ANALYSERER,
      );
    }
    case "genereringFerdig":
      if (!gjelder(tilstand, handling)) return tilstand;
      return medGap(
        tilstand,
        {
          status: "ferdig",
          feilkode: null,
          generert: handling.data,
          redigert: null,
          gapVersjon: handling.gapVersjon,
        },
        gapKlarTekst(handling.data),
      );
    case "genereringFeilet": {
      const gap = tilstand.innhold.resultatdeler.gap;
      if (!gap || !gjelder(tilstand, handling)) return tilstand;
      // Feilen vises med role="alert" i fanen, ikke i live-regionen, og meldingen om
      // at analysen pågår, fjernes. En forrige analyse står igjen med redigeringene.
      return {
        ...medGap(
          tilstand,
          {
            ...gap,
            status: "feil",
            feilkode: handling.feilkode,
            gapVersjon: handling.gapVersjon,
          },
          null,
        ),
        kunngjoring: null,
      };
    }
    case "kravRedigert":
      return medRedigering(tilstand, handling);
    case "kopiert":
      return {
        ...tilstand,
        kunngjoring: kunngjor(tilstand.kunngjoring, [KOPIERT]),
      };
  }
}

// FR-3: teksten er uendret når utkastet er likt kjøringen, og ingen CV-fil leses.
export function erUendret(tilstand: OktTilstand): boolean {
  const { utkast, kjoring } = tilstand.innhold;
  return (
    kjoring !== null &&
    utkast.cvTekst === kjoring.cvTekst &&
    utkast.annonse === kjoring.annonse &&
    !erLeser(tilstand)
  );
}

// UX-DR18: fanene med redigeringer. En fane er redigert når `redigert !== null`, også
// etter en feil og under en ny generering, når redigeringen ikke vises.
export function redigerteFaner(tilstand: OktTilstand): string[] {
  const { resultatdeler } = tilstand.innhold;
  return (Object.keys(resultatdeler) as GenerertResultatdel[])
    .filter((del) => (resultatdeler[del]?.redigert ?? null) !== null)
    .map((del) => FANENAVN[del]);
}

// Om et trykk på *Analyser* starter en ny kjøring. Den rene reduceren avgjør, så svaret
// alltid følger `analyser()`: maskering, årsaker, demovarsel og ukjent modus.
export function analyserStarterKjoring(tilstand: OktTilstand): boolean {
  return (
    reducer(tilstand, { type: "analyserTrykket" }).innhold.kjoring !==
    tilstand.innhold.kjoring
  );
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

export function cvVurdering(
  cvTekst: string,
  cvFil: CvFil | null = null,
): {
  status: CvStatus;
  antall: number;
  erKort: boolean;
} {
  const antall = tegnAntall(cvTekst);
  // Varselet om kort tekst gjelder 1–299 tegn. Et tomt felt gir varsel bare når
  // teksten kommer fra en fil som er lest (FR-3).
  const kanVarsle = antall > 0 || cvFil?.tilstand === "lest";

  return {
    status: cvStatus(cvTekst),
    antall,
    erKort: kanVarsle && antall < CV_KORT,
  };
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
