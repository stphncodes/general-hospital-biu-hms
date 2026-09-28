import { fileURLToPath } from "node:url";
import { defineConfig } from "vitest/config";

// Vite 8 compiles TSX natively with Oxc, so no React plugin is required.
export default defineConfig({
  oxc: {
    jsx: { runtime: "automatic" },
  },
  resolve: {
    alias: {
      "@": fileURLToPath(new URL("./src", import.meta.url)),
      // `server-only` throws when imported outside a React Server environment;
      // unit tests exercise server modules directly, so stub it out here.
      "server-only": fileURLToPath(
        new URL("./tests/stubs/server-only.ts", import.meta.url),
      ),
    },
  },
  test: {
    // Pure logic runs in Node (fast). DOM tests opt in with a
    // `// @vitest-environment jsdom` comment at the top of the file.
    environment: "node",
    globals: true,
    setupFiles: ["./tests/setup.ts"],
    include: ["tests/unit/**/*.test.{ts,tsx}", "tests/integration/**/*.test.{ts,tsx}"],
    css: false,
    restoreMocks: true,
  },
});
