import type { GetDocument } from "@/lib/innlesing/pdf";

let hentet: Promise<GetDocument> | null = null;

// Laster pdfjs-dist først når en PDF skal leses (AD-7), og setter workeren én gang.
// Workeren bygges inn i appen og hentes fra appens egen adresse, aldri fra en CDN.
export function hentGetDocument(): Promise<GetDocument> {
  hentet ??= import("pdfjs-dist")
    .then((pdfjs) => {
      pdfjs.GlobalWorkerOptions.workerSrc = new URL(
        "pdfjs-dist/build/pdf.worker.min.mjs",
        import.meta.url,
      ).toString();
      return pdfjs.getDocument;
    })
    .catch((feil: unknown) => {
      // En chunk som ikke kunne lastes, eller et oppsett som feilet, prøves på
      // nytt neste gang.
      hentet = null;
      throw feil;
    });
  return hentet;
}
