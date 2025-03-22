import { defineConfig } from "tsup"

export default defineConfig({
  entry: ["src/lambdas/**/index.ts"],
  outDir: "dist",
  format: ["esm"],
  target: "node22",
  splitting: false,
  sourcemap: true,
  clean: true,
  dts: false,
  minify: true,
  outExtension: () => ({ js: ".mjs" }),
})
