"use client";

import { useEffect, useState } from "react";

import { DemoBanner } from "@/components/DemoBanner";
import { erDemomodus, hentStatus } from "@/lib/okt/status";

export function Demomodus() {
  const [erDemo, setErDemo] = useState(false);

  useEffect(() => {
    let aktiv = true;

    void hentStatus().then((status) => {
      if (aktiv) setErDemo(erDemomodus(status));
    });

    return () => {
      aktiv = false;
    };
  }, []);

  return erDemo ? <DemoBanner /> : null;
}
