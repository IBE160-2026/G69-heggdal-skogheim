"use client";

import { Info } from "lucide-react";

export function DemoBanner() {
  return (
    <div className="flex w-full items-start gap-2 bg-primary-soft px-4 py-3 text-sm text-primary">
      <Info className="mt-0.5 size-4 shrink-0" aria-hidden="true" />
      <p>
        Demomodus: appen kjører uten API-nøkkel. Du kan prøve eksempelet og
        kontrollsteget med din egen CV.
      </p>
    </div>
  );
}
