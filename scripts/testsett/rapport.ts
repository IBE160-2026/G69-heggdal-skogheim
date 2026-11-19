import type { GapAnalyse, Kategori } from "@/lib/kontrakt/gap";
import { MAKS_UTDATA_TOKENS, TEMPERATUR } from "@/lib/llm/felles";
import type { Leverandor } from "@/lib/llm/leverandor";
import { resonnering } from "@/lib/llm/mistral";

import { kostnad, kroner, kronerMedUkjente, snittMedUkjente } from "./kostnad";
import { dekningTekst, type Fasit, nokkelordDekning, type Sjekkliste } from "./fasit";

// Rapporten bygges bare fra flaggene, pipelinesvaret, tokens, testdata og
// git-metadata, aldri fra `process.env` (NFR-10). Ingen nøkkel kommer hit.
export type Metadata = {
  commit: string;
  endringer: boolean;
  leverandor: Leverandor;
  modell: string;
  dato: string;
  prisInn: number;
  prisUt: number;
  ganger: number;
  mock: boolean;
};

export type Kjoring = {
  nr: number;
  status: number;
  feilkode: string | null;
  inputTokens: number | null;
  outputTokens: number | null;
  // NFR-10: modellen leverandøren svarte med. `null` når kjøringen feilet uten svar.
  modellversjon: string | null;
  varighetMs: number;
  analyse: GapAnalyse | null;
};

export type ParResultat = {
  navn: string;
  fasit: Fasit;
  kjoringer: Kjoring[];
};

export type RapportData = {
  meta: Metadata;
  sjekkliste: Sjekkliste;
  par: ParResultat[];
};

const KATEGORI: Record<Kategori, string> = {
  oppfylt: "Oppfylt",
  delvis: "Delvis oppfylt",
  mangler: "Mangler",
};

// Modelltekst i en tabellcelle: uten linjeskift og med `|` escapet.
function celle(tekst: string): string {
  return tekst.replace(/\r?\n/g, " ").replace(/\|/g, "\\|").trim() || "–";
}

function tall(verdi: number | null): string {
  return verdi === null ? "–" : String(verdi);
}

function prisTekst(pris: number): string {
  return `${String(pris).replace(".", ",")} kr`;
}

function kjoringKostnad(k: Kjoring, meta: Metadata): number | null {
  return kostnad(k.inputTokens, k.outputTokens, meta.prisInn, meta.prisUt);
}

// AD-8: resonneringen Mistral-adapteren sender for modellen (NFR-10). Mock og
// OpenAI sender ingen.
function resonneringTekst(meta: Metadata): string {
  if (meta.mock || meta.leverandor !== "mistral") return "ikke satt";
  return resonnering(meta.modell) ?? "ikke satt (leverandørens standard)";
}

const UKJENT_VERSJON = "ukjent";

// AI SDK faller tilbake til modellen som ble bedt om når leverandøren ikke oppgir
// noen, så en versjon lik navnet er kanskje ikke løst opp.
const SAMME_SOM_NAVNET =
  " (samme som navnet som ble bedt om; leverandøren oppga kanskje ingen egen versjon)";

function versjon(k: Kjoring): string {
  return k.modellversjon ?? UKJENT_VERSJON;
}

// Versjonen kommer fra leverandøren, så den escapes som modelltekst.
function versjonVisning(v: string, meta: Metadata): string {
  return `${celle(v)}${v === meta.modell ? SAMME_SOM_NAVNET : ""}`;
}

function kjoringerTekst(antall: number): string {
  return `${antall} ${antall === 1 ? "kjøring" : "kjøringer"}`;
}

// NFR-10: hver distinkte versjon med antall kjøringer, i rekkefølgen de kom.
// Ukjent står til slutt.
function versjonerTekst(par: ParResultat[], meta: Metadata): string {
  const antall = new Map<string, number>();
  for (const k of par.flatMap((p) => p.kjoringer)) {
    antall.set(versjon(k), (antall.get(versjon(k)) ?? 0) + 1);
  }
  const navn = [...antall.keys()].sort(
    (a, b) => Number(a === UKJENT_VERSJON) - Number(b === UKJENT_VERSJON),
  );
  return navn.length === 0
    ? "–"
    : navn.map((v) => `${versjonVisning(v, meta)} (${kjoringerTekst(antall.get(v) ?? 0)})`).join(", ");
}

function topptekst(meta: Metadata, par: ParResultat[]): string[] {
  return [
    `# Testsett: ${meta.leverandor} ${meta.modell}${meta.mock ? " (tørrkjøring med mock)" : ""}`,
    "",
    `- **Commit:** \`${meta.commit}\`${meta.endringer ? " (arbeidstreet har endringer som ikke er committet)" : ""}`,
    `- **Leverandør:** ${meta.leverandor}`,
    `- **Modell (bedt om):** ${meta.modell}`,
    `- **Modellversjon fra leverandøren:** ${versjonerTekst(par, meta)}`,
    `- **Dato:** ${meta.dato}`,
    `- **Priser:** ${prisTekst(meta.prisInn)} per million input-tokens, ${prisTekst(meta.prisUt)} per million output-tokens`,
    `- **Kjøringer per par:** ${meta.ganger}`,
    `- **Temperatur:** ${TEMPERATUR}`,
    `- **Tak for output-tokens:** ${MAKS_UTDATA_TOKENS}`,
    `- **Resonnering (reasoningEffort):** ${resonneringTekst(meta)}`,
    ...(meta.mock
      ? ["", "> Tørrkjøring: alle parene fikk demosvaret fra mock-adapteren. Dette er ikke en måling og skal ikke committes som en."]
      : []),
    "",
    "Kategorier, belegg og treffprosent er kontrollert i kode (samme pipeline som appen). Nøkkelorddekningen mot fasiten er en hjelp. Den endelige vurderingen gjøres manuelt med sjekklisten.",
  ];
}

function kjoringSeksjon(k: Kjoring, fasit: Fasit, meta: Metadata): string[] {
  const linjer = [
    `#### Kjøring ${k.nr}`,
    "",
    `- **Status:** ${k.status}${k.feilkode ? ` (${k.feilkode})` : ""}`,
    `- **Modellversjon:** ${versjonVisning(versjon(k), meta)}`,
    `- **Tokens:** ${tall(k.inputTokens)} inn, ${tall(k.outputTokens)} ut${
      k.outputTokens !== null && k.outputTokens >= MAKS_UTDATA_TOKENS
        ? " (nådde taket for output-tokens)"
        : ""
    }`,
    `- **Varighet:** ${k.varighetMs} ms`,
    `- **Kostnad:** ${kroner(kjoringKostnad(k, meta))}`,
  ];
  const a = k.analyse;
  if (!a) return [...linjer, ""];

  const nedgradert = a.krav.filter((kr) => kr.nedgradert).map((kr) => kr.tekst);
  const funnet = a.nokkelord.filter((n) => n.funnet).map((n) => n.tekst);
  const ikkeFunnet = a.nokkelord.filter((n) => !n.funnet).map((n) => n.tekst);
  const dekning = nokkelordDekning(
    fasit.nokkelord,
    a.nokkelord.map((n) => n.tekst),
  );

  return [
    ...linjer,
    `- **Stilling:** ${celle(a.stilling)}, **arbeidsgiver:** ${celle(a.arbeidsgiver)}`,
    `- **Treffprosent:** ${a.treffprosent} %`,
    `- **Fjernede belegg:** ${a.fjernetBelegg}`,
    `- **Nedgraderte krav:** ${nedgradert.length === 0 ? "ingen" : nedgradert.map(celle).join("; ")}`,
    `- **Nøkkelord funnet i CV-en:** ${funnet.length === 0 ? "ingen" : funnet.map(celle).join(", ")}`,
    `- **Nøkkelord ikke funnet:** ${ikkeFunnet.length === 0 ? "ingen" : ikkeFunnet.map(celle).join(", ")}`,
    `- **Nøkkelorddekning mot fasiten:** ${dekningTekst(dekning)}`,
    `  - Ikke med fra fasiten: ${dekning.ikkeFunnet.length === 0 ? "ingen" : dekning.ikkeFunnet.join(", ")}`,
    "",
    "| # | Krav | Kategori | Belegg | Forklaring eller råd |",
    "|---|---|---|---|---|",
    ...a.krav.map(
      (kr, i) =>
        `| ${i + 1} | ${celle(kr.tekst)} | ${KATEGORI[kr.kategori]}${kr.nedgradert ? " (nedgradert)" : ""} | ${
          kr.belegg.length === 0 ? "–" : kr.belegg.map((b) => `«${celle(b)}»`).join("<br>")
        } | ${celle([kr.forklaring, kr.raad && `Råd: ${kr.raad}`].filter(Boolean).join(" "))} |`,
    ),
    "",
  ];
}

function oppsummering(p: ParResultat, meta: Metadata): string[] {
  const feil = p.kjoringer.filter((k) => k.feilkode !== null);
  const lengste = Math.max(0, ...p.kjoringer.map((k) => k.varighetMs));
  const output = p.kjoringer.map((k) => k.outputTokens).filter((t): t is number => t !== null);
  const treff = p.kjoringer.flatMap((k) => (k.analyse ? [k.analyse.treffprosent] : []));
  const kostnader = p.kjoringer.map((k) => kjoringKostnad(k, meta));

  return [
    "### Oppsummering",
    "",
    `- **Kjøringer:** ${p.kjoringer.length}, **feil:** ${feil.length}${
      feil.length ? ` (${feil.map((k) => `kjøring ${k.nr}: ${k.feilkode}`).join(", ")})` : ""
    }`,
    `- **Gjennomsnittlig kostnad:** ${snittMedUkjente(kostnader)}`,
    `- **Lengste varighet:** ${lengste} ms`,
    `- **Høyeste output-tokens:** ${output.length ? Math.max(...output) : "–"}`,
    `- **Treffprosent per kjøring:** ${treff.length ? treff.map((t) => `${t} %`).join(", ") : "–"}`,
    "",
  ];
}

function parSeksjon(p: ParResultat, sjekkliste: Sjekkliste, meta: Metadata): string[] {
  return [
    `## ${p.navn}`,
    "",
    "### Fasit",
    "",
    "| Krav | Forventet kategori | Grunnlag i CV |",
    "|---|---|---|",
    ...p.fasit.tabell.map((r) => `| ${celle(r.krav)} | ${celle(r.kategori)} | ${celle(r.grunnlag)} |`),
    "",
    `**Forventede nøkkelord:** ${p.fasit.nokkelord.join(", ")}`,
    "",
    "### Forbudte påstander (SM-2)",
    "",
    ...p.fasit.forbudte.map((f) => `- ${f}`),
    "",
    "### Nøkkelorddekning",
    "",
    ...p.kjoringer.map((k) =>
      k.analyse
        ? `- Kjøring ${k.nr}: ${dekningTekst(
            nokkelordDekning(
              p.fasit.nokkelord,
              k.analyse.nokkelord.map((n) => n.tekst),
            ),
          )}`
        : `- Kjøring ${k.nr}: ingen analyse (${k.feilkode})`,
    ),
    "",
    "### Kjøringer",
    "",
    ...p.kjoringer.flatMap((k) => kjoringSeksjon(k, p.fasit, meta)),
    "### Sjekkliste",
    "",
    "**Gjennomgående**",
    "",
    ...sjekkliste.gjennomgaende.map((s) => `- [ ] ${s}`),
    "",
    "**Gap-analyse**",
    "",
    ...sjekkliste.gap.map((s) => `- [ ] ${s}`),
    "",
    ...oppsummering(p, meta),
  ];
}

function totalt({ meta, par }: RapportData): string[] {
  const alle = par.flatMap((p) => p.kjoringer);
  const feil = alle.filter((k) => k.feilkode !== null).length;
  const output = alle.map((k) => k.outputTokens).filter((t): t is number => t !== null);
  const kostnader = alle.map((k) => kjoringKostnad(k, meta));
  const sum = kostnader.reduce<number>((s, k) => s + (k ?? 0), 0);

  return [
    "## Totalt",
    "",
    `- **Kjøringer:** ${alle.length}, **feil:** ${feil}`,
    `- **Samlet kostnad:** ${kronerMedUkjente(sum, kostnader)}`,
    `- **Gjennomsnittlig kostnad per kjøring:** ${snittMedUkjente(kostnader)}`,
    `- **Lengste varighet:** ${Math.max(0, ...alle.map((k) => k.varighetMs))} ms`,
    `- **Høyeste output-tokens:** ${output.length ? Math.max(...output) : "–"} (taket er ${MAKS_UTDATA_TOKENS})`,
    `- **Temperatur:** ${TEMPERATUR}`,
    "",
  ];
}

export function lagRapport(data: RapportData): string {
  return [
    ...topptekst(data.meta, data.par),
    "",
    ...data.par.flatMap((p) => parSeksjon(p, data.sjekkliste, data.meta)),
    ...totalt(data),
  ].join("\n");
}
