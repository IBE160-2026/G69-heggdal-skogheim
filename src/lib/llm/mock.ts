import "server-only";

import gapSvar from "./demo-svar/gap.json";
import type { LlmKlient } from "./klient";

// AD-3: mock-adapteren gir demosvaret i det rå svarformatet. Pipelinen bruker den
// bare når `erDemoeksempel` er sann.
export const mockKlient: LlmKlient = {
  async analyseGap() {
    return { svar: structuredClone(gapSvar), inputTokens: 0, outputTokens: 0 };
  },
};
