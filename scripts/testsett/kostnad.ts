// SM-8: kostnaden per kjøring i kroner. Prisene er kroner per million tokens og
// kommer fra flaggene. Ukjente tokens (adapteren kastet en feil) gir ukjent kostnad,
// og det gjør også 0 inn og 0 ut, som adapteren gir når den ikke fikk vite tokenene.
export function kostnad(
  inputTokens: number | null,
  outputTokens: number | null,
  prisInn: number,
  prisUt: number,
): number | null {
  if (inputTokens === null || outputTokens === null) return null;
  if (inputTokens === 0 && outputTokens === 0) return null;

  return (inputTokens / 1_000_000) * prisInn + (outputTokens / 1_000_000) * prisUt;
}

// Gjennomsnittet av de kjente kostnadene, eller `null` når ingen er kjent.
export function snittKostnad(kostnader: readonly (number | null)[]): number | null {
  const kjente = kostnader.filter((k): k is number => k !== null);
  if (kjente.length === 0) return null;

  return kjente.reduce((sum, k) => sum + k, 0) / kjente.length;
}

// Beløpet med antallet ukjente kostnader. Med ukjente er beløpet en nedre grense.
export function kronerMedUkjente(belop: number | null, kostnader: readonly (number | null)[]): string {
  const ukjente = kostnader.filter((k) => k === null).length;
  if (ukjente === 0) return kroner(belop);
  return `minst ${kroner(belop ?? 0)} (${ukjente} ${ukjente === 1 ? "kjøring" : "kjøringer"} med ukjent kostnad)`;
}

// Kroner med fire desimaler, så også små beløp synes (for eksempel «0,0123 kr»).
export function kroner(belop: number | null): string {
  return belop === null ? "ukjent" : `${belop.toFixed(4).replace(".", ",")} kr`;
}
