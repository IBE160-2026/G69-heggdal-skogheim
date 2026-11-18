// Testhjelp som deles av testene for innlesing og CV-panelet.

// En gyldig PDF med én tom A4-side uten tekstlag, slik en skannet side uten OCR ser
// ut for tekstuttrekket. Den har ikke CV-innhold.
export function pdfUtenTekst(): Uint8Array {
  const objekter = [
    "<< /Type /Catalog /Pages 2 0 R >>",
    "<< /Type /Pages /Kids [3 0 R] /Count 1 >>",
    "<< /Type /Page /Parent 2 0 R /MediaBox [0 0 595 842] /Contents 4 0 R /Resources << >> >>",
    "<< /Length 0 >>\nstream\n\nendstream",
  ];
  let pdf = "%PDF-1.4\n";
  const posisjoner: number[] = [];
  objekter.forEach((innhold, i) => {
    posisjoner.push(pdf.length);
    pdf += `${i + 1} 0 obj\n${innhold}\nendobj\n`;
  });
  const xref = pdf.length;
  pdf += `xref\n0 ${objekter.length + 1}\n0000000000 65535 f \n`;
  for (const posisjon of posisjoner) {
    pdf += `${String(posisjon).padStart(10, "0")} 00000 n \n`;
  }
  pdf += `trailer\n<< /Size ${objekter.length + 1} /Root 1 0 R >>\nstartxref\n${xref}\n%%EOF\n`;
  return new TextEncoder().encode(pdf);
}
