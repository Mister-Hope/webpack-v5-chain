import merge from "deepmerge";
import type { Configuration, WebpackPluginInstance } from "webpack";

import type { Config } from "./Config.js";
import { Plugin } from "./Plugin.js";
import { ChainedMap, ChainedValueMap, TypedChainedMap } from "./utils/index.js";

type WebpackOptimization = Required<NonNullable<Configuration["optimization"]>>;
type SplitChunksObject = Exclude<WebpackOptimization["splitChunks"], false>;

// Merge splitChunks patches like the rest of the chained maps: recurse into
// plain objects (and concatenate arrays), keep special values such as RegExp by
// reference instead of letting deepmerge turn them into plain objects.
const isPlainObject = (value: unknown): value is Record<string, unknown> => {
  if (typeof value !== "object" || value == null) return false;

  const prototype: unknown = Object.getPrototypeOf(value);

  return prototype === Object.prototype || prototype == null;
};

const mergeSplitChunksValues = (
  target: Record<string, unknown>,
  source: Record<string, unknown>,
): SplitChunksObject =>
  merge(target, source, {
    isMergeableObject: (value: unknown): boolean => isPlainObject(value) || Array.isArray(value),
  });

export class Optimization extends ChainedMap<Config> {
  minimizers: TypedChainedMap<this, Record<string, Plugin<this, WebpackPluginInstance>>>;
  splitChunks!: ChainedValueMap<this> & ((value: SplitChunksObject | false) => this);

  constructor(parent?: Config) {
    super(parent);
    this.minimizers = new TypedChainedMap(this);
    // oxlint-disable-next-line typescript/no-explicit-any, typescript/no-unsafe-member-access
    (this as any).splitChunks = new ChainedValueMap(this);
    this.extend([
      "checkWasmTypes",
      "chunkIds",
      "concatenateModules",
      "emitOnErrors",
      "avoidEntryIife",
      "flagIncludedChunks",
      "inlineExports",
      "innerGraph",
      "mangleExports",
      "mangleWasmImports",
      "mergeDuplicateChunks",
      "minimize",
      "minimizeOptions",
      "moduleIds",
      "nodeEnv",
      // deprecated in webpack, kept for parity with `emitOnErrors`
      "noEmitOnErrors",
      "portableRecords",
      "providedExports",
      "realContentHash",
      "removeAvailableModules",
      "removeEmptyChunks",
      "runtimeChunk",
      "sideEffects",
      "usedExports",
    ]);
  }

  declare checkWasmTypes: (value: WebpackOptimization["checkWasmTypes"]) => this;
  declare chunkIds: (value: WebpackOptimization["chunkIds"]) => this;
  declare concatenateModules: (value: WebpackOptimization["concatenateModules"]) => this;
  declare emitOnErrors: (value: WebpackOptimization["emitOnErrors"]) => this;
  declare avoidEntryIife: (value: WebpackOptimization["avoidEntryIife"]) => this;
  declare flagIncludedChunks: (value: WebpackOptimization["flagIncludedChunks"]) => this;
  declare inlineExports: (value: WebpackOptimization["inlineExports"]) => this;
  declare innerGraph: (value: WebpackOptimization["innerGraph"]) => this;
  declare mangleExports: (value: WebpackOptimization["mangleExports"]) => this;
  declare mangleWasmImports: (value: WebpackOptimization["mangleWasmImports"]) => this;
  declare mergeDuplicateChunks: (value: WebpackOptimization["mergeDuplicateChunks"]) => this;
  declare minimize: (value: WebpackOptimization["minimize"]) => this;
  declare minimizeOptions: (value: WebpackOptimization["minimizeOptions"]) => this;
  declare moduleIds: (value: WebpackOptimization["moduleIds"]) => this;
  declare nodeEnv: (value: WebpackOptimization["nodeEnv"]) => this;
  declare noEmitOnErrors: (value: WebpackOptimization["noEmitOnErrors"]) => this;
  declare portableRecords: (value: WebpackOptimization["portableRecords"]) => this;
  declare providedExports: (value: WebpackOptimization["providedExports"]) => this;
  declare realContentHash: (value: WebpackOptimization["realContentHash"]) => this;
  declare removeAvailableModules: (value: WebpackOptimization["removeAvailableModules"]) => this;
  declare removeEmptyChunks: (value: WebpackOptimization["removeEmptyChunks"]) => this;
  declare runtimeChunk: (value: WebpackOptimization["runtimeChunk"]) => this;
  declare sideEffects: (value: WebpackOptimization["sideEffects"]) => this;
  declare usedExports: (value: WebpackOptimization["usedExports"]) => this;

  minimizer(name: string): Plugin<this, WebpackPluginInstance> {
    return this.minimizers.getOrCompute(
      name,
      () => new Plugin(this, name, "optimization.minimizer"),
    );
  }

  toConfig(): Record<string, unknown> {
    const keep: string[] = [];

    // Keep `splitChunks: {}` when the user explicitly configured it: webpack
    // normalizes it like the default, but the generated config should preserve
    // the explicit setting instead of silently dropping it.
    if (!this.splitChunks.useMap && this.splitChunks.value != null) keep.push("splitChunks");

    return this.omitEmpty(
      // oxlint-disable-next-line typescript/no-unsafe-argument
      Object.assign(this.entries() ?? {}, {
        // oxlint-disable-next-line typescript/no-explicit-any, typescript/no-unsafe-assignment, typescript/no-unsafe-call, typescript/no-unsafe-member-access
        splitChunks: (this.splitChunks as any).entries(),
        minimizer: this.minimizers.values().map((plugin) => plugin.toConfig()),
      }),
      keep,
    );
  }

  override merge(obj: Record<string, unknown>, omit: string[] = []): this {
    if (!omit.includes("minimizer") && "minimizer" in obj) {
      Object.keys(obj.minimizer as object).forEach((name) => {
        this.minimizer(name).merge(
          (obj.minimizer as Record<string, Record<string, unknown>>)[name],
        );
      });
    }

    if (!omit.includes("splitChunks") && "splitChunks" in obj) {
      const { splitChunks } = obj as { splitChunks?: SplitChunksObject | false };
      const current = this.splitChunks;
      const { value } = current;

      if (splitChunks === false) {
        current(false);
      } else if (splitChunks != null && typeof splitChunks === "object") {
        // `merge()` on a callable value used to switch back to map mode and drop
        // the object set through `splitChunks({...})`. Deep merge into the
        // current object instead so the callable configuration survives.
        if (!current.useMap && typeof value === "object" && value != null) {
          current(
            mergeSplitChunksValues(
              value as Record<string, unknown>,
              splitChunks as Record<string, unknown>,
            ),
          );
        } else {
          current.merge(splitChunks as Record<string, unknown>);
        }
      }
    }

    return super.merge(obj, [...omit, "minimizer", "splitChunks"]);
  }
}
