import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  turbopack: {
    rules: {
      "*.css": {
        loaders: ["@tailwindcss/turbopack"],
        as: "*.css",
      },
      // Demotekstene importeres som tekst med `?raw` (lib/kontrakt/demo.ts).
      "*.txt": { condition: { query: "?raw" }, type: "text" },
    },
  },
};

export default nextConfig;
