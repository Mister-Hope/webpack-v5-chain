import { codecovRollupPlugin } from "@codecov/rollup-plugin";
import { defineConfig } from "tsdown";

export default defineConfig([
  {
    entry: "./src/index.ts",
    outDir: "./dist",
    format: "cjs",
    target: "node10",
    plugins: [
      codecovRollupPlugin({
        enableBundleAnalysis: Boolean(process.env.BUNDLE_ANALYSIS),
        bundleName: "node",
        oidc: {
          useGitHubOIDC: true,
        },
      }),
    ],
    platform: "node",
    fixedExtension: false,
    minify: true,
    sourcemap: true,
    external: ["webpack", "webpack-dev-server"],
  },
]);
