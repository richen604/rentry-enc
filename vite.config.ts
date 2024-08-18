import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import webExtension, { readJsonFile } from "vite-plugin-web-extension";

function generateManifest() {
  const manifest = readJsonFile("src/manifest.json");
  const pkg = readJsonFile("package.json");
  const isBrowserFirefox = process.env.BROWSER === "firefox";

  return {
    name: pkg.name,
    description: pkg.description,
    version: pkg.version,
    ...manifest,
    background: isBrowserFirefox
      ? { scripts: ["src/background.ts"] }
      : { service_worker: "src/background.ts" },
  };
}

// https://vitejs.dev/config/
export default defineConfig(() => ({
  plugins: [
    react(),
    webExtension({
      manifest: generateManifest,
      additionalInputs: [
        "src/content.tsx",
        "src/background.ts",
        "src/injected.js",
      ],
      browser: process.env.BROWSER === "firefox" ? "firefox" : "chrome",
    }),
  ],
}));
