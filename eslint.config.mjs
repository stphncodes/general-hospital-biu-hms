import { defineConfig, globalIgnores } from "eslint/config";
import nextVitals from "eslint-config-next/core-web-vitals";
import nextTs from "eslint-config-next/typescript";
import prettier from "eslint-config-prettier/flat";

const eslintConfig = defineConfig([
  ...nextVitals,
  ...nextTs,
  {
    rules: {
      // `any` defeats the type system. Use `unknown` + narrowing, generics, or
      // Zod inference. A genuine exception needs an inline disable comment that
      // explains why.
      "@typescript-eslint/no-explicit-any": "error",
      "@typescript-eslint/consistent-type-imports": [
        "warn",
        { prefer: "type-imports", fixStyle: "inline-type-imports" },
      ],
      "@typescript-eslint/no-unused-vars": [
        "error",
        { argsIgnorePattern: "^_", varsIgnorePattern: "^_" },
      ],
      // Server-side code must use the redacting logger in `@/lib/logger`.
      "no-console": ["warn", { allow: ["warn", "error"] }],
    },
  },
  {
    // Generated shadcn/ui primitives are vendored as-is; keep them close to
    // upstream so they can be re-synced with the shadcn CLI.
    files: ["src/components/ui/**"],
    rules: {
      "@typescript-eslint/consistent-type-imports": "off",
    },
  },
  // Must stay last: turns off stylistic rules that conflict with Prettier.
  prettier,
  globalIgnores([
    ".next/**",
    "out/**",
    "build/**",
    "coverage/**",
    "playwright-report/**",
    "test-results/**",
    "supabase/.temp/**",
    "next-env.d.ts",
  ]),
]);

export default eslintConfig;
