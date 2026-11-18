// FR-4: merknaden om språk under overskriften i CV-panelet og annonsepanelet.
export const SPRAAK_MERKNAD =
  "Laget for CV-er og annonser på norsk. Resultatet er alltid på bokmål.";

export function SpraakMerknad() {
  return (
    <p className="mt-1 text-label text-muted-foreground">{SPRAAK_MERKNAD}</p>
  );
}
