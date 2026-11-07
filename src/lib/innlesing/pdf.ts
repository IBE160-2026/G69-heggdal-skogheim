// Leser teksten i en PDF-fil, også med to kolonner (FR-2, SM-5). pdfjs-dist gis inn
// som `getDocument`, slik at nettleseren bruker den moderne builden og Node-testene
// legacy-builden med den samme funksjonen. Kaster når filen ikke kan åpnes.

// En tekstbit på siden. x og y er nederste venstre hjørne i PDF-koordinater
// (y øker oppover), og `storrelse` er tekststørrelsen.
export type Tekstbit = {
  tekst: string;
  x: number;
  y: number;
  bredde: number;
  storrelse: number;
};

// Det lille av pdfjs-dist som brukes her. Både den ekte `getDocument` og falske
// versjoner i testene passer til typen.
type PdfSide = {
  view: number[];
  getTextContent(): Promise<{ items: unknown[] }>;
  cleanup?(): unknown;
};

type PdfDokument = {
  numPages: number;
  getPage(nummer: number): Promise<PdfSide>;
};

export type GetDocument = (parametre: {
  data: Uint8Array;
  isEvalSupported: boolean;
}) => { promise: Promise<PdfDokument>; destroy(): Promise<void> };

type PdfTekstbit = { str: string; transform: number[]; width: number };

// Elementer med y innenfor denne avstanden hører til samme linje.
const LINJE_TOLERANSE = 2;
// Kolonnegrensen letes etter mellom 20 og 80 % av sidebredden.
const GRENSE_FRA = 0.2;
const GRENSE_TIL = 0.8;
// Det tomme feltet mellom kolonnene må være minst så bredt (pt).
const MINSTE_GRENSE = 12;
// Biter skjøtes med mellomrom bare når avstanden er større enn dette × tekststørrelsen.
const MELLOMROM_ANDEL = 0.15;

function erPdfTekstbit(item: unknown): item is PdfTekstbit {
  return typeof item === "object" && item !== null && "str" in item;
}

function harTekst(bit: Tekstbit): boolean {
  return bit.tekst.trim() !== "";
}

// Finner det bredeste x-intervallet mellom 20 og 80 % av sidebredden som ingen
// tekst dekker, minst 12 pt bredt og med tekst på begge sider. Gir start og slutt
// på intervallet, eller null når siden har én kolonne.
function finnKolonnegrense(
  biter: Tekstbit[],
  sidebredde: number,
): { fra: number; til: number } | null {
  const fra = sidebredde * GRENSE_FRA;
  const til = sidebredde * GRENSE_TIL;
  const dekket = biter
    .map((bit) => ({ start: bit.x, slutt: bit.x + bit.bredde }))
    .sort((a, b) => a.start - b.start);

  let beste: { fra: number; til: number } | null = null;
  let markor = fra;
  const vurder = (start: number, slutt: number) => {
    const bredde = slutt - start;
    if (bredde < MINSTE_GRENSE) return;
    if (beste && bredde <= beste.til - beste.fra) return;
    const venstre = biter.some((bit) => bit.x + bit.bredde <= start);
    const hoyre = biter.some((bit) => bit.x >= slutt);
    if (venstre && hoyre) beste = { fra: start, til: slutt };
  };

  for (const { start, slutt } of dekket) {
    if (start > markor) vurder(markor, Math.min(start, til));
    markor = Math.max(markor, slutt);
    if (markor >= til) break;
  }
  if (markor < til) vurder(markor, til);

  return beste;
}

// Skjøter bitene på én linje i x-rekkefølge. Mellomrom settes bare når avstanden er
// stor nok, så et ord som er delt i flere biter, ikke blir delt.
function skjotLinje(linje: Tekstbit[]): string {
  const sortert = [...linje].sort((a, b) => a.x - b.x);
  let tekst = sortert[0].tekst;
  for (let i = 1; i < sortert.length; i++) {
    const forrige = sortert[i - 1];
    const bit = sortert[i];
    const avstand = bit.x - (forrige.x + forrige.bredde);
    const storrelse = Math.max(forrige.storrelse, bit.storrelse);
    tekst += (avstand > MELLOMROM_ANDEL * storrelse ? " " : "") + bit.tekst;
  }
  return tekst;
}

// Sorterer ovenfra og ned og deler i linjer etter y.
function delILinjer(biter: Tekstbit[]): Tekstbit[][] {
  const sortert = [...biter].sort((a, b) => b.y - a.y || a.x - b.x);
  const linjer: Tekstbit[][] = [];
  for (const bit of sortert) {
    const linje = linjer.at(-1);
    if (linje && Math.abs(linje[0].y - bit.y) <= LINJE_TOLERANSE) linje.push(bit);
    else linjer.push([bit]);
  }
  return linjer;
}

// Sorterer ovenfra og ned, deler i linjer etter y og skjøter hver linje.
function ordneKolonne(biter: Tekstbit[]): string[] {
  return delILinjer(biter).map(skjotLinje);
}

// Gir sann når minst én bit på linjen dekker noe av kolonnegrensen.
function krysser(linje: Tekstbit[], grense: { fra: number; til: number }): boolean {
  return linje.some((bit) => bit.x < grense.til && bit.x + bit.bredde > grense.fra);
}

type Oppdeling = {
  grense: { fra: number; til: number };
  topp: Tekstbit[][];
  midten: Tekstbit[];
  bunn: Tekstbit[][];
};

// Finner kolonnegrensen, først med alle linjene og så uten de øverste og nederste.
// Færrest mulig linjer fjernes (ved lik sum: færre nederst), høyst en fjerdedel
// av linjene på siden. Bare fjernede linjer som krysser grensen, blir topp- og
// bunntekst. De andre leses med kolonnene.
function finnOppdeling(linjer: Tekstbit[][], sidebredde: number): Oppdeling | null {
  const maks = Math.floor(linjer.length / 4);
  for (let sum = 0; sum <= maks; sum++) {
    for (let bunn = 0; bunn <= sum; bunn++) {
      const topp = sum - bunn;
      const grense = finnKolonnegrense(
        linjer.slice(topp, linjer.length - bunn).flat(),
        sidebredde,
      );
      if (!grense) continue;
      const fjernetTopp = linjer.slice(0, topp);
      const fjernetBunn = linjer.slice(linjer.length - bunn);
      const tilbake = [...fjernetTopp, ...fjernetBunn].filter(
        (linje) => !krysser(linje, grense),
      );
      return {
        grense,
        topp: fjernetTopp.filter((linje) => krysser(linje, grense)),
        midten: [...linjer.slice(topp, linjer.length - bunn), ...tilbake].flat(),
        bunn: fjernetBunn.filter((linje) => krysser(linje, grense)),
      };
    }
  }
  return null;
}

// Ordner tekstbitene på én side til lesbar tekst. Med to kolonner kommer
// toppteksten først, så hele venstre kolonne, hele høyre og til slutt bunnteksten.
// Elementer med bare mellomrom brukes ikke.
export function ordneSide(elementer: Tekstbit[], sidebredde: number): string {
  const linjer = delILinjer(elementer.filter(harTekst));
  const oppdeling = finnOppdeling(linjer, sidebredde);
  if (!oppdeling) return linjer.map(skjotLinje).join("\n");

  const { grense, topp, midten, bunn } = oppdeling;
  const venstre = midten.filter((bit) => bit.x + bit.bredde <= grense.fra);
  const hoyre = midten.filter((bit) => bit.x + bit.bredde > grense.fra);
  return [
    ...topp.map(skjotLinje),
    ...ordneKolonne(venstre),
    ...ordneKolonne(hoyre),
    ...bunn.map(skjotLinje),
  ].join("\n");
}

function tilTekstbit(item: PdfTekstbit, venstreKant: number): Tekstbit {
  const [a, b, c, d, e, f] = item.transform;
  return {
    tekst: item.str,
    x: e - venstreKant,
    y: f,
    bredde: item.width,
    storrelse: Math.hypot(c, d) || Math.hypot(a, b),
  };
}

export async function lesPdf(
  data: ArrayBuffer,
  getDocument: GetDocument,
): Promise<string> {
  // Kopieres, fordi pdfjs kan overføre bufferen til workeren.
  const oppgave = getDocument({
    data: new Uint8Array(data.slice(0)),
    isEvalSupported: false,
  });

  try {
    const dokument = await oppgave.promise;
    const sider: string[] = [];
    for (let nummer = 1; nummer <= dokument.numPages; nummer++) {
      const side = await dokument.getPage(nummer);
      const [x0, , x1] = side.view;
      const { items } = await side.getTextContent();
      const biter = items
        .filter(erPdfTekstbit)
        .map((item) => tilTekstbit(item, x0));
      sider.push(ordneSide(biter, x1 - x0));
      side.cleanup?.();
    }
    return sider.filter((tekst) => tekst !== "").join("\n\n");
  } finally {
    await oppgave.destroy();
  }
}
