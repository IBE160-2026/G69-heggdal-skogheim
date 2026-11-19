import { type Leverandor, NOKKEL_VARIABEL, STANDARD_MODELL } from "@/lib/llm/leverandor";

export function manglerNokkel(leverandor: Leverandor): string {
  return `Mangler ${NOKKEL_VARIABEL[leverandor]}. Legg nøkkelen i .env.local, eller kjør med --mock for en tørrkjøring uten nøkkel.`;
}

// Flaggene til `npm run testsett` (story 2.4). Prisene er kroner per million
// tokens. De er påkrevd ved ekte kjøring og står aldri i koden.
export type Valg = {
  leverandor: Leverandor;
  modell: string;
  ganger: number;
  // `null` betyr alle parene.
  par: string | null;
  mock: boolean;
  prisInn: number;
  prisUt: number;
};

export type Tolket = { ok: true; valg: Valg } | { ok: false; melding: string };

export const STANDARD_GANGER = 3;

export const BRUK = `Bruk: npm run testsett -- --leverandor mistral|openai [valg]

  --leverandor mistral|openai  påkrevd
  --modell <navn>              standard mistral-medium-latest eller gpt-4.1-mini
  --ganger <antall>            kjøringer per par, heltall fra 1 (standard ${STANDARD_GANGER})
  --par <mappe>                bare ett par, for eksempel par-2-it-support
  --pris-inn <kr>              kroner per million input-tokens (påkrevd uten --mock)
  --pris-ut <kr>               kroner per million output-tokens (påkrevd uten --mock)
  --mock                       tørrkjøring med demosvaret, uten nøkkel og nettverk`;

const MED_VERDI = new Set(["leverandor", "modell", "ganger", "par", "pris-inn", "pris-ut"]);

function feil(melding: string): Tolket {
  return { ok: false, melding: `${melding}\n\n${BRUK}` };
}

// Et ikke-negativt tall med punktum eller komma som desimaltegn.
function pris(tekst: string): number | null {
  return /^\d+([.,]\d+)?$/.test(tekst) ? Number(tekst.replace(",", ".")) : null;
}

// `harNokkel` sjekkes før prisene ved ekte kjøring, så en manglende nøkkel gir
// nøkkelmeldingen og ikke meldingen om priser.
export function lesArgumenter(
  argv: readonly string[],
  kjentePar: readonly string[],
  harNokkel?: (leverandor: Leverandor) => boolean,
): Tolket {
  const verdier = new Map<string, string>();
  let mock = false;

  for (let i = 0; i < argv.length; i++) {
    const arg = argv[i];
    if (!arg.startsWith("--")) return feil(`Ukjent argument: ${arg}`);
    const [navn, innebygd] = arg.slice(2).split(/=([^]*)/, 2);

    if (navn === "mock" && innebygd === undefined) {
      mock = true;
      continue;
    }
    if (!MED_VERDI.has(navn)) return feil(`Ukjent flagg: --${navn}`);
    if (verdier.has(navn)) return feil(`--${navn} er oppgitt mer enn én gang.`);

    const verdi = innebygd ?? argv[++i];
    if (verdi === undefined || verdi === "" || (innebygd === undefined && verdi.startsWith("--"))) {
      return feil(`--${navn} mangler en verdi.`);
    }
    verdier.set(navn, verdi.trim());
  }

  const leverandor = verdier.get("leverandor")?.toLowerCase();
  if (leverandor === undefined) return feil("--leverandor er påkrevd.");
  if (leverandor !== "mistral" && leverandor !== "openai") {
    return feil(`Ukjent leverandør: ${leverandor}. Velg mistral eller openai.`);
  }
  if (!mock && harNokkel && !harNokkel(leverandor)) {
    return { ok: false, melding: manglerNokkel(leverandor) };
  }

  const gangerTekst = verdier.get("ganger");
  let ganger = STANDARD_GANGER;
  if (gangerTekst !== undefined) {
    if (!/^\d+$/.test(gangerTekst) || Number(gangerTekst) < 1) {
      return feil(`--ganger må være et heltall fra 1, ikke ${gangerTekst}.`);
    }
    ganger = Number(gangerTekst);
  }

  const par = verdier.get("par") ?? null;
  if (par !== null && !kjentePar.includes(par)) {
    return feil(`Ukjent par: ${par}. Kjente par: ${kjentePar.join(", ")}.`);
  }

  const priser: Record<"pris-inn" | "pris-ut", number> = { "pris-inn": 0, "pris-ut": 0 };
  for (const navn of ["pris-inn", "pris-ut"] as const) {
    const tekst = verdier.get(navn);
    if (tekst === undefined) {
      if (!mock) {
        return feil(`--${navn} er påkrevd ved ekte kjøring (kroner per million tokens).`);
      }
      continue;
    }
    const tall = pris(tekst);
    if (tall === null) {
      return feil(`--${navn} må være et tall som er 0 eller større, ikke ${tekst}.`);
    }
    priser[navn] = tall;
  }

  return {
    ok: true,
    valg: {
      leverandor,
      modell: verdier.get("modell") || STANDARD_MODELL[leverandor],
      ganger,
      par,
      mock,
      prisInn: priser["pris-inn"],
      prisUt: priser["pris-ut"],
    },
  };
}
