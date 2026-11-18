import "server-only";

// AD-9, NFR-3: én teller i minnet per instans, uten identifikator. Den er en myk
// grense. Det harde taket er den forhåndsbetalte kreditten hos leverandøren.

export const STANDARD_PER_MINUTT = 10;
export const STANDARD_PER_DOGN = 200;

const MINUTT_MS = 60_000;
const DOGN_MS = 86_400_000;

type Env = Record<string, string | undefined>;

type Teller = { minutt: number; iMinuttet: number; dogn: number; iDognet: number };

let teller: Teller = { minutt: -1, iMinuttet: 0, dogn: -1, iDognet: 0 };

function grense(verdi: string | undefined, standard: number): number {
  const tekst = verdi?.trim() ?? "";
  // 0 ville stoppe alle ekte genereringer, så den regnes som ugyldig.
  return /^\d+$/.test(tekst) && Number(tekst) > 0 ? Number(tekst) : standard;
}

// Sjekker og teller i samme steg. Gir `false` uten å telle når grensen per minutt
// eller per UTC-døgn er nådd. `na` er klokken i millisekunder, injisert i tester.
export function taPlass(env: Env, na: number = Date.now()): boolean {
  const minutt = Math.floor(na / MINUTT_MS);
  const dogn = Math.floor(na / DOGN_MS);
  const iMinuttet = teller.minutt === minutt ? teller.iMinuttet : 0;
  const iDognet = teller.dogn === dogn ? teller.iDognet : 0;

  if (
    iMinuttet >= grense(env.GRENSE_PER_MINUTT, STANDARD_PER_MINUTT) ||
    iDognet >= grense(env.GRENSE_PER_DOGN, STANDARD_PER_DOGN)
  ) {
    return false;
  }

  teller = { minutt, iMinuttet: iMinuttet + 1, dogn, iDognet: iDognet + 1 };
  return true;
}

// Bare for tester.
export function nullstill(): void {
  teller = { minutt: -1, iMinuttet: 0, dogn: -1, iDognet: 0 };
}
