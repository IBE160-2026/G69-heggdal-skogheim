"use client";

import { AnalyserKnapp } from "@/components/AnalyserKnapp";
import { Annonsepanel } from "@/components/Annonsepanel";
import { CvPanel } from "@/components/CvPanel";
import { Personvernbekreftelse } from "@/components/Personvernbekreftelse";
import { Personvernboks } from "@/components/Personvernboks";

const INNHOLD = "mx-auto w-full max-w-content-max px-4";

export function Forberedelse() {
  return (
    <>
      <header className={`${INNHOLD} pt-6`}>
        <h1 className="text-page-title">
          Se hva CV-en din dekker i en stillingsannonse
        </h1>
        <p className="mt-1.5 text-muted-foreground">
          Last opp CV-en og lim inn annonsen. Du ser krav for krav hva du
          dekker, og får et utkast til søknadsbrev.
        </p>
      </header>
      <main className={`${INNHOLD} flex flex-1 flex-col gap-5 pt-5 pb-8`}>
        <Personvernboks />
        <div className="grid gap-5 lg:grid-cols-2">
          <CvPanel />
          <Annonsepanel />
        </div>
        <div className="flex flex-col gap-4 rounded-lg border bg-card p-4 lg:flex-row lg:items-start lg:justify-between">
          <Personvernbekreftelse />
          <AnalyserKnapp />
        </div>
      </main>
    </>
  );
}
