import { codecovRollupPlugin } from "@codecov/rollup-plugin";
import { defineConfig } from "tsdown";

export default defineConfig([
  {
    entry: "./src/index.js",
    outDir: "./dist",
    format: "cjs",
    target: "node10",
    plugins: [
      codecovRollupPlugin({
        enableBundleAnalysis: process.env.CODECOV_TOKEN !== undefined,
        bundleName: "node",
        uploadToken: process.env.CODECOV_TOKEN,
      }),
    ],
    platform: "node",
    fixedExtension: false,
    minify: true,
    sourcemap: true,
  },
  {
    entry: "./types/index.d.ts",
    outDir: "./dist",
    dts: {
      dtsInput: true,
      emitDtsOnly: true,
    },
    platform: "node",
    fixedExtension: false,
    external: ["webpack", "webpack-dev-server"],
    minify: true,
    sourcemap: true,
  },
]);
