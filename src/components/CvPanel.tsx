"use client";

export function CvPanel() {
  return (
    <section
      aria-labelledby="cv-tittel"
      className="min-w-0 rounded-lg border bg-card p-4"
    >
      <h2 id="cv-tittel" className="text-section-title">
        CV
      </h2>
      <p className="mt-2 text-sm text-muted-foreground">
        Opplasting og innliming av CV-en kommer snart.
      </p>
    </section>
  );
}
