import { describe, expect, it } from "vitest";

import { lesArgumenter } from "./argumenter";

const PAR = ["par-1-butikk-bank", "par-2-it-support"];
const PRISER = ["--pris-inn", "4", "--pris-ut", "20"];

function les(...argv: string[]) {
  return lesArgumenter(argv, PAR);
}

function melding(...argv: string[]): string {
  const tolket = les(...argv);
  if (tolket.ok) throw new Error("ventet feil");
  return tolket.melding;
}

describe("lesArgumenter", () => {
  it("AD-11: --mock gir standardverdier og priser 0", () => {
    expect(les("--leverandor", "mistral", "--mock")).toEqual({
      ok: true,
      valg: {
        leverandor: "mistral",
        modell: "mistral-medium-latest",
        ganger: 3,
        par: null,
        mock: true,
        prisInn: 0,
        prisUt: 0,
      },
    });
  });

  it("AD-11: ekte kjøring med alle flaggene, også med = og desimalkomma", () => {
    expect(
      les("--leverandor=OpenAI", "--modell", "gpt-5", "--ganger", "2", "--par", "par-2-it-support", "--pris-inn", "2,5", "--pris-ut=20.75"),
    ).toEqual({
      ok: true,
      valg: {
        leverandor: "openai",
        modell: "gpt-5",
        ganger: 2,
        par: "par-2-it-support",
        mock: false,
        prisInn: 2.5,
        prisUt: 20.75,
      },
    });
  });

  it("AD-11: standardmodellen følger leverandøren", () => {
    const tolket = les("--leverandor", "openai", ...PRISER);
    expect(tolket.ok && tolket.valg.modell).toBe("gpt-4.1-mini");
  });

  it("AD-11: --leverandor er påkrevd og må være mistral eller openai", () => {
    expect(melding("--mock")).toContain("--leverandor er påkrevd");
    expect(melding("--leverandor", "foo", "--mock")).toContain("Ukjent leverandør: foo");
    expect(melding("--leverandor", "--mock")).toContain("--leverandor mangler en verdi");
  });

  it.each([["0"], ["-1"], ["to"], ["1.5"]])("AD-11: --ganger %s gir en melding om bruk", (verdi) => {
    const tekst = melding("--leverandor", "mistral", "--mock", "--ganger", verdi);
    expect(tekst).toContain("--ganger må være et heltall fra 1");
    expect(tekst).toContain("Bruk: npm run testsett");
  });

  it("SM-8: prisene er påkrevd ved ekte kjøring", () => {
    expect(melding("--leverandor", "mistral")).toContain("--pris-inn er påkrevd ved ekte kjøring");
    expect(melding("--leverandor", "mistral", "--pris-inn", "4")).toContain(
      "--pris-ut er påkrevd ved ekte kjøring",
    );
  });

  it.each([["-1"], ["abc"], ["1e3"], [""]])("SM-8: prisen %j er ugyldig", (verdi) => {
    expect(melding("--leverandor", "mistral", "--pris-inn", verdi, "--pris-ut", "1")).toMatch(
      /--pris-inn (må være et tall som er 0 eller større|mangler en verdi)/,
    );
  });

  it("AD-11: manglende nøkkel meldes før manglende priser, men ikke med --mock", () => {
    const utenNokkel = () => false;

    const tolket = lesArgumenter(["--leverandor", "mistral"], PAR, utenNokkel);
    expect(tolket.ok).toBe(false);
    expect(!tolket.ok && tolket.melding).toMatch(/^Mangler MISTRAL_API_KEY\./);
    expect(!tolket.ok && tolket.melding).not.toContain("--pris-inn");
    expect(lesArgumenter(["--leverandor", "openai", "--mock"], PAR, utenNokkel).ok).toBe(true);
    expect(lesArgumenter(["--leverandor", "openai", ...PRISER], PAR, () => true).ok).toBe(true);
  });

  it("SM-8: 0 er en gyldig pris", () => {
    const tolket = les("--leverandor", "mistral", "--pris-inn", "0", "--pris-ut", "0");
    expect(tolket.ok).toBe(true);
  });

  it("AD-11: ukjent par, ukjent flagg og dobbelt flagg gir melding", () => {
    expect(melding("--leverandor", "mistral", "--mock", "--par", "par-9")).toContain(
      "Ukjent par: par-9. Kjente par: par-1-butikk-bank, par-2-it-support.",
    );
    expect(melding("--leverandor", "mistral", "--mock", "--fort")).toContain("Ukjent flagg: --fort");
    expect(melding("--leverandor", "mistral", "--mock", "mistral")).toContain("Ukjent argument");
    expect(melding("--leverandor", "mistral", "--leverandor", "openai", "--mock")).toContain(
      "mer enn én gang",
    );
  });
});
