// Node-loader for `npm run testsett`: gjør `*.txt?raw` om til en modul med teksten
// som standardeksport, slik Next og Vitest gjør (lib/kontrakt/demo.ts). Synkrone
// hooks virker for både `import` og `require`.
import { readFileSync } from "node:fs";
import { registerHooks } from "node:module";

const RAW = /\.txt\?raw$/;

registerHooks({
  resolve(specifier, context, nextResolve) {
    if (!RAW.test(specifier)) return nextResolve(specifier, context);
    const url = new URL(specifier, context.parentURL);
    return { url: url.href, format: "module", shortCircuit: true };
  },
  load(url, context, nextLoad) {
    if (!RAW.test(url)) return nextLoad(url, context);
    const tekst = readFileSync(new URL(url.replace(/\?raw$/, "")), "utf8");
    return {
      format: "module",
      source: `export default ${JSON.stringify(tekst)};`,
      shortCircuit: true,
    };
  },
});
