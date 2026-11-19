import { spawnSync } from "node:child_process";
import { readdirSync, readFileSync } from "node:fs";

import { describe, expect, it } from "vitest";

// Kjører samme kommando som `npm run testsett` (tsx, react-server, ?raw-loaderen,
// @/-stiene og vakten for skriptet), med et ugyldig flagg. Det gir ingen rapport og
// ingen kall.
describe("npm run testsett", () => {
  it("AD-11: --leverandor foo gir melding om bruk og utgangskode 1", () => {
    const skript: string = JSON.parse(readFileSync("package.json", "utf8")).scripts.testsett;
    const [kommando, ...args] = skript.split(" ");
    expect(kommando).toBe("tsx");
    const foer = readdirSync("testsett-rapporter");

    const resultat = spawnSync(
      process.execPath,
      ["node_modules/tsx/dist/cli.mjs", ...args, "--leverandor", "foo"],
      { cwd: process.cwd(), encoding: "utf8", timeout: 60_000 },
    );

    expect(resultat.status).toBe(1);
    expect(resultat.stderr).toContain("Ukjent leverandør: foo");
    expect(resultat.stderr).toContain("Bruk: npm run testsett");
    expect(readdirSync("testsett-rapporter")).toEqual(foer);
  }, 90_000);
});
