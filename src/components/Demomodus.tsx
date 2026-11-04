"use client";

import { DemoBanner } from "@/components/DemoBanner";
import { useOkt } from "@/lib/okt/OktProvider";
import { erDemomodus } from "@/lib/okt/status";

export function Demomodus() {
  const { tilstand } = useOkt();

  return erDemomodus(tilstand.okt) ? <DemoBanner /> : null;
}
