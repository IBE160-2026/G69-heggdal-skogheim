import { statusSvar, type StatusSvar } from "@/lib/kontrakt/status";

export async function hentStatus(): Promise<StatusSvar | null> {
  try {
    const svar = await fetch("/api/status", { cache: "no-store" });
    if (!svar.ok) return null;

    const resultat = statusSvar.safeParse(await svar.json());
    return resultat.success ? resultat.data : null;
  } catch {
    return null;
  }
}

export function erDemomodus(status: StatusSvar | null): boolean {
  return status?.modus === "demo";
}
