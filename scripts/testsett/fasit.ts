import { ord } from "@/lib/kjerne/treffprosent";

// Fasiten for et testpar, lest fra `fasit.md`. Overskriftene er de samme i alle
// fire parene.
export type FasitRad = { krav: string; kategori: string; grunnlag: string };

export type Fasit = {
  tabell: FasitRad[];
  nokkelord: string[];
  forbudte: string[];
};

export type Sjekkliste = { gjennomgaende: string[]; gap: string[] };

// Innholdet under `## <overskrift>` fram til neste `## `-overskrift.
function seksjon(md: string, overskrift: string): string[] {
  const linjer = md.split(/\r?\n/);
  const start = linjer.findIndex((l) => l.trim() === `## ${overskrift}`);
  if (start === -1) throw new Error(`Fant ikke seksjonen «${overskrift}».`);
  const slutt = linjer.findIndex((l, i) => i > start && l.startsWith("## "));

  return linjer.slice(start + 1, slutt === -1 ? undefined : slutt);
}

function celler(linje: string): string[] {
  return linje
    .trim()
    .replace(/^\|/, "")
    .replace(/\|$/, "")
    .split("|")
    .map((c) => c.trim());
}

export function lesFasit(md: string): Fasit {
  // Tabellen: overskriftsraden, skillelinjen og så én rad per krav.
  const tabell = seksjon(md, "Forventet gap-analyse")
    .filter((l) => l.trim().startsWith("|"))
    .slice(2)
    .map((l) => {
      const [krav = "", kategori = "", grunnlag = ""] = celler(l);
      return { krav, kategori, grunnlag };
    });

  const linje = seksjon(md, "Forventede nøkkelord").find((l) => l.trim() !== "") ?? "";
  const nokkelord = linje
    .split(",")
    .map((n) => n.trim())
    .filter(Boolean);

  const forbudte = seksjon(md, "Forbudte påstander (skal aldri forekomme)")
    .filter((l) => l.trim().startsWith("- "))
    .map((l) => l.trim().slice(2).trim());

  return { tabell, nokkelord, forbudte };
}

function punkter(linjer: readonly string[]): string[] {
  return linjer
    .filter((l) => l.trim().startsWith("- [ ]"))
    .map((l) => l.trim().slice("- [ ]".length).trim());
}

// Punktene i «Gjennomgående» og «Gap-analyse» i `testdata/sjekkliste.md`.
export function lesSjekkliste(md: string): Sjekkliste {
  return {
    gjennomgaende: punkter(seksjon(md, "Gjennomgående (gjelder alt generert innhold)")),
    gap: punkter(seksjon(md, "Gap-analyse")),
  };
}

export type Dekning = {
  funnet: string[];
  ikkeFunnet: string[];
  prosent: number;
};

const nokkel = (tekst: string) => ord(tekst).join(" ");

// Hvor mange av de forventede nøkkelordene modellen fant. Et forventet nøkkelord
// er funnet når det er likt et av modellens etter `ord()`. Synonymer og bøyninger
// gir ikke treff, så tallet er en hjelp og ikke en vurdering.
export function nokkelordDekning(
  forventede: readonly string[],
  modellens: readonly string[],
): Dekning {
  const sett = new Set(modellens.map(nokkel).filter(Boolean));
  const funnet = forventede.filter((f) => sett.has(nokkel(f)));
  const ikkeFunnet = forventede.filter((f) => !sett.has(nokkel(f)));
  const prosent =
    forventede.length === 0 ? 0 : Math.round((100 * funnet.length) / forventede.length);

  return { funnet, ikkeFunnet, prosent };
}

export function dekningTekst({ funnet, ikkeFunnet, prosent }: Dekning): string {
  const totalt = funnet.length + ikkeFunnet.length;
  return `${funnet.length} av ${totalt} forventede nøkkelord (${prosent} %), hjelp, ikke vurdering`;
}
