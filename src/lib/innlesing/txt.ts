// Leser en TXT-fil som UTF-8. Ugyldig UTF-8 kaster, slik at feilen kan vises (FR-22).
export function lesTxt(data: ArrayBuffer): string {
  return new TextDecoder("utf-8", { fatal: true }).decode(data);
}
