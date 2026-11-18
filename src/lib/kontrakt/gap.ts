import { z } from "zod";

// AD-14: delte former for gap-analysen og genereringene som bygger på den.

export const kategori = z.enum(["oppfylt", "delvis", "mangler"]);

export const belegg = z.string();

export const krav = z.object({
  tekst: z.string(),
  kategori,
  belegg: z.array(belegg),
  forklaring: z.string().optional(),
  raad: z.string().optional(),
  nedgradert: z.boolean(),
});

export const nokkelord = z.object({
  tekst: z.string(),
  kravIndeks: z.number().int().min(0).nullable(),
  funnet: z.boolean(),
});

// Tellerne for belegg og forslag som ble fjernet fordi de ikke fantes i CV-teksten.
const teller = z.number().int().min(0);
export const fjernetBelegg = teller;
export const fjernetForslag = teller;

export const gapAnalyse = z.object({
  stilling: z.string(),
  arbeidsgiver: z.string(),
  krav: z.array(krav),
  nokkelord: z.array(nokkelord),
  treffprosent: z.number().int().min(0).max(100),
  fjernetBelegg,
});

// Det rå svaret fra språkmodellen, før kontrollen i kode. `nedgradert` og `funnet`
// settes av pipelinen, og en `kravIndeks` utenfor `krav` blir `null` der.
export const kravSvar = krav.omit({ nedgradert: true });
export const nokkelordSvar = z.object({
  tekst: z.string(),
  kravIndeks: z.number().nullable(),
});

export const gapSvar = z.object({
  stilling: z.string(),
  arbeidsgiver: z.string(),
  krav: z.array(kravSvar),
  nokkelord: z.array(nokkelordSvar),
});

// Grunnlaget for brev, CV og ATS: bare låste felter, uten fritekst, og med grenser.
export const GRUNNLAG_GRENSER = {
  krav: 30,
  kravTekst: 300,
  belegg: 10,
  beleggTekst: 500,
  nokkelord: 40,
  nokkelordTekst: 100,
} as const;

export const gapGrunnlag = z.object({
  krav: z
    .array(
      z.object({
        tekst: z.string().max(GRUNNLAG_GRENSER.kravTekst),
        kategori,
        belegg: z
          .array(belegg.max(GRUNNLAG_GRENSER.beleggTekst))
          .max(GRUNNLAG_GRENSER.belegg),
      }),
    )
    .max(GRUNNLAG_GRENSER.krav),
  nokkelord: z
    .array(
      z.object({
        tekst: z.string().max(GRUNNLAG_GRENSER.nokkelordTekst),
        kravIndeks: z.number().int().min(0).nullable(),
      }),
    )
    .max(GRUNNLAG_GRENSER.nokkelord),
});

export type Kategori = z.infer<typeof kategori>;
export type Belegg = z.infer<typeof belegg>;
export type Krav = z.infer<typeof krav>;
export type Nokkelord = z.infer<typeof nokkelord>;
export type GapAnalyse = z.infer<typeof gapAnalyse>;
export type KravSvar = z.infer<typeof kravSvar>;
export type NokkelordSvar = z.infer<typeof nokkelordSvar>;
export type GapSvar = z.infer<typeof gapSvar>;
export type GapGrunnlag = z.infer<typeof gapGrunnlag>;
