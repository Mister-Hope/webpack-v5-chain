import { dts } from "rollup-plugin-dts";
import esbuild from "rollup-plugin-esbuild";

export default [
  // full package
  {
    input: "./src/index.js",
    output: [
      {
        file: "./dist/index.js",
        format: "cjs",
        sourcemap: true,
      },
    ],
    plugins: [
      esbuild({
        charset: "utf8",
        target: ["node10"],
        minify: true,
      }),
    ],
    external: ["deepmerge", "javascript-stringify"],
    treeshake: "smallest",
  },

  {
    input: "./types/index.d.ts",
    output: [{ file: "./dist/index.d.ts", format: "esm" }],
    plugins: [
      dts({
        compilerOptions: { preserveSymlinks: false },
      }),
    ],
  },
];
