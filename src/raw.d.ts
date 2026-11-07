// Tekstfiler importert med `?raw` (next.config.ts og Vitest).
declare module "*.txt?raw" {
  const tekst: string;
  export default tekst;
}
