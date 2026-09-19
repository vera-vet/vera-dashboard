import { defineConfig } from "vitest/config";
import path from "path";

export default defineConfig({
  // tsconfig usa "jsx": "preserve" (lo compila Next); para los tests de componentes, runtime automático.
  esbuild: { jsx: "automatic" },
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "."),
    },
  },
  test: {
    environment: "node",
    include: ["lib/**/*.test.ts", "components/**/*.test.tsx", "middleware.test.ts"],
  },
});
