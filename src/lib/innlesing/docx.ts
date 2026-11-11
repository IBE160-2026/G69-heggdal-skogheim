// Leser teksten i en DOCX-fil. mammoth lastes først når en DOCX skal leses (AD-7).
// Kaster når filen ikke er en gyldig DOCX.
export async function lesDocx(data: ArrayBuffer): Promise<string> {
  const { default: mammoth } = await import("mammoth");

  // Nettleserbygget av mammoth leser `arrayBuffer` og Node-bygget `buffer`.
  // Begge sender verdien videre til JSZip, som tar en ArrayBuffer.
  const input = { arrayBuffer: data, buffer: data } as { arrayBuffer: ArrayBuffer };
  const { value } = await mammoth.extractRawText(input);

  return value;
}
